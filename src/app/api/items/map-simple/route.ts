import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

// GET /api/items/map-simple - Versão simplificada para teste
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const latitude = parseFloat(searchParams.get("latitude") ?? "0");
    const longitude = parseFloat(searchParams.get("longitude") ?? "0");
    const radius = parseFloat(searchParams.get("radius") || "10");

    console.log("Parâmetros recebidos:", { latitude, longitude, radius });

    // Query simples sem PostGIS primeiro
    const items = await prisma.item.findMany({
      where: {
        status: "ACTIVE",
        location: {
          not: null,
        },
      },
      include: {
        material: true,
        organization: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: {
          orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
        },
      },
      take: 10,
    });

    console.log("Itens encontrados:", items.length);

    // Converter para formato esperado
    const formattedItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      status: item.status,
      price: item.price ? parseFloat(item.price.toString()) : null,
      quantity: item.quantity,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      location: {
        latitude: 0, // Placeholder
        longitude: 0, // Placeholder
      },
      distance: 0, // Placeholder
      material: item.material
        ? {
            id: item.material.id,
            name: item.material.name,
            category: item.material.category,
          }
        : null,
      organization: item.organization
        ? {
            id: item.organization.id,
            name: item.organization.name,
            verified: item.organization.verified,
          }
        : null,
      creator: {
        id: item.createdBy.id,
        name: item.createdBy.name,
        email: item.createdBy.email,
      },
      images: item.images.map((img) => ({
        id: img.id,
        url: img.url,
        altText: img.altText,
        isPrimary: img.isPrimary,
      })),
    }));

    return NextResponse.json({
      success: true,
      data: {
        items: formattedItems,
        center: {
          latitude,
          longitude,
        },
        radius,
        total: formattedItems.length,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar itens do mapa:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
