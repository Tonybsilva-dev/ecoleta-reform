"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui";
// Upload acontece via POST multipart para /api/uploadthing; não usamos SDK server aqui
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (
    formData: Record<string, string>,
    images?: string[],
    files?: File[],
  ) => {
    console.log("🔍 ItemCreationModal.handleComplete:", {
      formDataKeys: Object.keys(formData),
      imagesReceived: images ? "SIM" : "NÃO",
      imagesLength: images?.length || 0,
      imagesPreview: images?.map((img) => `${img.substring(0, 50)}...`),
    });

    try {
      setIsSubmitting(true);
      toast.loading("Enviando dados do item...");
      // 1) Upload ONLY at confirmation step (no visual change)
      let imageUrls: string[] = [];
      if (files && files.length > 0) {
        const fd = new FormData();
        files.slice(0, 5).forEach((f) => {
          fd.append("files", f);
        });
        const res = await fetch("/api/uploadthing/direct", {
          method: "POST",
          body: fd,
        });
        const json = await res.json();
        imageUrls = (json?.urls || []) as string[];
      }
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
        // Salvar URLs reais (se existirem)
        imageUrls: imageUrls.length > 0 ? imageUrls : [],
        imageAltTexts: imageUrls.length > 0 ? imageUrls.map(() => "") : [],
      };

      // Usar o store para criar o item
      const newItem = await createItem(itemData);

      if (newItem) {
        console.log("Item criado com sucesso:", newItem);
        toast.success("Item publicado com sucesso!");
        // Fechar modal e chamar callback de sucesso
        onClose();
        onSuccess?.();
      }
    } catch (error) {
      console.error("Erro ao criar item:", error);
      toast.error("Falha ao criar item");
    } finally {
      setIsSubmitting(false);
      toast.dismiss();
    }
  };

  const handleBack = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="relative max-h-[90vh] max-w-4xl overflow-y-auto p-0">
        <DialogTitle className="sr-only">Criar Novo Item</DialogTitle>
        {isSubmitting && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
          </div>
        )}
        <ItemCreationForm
          onComplete={handleComplete}
          onBack={handleBack}
          isLoading={isLoading || isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
