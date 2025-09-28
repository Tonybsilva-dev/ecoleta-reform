"use server";

import { UserType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

export async function selectAccountType(userType: UserType) {
  try {
    // Verificar se o usuário está autenticado
    const session = await auth();

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

    // Redirecionar baseado no tipo de conta selecionado
    switch (userType) {
      case UserType.CITIZEN:
      case UserType.COLLECTOR:
        redirect("/dashboard");
        break;
      case UserType.COMPANY:
      case UserType.NGO:
        redirect("/onboarding/organization/create");
        break;
      default:
        redirect("/dashboard");
        break;
    }
  } catch (error) {
    console.error("Erro ao selecionar tipo de conta:", error);
    throw new Error("Erro interno do servidor. Tente novamente.");
  }
}

export async function getAccountTypeSelectionStatus() {
  try {
    const session = await auth();

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
