"use client";

import { CheckCircle, Image, MapPin } from "lucide-react";
import NextImage from "next/image";
import { useState } from "react";

import { Button, Input, Label } from "@/components/ui";
import { cn } from "@/lib/utils";

// Step 1: Informações Básicas
export function ItemBasicInfoStep({
  formData,
  updateFormData,
}: {
  formData: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title" className="font-medium text-gray-700">
          Título do Item *
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="Ex: Garrafas de vidro para reciclagem"
          value={formData.title || ""}
          onChange={(e) => updateFormData("title", e.target.value)}
          className="mt-2"
        />
        <p className="mt-1 text-gray-500 text-sm">
          Seja específico e descritivo sobre o que você está oferecendo
        </p>
      </div>

      <div>
        <Label htmlFor="description" className="font-medium text-gray-700">
          Descrição Detalhada *
        </Label>
        <textarea
          id="description"
          placeholder="Descreva o item em detalhes: condição, material, quantidade, etc."
          value={formData.description || ""}
          onChange={(e) => updateFormData("description", e.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          rows={4}
        />
        <p className="mt-1 text-gray-500 text-sm">
          Mínimo 10 caracteres. Inclua detalhes sobre condição e uso
        </p>
      </div>
    </div>
  );
}

// Step 2: Material e Quantidade
export function ItemMaterialStep({
  formData,
  updateFormData,
}: {
  formData: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
}) {
  const materials = [
    { id: "plastic", name: "Plástico", icon: "♻️" },
    { id: "paper", name: "Papel", icon: "📄" },
    { id: "glass", name: "Vidro", icon: "🍶" },
    { id: "metal", name: "Metal", icon: "🔩" },
    { id: "electronic", name: "Eletrônico", icon: "📱" },
    { id: "organic", name: "Orgânico", icon: "🌱" },
    { id: "textile", name: "Têxtil", icon: "👕" },
    { id: "other", name: "Outro", icon: "📦" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-4 block font-medium text-gray-700">
          Tipo de Material *
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {materials.map((material) => (
            <button
              key={material.id}
              type="button"
              onClick={() => updateFormData("materialType", material.id)}
              className={cn(
                "flex items-center space-x-3 rounded-lg border-2 p-4 text-left transition-all duration-200",
                formData.materialType === material.id
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50",
              )}
            >
              <span className="text-2xl">{material.icon}</span>
              <span className="font-medium">{material.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity" className="font-medium text-gray-700">
            Quantidade *
          </Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            max="9999"
            placeholder="1"
            value={formData.quantity || ""}
            onChange={(e) => updateFormData("quantity", e.target.value)}
            className="mt-2"
          />
          <p className="mt-1 text-gray-500 text-sm">Unidades disponíveis</p>
        </div>

        <div>
          <Label htmlFor="unit" className="font-medium text-gray-700">
            Unidade
          </Label>
          <select
            id="unit"
            value={formData.unit || "unidade"}
            onChange={(e) => updateFormData("unit", e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            <option value="unidade">Unidade</option>
            <option value="kg">Quilograma (kg)</option>
            <option value="g">Grama (g)</option>
            <option value="litro">Litro</option>
            <option value="metro">Metro</option>
            <option value="caixa">Caixa</option>
            <option value="saco">Saco</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Step 3: Preço e Tipo de Transação
export function ItemPricingStep({
  formData,
  updateFormData,
}: {
  formData: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
}) {
  const transactionTypes = [
    {
      id: "sale",
      name: "Venda",
      description: "Vender por um preço específico",
      icon: "💰",
    },
    {
      id: "donation",
      name: "Doação",
      description: "Doar gratuitamente",
      icon: "🎁",
    },
    {
      id: "collection",
      name: "Coleta",
      description: "Solicitar coleta gratuita",
      icon: "🚛",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-4 block font-medium text-gray-700">
          Tipo de Transação *
        </Label>
        <div className="space-y-3">
          {transactionTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => updateFormData("transactionType", type.id)}
              className={cn(
                "w-full rounded-lg border-2 p-4 text-left transition-all duration-200",
                formData.transactionType === type.id
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50",
              )}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{type.icon}</span>
                <div>
                  <div className="font-medium">{type.name}</div>
                  <div className="text-gray-500 text-sm">
                    {type.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {formData.transactionType === "sale" && (
        <div>
          <Label htmlFor="price" className="font-medium text-gray-700">
            Preço (R$) *
          </Label>
          <div className="relative mt-2">
            <span className="-translate-y-1/2 absolute top-1/2 left-4 text-gray-500">
              R$
            </span>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              max="999999.99"
              placeholder="0,00"
              value={formData.price || ""}
              onChange={(e) => updateFormData("price", e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="mt-1 text-gray-500 text-sm">
            Preço por unidade (opcional para doações)
          </p>
        </div>
      )}
    </div>
  );
}

// Step 4: Localização
export function ItemLocationStep({
  formData,
  updateFormData,
}: {
  formData: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
}) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada por este navegador.");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateFormData("latitude", latitude.toString());
        updateFormData("longitude", longitude.toString());
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        alert("Erro ao obter localização. Você pode inserir manualmente.");
        setIsGettingLocation(false);
      },
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-4 block font-medium text-gray-700">
          Localização do Item *
        </Label>
        <p className="mb-4 text-gray-600 text-sm">
          A localização é necessária para que outros usuários possam encontrar
          seu item no mapa.
        </p>

        <Button
          type="button"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="mb-4 w-full"
        >
          {isGettingLocation ? (
            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Obtendo localização...
            </div>
          ) : (
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              Usar minha localização atual
            </div>
          )}
        </Button>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude" className="font-medium text-gray-700">
              Latitude
            </Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              placeholder="Ex: -23.5505"
              value={formData.latitude || ""}
              onChange={(e) => updateFormData("latitude", e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="longitude" className="font-medium text-gray-700">
              Longitude
            </Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              placeholder="Ex: -46.6333"
              value={formData.longitude || ""}
              onChange={(e) => updateFormData("longitude", e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="address" className="font-medium text-gray-700">
            Endereço (opcional)
          </Label>
          <Input
            id="address"
            type="text"
            placeholder="Ex: Rua das Flores, 123 - São Paulo, SP"
            value={formData.address || ""}
            onChange={(e) => updateFormData("address", e.target.value)}
            className="mt-2"
          />
          <p className="mt-1 text-gray-500 text-sm">
            Endereço completo para referência
          </p>
        </div>
      </div>
    </div>
  );
}

// Step 5: Imagens
export function ItemImagesStep({
  formData: _formData,
  updateFormData: _updateFormData,
}: {
  formData: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
}) {
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Simular upload de imagens (em produção, enviar para servidor)
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file),
    );
    setImages((prev) => [...prev, ...newImages].slice(0, 5)); // Máximo 5 imagens
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-4 block font-medium text-gray-700">
          Imagens do Item
        </Label>
        <p className="mb-4 text-gray-600 text-sm">
          Adicione até 5 fotos do item. Boas fotos aumentam as chances de
          interesse.
        </p>

        <div className="space-y-4">
          {/* Upload Area */}
          <div className="rounded-lg border-2 border-gray-300 border-dashed p-6 text-center transition-colors hover:border-gray-400">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex cursor-pointer flex-col items-center space-y-2"
            >
              <Image className="h-8 w-8 text-gray-400" />
              <span className="font-medium text-gray-600">
                Clique para adicionar imagens
              </span>
              <span className="text-gray-500 text-sm">
                PNG, JPG até 5MB cada
              </span>
            </label>
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {images.map((image, index) => (
                <div key={image} className="relative">
                  <NextImage
                    src={image}
                    alt={`Preview ${index + 1}`}
                    width={200}
                    height={128}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="-top-2 -right-2 absolute h-6 w-6 rounded-full bg-red-500 text-sm text-white hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 6: Confirmação
export function ItemConfirmationStep({
  formData,
}: {
  formData: Record<string, string>;
}) {
  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case "sale":
        return "💰 Venda";
      case "donation":
        return "🎁 Doação";
      case "collection":
        return "🚛 Coleta";
      default:
        return "Não especificado";
    }
  };

  const getMaterialTypeText = (type: string) => {
    const materials: Record<string, string> = {
      plastic: "♻️ Plástico",
      paper: "📄 Papel",
      glass: "🍶 Vidro",
      metal: "🔩 Metal",
      electronic: "📱 Eletrônico",
      organic: "🌱 Orgânico",
      textile: "👕 Têxtil",
      other: "📦 Outro",
    };
    return materials[type] || "Não especificado";
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-green-200 bg-green-50 p-6">
        <div className="mb-4 flex items-center space-x-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <h3 className="font-semibold text-green-800 text-lg">
            Resumo do Item
          </h3>
        </div>
        <p className="text-green-700 text-sm">
          Revise as informações abaixo antes de publicar seu item.
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-gray-200 border-b pb-4">
          <h4 className="mb-2 font-medium text-gray-900">
            Informações Básicas
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Título:</span>{" "}
              <span className="font-medium">
                {formData.title || "Não informado"}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Descrição:</span>{" "}
              <span className="font-medium">
                {formData.description || "Não informado"}
              </span>
            </div>
          </div>
        </div>

        <div className="border-gray-200 border-b pb-4">
          <h4 className="mb-2 font-medium text-gray-900">
            Material e Quantidade
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Tipo:</span>{" "}
              <span className="font-medium">
                {getMaterialTypeText(formData.materialType || "")}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Quantidade:</span>{" "}
              <span className="font-medium">
                {formData.quantity || "1"} {formData.unit || "unidade"}
              </span>
            </div>
          </div>
        </div>

        <div className="border-gray-200 border-b pb-4">
          <h4 className="mb-2 font-medium text-gray-900">Transação</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Tipo:</span>{" "}
              <span className="font-medium">
                {getTransactionTypeText(formData.transactionType || "")}
              </span>
            </div>
            {formData.transactionType === "sale" && formData.price && (
              <div>
                <span className="text-gray-600">Preço:</span>{" "}
                <span className="font-medium">R$ {formData.price}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-2 font-medium text-gray-900">Localização</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Coordenadas:</span>{" "}
              <span className="font-medium">
                {formData.latitude && formData.longitude
                  ? `${formData.latitude}, ${formData.longitude}`
                  : "Não informado"}
              </span>
            </div>
            {formData.address && (
              <div>
                <span className="text-gray-600">Endereço:</span>{" "}
                <span className="font-medium">{formData.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
