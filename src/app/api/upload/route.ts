import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
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

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 },
      );
    }

    // Criar diretório de uploads se não existir
    const uploadDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedFiles = [];

    for (const file of files) {
      // Validar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: `Arquivo ${file.name} não é uma imagem válida` },
          { status: 400 },
        );
      }

      // Validar tamanho (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `Arquivo ${file.name} é muito grande (máximo 5MB)` },
          { status: 400 },
        );
      }

      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split(".").pop();
      const fileName = `${timestamp}-${randomString}.${fileExtension}`;
      const filePath = join(uploadDir, fileName);

      // Converter ArrayBuffer para Buffer e salvar
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Retornar URL pública do arquivo
      const publicUrl = `/uploads/${fileName}`;
      uploadedFiles.push({
        originalName: file.name,
        fileName,
        url: publicUrl,
        size: file.size,
        type: file.type,
      });
    }

    return NextResponse.json({
      success: true,
      data: uploadedFiles,
      message: `${uploadedFiles.length} arquivo(s) enviado(s) com sucesso`,
    });
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
