"use client";

import type { UserType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import {
  type Actions,
  type AppAbility,
  createAbilityFor,
  type Resources,
} from "@/lib/permissions";

/**
 * Hook para usar CASL abilities em componentes React
 *
 * @example
 * ```tsx
 * const { can, cannot, ability } = useAbility();
 *
 * if (can('create', 'Item')) {
 *   return <CreateItemButton />;
 * }
 *
 * if (cannot('delete', 'Item')) {
 *   return <span>Você não pode deletar este item</span>;
 * }
 * ```
 */
export function useAbility() {
  const { data: session, status } = useSession();

  const ability = useMemo((): AppAbility => {
    if (status === "loading" || !session?.user) {
      // Usuário não autenticado - abilities limitadas
      return createAbilityFor("CITIZEN" as UserType);
    }

    const userType = session.user.userType as UserType;
    const userId = session.user.id;
    const organizationId = undefined; // Será implementado quando tivermos organizationId no session

    return createAbilityFor(userType, userId, organizationId);
  }, [session, status]);

  // Funções de conveniência
  const can = (action: Actions, resource: Resources) => {
    return ability.can(action, resource);
  };

  const cannot = (action: Actions, resource: Resources) => {
    return ability.cannot(action, resource);
  };

  const relevantRuleFor = (action: Actions, resource: Resources) => {
    return ability.relevantRuleFor(action, resource);
  };

  return {
    ability,
    can,
    cannot,
    relevantRuleFor,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    user: session?.user,
  };
}

/**
 * Hook para verificar permissões específicas
 *
 * @example
 * ```tsx
 * const canCreateItems = useCan('create', 'Item');
 * const canDeleteItems = useCan('delete', 'Item');
 * ```
 */
export function useCan(action: Actions, resource: Resources): boolean {
  const { can } = useAbility();
  return can(action, resource);
}

/**
 * Hook para verificar se NÃO pode executar uma ação
 *
 * @example
 * ```tsx
 * const cannotDeleteItem = useCannot('delete', 'Item');
 * ```
 */
export function useCannot(action: Actions, resource: Resources): boolean {
  const { cannot } = useAbility();
  return cannot(action, resource);
}

/**
 * Hook para obter regras específicas de um recurso
 *
 * @example
 * ```tsx
 * const itemRules = useRulesFor('Item');
 * ```
 */
export function useRulesFor(resource: Resources) {
  const { ability } = useAbility();
  return ability.rules.filter((rule) => rule.subject === resource);
}

/**
 * Hook para verificar se o usuário tem um tipo específico
 *
 * @example
 * ```tsx
 * const isAdmin = useIsUserType('ADMIN');
 * const isCollector = useIsUserType('COLLECTOR');
 * ```
 */
export function useIsUserType(userType: UserType): boolean {
  const { user } = useAbility();
  return user?.userType === userType;
}

/**
 * Hook para verificar se o usuário é administrador
 */
export function useIsAdmin(): boolean {
  // ADMIN não está no UserType, será implementado quando tivermos o sistema de roles completo
  return false;
}

/**
 * Hook para verificar se o usuário é coletor
 */
export function useIsCollector(): boolean {
  return useIsUserType("COLLECTOR");
}

/**
 * Hook para verificar se o usuário é de uma organização (Company ou NGO)
 */
export function useIsOrganization(): boolean {
  const { user } = useAbility();
  return user?.userType === "COMPANY" || user?.userType === "NGO";
}
