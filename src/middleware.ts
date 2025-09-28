import type { UserType } from "@prisma/client";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import {
  canAccessRoute,
  getRedirectUrl,
  isApiRoute,
  isPublicRoute,
} from "@/lib/middleware-utils";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Se o usuário não está autenticado, permitir acesso às páginas de auth
    if (!token) {
      return NextResponse.next();
    }

    // Extrair informações do token
    const hasSelectedRole = Boolean(token?.hasSelectedRole);
    const userType = token?.userType as UserType | undefined;
    const userId = token?.id as string | undefined;

    // Identificar tipo de página (para uso futuro)
    // const pageType = getPageType(pathname);

    // Permitir acesso a todas as rotas de API
    if (isApiRoute(pathname)) {
      return NextResponse.next();
    }

    // Verificar redirecionamentos baseados no fluxo de onboarding
    if (userType) {
      const redirectUrl = getRedirectUrl(userType, hasSelectedRole, pathname);
      if (redirectUrl) {
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }
    }

    // Verificar permissões CASL para páginas protegidas
    if (hasSelectedRole && userType && userId) {
      // Verificar se o usuário tem permissão para acessar a rota
      if (!canAccessRoute(pathname, userType, userId)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Permitir acesso às páginas públicas
        if (isPublicRoute(pathname)) {
          return true;
        }

        // Para outras páginas, requer autenticação
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/organization/:path*",
    "/api/protected/:path*",
    "/onboarding/:path*",
    "/",
  ],
};
