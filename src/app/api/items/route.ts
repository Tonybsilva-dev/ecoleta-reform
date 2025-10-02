import type { Prisma } from "@prisma/client";
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

    // Debug: verificar dados recebidos
    console.log("API recebeu:", {
      ...body,
      imageUrls: body.imageUrls,
      imageUrlsLength: body.imageUrls?.length || 0,
      imageBase64Length: body.imageBase64?.length || 0,
      imageUrlsPreview:
        body.imageUrls?.map((img: string) => `${img.substring(0, 50)}...`) ||
        [],
      imageBase64Preview:
        body.imageBase64?.map((img: string) => `${img.substring(0, 50)}...`) ||
        [],
    });

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

    // Preparar dados para criação (sem location)
    const itemData = {
      title: validatedData.title,
      description: validatedData.description || null,
      transactionType: validatedData.transactionType ?? "DONATION",
      price: validatedData.price
        ? parseFloat(validatedData.price.toString())
        : null,
      quantity: validatedData.quantity,
      materialId: validatedData.materialId || null,
      organizationId: validatedData.organizationId || null,
      createdById: session.user.id,
      status: "ACTIVE" as const,
    };

    // Criar o item no banco de dados
    const item = await prisma.item.create({
      data: itemData,
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

    // Adicionar coordenadas geográficas usando SQL raw se fornecidas
    if (validatedData.latitude && validatedData.longitude) {
      await prisma.$executeRaw`
        UPDATE items 
        SET location = ST_Point(${validatedData.longitude}, ${validatedData.latitude})::geography
        WHERE id = ${item.id}
      `;
    }

    // Criar imagens se fornecidas
    console.log("Verificando imagens:", {
      hasImageUrls: !!validatedData.imageUrls,
      imageUrlsLength: validatedData.imageUrls?.length || 0,
      hasImageBase64: !!validatedData.imageBase64,
      imageBase64Length: validatedData.imageBase64?.length || 0,
    });

    // Processar imagens (URLs ou base64)
    const imagesToCreate = [];

    if (validatedData.imageUrls && validatedData.imageUrls.length > 0) {
      // Criar imagens a partir de URLs
      validatedData.imageUrls.forEach((url, index) => {
        imagesToCreate.push({
          url,
          base64: null,
          altText: validatedData.imageAltTexts?.[index] || "",
          isPrimary: index === 0, // Primeira imagem é a principal
          itemId: item.id,
        });
      });
    } else if (
      validatedData.imageBase64 &&
      validatedData.imageBase64.length > 0
    ) {
      // Criar imagens a partir de base64
      validatedData.imageBase64.forEach((base64Data, index) => {
        imagesToCreate.push({
          url: null,
          base64: base64Data,
          altText: validatedData.imageAltTexts?.[index] || "",
          isPrimary: index === 0, // Primeira imagem é a principal
          itemId: item.id,
        });
      });
    }

    if (imagesToCreate.length > 0) {
      console.log("Criando imagens:", {
        imageDataCount: imagesToCreate.length,
        imageData: imagesToCreate.map((img) => ({
          ...img,
          url: img.url ? `${img.url.substring(0, 50)}...` : null,
          base64: img.base64 ? `${img.base64.substring(0, 50)}...` : null,
        })),
      });

      await prisma.itemImage.createMany({
        data: imagesToCreate,
      });

      console.log("Imagens criadas com sucesso!");

      // Buscar o item atualizado com as imagens
      const updatedItem = await prisma.item.findUnique({
        where: { id: item.id },
        include: {
          material: { include: { category: true } },
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

      console.log("Item atualizado com imagens:", {
        itemId: updatedItem?.id,
        imagesCount: updatedItem?.images?.length || 0,
        images: updatedItem?.images,
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
    const minPriceParam = searchParams.get("minPrice");
    const minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined;
    const maxPriceParam = searchParams.get("maxPrice");
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined;
    const latitudeParam = searchParams.get("latitude");
    const latitude = latitudeParam ? parseFloat(latitudeParam) : undefined;
    const longitudeParam = searchParams.get("longitude");
    const longitude = longitudeParam ? parseFloat(longitudeParam) : undefined;
    const radiusParam = searchParams.get("radius");
    const radius = radiusParam ? parseFloat(radiusParam) : 10;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    // Construir filtros
    const where: Prisma.ItemWhereInput = {
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
      where.status = status as
        | "ACTIVE"
        | "INACTIVE"
        | "SOLD"
        | "DONATED"
        | "COLLECTED";
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Filtro geográfico usando PostGIS - será aplicado na query raw
    // where.location = { not: null }; // Não funciona com PrismaWhereInput

    // Calcular offset para paginação
    const skip = (page - 1) * limit;

    // Buscar itens
    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          quantity: true,
          status: true,
          transactionType: true,
          createdAt: true,
          updatedAt: true,
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
