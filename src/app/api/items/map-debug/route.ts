import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/items/map-debug - Versão de debug
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Iniciando debug da API...");

    const { searchParams } = new URL(request.url);
    const latitude = parseFloat(searchParams.get("latitude") ?? "0");
    const longitude = parseFloat(searchParams.get("longitude") ?? "0");
    const radius = parseFloat(searchParams.get("radius") || "10");

    console.log("📊 Parâmetros:", { latitude, longitude, radius });

    // Teste 1: Query básica
    console.log("🧪 Teste 1: Query básica...");
    interface BasicItem {
      id: string;
      title: string;
      status: string;
    }
    const basicItems = await prisma.$queryRaw`
      SELECT id, title, status
      FROM items 
      WHERE status = 'ACTIVE' AND location IS NOT NULL
      LIMIT 3
    `;
    console.log(
      "✅ Itens básicos encontrados:",
      (basicItems as BasicItem[]).length,
    );

    // Teste 2: Query PostGIS simples
    console.log("🧪 Teste 2: Query PostGIS simples...");
    interface PostGISItem {
      id: string;
      title: string;
      longitude: number;
      latitude: number;
    }
    const postgisItems = await prisma.$queryRaw`
      SELECT 
        i.id,
        i.title,
        ST_X(i.location::geometry) as longitude,
        ST_Y(i.location::geometry) as latitude
      FROM items i
      WHERE i.location IS NOT NULL
      LIMIT 3
    `;
    console.log(
      "✅ Query PostGIS simples:",
      (postgisItems as PostGISItem[]).length,
    );

    // Teste 3: Query com distância
    console.log("🧪 Teste 3: Query com distância...");
    interface DistanceItem {
      id: string;
      title: string;
      distance_km: number;
    }
    const distanceItems = await prisma.$queryRaw`
      SELECT 
        i.id,
        i.title,
        ST_Distance(
          i.location, 
          ST_Point(${longitude}, ${latitude})::geography
        ) / 1000 as distance_km
      FROM items i
      WHERE i.location IS NOT NULL
      ORDER BY distance_km ASC
      LIMIT 3
    `;
    console.log(
      "✅ Query com distância:",
      (distanceItems as DistanceItem[]).length,
    );

    // Teste 4: Query completa usando nomes corretos das colunas
    console.log("🧪 Teste 4: Query completa...");
    const fullItems = await prisma.$queryRaw`
      SELECT 
        i.id,
        i.title,
        i.description,
        i.status,
        i.price,
        i.quantity,
        ST_X(i.location::geometry) as longitude,
        ST_Y(i.location::geometry) as latitude,
        ST_Distance(
          i.location, 
          ST_Point(${longitude}, ${latitude})::geography
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
          ST_Point(${longitude}, ${latitude})::geography, 
          ${radius * 1000}
        )
      ORDER BY distance_km ASC
      LIMIT 10
    `;
    console.log("✅ Query completa:", (fullItems as RawItem[]).length);

    // Adicionar interface para o resultado da query
    interface RawItem {
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
    }

    // Converter resultado
    const formattedItems = (fullItems as RawItem[]).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      status: item.status,
      price: item.price ? parseFloat(item.price.toString()) : null,
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
      creator: {
        name: item.creator_name,
      },
      images: [],
    }));

    console.log("🎉 Debug concluído com sucesso!");

    return NextResponse.json({
      success: true,
      data: {
        items: formattedItems,
        center: { latitude, longitude },
        radius,
        total: formattedItems.length,
        debug: {
          basicItems: (basicItems as BasicItem[]).length,
          postgisItems: (postgisItems as PostGISItem[]).length,
          distanceItems: (distanceItems as DistanceItem[]).length,
          fullItems: (fullItems as RawItem[]).length,
        },
      },
    });
  } catch (error) {
    console.error("❌ Erro no debug:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: (error as Error).message,
        stack: (error as Error).stack,
      },
      { status: 500 },
    );
  }
}
