"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
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
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async (formData: any) => {
    setIsLoading(true);
    try {
      // TODO: Implementar criação de item via API
      console.log("Dados do item:", formData);

      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Fechar modal e chamar callback de sucesso
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao criar item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Item</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ItemCreationForm
            onComplete={handleComplete}
            onBack={handleBack}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
