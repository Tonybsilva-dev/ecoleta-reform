import { UserType } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  return handleSelectType(request);
}

export async function GET(request: NextRequest) {
  return handleSelectType(request);
}

async function handleSelectType(request: NextRequest) {
  try {
    // Verificar se o usuário está autenticado
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    // Obter o userType do body (POST) ou query params (GET)
    let userType: string | null;
    if (request.method === "POST") {
      const body = await request.json();
      userType = body.userType;
    } else {
      const { searchParams } = new URL(request.url);
      userType = searchParams.get("userType");
    }

    if (!userType) {
      return NextResponse.json(
        { error: "Tipo de usuário é obrigatório" },
        { status: 400 },
      );
    }

    // Atualizar o perfil do usuário com o tipo selecionado
    const updatedProfile = await prisma.profile.update({
      where: {
        userId: session.user.id,
      },
      data: {
        userType: userType as UserType,
        hasSelectedRole: true,
      },
      include: {
        user: true,
      },
    });

    // Retornar sucesso com JSON
    const redirectUrl = getRedirectUrl(userType as UserType);

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      redirectUrl,
    });
  } catch (error) {
    console.error("Erro na API selectAccountType:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

function getRedirectUrl(userType: UserType): string {
  switch (userType) {
    case UserType.CITIZEN:
    case UserType.COLLECTOR:
      return "/dashboard";
    case UserType.COMPANY:
    case UserType.NGO:
      return "/onboarding/organization/create";
    default:
      return "/dashboard";
  }
}
