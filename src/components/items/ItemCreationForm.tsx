"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ErrorState, StepForm } from "@/components/ui";
import { useNotifications } from "@/hooks/useNotifications";
import { createItemSchema } from "@/lib/validations/item.schema";
import {
  ItemBasicInfoStep,
  ItemConfirmationStep,
  ItemImagesStep,
  ItemLocationStep,
  ItemMaterialStep,
  ItemPricingStep,
} from "./item-form-steps";

interface ItemCreationFormProps {
  className?: string;
  onComplete?: (formData: Record<string, string>) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export function ItemCreationForm({
  className,
  onComplete,
  onBack,
  isLoading: externalLoading,
}: ItemCreationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const { showSuccess, showError, showLoading, dismiss } = useNotifications();

  const isFormLoading = externalLoading || isLoading;

  const steps = [
    {
      id: "basic",
      title: "Informações básicas do item",
      description: "Comece descrevendo o que você está oferecendo",
      component: ItemBasicInfoStep,
      validation: (formData: Record<string, string>) => {
        try {
          createItemSchema.pick({ title: true, description: true }).parse({
            title: formData.title || "",
            description: formData.description || "",
          });
          return true;
        } catch {
          return false;
        }
      },
    },
    {
      id: "material",
      title: "Tipo de material e quantidade",
      description: "Especifique o material e quantas unidades você tem",
      component: ItemMaterialStep,
      validation: (formData: Record<string, string>) => {
        try {
          createItemSchema.pick({ quantity: true, materialId: true }).parse({
            quantity: parseInt(formData.quantity || "1", 10),
            materialId: formData.materialId || "",
          });
          return !!(formData.materialId && formData.quantity);
        } catch {
          return false;
        }
      },
    },
    {
      id: "pricing",
      title: "Preço e tipo de transação",
      description: "Como você quer disponibilizar este item?",
      component: ItemPricingStep,
      validation: (formData: Record<string, string>) => {
        if (!formData.transactionType) return false;

        if (formData.transactionType === "SALE") {
          try {
            createItemSchema.pick({ price: true }).parse({
              price: parseFloat(formData.price || "0"),
            });
            return !!(formData.price && parseFloat(formData.price) >= 0);
          } catch {
            return false;
          }
        }

        return true;
      },
    },
    {
      id: "location",
      title: "Localização do item",
      description: "Onde o item está localizado?",
      component: (props: any) => (
        <ItemLocationStep
          {...props}
          isGettingLocation={isGettingLocation}
          setIsGettingLocation={setIsGettingLocation}
        />
      ),
      validation: (formData: Record<string, string>) => {
        try {
          createItemSchema.pick({ latitude: true, longitude: true }).parse({
            latitude: parseFloat(formData.latitude || "0"),
            longitude: parseFloat(formData.longitude || "0"),
          });
          return !!(formData.latitude && formData.longitude);
        } catch {
          return false;
        }
      },
    },
    {
      id: "images",
      title: "Fotos do item",
      description: "Adicione fotos para mostrar seu item",
      component: (props: any) => (
        <ItemImagesStep {...props} images={images} setImages={setImages} />
      ),
      validation: () => images.length > 0, // Pelo menos uma imagem é obrigatória
    },
    {
      id: "confirmation",
      title: "Confirme os dados",
      description: "Revise as informações antes de publicar",
      component: ItemConfirmationStep,
      validation: () => true, // Step de confirmação sempre válido
    },
  ];

  const handleComplete = async (formData: Record<string, string>) => {
    // Se onComplete foi fornecido, usar ele (modal)
    if (onComplete) {
      onComplete(formData);
      return;
    }

    // Caso contrário, usar lógica original (página)
    setIsLoading(true);
    setError(null);
    const loadingToastId = showLoading("Criando seu item...");

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
        // URLs das imagens selecionadas
        imageUrls: images,
        imageAltTexts: images.map(() => ""), // Textos alternativos vazios por enquanto
      };

      // Debug: verificar dados antes do envio
      console.log("Dados sendo enviados:", {
        ...itemData,
        imageUrls: images,
        imageUrlsLength: images.length,
        imageUrlsPreview: images.map((img) => `${img.substring(0, 50)}...`),
      });

      // Validar dados finais
      const validatedData = createItemSchema.parse(itemData);

      // Enviar para API
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar item");
      }

      await response.json();

      // Dismissar o toast de loading
      dismiss(loadingToastId);

      showSuccess(
        "Item criado com sucesso!",
        "Seu item foi publicado e já está visível no mapa.",
      );

      // Aguardar um pouco para mostrar o toast
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirecionar para a página de itens do dashboard
      router.push("/dashboard/items");
    } catch (error) {
      console.error("Erro ao criar item:", error);

      // Dismissar o toast de loading em caso de erro
      dismiss(loadingToastId);

      const errorMessage =
        error instanceof Error ? error.message : "Erro inesperado";
      setError(errorMessage);
      showError("Erro ao criar item", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    // Se onBack foi fornecido, usar ele (modal)
    if (onBack) {
      onBack();
      return;
    }

    // Caso contrário, usar lógica original (página)
    router.back();
  };

  // Mostrar error state se houver erro
  if (error) {
    return (
      <div className={`space-y-6 ${className || ""}`}>
        <ErrorState
          message={error}
          onRetry={() => {
            setError(null);
            setIsLoading(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className={className || ""}>
      <StepForm
        steps={steps}
        onComplete={handleComplete}
        onBack={handleBack}
        isLoading={isFormLoading}
      />
    </div>
  );
}
