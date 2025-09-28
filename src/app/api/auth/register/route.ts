import bcrypt from "bcryptjs";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth.schema";

export async function POST(request: NextRequest) {
  try {
    // Parse e validação dos dados do corpo da requisição
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    const { name, email, password } = validatedData;

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Email já está em uso",
          code: "EMAIL_ALREADY_EXISTS",
        },
        { status: 409 },
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criar usuário e perfil em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Criar o usuário
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          emailVerified: null, // Será verificado posteriormente
        },
      });

      // Criar o perfil associado
      const profile = await tx.profile.create({
        data: {
          userId: user.id,
          name,
          userType: "CITIZEN", // Tipo padrão para novos usuários
        },
      });

      return { user, profile };
    });

    // Retornar sucesso (sem dados sensíveis)
    return NextResponse.json(
      {
        message: "Usuário criado com sucesso",
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          userType: result.profile.userType,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro no registro de usuário:", error);

    // Erro de validação do Zod
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: error.message,
          code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    }

    // Erro de banco de dados
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        {
          error: "Email já está em uso",
          code: "EMAIL_ALREADY_EXISTS",
        },
        { status: 409 },
      );
    }

    // Erro interno do servidor
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 },
    );
  }
}

// Método não permitido
export async function GET() {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}
