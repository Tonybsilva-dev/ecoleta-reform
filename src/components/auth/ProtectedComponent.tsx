"use client";

import type { ReactNode } from "react";
import { useAbility, useCan } from "@/hooks/useAbility";
import type { Actions, Resources } from "@/lib/permissions";

interface ProtectedComponentProps {
  action: Actions;
  resource: Resources;
  children: ReactNode;
  fallback?: ReactNode;
  showError?: boolean;
  errorMessage?: string;
}

/**
 * Componente que renderiza children apenas se o usuário tiver permissão
 *
 * @example
 * ```tsx
 * <ProtectedComponent action="create" resource="Item">
 *   <CreateItemButton />
 * </ProtectedComponent>
 *
 * <ProtectedComponent
 *   action="delete"
 *   resource="Item"
 *   fallback={<span>Você não pode deletar este item</span>}
 * >
 *   <DeleteItemButton />
 * </ProtectedComponent>
 * ```
 */
export function ProtectedComponent({
  action,
  resource,
  children,
  fallback = null,
  showError = false,
  errorMessage = "Você não tem permissão para executar esta ação",
}: ProtectedComponentProps) {
  const can = useCan(action, resource);

  if (can) {
    return <>{children}</>;
  }

  if (showError) {
    return <span className="text-red-500 text-sm">{errorMessage}</span>;
  }

  return <>{fallback}</>;
}

/**
 * Componente que renderiza children apenas se o usuário NÃO tiver permissão
 *
 * @example
 * ```tsx
 * <RestrictedComponent action="delete" resource="Item">
 *   <span>Você não pode deletar este item</span>
 * </RestrictedComponent>
 * ```
 */
export function RestrictedComponent({
  action,
  resource,
  children,
}: Omit<ProtectedComponentProps, "fallback" | "showError" | "errorMessage">) {
  const { cannot } = useAbility();

  if (cannot(action, resource)) {
    return <>{children}</>;
  }

  return null;
}

/**
 * Hook para usar em componentes que precisam de verificação de permissão
 *
 * @example
 * ```tsx
 * function ItemActions({ item }: { item: Item }) {
 *   const { can, cannot } = useAbility();
 *
 *   return (
 *     <div>
 *       {can('update', 'Item') && (
 *         <EditButton />
 *       )}
 *       {cannot('delete', 'Item') && (
 *         <span>Você não pode deletar este item</span>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export { useAbility, useCan } from "@/hooks/useAbility";
