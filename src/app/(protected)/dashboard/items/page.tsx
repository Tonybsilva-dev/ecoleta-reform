"use client";

import { Package, Plus } from "lucide-react";
import { useState } from "react";
import { ItemCreationModal } from "@/components/items";
import { MainLayout, PageHeader } from "@/components/layout";
import { Button, EmptyState } from "@/components/ui";

export default function ItemsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateSuccess = () => {
    // TODO: Atualizar lista de itens
    console.log("Item criado com sucesso!");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Meus Itens"
          description="Gerencie todos os seus itens cadastrados"
          actions={
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex cursor-pointer items-center justify-center gap-3 rounded-lg bg-green-600 px-8 py-6 font-medium text-lg text-white shadow-sm transition-colors hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              <span>Criar Item</span>
            </Button>
          }
        />

        <EmptyState
          icon={<Package className="h-12 w-12 text-gray-400" />}
          title="Nenhum item encontrado"
          description="Você ainda não criou nenhum item. Comece adicionando seu primeiro item para reciclagem."
          action={{
            label: "Criar primeiro item",
            onClick: () => setIsCreateModalOpen(true),
          }}
        />

        <ItemCreationModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </MainLayout>
  );
}
