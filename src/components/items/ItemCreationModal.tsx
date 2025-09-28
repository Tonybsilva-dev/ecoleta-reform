"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui";
import { useItemsStore } from "@/lib/stores";
import { ItemCreationForm } from "./ItemCreationForm";

interface ItemCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ItemCreationModal({
  isOpen,
  onClose,
  onSuccess,
}: ItemCreationModalProps) {
  const { createItem, isLoading } = useItemsStore();

  const handleComplete = async (formData: Record<string, string>) => {
    try {
      // Preparar dados para envio
      const itemData = {
        title: formData.title,
        description: formData.description,
        quantity: parseInt(formData.quantity || "1", 10),
        materialType: formData.materialType,
        unit: formData.unit || "unidade",
        transactionType: formData.transactionType,
        price: formData.price ? parseFloat(formData.price) : undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude
          ? parseFloat(formData.longitude)
          : undefined,
        address: formData.address,
        // TODO: Implementar upload de imagens
        imageUrls: [],
        imageAltTexts: [],
      };

      // Usar o store para criar o item
      const newItem = await createItem(itemData);

      if (newItem) {
        console.log("Item criado com sucesso:", newItem);
        // Fechar modal e chamar callback de sucesso
        onClose();
        onSuccess?.();
      }
    } catch (error) {
      console.error("Erro ao criar item:", error);
      // TODO: Mostrar toast de erro
    }
  };

  const handleBack = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0">
        <DialogTitle className="sr-only">Criar Novo Item</DialogTitle>
        <ItemCreationForm
          onComplete={handleComplete}
          onBack={handleBack}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
