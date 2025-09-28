"use client";

import {
  CheckCircle,
  DollarSign,
  FileText,
  Gift,
  Image,
  MapPin,
  Package,
  Recycle,
  Shirt,
  Smartphone,
  Sprout,
  Truck,
  Wine,
  Wrench,
  X,
} from "lucide-react";
import NextImage from "next/image";
import { useCallback, useEffect, useState } from "react";

import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { LocationMap } from "./LocationMap";

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
    { id: "plastic", name: "Plástico", icon: Recycle, color: "text-green-600" },
    { id: "paper", name: "Papel", icon: FileText, color: "text-blue-600" },
    { id: "glass", name: "Vidro", icon: Wine, color: "text-cyan-600" },
    { id: "metal", name: "Metal", icon: Wrench, color: "text-gray-600" },
    {
      id: "electronic",
      name: "Eletrônico",
      icon: Smartphone,
      color: "text-purple-600",
    },
    { id: "organic", name: "Orgânico", icon: Sprout, color: "text-green-500" },
    { id: "textile", name: "Têxtil", icon: Shirt, color: "text-pink-600" },
    { id: "other", name: "Outro", icon: Package, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-4 block font-medium text-gray-700">
          Tipo de Material *
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {materials.map((material) => {
            const IconComponent = material.icon;
            return (
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
                <IconComponent className={cn("h-6 w-6", material.color)} />
                <span className="font-medium">{material.name}</span>
              </button>
            );
          })}
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
          <Select
            value={formData.unit || "unidade"}
            onValueChange={(value: string) => updateFormData("unit", value)}
          >
            <SelectTrigger className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200">
              <SelectValue placeholder="Unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unidade">Unidade</SelectItem>
              <SelectItem value="kg">Quilograma (kg)</SelectItem>
              <SelectItem value="g">Grama (g)</SelectItem>
              <SelectItem value="litro">Litro</SelectItem>
              <SelectItem value="metro">Metro</SelectItem>
              <SelectItem value="caixa">Caixa</SelectItem>
              <SelectItem value="saco">Saco</SelectItem>
            </SelectContent>
          </Select>
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
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      id: "donation",
      name: "Doação",
      description: "Doar gratuitamente",
      icon: Gift,
      color: "text-pink-600",
    },
    {
      id: "collection",
      name: "Coleta",
      description: "Solicitar coleta gratuita",
      icon: Truck,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-4 block font-medium text-gray-700">
          Tipo de Transação *
        </Label>
        <div className="space-y-3">
          {transactionTypes.map((type) => {
            const IconComponent = type.icon;
            return (
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
                  <IconComponent className={cn("h-6 w-6", type.color)} />
                  <div>
                    <div className="font-medium">{type.name}</div>
                    <div className="text-gray-500 text-sm">
                      {type.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
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
  isGettingLocation,
  setIsGettingLocation,
}: {
  formData: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
  isGettingLocation: boolean;
  setIsGettingLocation: (value: boolean) => void;
}) {
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      // Definir localização padrão (São Paulo) se geolocalização não estiver disponível
      updateFormData("latitude", "-23.5505");
      updateFormData("longitude", "-46.6333");
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
        // Definir localização padrão (São Paulo) em caso de erro
        updateFormData("latitude", "-23.5505");
        updateFormData("longitude", "-46.6333");
        setIsGettingLocation(false);
      },
    );
  }, [updateFormData, setIsGettingLocation]);

  // Solicitar localização automaticamente ao montar o componente
  useEffect(() => {
    if (!hasRequestedLocation) {
      setHasRequestedLocation(true);
      getCurrentLocation();
    }
  }, [hasRequestedLocation, getCurrentLocation]);

  const handleMapClick = (lat: number, lng: number) => {
    updateFormData("latitude", lat.toString());
    updateFormData("longitude", lng.toString());
  };

  const currentLat = parseFloat(formData.latitude || "-23.5505");
  const currentLng = parseFloat(formData.longitude || "-46.6333");

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-4 block font-medium text-gray-700">
          Localização do Item *
        </Label>
        <p className="mb-4 text-gray-600 text-sm">
          Clique no mapa para definir a localização do seu item. A localização é
          necessária para que outros usuários possam encontrá-lo.
        </p>

        {/* Mapa Interativo */}
        <div className="mb-4">
          <LocationMap
            latitude={currentLat}
            longitude={currentLng}
            onLocationChange={handleMapClick}
            className="w-full"
          />
          <p className="mt-2 text-center text-gray-500 text-sm">
            💡 Clique no mapa para definir a localização exata do seu item
          </p>
        </div>

        {/* Botão para usar localização atual */}
        <Button
          type="button"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          variant="outline"
          className="mb-4 w-full"
        >
          {isGettingLocation ? (
            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
              Obtendo sua localização...
            </div>
          ) : (
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              Usar minha localização atual
            </div>
          )}
        </Button>

        {/* Campos ocultos para latitude e longitude */}
        <input type="hidden" name="latitude" value={formData.latitude || ""} />
        <input
          type="hidden"
          name="longitude"
          value={formData.longitude || ""}
        />

        {/* Endereço opcional */}
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
  images,
  setImages,
}: {
  formData: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
  images: string[];
  setImages: (images: string[]) => void;
}) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Simular upload de imagens (em produção, enviar para servidor)
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file),
    );
    setImages([...images, ...newImages].slice(0, 5)); // Máximo 5 imagens
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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
                    className="-top-2 -right-2 absolute flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
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
        return "Venda";
      case "donation":
        return "Doação";
      case "collection":
        return "Coleta";
      default:
        return "Não especificado";
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case "sale":
        return DollarSign;
      case "donation":
        return Gift;
      case "collection":
        return Truck;
      default:
        return Package;
    }
  };

  const getMaterialTypeText = (type: string) => {
    const materials: Record<string, string> = {
      plastic: "Plástico",
      paper: "Papel",
      glass: "Vidro",
      metal: "Metal",
      electronic: "Eletrônico",
      organic: "Orgânico",
      textile: "Têxtil",
      other: "Outro",
    };
    return materials[type] || "Não especificado";
  };

  const getMaterialTypeIcon = (type: string) => {
    const materials: Record<
      string,
      React.ComponentType<{ className?: string }>
    > = {
      plastic: Recycle,
      paper: FileText,
      glass: Wine,
      metal: Wrench,
      electronic: Smartphone,
      organic: Sprout,
      textile: Shirt,
      other: Package,
    };
    return materials[type] || Package;
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
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Tipo:</span>
              <div className="flex items-center space-x-2">
                {(() => {
                  const MaterialIcon = getMaterialTypeIcon(
                    formData.materialType || "",
                  );
                  return <MaterialIcon className="h-4 w-4 text-gray-600" />;
                })()}
                <span className="font-medium">
                  {getMaterialTypeText(formData.materialType || "")}
                </span>
              </div>
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
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Tipo:</span>
              <div className="flex items-center space-x-2">
                {(() => {
                  const TransactionIcon = getTransactionTypeIcon(
                    formData.transactionType || "",
                  );
                  return <TransactionIcon className="h-4 w-4 text-gray-600" />;
                })()}
                <span className="font-medium">
                  {getTransactionTypeText(formData.transactionType || "")}
                </span>
              </div>
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
