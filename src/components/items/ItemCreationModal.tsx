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

  const handleComplete = async (
    formData: Record<string, string>,
    images?: string[],
  ) => {
    console.log("🔍 ItemCreationModal.handleComplete:", {
      formDataKeys: Object.keys(formData),
      imagesReceived: images ? "SIM" : "NÃO",
      imagesLength: images?.length || 0,
      imagesPreview: images?.map((img) => `${img.substring(0, 50)}...`),
    });

    try {
      // Preparar dados para envio
      const itemData = {
        title: formData.title,
        description: formData.description,
        quantity: parseInt(formData.quantity || "1", 10),
        materialId: formData.materialId,
        unit: formData.unit || "unidade",
        transactionType: formData.transactionType,
        price: formData.price ? parseFloat(formData.price) : undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude
          ? parseFloat(formData.longitude)
          : undefined,
        address: formData.address,
        // Usar imagens base64 se disponíveis, senão URLs vazias
        imageBase64: images && images.length > 0 ? images : undefined,
        imageUrls: images && images.length > 0 ? undefined : [],
        imageAltTexts: images && images.length > 0 ? images.map(() => "") : [],
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
