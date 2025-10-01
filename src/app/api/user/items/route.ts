import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

// GET /api/user/items - Listar itens do usuário logado
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Extrair parâmetros de query
    const query = searchParams.get("query") || undefined;
    const materialId = searchParams.get("materialId") || undefined;
    const status = searchParams.get("status") || undefined;
    const minPriceParam = searchParams.get("minPrice");
    const minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined;
    const maxPriceParam = searchParams.get("maxPrice");
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    // Construir filtros - SEMPRE filtrar por usuário logado
    const where: Record<string, unknown> = {
      createdById: session.user.id, // FILTRO CRÍTICO: apenas itens do usuário
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

    if (status) {
      where.status = status;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Calcular offset para paginação
    const skip = (page - 1) * limit;

    // Buscar itens do usuário
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

    // Calcular informações de paginação
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext,
          hasPrev,
        },
      },
    });
  } catch (error) {
    console.error("Erro ao buscar itens do usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
