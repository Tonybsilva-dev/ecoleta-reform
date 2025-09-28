import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Se o usuário não está autenticado, permitir acesso às páginas de auth
    if (!token) {
      return NextResponse.next();
    }

    // Verificar se o usuário já selecionou o tipo de conta
    const hasSelectedRole = token.hasSelectedRole ?? false;
    const isOnboardingPage = pathname.startsWith("/onboarding");
    const isAuthPage =
      pathname.startsWith("/auth") || pathname.startsWith("/register");
    const isPublicPage = pathname === "/" || pathname.startsWith("/api/auth");

    // Se o usuário não selecionou o tipo de conta e não está na página de onboarding
    if (!hasSelectedRole && !isOnboardingPage && !isAuthPage && !isPublicPage) {
      return NextResponse.redirect(new URL("/onboarding/select-type", req.url));
    }

    // Se o usuário já selecionou o tipo de conta e está tentando acessar a página de onboarding
    if (hasSelectedRole && isOnboardingPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Permitir acesso às páginas públicas
        if (
          pathname === "/" ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/auth") ||
          pathname.startsWith("/register")
        ) {
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
    "/api/protected/:path*",
    "/onboarding/:path*",
    "/",
  ],
};
