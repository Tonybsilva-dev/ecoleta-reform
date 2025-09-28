import type { UserType } from "@prisma/client";

/**
 * Tipos de páginas que o middleware pode identificar
 */
export type PageType =
  | "onboarding"
  | "auth"
  | "public"
  | "api"
  | "admin"
  | "organization"
  | "dashboard"
  | "profile";

/**
 * Configuração de rotas protegidas por tipo de usuário
 */
export const PROTECTED_ROUTES: Record<string, UserType[]> = {
  "/admin": [], // Apenas ADMIN (role especial)
  "/organization": ["COMPANY", "NGO"],
  "/dashboard/admin": [], // Apenas ADMIN
  "/dashboard/collector": ["COLLECTOR"],
  "/dashboard/organization": ["COMPANY", "NGO"],
};

/**
 * Identifica o tipo de página baseado no pathname
 */
export function getPageType(pathname: string): PageType {
  if (pathname.startsWith("/onboarding")) return "onboarding";
  if (pathname.startsWith("/auth") || pathname.startsWith("/register"))
    return "auth";
  if (pathname === "/" || pathname.startsWith("/api/auth")) return "public";
  if (pathname.startsWith("/api/")) return "api";
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/organization")) return "organization";
  if (pathname.startsWith("/dashboard")) return "dashboard";
  if (pathname.startsWith("/profile")) return "profile";

  return "public";
}

/**
 * Verifica se o usuário tem permissão para acessar uma rota específica
 */
export function canAccessRoute(
  pathname: string,
  userType: UserType,
  _userId: string,
  userRole?: string, // Adicionar role do usuário
): boolean {
  // Verificar rotas específicas
  for (const [route, allowedTypes] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (allowedTypes.length === 0) {
        // Rotas que requerem role especial (como ADMIN)
        return userRole === "ADMIN";
      }
      return allowedTypes.includes(userType);
    }
  }

  return true; // Por padrão, permitir acesso
}

/**
 * Determina o redirecionamento apropriado baseado no tipo de usuário
 */
export function getRedirectUrl(
  userType: UserType,
  hasSelectedRole: boolean,
  currentPath: string,
  userRole?: string,
): string | null {
  // Se não selecionou role ainda, ir para seleção
  if (!hasSelectedRole) {
    return "/onboarding/select-type";
  }

  // Se está na página de seleção mas já selecionou
  if (currentPath === "/onboarding/select-type") {
    if (userType === "COMPANY" || userType === "NGO") {
      return "/onboarding/organization/create";
    }
    // Se é ADMIN, redirecionar para /admin
    if (userRole === "ADMIN") {
      return "/admin";
    }
    return "/dashboard";
  }

  // Se está em onboarding mas já selecionou role
  if (
    currentPath.startsWith("/onboarding") &&
    currentPath !== "/onboarding/organization/create"
  ) {
    // Se é ADMIN, redirecionar para /admin
    if (userRole === "ADMIN") {
      return "/admin";
    }
    return "/dashboard";
  }

  return null; // Não redirecionar
}

/**
 * Verifica se uma rota é pública (não requer autenticação)
 */
export function isPublicRoute(pathname: string): boolean {
  const publicRoutes = ["/", "/api/auth", "/auth", "/register"];

  return publicRoutes.some((route) => pathname.startsWith(route));
}

/**
 * Verifica se uma rota é de API
 */
export function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/");
}
