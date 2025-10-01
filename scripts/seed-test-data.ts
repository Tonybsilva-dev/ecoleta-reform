import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de dados de teste...");

  // Criar material de teste
  const material = await prisma.material.upsert({
    where: { name: "Plástico PET" },
    update: {},
    create: {
      name: "Plástico PET",
      description: "Garrafas de plástico PET para reciclagem",
      category: { connect: { id: "recyclable-category-id" } },
      isActive: true,
    },
  });

  console.log("✅ Material criado:", material.name);

  // Criar organização de teste
  const organization = await prisma.organization.upsert({
    where: { domain: "ecorecicla-sp.com.br" },
    update: {},
    create: {
      name: "EcoRecicla SP",
      description: "Cooperativa de reciclagem em São Paulo",
      website: "https://ecorecicla-sp.com.br",
      domain: "ecorecicla-sp.com.br",
      verified: true,
    },
  });

  console.log("✅ Organização criada:", organization.name);

  // Criar usuário de teste
  const user = await prisma.user.upsert({
    where: { email: "teste@ecorecicla.com" },
    update: {},
    create: {
      email: "teste@ecorecicla.com",
      name: "João Silva",
    },
  });

  console.log("✅ Usuário criado:", user.email);

  // Criar item de teste com localização usando query raw
  await prisma.$executeRaw`
    INSERT INTO items (id, title, description, price, quantity, status, "materialId", "organizationId", "createdById", location, "createdAt", "updatedAt")
    VALUES (
      'test-item-1',
      'Garrafas PET - 50 unidades',
      'Garrafas de plástico PET limpas, prontas para reciclagem',
      25.50,
      50,
      'ACTIVE',
      ${material.id},
      ${organization.id},
      ${user.id},
      ST_Point(-46.6333, -23.5505)::geography,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING
  `;

  const item = await prisma.item.findUnique({
    where: { id: "test-item-1" },
  });

  console.log("✅ Item criado:", item?.title || "Item não encontrado");

  // Criar mais alguns itens em locais diferentes
  await prisma.$executeRaw`
    INSERT INTO items (id, title, description, price, quantity, status, "materialId", "organizationId", "createdById", location, "createdAt", "updatedAt")
    VALUES (
      'test-item-2',
      'Papelão - 20kg',
      'Caixas de papelão limpas e secas',
      15.00,
      20,
      'ACTIVE',
      ${material.id},
      ${organization.id},
      ${user.id},
      ST_Point(-46.6400, -23.5600)::geography,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING
  `;

  const item2 = await prisma.item.findUnique({
    where: { id: "test-item-2" },
  });

  console.log("✅ Item 2 criado:", item2?.title);

  console.log("🎉 Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
