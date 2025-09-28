"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  LoadingState,
} from "@/components/ui";
import { useNotifications } from "@/hooks/useNotifications";

export function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showError, dismissAll } = useNotifications();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    items: [],
    transactions: [],
    stats: {
      totalItems: 0,
      totalTransactions: 0,
      ecoPoints: 0,
    },
  });
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  // Simular carregamento de dados do dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null); // Limpar erros anteriores

        // Limpar todos os toasts pendentes
        dismissAll();

        // Simular delay de carregamento
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simular dados do dashboard
        setDashboardData({
          items: [],
          transactions: [],
          stats: {
            totalItems: 0,
            totalTransactions: 0,
            ecoPoints: 0,
          },
        });
        hasLoaded.current = true;
      } catch (_err) {
        setError("Erro ao carregar dados do dashboard");
        showError(
          "Erro ao carregar dashboard",
          "Tente novamente em alguns instantes",
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Só carregar se tiver sessão e não tiver carregado ainda
    if (session?.user?.id && !hasLoaded.current) {
      loadDashboardData();
    }
  }, [session?.user?.id, showError, dismissAll]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingState message="Carregando dashboard..." />
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex items-center">
                <h1 className="font-semibold text-gray-900 text-xl">
                  Ecoleta Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm">
                  Olá, {session.user?.name || session.user?.email}
                </span>
                <Link
                  href="/settings"
                  className="rounded-md bg-gray-600 px-3 py-2 font-medium text-sm text-white hover:bg-gray-700"
                >
                  Configurações
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="rounded-md bg-red-600 px-3 py-2 font-medium text-sm text-white hover:bg-red-700"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <LoadingState message="Carregando seus dados..." />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex items-center">
                <h1 className="font-semibold text-gray-900 text-xl">
                  Ecoleta Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm">
                  Olá, {session.user?.name || session.user?.email}
                </span>
                <Link
                  href="/settings"
                  className="rounded-md bg-gray-600 px-3 py-2 font-medium text-sm text-white hover:bg-gray-700"
                >
                  Configurações
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="rounded-md bg-red-600 px-3 py-2 font-medium text-sm text-white hover:bg-red-700"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <EmptyState
              icon={
                <svg
                  className="h-12 w-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Ícone de erro"
                >
                  <title>Erro</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              }
              title="Erro ao carregar dashboard"
              description={error}
              action={{
                label: "Tentar novamente",
                onClick: () => {
                  setError(null);
                  setIsLoading(true);
                },
              }}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="font-semibold text-gray-900 text-xl">
                Ecoleta Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/items/create"
                className="rounded-md bg-green-600 px-4 py-2 font-medium text-sm text-white hover:bg-green-700"
              >
                + Criar Item
              </Link>
              <Link
                href="/map"
                className="rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700"
              >
                Ver Mapa
              </Link>
              <span className="text-gray-700 text-sm">
                Olá, {session.user?.name || session.user?.email}
              </span>
              <Link
                href="/settings"
                className="rounded-md bg-gray-600 px-3 py-2 font-medium text-sm text-white hover:bg-gray-700"
              >
                Configurações
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="rounded-md bg-red-600 px-3 py-2 font-medium text-sm text-white hover:bg-red-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="mb-2 font-bold text-2xl text-gray-900">
              Bem-vindo ao seu Dashboard!
            </h2>
            <p className="text-gray-600">
              Gerencie seus itens, transações e acompanhe seu impacto ambiental.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  Total de Itens
                </CardTitle>
                <svg
                  className="h-4 w-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Ícone de itens"
                >
                  <title>Itens</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {dashboardData.stats.totalItems}
                </div>
                <p className="text-muted-foreground text-xs">
                  Itens cadastrados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  Transações
                </CardTitle>
                <svg
                  className="h-4 w-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Ícone de transações"
                >
                  <title>Transações</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {dashboardData.stats.totalTransactions}
                </div>
                <p className="text-muted-foreground text-xs">
                  Transações realizadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">EcoPoints</CardTitle>
                <svg
                  className="h-4 w-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Ícone de EcoPoints"
                >
                  <title>EcoPoints</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {dashboardData.stats.ecoPoints}
                </div>
                <p className="text-muted-foreground text-xs">
                  Pontos acumulados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          {dashboardData.items.length === 0 &&
          dashboardData.transactions.length === 0 ? (
            <EmptyState
              icon={
                <svg
                  className="h-12 w-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Ícone de dashboard vazio"
                >
                  <title>Dashboard vazio</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              }
              title="Seu dashboard está vazio"
              description="Comece adicionando seus primeiros itens para reciclagem ou explore o marketplace para encontrar materiais sustentáveis."
              action={{
                label: "Criar primeiro item",
                onClick: () => {
                  router.push("/items/create");
                },
              }}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Meus Itens</CardTitle>
                  <CardDescription>
                    Gerencie os itens que você está vendendo ou doando.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {dashboardData.items.length} itens cadastrados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transações</CardTitle>
                  <CardDescription>
                    Acompanhe suas compras e vendas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {dashboardData.transactions.length} transações realizadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Perfil</CardTitle>
                  <CardDescription>
                    Atualize suas informações pessoais.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Mantenha seu perfil atualizado
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
