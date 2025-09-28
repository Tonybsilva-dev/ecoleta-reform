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
    const isApiRoute = pathname.startsWith("/api/");

    // Permitir acesso a todas as rotas de API
    if (isApiRoute) {
      return NextResponse.next();
    }

    // Se o usuário não selecionou o tipo de conta e não está na página de onboarding
    if (!hasSelectedRole && !isOnboardingPage && !isAuthPage && !isPublicPage) {
      return NextResponse.redirect(new URL("/onboarding/select-type", req.url));
    }

    // Se o usuário já selecionou o tipo de conta e está tentando acessar a página de onboarding
    // EXCETO se estiver na página de criação de organização (fluxo normal para empresas/ONGs)
    if (
      hasSelectedRole &&
      isOnboardingPage &&
      pathname !== "/onboarding/organization/create"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Se o usuário está na página de select-type mas já selecionou o tipo
    // Só redirecionar se não estiver no processo de seleção (evitar loop)
    if (hasSelectedRole && pathname === "/onboarding/select-type") {
      // Verificar se é empresa ou ONG que precisa criar organização
      const userType = token.userType;

      if (userType === "COMPANY" || userType === "NGO") {
        return NextResponse.redirect(
          new URL("/onboarding/organization/create", req.url),
        );
      }
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
