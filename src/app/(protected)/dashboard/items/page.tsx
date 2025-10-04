"use client";

import { Package, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ItemCreationModal, ItemListRow } from "@/components/items";
import { MainLayout, PageHeader } from "@/components/layout";
import { Button, EmptyState, LoadingState } from "@/components/ui";
import { useItemsStore } from "@/lib/stores";

export default function ItemsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { items, isLoading, error, loadItems } = useItemsStore();
  const router = useRouter();

  useEffect(() => {
    loadItems({}, true); // true = apenas itens do usuário logado
  }, [loadItems]);

  const handleCreateSuccess = async () => {
    console.log("Item criado com sucesso!");
    // Recarregar a lista de itens do usuário
    await loadItems({}, true);
  };

  const handleEditItem = (itemId: string) => {
    router.push(`/dashboard/items/${itemId}/edit`);
  };

  const handleViewItem = (itemId: string) => {
    router.push(`/dashboard/items/${itemId}`);
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
            <Button onClick={() => loadItems({}, true)} variant="outline">
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
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <ItemListRow
                  key={item.id}
                  item={item}
                  onEdit={handleEditItem}
                  onView={handleViewItem}
                />
              ))}
            </div>
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
