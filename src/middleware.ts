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
    // Bypass completo em ambiente de E2E para facilitar testes de UI
    if (process.env.E2E_TEST === "true") {
      return NextResponse.next();
    }
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Se o usuário não está autenticado, permitir acesso às páginas de auth
    if (!token) {
      // Bloquear acesso a /admin se não estiver autenticado
      if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/signin", req.url));
      }
      return NextResponse.next();
    }

    // Extrair informações do token
    const hasSelectedRole = Boolean(token?.hasSelectedRole);
    const userType = token?.userType as UserType | undefined;
    const userId = token?.id as string | undefined;
    const userRole = token?.role as string | undefined;

    // Identificar tipo de página (para uso futuro)
    // const pageType = getPageType(pathname);

    // Permitir acesso a todas as rotas de API
    if (isApiRoute(pathname)) {
      return NextResponse.next();
    }

    // Verificar redirecionamentos baseados no fluxo de onboarding
    // Só verificar redirecionamentos se o usuário estiver autenticado
    if (userType && hasSelectedRole !== undefined) {
      // Se é ADMIN, sempre redirecionar para /admin (exceto se já estiver lá)
      if (
        userRole === "ADMIN" &&
        pathname !== "/admin" &&
        !pathname.startsWith("/admin/")
      ) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }

      // Para outros usuários, verificar redirecionamentos normais
      if (!pathname.startsWith("/onboarding")) {
        const redirectUrl = getRedirectUrl(
          userType,
          hasSelectedRole,
          pathname,
          userRole,
        );
        if (redirectUrl) {
          return NextResponse.redirect(new URL(redirectUrl, req.url));
        }
      }
    }

    // Verificar permissões CASL para páginas protegidas
    if (hasSelectedRole && userType && userId) {
      // Verificar se o usuário tem permissão para acessar a rota
      if (!canAccessRoute(pathname, userType, userId, userRole)) {
        // Se tentou acessar /admin sem ser ADMIN, redirecionar para login
        if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
          return NextResponse.redirect(new URL("/signin", req.url));
        }
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

        // Bloquear acesso a /admin se não estiver autenticado
        if (pathname.startsWith("/admin")) {
          return !!token;
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
