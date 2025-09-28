"use client";

import { Package, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { ItemCreationModal } from "@/components/items";
import { MainLayout, PageHeader } from "@/components/layout";
import { Button, EmptyState, LoadingState } from "@/components/ui";
import { useItemsStore } from "@/lib/stores";

export default function ItemsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { items, isLoading, error, loadItems } = useItemsStore();

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleCreateSuccess = async () => {
    console.log("Item criado com sucesso!");
    // Recarregar a lista de itens
    await loadItems();
  };

  if (isLoading) {
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
          <LoadingState message="Carregando seus itens..." />
        </div>
      </MainLayout>
    );
  }

  if (error) {
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
          <div className="py-8 text-center">
            <p className="mb-4 text-red-600">Erro ao carregar itens: {error}</p>
            <Button onClick={() => loadItems()} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

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

        {items.length === 0 ? (
          <EmptyState
            icon={<Package className="h-12 w-12 text-gray-400" />}
            title="Nenhum item encontrado"
            description="Você ainda não criou nenhum item. Comece adicionando seu primeiro item para reciclagem."
            action={{
              label: "Criar primeiro item",
              onClick: () => setIsCreateModalOpen(true),
            }}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {item.description || "Sem descrição"}
                  </p>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Quantidade:</span>
                    <span className="font-medium">{item.quantity}</span>
                  </div>

                  {item.price && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Preço:</span>
                      <span className="font-medium text-green-600">
                        R$ {item.price.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className="rounded-full bg-green-100 px-2 py-1 font-medium text-green-800 text-xs">
                      {item.status}
                    </span>
                  </div>

                  {item.material && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Material:</span>
                      <span className="font-medium">{item.material.name}</span>
                    </div>
                  )}
                </div>

                <div className="text-gray-400 text-xs">
                  Criado em{" "}
                  {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </div>
            ))}
          </div>
        )}

        <ItemCreationModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </MainLayout>
  );
}
