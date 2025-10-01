import type { Prisma } from "@prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

// GET /api/materials - Listar materiais disponíveis
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extrair parâmetros de query
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const active = searchParams.get("active") !== "false"; // true por padrão

    // Construir filtros
    const where: Prisma.MaterialWhereInput = {};

    if (active) {
      where.isActive = true;
    }

    if (category) {
      // Filtrar por nome da categoria
      where.category = {
        name: {
          equals: category,
        },
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Buscar materiais
    const materials = await prisma.material.findMany({
      where,
      include: { category: true },
      orderBy: [{ name: "asc" }],
    });

    // Agrupar por categoria para facilitar o uso no frontend
    const materialsByCategory = materials.reduce(
      (
        acc: Record<
          string,
          Array<{
            id: string;
            name: string;
            description: string | null;
            category: string | null;
            isActive: boolean;
            itemCount: number;
            createdAt: Date;
            updatedAt: Date;
          }>
        >,
        material,
      ) => {
        const categoryName =
          material.category &&
          typeof material.category === "object" &&
          "name" in material.category
            ? (material.category as { name: string }).name
            : typeof material.category === "string"
              ? material.category
              : "Outros";
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push({
          id: material.id,
          name: material.name,
          description: material.description,
          category: categoryName,
          isActive: material.isActive,
          itemCount: 0, // TODO: Implementar contagem de itens quando necessário
          createdAt: material.createdAt,
          updatedAt: material.updatedAt,
        });
        return acc;
      },
      {} as Record<
        string,
        Array<{
          id: string;
          name: string;
          description: string | null;
          category: string | null;
          isActive: boolean;
          itemCount: number;
          createdAt: Date;
          updatedAt: Date;
        }>
      >,
    );

    return NextResponse.json({
      success: true,
      data: {
        materials,
        materialsByCategory,
        total: materials.length,
        categories: Object.keys(materialsByCategory) as string[],
      },
    });
  } catch (error) {
    console.error("Erro ao buscar materiais:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

// POST /api/materials - Criar novo material (apenas para admins)
export async function POST(request: NextRequest) {
  try {
    // TODO: Implementar verificação de permissão de admin
    // Por enquanto, permitir criação para qualquer usuário autenticado

    const body = await request.json();

    // Validar dados de entrada
    const createMaterialSchema = z.object({
      name: z
        .string()
        .min(1, "Nome é obrigatório")
        .max(100, "Nome deve ter no máximo 100 caracteres"),
      description: z
        .string()
        .max(500, "Descrição deve ter no máximo 500 caracteres")
        .optional(),
      category: z
        .string()
        .max(50, "Categoria deve ter no máximo 50 caracteres")
        .optional(),
    });

    const validatedData = createMaterialSchema.parse(body);

    // Verificar se já existe um material com o mesmo nome
    const existingMaterial = await prisma.material.findUnique({
      where: { name: validatedData.name },
    });

    if (existingMaterial) {
      return NextResponse.json(
        { error: "Já existe um material com este nome" },
        { status: 409 },
      );
    }

    // Criar material
    const material = await prisma.material.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        ...(validatedData.category && {
          category: { connect: { id: validatedData.category } },
        }),
        isActive: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: material,
        message: "Material criado com sucesso",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar material:", error);

    // Erro de validação Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    // Erro genérico
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
