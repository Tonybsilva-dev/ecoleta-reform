import bcrypt from "bcryptjs";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { userPasswordChangeSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    // Verificar se o usuário está autenticado
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Parsear e validar o corpo da requisição
    const body = await request.json();
    const validationResult = userPasswordChangeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const { currentPassword, newPassword } = validationResult.data;

    // Buscar o usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    // Se o usuário já tem uma senha, verificar a senha atual
    if (user.password) {
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: "Senha atual incorreta" },
          { status: 400 },
        );
      }
    }

    // Hash da nova senha
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Atualizar a senha do usuário
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json(
      { message: "Senha atualizada com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
