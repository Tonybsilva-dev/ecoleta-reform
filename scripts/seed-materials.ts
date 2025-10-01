import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SeedMaterial = {
  name: string;
  description?: string;
  category?: string; // nome da categoria
};

const MATERIALS: SeedMaterial[] = [
  // Plásticos
  {
    name: "Plástico PET",
    description: "Garrafas PET e similares",
    category: "PLASTIC",
  },
  {
    name: "Plástico PEAD (HDPE)",
    description: "Frascos de produtos de limpeza",
    category: "PLASTIC",
  },
  {
    name: "Plástico PP",
    description: "Tampas, potes e utilidades",
    category: "PLASTIC",
  },
  {
    name: "Plástico PVC",
    description: "Tubos e conexões",
    category: "PLASTIC",
  },
  {
    name: "Filme Plástico",
    description: "Sacos e embalagens flexíveis",
    category: "PLASTIC",
  },

  // Metais
  { name: "Alumínio", description: "Latas de bebidas", category: "METAL" },
  {
    name: "Aço",
    description: "Latas de alimentos e sucata ferrosa",
    category: "METAL",
  },
  {
    name: "Cobre",
    description: "Fios e sucata não ferrosa",
    category: "METAL",
  },

  // Vidros
  {
    name: "Vidro Incolor",
    description: "Garrafas e frascos incolores",
    category: "GLASS",
  },
  { name: "Vidro Verde", description: "Garrafas verdes", category: "GLASS" },
  { name: "Vidro Âmbar", description: "Garrafas âmbar", category: "GLASS" },

  // Papéis
  {
    name: "Papel Branco",
    description: "Sulfitos, impressões",
    category: "PAPER",
  },
  {
    name: "Papelão Ondulado",
    description: "Caixas e embalagens",
    category: "PAPER",
  },
  { name: "Tetra Pak", description: "Cartões longa vida", category: "PAPER" },

  // Eletrônicos (e-waste)
  {
    name: "Placas Eletrônicas",
    description: "PCBs e sucata eletrônica",
    category: "E_WASTE",
  },
  { name: "Cabos e Fios", description: "Cabos em geral", category: "E_WASTE" },
  {
    name: "Baterias e Pilhas",
    description: "Baterias diversas",
    category: "E_WASTE",
  },
  {
    name: "Eletrodomésticos",
    description: "Linha branca / marrom",
    category: "E_WASTE",
  },

  // Outros
  {
    name: "Madeira",
    description: "Paletes, sobras de madeira",
    category: "WOOD",
  },
  {
    name: "Borracha",
    description: "Câmaras, pneus processados",
    category: "RUBBER",
  },
  { name: "Têxteis", description: "Roupas, retalhos", category: "TEXTILE" },
  {
    name: "Óleo de Cozinha",
    description: "Óleo vegetal usado",
    category: "OIL",
  },
  {
    name: "Resíduos Orgânicos",
    description: "Compostagem",
    category: "ORGANIC",
  },
];

const CATEGORIES: Array<{ name: string; description?: string; icon?: string }> =
  [
    { name: "PLASTIC", description: "Materiais plásticos", icon: "recycle" },
    {
      name: "METAL",
      description: "Metais ferrosos e não ferrosos",
      icon: "nut",
    },
    { name: "GLASS", description: "Vidros e frascos", icon: "wine" },
    { name: "PAPER", description: "Papéis e papelão", icon: "file-text" },
    { name: "E_WASTE", description: "Resíduos eletrônicos", icon: "cpu" },
    { name: "WOOD", description: "Madeira", icon: "trees" },
    { name: "RUBBER", description: "Borracha", icon: "circle-dot" },
    { name: "TEXTILE", description: "Têxteis", icon: "shirt" },
    { name: "OIL", description: "Óleos", icon: "flame" },
    { name: "ORGANIC", description: "Resíduos orgânicos", icon: "leaf" },
  ];

async function seedMaterials() {
  console.log("🌱 Upsert de materiais (evitando duplicatas)...");

  // Se a tabela de categorias ainda não existir, popular só materiais (sem categoria)
  const existsRows = await prisma.$queryRawUnsafe<Array<{ exists: boolean }>>(
    "SELECT to_regclass('public.material_categories') IS NOT NULL AS exists;",
  );
  const catTable =
    Array.isArray(existsRows) && existsRows[0] ? existsRows[0].exists : false;

  if (!catTable) {
    console.log(
      "⚠️ Tabela material_categories não existe. Populando apenas materials (sem categoria)...",
    );
    for (const m of MATERIALS) {
      await prisma.material.upsert({
        where: { name: m.name },
        update: {
          description: m.description ?? null,
          isActive: true,
          category: { disconnect: true },
        },
        create: {
          name: m.name,
          description: m.description ?? null,
          isActive: true,
        },
      });
      console.log(`✅ Material pronto: ${m.name}`);
    }
    console.log(
      "🎉 Seed de materiais concluído (sem categorias). Crie a tabela e rode novamente para vincular categorias.",
    );
    return;
  }

  // 1) Upsert de categorias e mapa nome -> id
  const categoryMap = new Map<string, string>();
  for (const c of CATEGORIES) {
    const cat = await prisma.materialCategory.upsert({
      where: { name: c.name },
      update: {
        description: c.description ?? null,
        icon: c.icon ?? null,
        isActive: true,
      },
      create: {
        name: c.name,
        description: c.description ?? null,
        icon: c.icon ?? null,
        isActive: true,
      },
    });
    categoryMap.set(c.name, cat.id);
    console.log(`✅ Categoria pronta: ${c.name}`);
  }

  // 2) Upsert de materiais vinculados à categoria
  for (const m of MATERIALS) {
    const categoryId = m.category ? categoryMap.get(m.category) : undefined;

    const updateData: Parameters<typeof prisma.material.upsert>[0]["update"] = {
      description: m.description ?? null,
      isActive: true,
      ...(categoryId
        ? { category: { connect: { id: categoryId } } }
        : { category: { disconnect: true } }),
    };

    const createBase = {
      name: m.name,
      description: m.description ?? null,
      isActive: true,
    } as const;

    const createData = categoryId
      ? { ...createBase, category: { connect: { id: categoryId } } }
      : createBase;

    await prisma.material.upsert({
      where: { name: m.name },
      update: updateData,
      create: createData,
    });
    console.log(
      `✅ Material pronto: ${m.name} ${categoryId ? `(cat: ${m.category})` : "(sem categoria)"}`,
    );
  }

  console.log("🎉 Seed de materiais concluído!");
}

seedMaterials()
  .catch((e) => {
    console.error("❌ Erro no seed de materiais:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
