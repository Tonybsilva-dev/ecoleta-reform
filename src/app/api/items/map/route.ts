import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { mapItemsSchema } from "@/lib/validations/item.schema";

// GET /api/items/map - Buscar itens próximos para o mapa
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extrair parâmetros de query
    const materialId = searchParams.get("materialId") || undefined;
    const organizationId = searchParams.get("organizationId") || undefined;
    const status = searchParams.get("status") || "ACTIVE";
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice") || "0")
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice") || "0")
      : undefined;
    const latitude = parseFloat(searchParams.get("latitude") ?? "0");
    const longitude = parseFloat(searchParams.get("longitude") ?? "0");
    const radius = parseFloat(searchParams.get("radius") || "10");

    // Validar dados de entrada
    const validatedData = mapItemsSchema.parse({
      materialId,
      organizationId,
      status,
      minPrice,
      maxPrice,
      latitude,
      longitude,
      radius,
    });

    // Construir query base
    let baseQuery = `
      SELECT 
        i.id,
        i.title,
        i.description,
        i.status,
        i.price,
        i.quantity,
        i."transactionType",
        ST_X(i.location::geometry) as longitude,
        ST_Y(i.location::geometry) as latitude,
        ST_Distance(
          i.location, 
          ST_Point(${validatedData.longitude}, ${validatedData.latitude})::geography
        ) / 1000 as distance_km,
        m.name as material_name,
        o.name as organization_name,
        u.name as creator_name
      FROM items i
      LEFT JOIN materials m ON i."materialId" = m.id
      LEFT JOIN organizations o ON i."organizationId" = o.id
      LEFT JOIN users u ON i."createdById" = u.id
      WHERE i.status = 'ACTIVE' 
        AND i.location IS NOT NULL
        AND ST_DWithin(
          i.location, 
          ST_Point(${validatedData.longitude}, ${validatedData.latitude})::geography, 
          ${validatedData.radius * 1000}
        )
    `;

    // Adicionar filtros condicionais
    if (validatedData.materialId) {
      baseQuery += ` AND i."materialId" = '${validatedData.materialId}'`;
    }

    if (validatedData.organizationId) {
      baseQuery += ` AND i."organizationId" = '${validatedData.organizationId}'`;
    }

    if (validatedData.minPrice !== undefined) {
      baseQuery += ` AND i.price >= ${validatedData.minPrice}`;
    }

    if (validatedData.maxPrice !== undefined) {
      baseQuery += ` AND i.price <= ${validatedData.maxPrice}`;
    }

    baseQuery += ` ORDER BY distance_km ASC LIMIT 100`;

    const items = await prisma.$queryRawUnsafe(baseQuery);

    // Converter resultado para formato mais limpo
    const formattedItems = (
      items as Array<{
        id: string;
        title: string;
        description: string | null;
        status: string;
        price: number | null;
        quantity: number;
        longitude: number;
        latitude: number;
        distance_km: number;
        material_name: string | null;
        organization_name: string | null;
        creator_name: string | null;
      }>
    ).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      status: item.status,
      price: item.price,
      quantity: item.quantity,
      location: {
        latitude: item.latitude,
        longitude: item.longitude,
      },
      distance: item.distance_km,
      material: item.material_name
        ? {
            name: item.material_name,
          }
        : null,
      organization: item.organization_name
        ? {
            name: item.organization_name,
          }
        : null,
      creator: item.creator_name
        ? {
            name: item.creator_name,
          }
        : null,
      images: [],
    }));

    return NextResponse.json({
      success: true,
      data: {
        items: formattedItems,
        center: {
          latitude: validatedData.latitude,
          longitude: validatedData.longitude,
        },
        radius: validatedData.radius,
        total: formattedItems.length,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar itens do mapa:", error);

    // Erro de validação Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Parâmetros inválidos",
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
