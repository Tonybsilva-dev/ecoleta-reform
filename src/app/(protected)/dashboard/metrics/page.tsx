import { BarChart3, Leaf, Recycle, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import { MainLayout } from "@/components/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Métricas | Sustainable",
  description: "Acompanhe seu impacto ambiental no Sustainable",
};

export default function MetricsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="font-bold text-3xl text-gray-900">Métricas</h1>
          <p className="text-gray-600">
            Acompanhe seu impacto ambiental e performance
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-gray-600 text-sm">
                CO2 Evitado
              </CardTitle>
              <Leaf className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl text-gray-900">0 kg</div>
              <p className="text-gray-500 text-xs">
                Dióxido de carbono evitado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-gray-600 text-sm">
                Materiais Reciclados
              </CardTitle>
              <Recycle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl text-gray-900">0 kg</div>
              <p className="text-gray-500 text-xs">
                Total de materiais reciclados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-gray-600 text-sm">
                Crescimento
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl text-gray-900">0%</div>
              <p className="text-gray-500 text-xs">Crescimento mensal</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gráfico de Impacto</CardTitle>
            <CardDescription>
              Visualize seu progresso ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50">
              <div className="text-center">
                <BarChart3 className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-500">
                  Gráfico será implementado em breve
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
