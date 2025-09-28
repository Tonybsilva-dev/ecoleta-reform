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
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
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

    // Construir filtros SQL para PostGIS
    let whereClause = "WHERE i.status = $1 AND i.location IS NOT NULL";
    const queryParams: string[] = [validatedData.status || "ACTIVE"];
    let paramIndex = 2;

    if (validatedData.materialId) {
      whereClause += ` AND i.material_id = $${paramIndex}`;
      queryParams.push(validatedData.materialId);
      paramIndex++;
    }

    if (validatedData.organizationId) {
      whereClause += ` AND i.organization_id = $${paramIndex}`;
      queryParams.push(validatedData.organizationId);
      paramIndex++;
    }

    if (validatedData.minPrice !== undefined) {
      whereClause += ` AND i.price >= $${paramIndex}`;
      queryParams.push(validatedData.minPrice.toString());
      paramIndex++;
    }

    if (validatedData.maxPrice !== undefined) {
      whereClause += ` AND i.price <= $${paramIndex}`;
      queryParams.push(validatedData.maxPrice.toString());
      paramIndex++;
    }

    // Adicionar filtro de distância
    whereClause += ` AND ST_DWithin(
      i.location, 
      ST_Point($${paramIndex}, $${paramIndex + 1})::geography, 
      $${paramIndex + 2}
    )`;
    queryParams.push(
      validatedData.longitude.toString(),
      validatedData.latitude.toString(),
      (validatedData.radius * 1000).toString(),
    );

    // Query SQL para buscar itens com distância calculada
    const items = await prisma.$queryRaw`
      SELECT 
        i.id,
        i.title,
        i.description,
        i.status,
        i.price,
        i.quantity,
        i.created_at,
        i.updated_at,
        i.created_by_id,
        i.organization_id,
        i.material_id,
        ST_X(i.location::geometry) as longitude,
        ST_Y(i.location::geometry) as latitude,
        ST_Distance(
          i.location, 
          ST_Point(${validatedData.longitude}, ${validatedData.latitude})::geography
        ) / 1000 as distance_km,
        m.name as material_name,
        m.category as material_category,
        o.name as organization_name,
        o.verified as organization_verified,
        u.name as creator_name,
        u.email as creator_email,
        (
          SELECT json_agg(
            json_build_object(
              'id', ii.id,
              'url', ii.url,
              'altText', ii.alt_text,
              'isPrimary', ii.is_primary
            )
          )
          FROM item_images ii
          WHERE ii.item_id = i.id
          ORDER BY ii.is_primary DESC, ii.created_at ASC
        ) as images
      FROM items i
      LEFT JOIN materials m ON i.material_id = m.id
      LEFT JOIN organizations o ON i.organization_id = o.id
      LEFT JOIN users u ON i.created_by_id = u.id
      ${whereClause}
      ORDER BY distance_km ASC
      LIMIT 100
    `;

    // Converter resultado para formato mais limpo
    const formattedItems = (
      items as Array<{
        id: string;
        title: string;
        description: string | null;
        status: string;
        price: string | null;
        quantity: number;
        created_at: Date;
        updated_at: Date;
        created_by_id: string;
        organization_id: string | null;
        material_id: string | null;
        longitude: number;
        latitude: number;
        distance_km: number;
        material_name: string | null;
        material_category: string | null;
        organization_name: string | null;
        organization_verified: boolean | null;
        creator_name: string | null;
        creator_email: string | null;
        images: Array<{
          id: string;
          url: string;
          altText: string | null;
          isPrimary: boolean;
        }> | null;
      }>
    ).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      status: item.status,
      price: item.price ? parseFloat(item.price) : null,
      quantity: item.quantity,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      location: {
        latitude: item.latitude,
        longitude: item.longitude,
      },
      distance: item.distance_km,
      material: item.material_name
        ? {
            id: item.material_id,
            name: item.material_name,
            category: item.material_category,
          }
        : null,
      organization: item.organization_name
        ? {
            id: item.organization_id,
            name: item.organization_name,
            verified: item.organization_verified,
          }
        : null,
      creator: {
        id: item.created_by_id,
        name: item.creator_name,
        email: item.creator_email,
      },
      images: item.images || [],
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
