import { UserType } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    console.log("=== API ROUTE: selectAccountType ===");

    // Verificar se o usuário está autenticado
    const session = await getServerSession(authOptions);
    console.log("session encontrada:", !!session);
    console.log("user.id:", session?.user?.id);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    // Obter o userType do body
    const body = await request.json();
    const { userType } = body;
    console.log("userType recebido:", userType);

    if (!userType) {
      return NextResponse.json(
        { error: "Tipo de usuário é obrigatório" },
        { status: 400 },
      );
    }

    // Atualizar o perfil do usuário com o tipo selecionado
    console.log("Atualizando perfil no banco...");
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
    console.log("Perfil atualizado:", updatedProfile);

    // Retornar sucesso
    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      redirectUrl: getRedirectUrl(userType as UserType),
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
