import { Gift, Leaf, Star, Trophy } from "lucide-react";
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
  title: "EcoPoints | Sustainable",
  description: "Acompanhe seus pontos sustentáveis no Sustainable",
};

export default function EcoPointsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="font-bold text-3xl text-gray-900">EcoPoints</h1>
          <p className="text-gray-600">Seus pontos sustentáveis e conquistas</p>
        </div>

        {/* Current Points */}
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <span>Seus EcoPoints</span>
            </CardTitle>
            <CardDescription>
              Continue contribuindo para um mundo mais sustentável
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 font-bold text-4xl text-green-600">0</div>
            <p className="text-gray-600">Pontos acumulados</p>
          </CardContent>
        </Card>

        {/* Level and Progress */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span>Nível Atual</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 font-bold text-2xl text-gray-900">
                Iniciante
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-green-600"
                  style={{ width: "0%" }}
                ></div>
              </div>
              <p className="mt-2 text-gray-500 text-sm">
                0 / 100 pontos para o próximo nível
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-blue-600" />
                <span>Próxima Conquista</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 font-semibold text-gray-900 text-lg">
                Primeiro Item
              </div>
              <p className="text-gray-600 text-sm">
                Crie seu primeiro item para ganhar 10 EcoPoints
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Conquistas</CardTitle>
            <CardDescription>
              Desbloqueie conquistas e ganhe mais EcoPoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <Gift className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Primeiro Item</div>
                  <div className="text-gray-500 text-sm">+10 pontos</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 opacity-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <Leaf className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Reciclador</div>
                  <div className="text-gray-500 text-sm">+50 pontos</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
