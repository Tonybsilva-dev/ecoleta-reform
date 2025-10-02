"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui";

/**
 * Exemplo de como usar imagens base64 na criação de itens
 * Este componente demonstra como converter arquivos para base64
 * e enviar para a API de criação de itens
 */
export function Base64ImageExample() {
  const [images, setImages] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    const base64Images: string[] = [];

    for (const file of Array.from(files)) {
      const base64 = await convertFileToBase64(file);
      base64Images.push(base64);
    }

    setImages([...images, ...base64Images].slice(0, 5)); // Máximo 5 imagens
    toast.success(
      `${base64Images.length} imagem(ns) convertida(s) para base64`,
    );
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const createItemWithBase64Images = async () => {
    if (images.length === 0) {
      toast.error("Adicione pelo menos uma imagem");
      return;
    }

    setIsCreating(true);
    try {
      const itemData = {
        title: "Item de Exemplo com Base64",
        description: "Este é um exemplo de item criado com imagens base64",
        quantity: 1,
        transactionType: "DONATION",
        latitude: -23.5505,
        longitude: -46.6333,
        // Usar base64 em vez de URLs
        imageBase64: images,
        imageAltTexts: images.map((_, index) => `Imagem ${index + 1}`),
      };

      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar item");
      }

      const result = await response.json();
      toast.success("Item criado com sucesso!");
      console.log("Item criado:", result);

      // Limpar imagens após sucesso
      setImages([]);
    } catch (error) {
      console.error("Erro ao criar item:", error);
      toast.error("Erro ao criar item");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <h3 className="font-semibold text-lg">Exemplo: Imagens Base64</h3>

      <div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="mb-2"
        />
        <p className="text-gray-600 text-sm">
          Selecione imagens para converter para base64
        </p>
      </div>

      {images.length > 0 && (
        <div>
          <h4 className="mb-2 font-medium">
            Imagens Base64 ({images.length}):
          </h4>
          <div className="space-y-2">
            {images.map((image, index) => (
              <div
                key={`base64-${image.substring(0, 20)}-${index}`}
                className="rounded bg-gray-100 p-2 text-xs"
              >
                <strong>Imagem {index + 1}:</strong> {image.substring(0, 100)}
                ...
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={createItemWithBase64Images}
        disabled={isCreating || images.length === 0}
        className="w-full"
      >
        {isCreating ? "Criando Item..." : "Criar Item com Base64"}
      </Button>
    </div>
  );
}
