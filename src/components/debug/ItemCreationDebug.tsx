"use client";

import { useState } from "react";
import { toast } from "sonner";

export function ItemCreationDebug() {
  const [testData, _setTestData] = useState({
    title: "Teste Debug",
    description: "Item de teste para debug",
    quantity: 1,
    materialId: "cmg8plw36000h1lpuoh03cfwi", // Cobre
    unit: "unidade",
    transactionType: "COLLECTION",
    latitude: -23.5505,
    longitude: -46.6333,
    address: "São Paulo, SP",
  });

  const [images, setImages] = useState<string[]>([]);

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

    setImages([...images, ...base64Images].slice(0, 5));
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

  const testCreateItem = async () => {
    try {
      const itemData = {
        ...testData,
        imageBase64: images.length > 0 ? images : undefined,
        imageUrls: images.length > 0 ? undefined : [],
        imageAltTexts: images.length > 0 ? images.map(() => "") : [],
      };

      console.log("🔍 Dados sendo enviados:", {
        ...itemData,
        imageBase64Length: itemData.imageBase64?.length || 0,
        imageUrlsLength: itemData.imageUrls?.length || 0,
        imageBase64Preview: itemData.imageBase64?.map(
          (img) => `${img.substring(0, 50)}...`,
        ),
      });

      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      const result = await response.json();
      console.log("📦 Resposta da API:", result);

      if (response.ok) {
        toast.success("Item criado com sucesso!");
        console.log("✅ Item criado:", result.data);
        console.log("🖼️ Imagens no item:", result.data.images);
      } else {
        toast.error(`Erro: ${result.error}`);
        console.error("❌ Erro:", result);
      }
    } catch (error) {
      console.error("❌ Erro ao criar item:", error);
      toast.error("Erro ao criar item");
    }
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="font-semibold text-lg">Debug: Criação de Item</h3>

      <div className="space-y-2 text-sm">
        <div>
          <strong>Imagens carregadas:</strong> {images.length}
        </div>
        <div>
          <strong>Material ID:</strong> {testData.materialId}
        </div>
      </div>

      <div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="mb-2"
        />
        <p className="text-gray-600 text-sm">Selecione imagens para testar</p>
      </div>

      {images.length > 0 && (
        <div>
          <h4 className="mb-2 font-medium">
            Imagens Base64 ({images.length}):
          </h4>
          <div className="max-h-40 space-y-1 overflow-y-auto">
            {images.map((image, index) => (
              <div
                key={`debug-${image.substring(0, 20)}-${index}`}
                className="rounded bg-gray-100 p-2 text-xs"
              >
                <strong>Imagem {index + 1}:</strong> {image.substring(0, 100)}
                ...
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={testCreateItem}
        className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
      >
        Testar Criação de Item
      </button>
    </div>
  );
}
