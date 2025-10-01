import { base, en, Faker, pt_BR } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

// Instância do Faker com locale pt_BR e fallbacks (en, base)
const faker = new Faker({ locale: [pt_BR, en, base] });

const prisma = new PrismaClient();

// BBox aproximado do Brasil (lon, lat)
const BRAZIL_BBOX = {
  minLat: -33.9,
  maxLat: 5.3,
  minLng: -74.0,
  maxLng: -34.0,
};

// Conversão aproximada: 1 grau de latitude ~ 111.32 km; longitude depende do cos(lat)
const KM_PER_DEG_LAT = 111.32;

function kmToDegLat(km: number): number {
  return km / KM_PER_DEG_LAT;
}

function kmToDegLng(km: number, latDeg: number): number {
  const latRad = (latDeg * Math.PI) / 180;
  const kmPerDegLng = KM_PER_DEG_LAT * Math.cos(latRad);
  // Evita divisão por ~0 em latitudes muito próximas ao equador? (cos(0) = 1) ok; perto dos polos não aplicável aqui
  return kmPerDegLng > 0 ? km / kmPerDegLng : km / KM_PER_DEG_LAT;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Gera ~500 pontos espaçados ~80–120 km (alvo 100 km com jitter), cobrindo o BBox do Brasil
function generateBrazilPoints(
  targetCount = 500,
): Array<{ lat: number; lng: number }> {
  const points: Array<{ lat: number; lng: number }> = [];

  // Passo em latitude ~100 km com jitter ±20 km
  const baseLatStepKm = 100;
  const latJitterKm = 20;

  // Itera faixas de latitude
  let lat = BRAZIL_BBOX.minLat;
  while (lat <= BRAZIL_BBOX.maxLat + 1e-6) {
    const latStepKm =
      baseLatStepKm +
      faker.number.float({ min: -latJitterKm, max: latJitterKm });
    const latStepDeg = kmToDegLat(latStepKm);

    // Para cada faixa, gera pontos ao longo da longitude com passo ~100 km com jitter ±20 km
    let lng = BRAZIL_BBOX.minLng;
    // Offset aleatório inicial por faixa para evitar alinhamento perfeito em grade
    const startOffsetKm = faker.number.float({ min: 0, max: 60 });
    const lngOffsetDeg = kmToDegLng(startOffsetKm, lat);
    lng = clamp(lng + lngOffsetDeg, BRAZIL_BBOX.minLng, BRAZIL_BBOX.maxLng);

    while (lng <= BRAZIL_BBOX.maxLng + 1e-6) {
      // Pequeno jitter posicional para afastar da grade perfeita (±0.2° lat, ±0.2° lon equil.)
      const jitterLatDeg = faker.number.float({ min: -0.2, max: 0.2 });
      const jitterLngDeg = faker.number.float({ min: -0.2, max: 0.2 });

      const latJ = clamp(
        lat + jitterLatDeg,
        BRAZIL_BBOX.minLat,
        BRAZIL_BBOX.maxLat,
      );
      const lngJ = clamp(
        lng + jitterLngDeg,
        BRAZIL_BBOX.minLng,
        BRAZIL_BBOX.maxLng,
      );
      points.push({ lat: latJ, lng: lngJ });

      const lonStepKm =
        baseLatStepKm +
        faker.number.float({ min: -latJitterKm, max: latJitterKm });
      const lonStepDeg = kmToDegLng(lonStepKm, lat);
      lng += lonStepDeg;
    }

    lat += latStepDeg;
  }

  // Balanceia para próximo de targetCount
  if (points.length > targetCount) {
    // Amostra aleatória estável
    faker.seed(42);
    const shuffled = [...points].sort(() =>
      faker.number.float({ min: -1, max: 1 }),
    );
    return shuffled.slice(0, targetCount);
  }

  return points;
}

async function ensureOrganization() {
  const org = await prisma.organization.upsert({
    where: { domain: "sustainable-br.org" },
    update: {},
    create: {
      name: "Sustainable Brasil",
      description: "Rede nacional de pontos de coleta",
      website: "https://sustainable-br.org",
      domain: "sustainable-br.org",
      verified: true,
    },
  });
  return org;
}

async function seedPoints() {
  console.log(
    "🌱 Gerando pontos de coleta (~500) em todo o Brasil (80–120 km) ...",
  );

  const organization = await ensureOrganization();

  // Evita duplicação em re-execuções: limpa pontos existentes desta organização
  await prisma.point.deleteMany({ where: { organizationId: organization.id } });

  const coords = generateBrazilPoints(500);
  console.log(`📍 Total de coordenadas geradas: ${coords.length}`);

  // Inserção em lotes para reduzir round-trips
  const batchSize = 100;
  let created = 0;

  for (let i = 0; i < coords.length; i += batchSize) {
    const slice = coords.slice(i, i + batchSize);

    // Monta SQL multi-values para melhor performance
    const valuesSql: string[] = [];
    const params: Array<string | number> = [];

    slice.forEach((c, idx) => {
      const id = faker.string.uuid();
      const name = `Ponto de Coleta ${faker.location.city()} #${i + idx + 1}`;
      const street = faker.location.streetAddress();
      const city = faker.location.city();
      const state = faker.location.state({ abbreviated: true });
      const address = `${street}, ${city} - ${state}`;

      // Para $executeRawUnsafe, usamos placeholders posicionais
      // Campos: id (text), name (text), description (text), address (text), organizationId (uuid), lng (float), lat (float)
      valuesSql.push(
        `($${params.length + 1}, $${params.length + 2}, $${params.length + 3}, $${params.length + 4}, $${params.length + 5}, ST_Point($${params.length + 6}, $${params.length + 7})::geography, NOW(), NOW())`,
      );
      params.push(
        id,
        name,
        faker.lorem.sentence(),
        address,
        organization.id,
        c.lng,
        c.lat,
      );
    });

    const sql = `INSERT INTO points (id, name, description, address, "organizationId", location, "createdAt", "updatedAt") VALUES ${valuesSql.join(",")} ON CONFLICT DO NOTHING;`;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await prisma.$executeRawUnsafe(sql, ...params);

    created += slice.length;
    console.log(`✅ Inseridos ${created}/${coords.length}`);
  }

  console.log("🎉 Seed de pontos concluído!");
}

seedPoints()
  .catch((e) => {
    console.error("❌ Erro no seed de pontos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
