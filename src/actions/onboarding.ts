"use server";

import type { UserType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

export async function selectAccountType(userType: UserType) {
  try {
    // Verificar se o usuário está autenticado
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    // Atualizar o perfil do usuário com o tipo selecionado
    await prisma.profile.update({
      where: {
        userId: session.user.id,
      },
      data: {
        userType,
        hasSelectedRole: true,
      },
      include: {
        user: true,
      },
    });

    // Revalidar o cache da página
    revalidatePath("/onboarding/select-type");
    revalidatePath("/dashboard");

    // O redirecionamento será feito no cliente após o sucesso
  } catch (error) {
    // Se for um redirect, re-lançar para não ser tratado como erro
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Erro ao selecionar tipo de conta:", error);
    throw new Error("Erro interno do servidor. Tente novamente.");
  }
}

export async function getAccountTypeSelectionStatus() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { hasSelectedRole: false, userType: null };
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
      },
      select: {
        hasSelectedRole: true,
        userType: true,
      },
    });

    return {
      hasSelectedRole: profile?.hasSelectedRole ?? false,
      userType: profile?.userType ?? null,
    };
  } catch (error) {
    console.error("Erro ao verificar status de seleção de conta:", error);
    return { hasSelectedRole: false, userType: null };
  }
}
