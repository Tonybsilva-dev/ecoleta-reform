"use client";

import { Package } from "lucide-react";
import { MainLayout } from "@/components/layout";
import { EmptyState } from "@/components/ui";

export default function ItemsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="font-bold text-3xl text-gray-900">Meus Itens</h1>
          <p className="text-gray-600">
            Gerencie todos os seus itens cadastrados
          </p>
        </div>

        <EmptyState
          icon={<Package className="h-12 w-12 text-gray-400" />}
          title="Nenhum item encontrado"
          description="Você ainda não criou nenhum item. Comece adicionando seu primeiro item para reciclagem."
          action={{
            label: "Criar primeiro item",
            onClick: () => {
              window.location.href = "/items/create";
            },
          }}
        />
      </div>
    </MainLayout>
  );
}
