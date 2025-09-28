"use client";

import { Leaf, Package, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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

export function DashboardContent() {
  const { status } = useSession();
  const { showError } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    items: [],
    transactions: [],
    stats: {
      totalItems: 0,
      totalTransactions: 0,
      ecoPoints: 0,
    },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Simular carregamento de dados
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // TODO: Implementar chamadas reais para API
        setDashboardData({
          items: [],
          transactions: [],
          stats: {
            totalItems: 0,
            totalTransactions: 0,
            ecoPoints: 0,
          },
        });
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
        showError(
          "Erro ao carregar dados",
          "Tente novamente em alguns instantes",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchDashboardData();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status, showError]);

  // Mostrar loading apenas quando o status da sessão está carregando
  if (status === "loading") {
    return <LoadingState message="Carregando seu dashboard..." />;
  }

  // Mostrar erro de acesso se não estiver autenticado
  if (status === "unauthenticated") {
    return (
      <EmptyState
        title="Acesso negado"
        description="Você precisa estar logado para acessar o dashboard"
      />
    );
  }

  // Mostrar loading apenas quando estiver carregando dados específicos
  if (isLoading) {
    return <LoadingState message="Carregando dados..." />;
  }

  const { stats } = dashboardData;
  const hasItems = stats.totalItems > 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="font-bold text-3xl text-gray-900">
          Bem-vindo ao seu Dashboard!
        </h1>
        <p className="text-gray-600">
          Gerencie seus itens, transações e acompanhe seu impacto ambiental.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-gray-600 text-sm">
              Total de Itens
            </CardTitle>
            <Package className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-gray-900">
              {stats.totalItems}
            </div>
            <p className="text-gray-500 text-xs">Itens cadastrados</p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-gray-600 text-sm">
              Transações
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-gray-900">
              {stats.totalTransactions}
            </div>
            <p className="text-gray-500 text-xs">Transações realizadas</p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-gray-600 text-sm">
              EcoPoints
            </CardTitle>
            <Leaf className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-gray-900">
              {stats.ecoPoints}
            </div>
            <p className="text-gray-500 text-xs">Pontos acumulados</p>
          </CardContent>
        </Card>
      </div>

      {/* Content based on data */}
      {hasItems ? (
        <div className="space-y-6">
          {/* Recent Items */}
          <Card>
            <CardHeader>
              <CardTitle>Itens Recentes</CardTitle>
              <CardDescription>Seus itens mais recentes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-sm">
                Nenhum item encontrado. Crie seu primeiro item!
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <EmptyState
          icon={<Package className="h-12 w-12 text-gray-400" />}
          title="Seu dashboard está vazio"
          description="Comece adicionando seus primeiros itens para reciclagem ou explore o marketplace para encontrar materiais sustentáveis."
          action={{
            label: "Ver Meus Itens",
            onClick: () => {
              window.location.href = "/items";
            },
          }}
        />
      )}
    </div>
  );
}
