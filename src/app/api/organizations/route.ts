import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

// GET /api/organizations - Listar organizações disponíveis
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extrair parâmetros de query
    const search = searchParams.get("search") || undefined;
    const verified = searchParams.get("verified") !== "false"; // true por padrão

    // Construir filtros
    const where: Record<string, unknown> = {};

    if (verified) {
      where.verified = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Buscar organizações
    const organizations = await prisma.organization.findMany({
      where,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        website: true,
        logoUrl: true,
        verified: true,
        createdAt: true,
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: organizations,
      total: organizations.length,
    });
  } catch (error) {
    console.error("Erro ao buscar organizações:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
