import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Testando conexão com o banco...");

    // Teste simples
    const userCount = await prisma.user.count();
    console.log("Usuários encontrados:", userCount);

    const itemCount = await prisma.item.count();
    console.log("Itens encontrados:", itemCount);

    const materialCount = await prisma.material.count();
    console.log("Materiais encontrados:", materialCount);

    const orgCount = await prisma.organization.count();
    console.log("Organizações encontradas:", orgCount);

    return NextResponse.json({
      success: true,
      data: {
        users: userCount,
        items: itemCount,
        materials: materialCount,
        organizations: orgCount,
      },
    });
  } catch (error) {
    console.error("Erro no teste do banco:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: "Erro interno do servidor", details: errorMessage },
      { status: 500 },
    );
  }
}
