import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { createItemSchema } from "@/lib/validations/item.schema";

// POST /api/items - Criar novo item
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Validar dados de entrada
    const body = await request.json();
    const validatedData = createItemSchema.parse(body);

    // Verificar se o material existe (se fornecido)
    if (validatedData.materialId) {
      const material = await prisma.material.findUnique({
        where: { id: validatedData.materialId },
      });

      if (!material) {
        return NextResponse.json(
          { error: "Material não encontrado" },
          { status: 404 },
        );
      }
    }

    // Verificar se a organização existe (se fornecida)
    if (validatedData.organizationId) {
      const organization = await prisma.organization.findUnique({
        where: { id: validatedData.organizationId },
      });

      if (!organization) {
        return NextResponse.json(
          { error: "Organização não encontrada" },
          { status: 404 },
        );
      }
    }

    // Preparar dados para criação
    const itemData: {
      title: string;
      description?: string | null;
      price?: number | null;
      quantity: number;
      materialId?: string | null;
      organizationId?: string | null;
      createdById: string;
      status: string;
      location?: {
        type: string;
        coordinates: number[];
      };
    } = {
      title: validatedData.title,
      description: validatedData.description || null,
      price: validatedData.price
        ? parseFloat(validatedData.price.toString())
        : null,
      quantity: validatedData.quantity,
      materialId: validatedData.materialId || null,
      organizationId: validatedData.organizationId || null,
      createdById: session.user.id,
      status: "ACTIVE" as const,
    };

    // Adicionar coordenadas geográficas se fornecidas
    if (validatedData.latitude && validatedData.longitude) {
      // Usar PostGIS para inserir ponto geográfico
      itemData.location = {
        type: "Point",
        coordinates: [validatedData.longitude, validatedData.latitude],
      };
    }

    // Criar o item no banco de dados
    const item = await prisma.item.create({
      data: itemData as any,
      include: {
        material: true,
        organization: {
          select: {
            id: true,
            name: true,
            verified: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: true,
      },
    });

    // Criar imagens se fornecidas
    if (validatedData.imageUrls && validatedData.imageUrls.length > 0) {
      const imageData = validatedData.imageUrls.map((url, index) => ({
        url,
        altText: validatedData.imageAltTexts?.[index] || "",
        isPrimary: index === 0, // Primeira imagem é a principal
        itemId: item.id,
      }));

      await prisma.itemImage.createMany({
        data: imageData,
      });

      // Buscar o item atualizado com as imagens
      const updatedItem = await prisma.item.findUnique({
        where: { id: item.id },
        include: {
          material: true,
          organization: {
            select: {
              id: true,
              name: true,
              verified: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          images: true,
        },
      });

      return NextResponse.json(
        {
          success: true,
          data: updatedItem,
          message: "Item criado com sucesso",
        },
        { status: 201 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: item,
        message: "Item criado com sucesso",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar item:", error);

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

// GET /api/items - Listar itens com filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extrair parâmetros de query
    const query = searchParams.get("query") || undefined;
    const materialId = searchParams.get("materialId") || undefined;
    const organizationId = searchParams.get("organizationId") || undefined;
    const status = searchParams.get("status") || undefined;
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;
    const latitude = searchParams.get("latitude")
      ? parseFloat(searchParams.get("latitude")!)
      : undefined;
    const longitude = searchParams.get("longitude")
      ? parseFloat(searchParams.get("longitude")!)
      : undefined;
    const radius = searchParams.get("radius")
      ? parseFloat(searchParams.get("radius")!)
      : 10;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    // Construir filtros
    const where: any = {
      status: "ACTIVE", // Apenas itens ativos por padrão
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    if (materialId) {
      where.materialId = materialId;
    }

    if (organizationId) {
      where.organizationId = organizationId;
    }

    if (status) {
      where.status = status;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Filtro geográfico usando PostGIS
    if (latitude && longitude) {
      where.location = {
        not: null,
      };
    }

    // Calcular offset para paginação
    const skip = (page - 1) * limit;

    // Buscar itens
    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        include: {
          material: true,
          organization: {
            select: {
              id: true,
              name: true,
              verified: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.item.count({ where }),
    ]);

    // Se há filtro geográfico, calcular distâncias
    let itemsWithDistance = items;
    if (latitude && longitude) {
      // Usar PostGIS para calcular distâncias
      const itemsWithLocation = await prisma.$queryRaw<
        Array<{
          id: string;
          distance_km: number;
        }>
      >`
        SELECT 
          i.id,
          ST_Distance(
            i.location, 
            ST_Point(${longitude}, ${latitude})::geography
          ) / 1000 as distance_km
        FROM items i
        WHERE i.location IS NOT NULL
          AND ST_DWithin(
            i.location, 
            ST_Point(${longitude}, ${latitude})::geography, 
            ${radius * 1000}
          )
        ORDER BY distance_km ASC
        LIMIT ${limit}
        OFFSET ${skip}
      `;

      // Combinar dados do Prisma com distâncias calculadas
      itemsWithDistance = items.map((item, index) => ({
        ...item,
        distance: itemsWithLocation[index]?.distance_km || null,
      }));
    }

    return NextResponse.json({
      success: true,
      data: {
        items: itemsWithDistance,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Erro ao buscar itens:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
