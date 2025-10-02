import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth.config";

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { images } = body; // Array de strings base64

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma imagem base64 fornecida" },
        { status: 400 },
      );
    }

    // Validar se são dados base64 válidos
    const base64Regex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;

    for (const image of images) {
      if (!base64Regex.test(image)) {
        return NextResponse.json(
          { error: "Formato de imagem base64 inválido" },
          { status: 400 },
        );
      }
    }

    // Retornar as imagens base64 como estão (para salvar diretamente no banco)
    return NextResponse.json({
      success: true,
      data: images,
      message: `${images.length} imagem(ns) base64 processada(s) com sucesso`,
    });
  } catch (error) {
    console.error("Erro ao processar imagens base64:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
