import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testPostGIS() {
  try {
    console.log("🧪 Testando query PostGIS...");

    // Teste 1: Verificar se PostGIS está disponível
    const postgisTest = await prisma.$queryRaw`SELECT PostGIS_Version()`;
    console.log("✅ PostGIS version:", postgisTest);

    // Teste 2: Verificar itens com localização
    const itemsWithLocation = await prisma.$queryRaw`
      SELECT id, title, ST_AsText(location) as location_text
      FROM items 
      WHERE location IS NOT NULL
      LIMIT 5
    `;
    console.log("✅ Itens com localização:", itemsWithLocation);

    // Teste 3: Query simples com ST_Point
    const simpleQuery = await prisma.$queryRaw`
      SELECT 
        i.id,
        i.title,
        ST_X(i.location::geometry) as longitude,
        ST_Y(i.location::geometry) as latitude
      FROM items i
      WHERE i.location IS NOT NULL
      LIMIT 3
    `;
    console.log("✅ Query simples:", simpleQuery);

    // Teste 4: Query com ST_Distance
    const distanceQuery = await prisma.$queryRaw`
      SELECT 
        i.id,
        i.title,
        ST_Distance(
          i.location, 
          ST_Point(-46.6333, -23.5505)::geography
        ) / 1000 as distance_km
      FROM items i
      WHERE i.location IS NOT NULL
      ORDER BY distance_km ASC
      LIMIT 3
    `;
    console.log("✅ Query com distância:", distanceQuery);

    // Teste 5: Query com ST_DWithin
    const withinQuery = await prisma.$queryRaw`
      SELECT 
        i.id,
        i.title,
        ST_Distance(
          i.location, 
          ST_Point(-46.6333, -23.5505)::geography
        ) / 1000 as distance_km
      FROM items i
      WHERE i.location IS NOT NULL
        AND ST_DWithin(
          i.location, 
          ST_Point(-46.6333, -23.5505)::geography, 
          10000
        )
      ORDER BY distance_km ASC
    `;
    console.log("✅ Query com ST_DWithin:", withinQuery);
  } catch (error) {
    console.error("❌ Erro no teste PostGIS:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testPostGIS();
