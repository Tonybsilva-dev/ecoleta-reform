"use client";

import { Leaf, Save } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout";
import { ErrorState, LoadingState } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useItemsStore } from "@/lib/stores";

interface ItemEditClientProps {
  id: string;
}

interface ItemData {
  id: string;
  title: string;
  description?: string | null;
  price?: number | null;
  quantity: number;
  status: string;
  transactionType: string;
  material?: {
    id: string;
    name: string;
  } | null;
  organization?: {
    id: string;
    name: string;
  } | null;
  images: Array<{
    id: string;
    url: string;
    altText: string | null;
    isPrimary: boolean;
  }>;
}

export function ItemEditClient({ id }: ItemEditClientProps) {
  const router = useRouter();
  const { updateItem } = useItemsStore();
  const [item, setItem] = useState<ItemData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados do formulário
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    status: "ACTIVE",
    transactionType: "DONATION",
    materialId: "",
    organizationId: "",
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/items/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Item não encontrado");
          } else {
            setError("Erro ao carregar item");
          }
          return;
        }

        const itemData: ItemData = await response.json();
        setItem(itemData);

        // Preencher formulário com dados existentes
        setFormData({
          title: itemData.title,
          description: itemData.description || "",
          price: itemData.price ? itemData.price.toString() : "",
          quantity: itemData.quantity.toString(),
          status: itemData.status,
          transactionType: itemData.transactionType,
          materialId: itemData.material?.id || "",
          organizationId: itemData.organization?.id || "",
        });
      } catch (err) {
        console.error("Erro ao carregar item:", err);
        setError("Erro ao carregar item");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item) return;

    setIsSaving(true);
    try {
      const updateData = {
        title: formData.title,
        description: formData.description || null,
        price: formData.price ? parseFloat(formData.price) : null,
        quantity: parseInt(formData.quantity, 10),
        status: formData.status as
          | "ACTIVE"
          | "INACTIVE"
          | "SOLD"
          | "DONATED"
          | "COLLECTED",
        transactionType: formData.transactionType as
          | "SALE"
          | "DONATION"
          | "COLLECTION",
        materialId: formData.materialId || null,
        organizationId: formData.organizationId || null,
      };

      const success = await updateItem(id, updateData);

      if (success) {
        toast.success("Item atualizado com sucesso!");
        router.push(`/dashboard/items/${id}`);
      } else {
        toast.error("Erro ao atualizar item");
      }
    } catch (err) {
      console.error("Erro ao atualizar item:", err);
      toast.error("Erro ao atualizar item");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Carregando item..." />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/items")}
            className="flex items-center gap-2"
          >
            Voltar
          </Button>
        </div>
        <ErrorState message={error} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/items")}
            className="flex items-center gap-2"
          >
            Voltar
          </Button>
        </div>
        <ErrorState message="Item não encontrado" />
      </div>
    );
  }

  const primaryImage = item.images?.[0];
  const additionalImages = item.images?.slice(1, 5) || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Editar Item"
        description={item.title}
        actions={
          <div className="flex gap-3">
            <Button
              asChild
              variant="outline"
              className="flex cursor-pointer items-center justify-center gap-3 rounded-lg px-8 py-6 font-medium text-lg shadow-sm transition-colors"
            >
              <Link href={`/dashboard/items/${id}`}>Cancelar</Link>
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex cursor-pointer items-center justify-center gap-3 rounded-lg bg-green-600 px-8 py-6 font-medium text-lg text-white shadow-sm transition-colors hover:bg-green-700"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Seção de Imagens */}
          <div className="space-y-4">
            {/* Imagem Principal */}
            {primaryImage ? (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-muted md:aspect-[16/9]">
                <Image
                  src={primaryImage.url}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                Sem imagem
              </div>
            )}

            {/* Imagens Adicionais */}
            {additionalImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {additionalImages.map((image, index) => (
                  <div
                    key={`additional-image-${image.url}-${index}`}
                    className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted"
                  >
                    <Image
                      src={image.url}
                      alt={`${item.title} - Imagem ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seção de Informações Editáveis */}
          <div className="space-y-4">
            {/* Informações do Produto */}
            <div className="space-y-3">
              {/* Título */}
              <div className="rounded-lg border p-3">
                <Label
                  htmlFor="title"
                  className="text-muted-foreground text-xs"
                >
                  Título *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Nome do item"
                  required
                  className="border-0 p-0 font-semibold text-lg focus-visible:ring-0"
                />
              </div>

              {/* Descrição */}
              <div className="rounded-lg border p-3">
                <Label
                  htmlFor="description"
                  className="text-muted-foreground text-xs"
                >
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Descreva o item..."
                  className="resize-none border-0 p-0 focus-visible:ring-0"
                  rows={3}
                />
              </div>

              {/* Preço */}
              <div className="rounded-lg border p-3">
                <Label
                  htmlFor="price"
                  className="text-muted-foreground text-xs"
                >
                  Preço (R$)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  className="border-0 p-0 font-semibold text-lg focus-visible:ring-0"
                />
              </div>

              {/* Quantidade */}
              <div className="rounded-lg border p-3">
                <Label
                  htmlFor="quantity"
                  className="text-muted-foreground text-xs"
                >
                  Quantidade *
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)
                  }
                  placeholder="1"
                  required
                  className="border-0 p-0 font-semibold text-lg focus-visible:ring-0"
                />
              </div>

              {/* Material */}
              <div className="rounded-lg border p-3">
                <Label className="text-muted-foreground text-xs">
                  Material
                </Label>
                <div className="flex items-center space-x-2 font-semibold text-lg">
                  <Leaf className="h-4 w-4 text-green-600" />
                  <span>{item.material?.name || "—"}</span>
                </div>
              </div>

              {/* Status */}
              <div className="rounded-lg border p-3">
                <Label
                  htmlFor="status"
                  className="text-muted-foreground text-xs"
                >
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger className="border-0 p-0 font-semibold text-lg focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Ativo</SelectItem>
                    <SelectItem value="INACTIVE">Inativo</SelectItem>
                    <SelectItem value="SOLD">Vendido</SelectItem>
                    <SelectItem value="DONATED">Doado</SelectItem>
                    <SelectItem value="COLLECTED">Coletado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de Transação */}
              <div className="rounded-lg border p-3">
                <Label
                  htmlFor="transactionType"
                  className="text-muted-foreground text-xs"
                >
                  Tipo de Transação
                </Label>
                <Select
                  value={formData.transactionType}
                  onValueChange={(value) =>
                    handleInputChange("transactionType", value)
                  }
                >
                  <SelectTrigger className="border-0 p-0 font-semibold text-lg focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SALE">Venda</SelectItem>
                    <SelectItem value="DONATION">Doação</SelectItem>
                    <SelectItem value="COLLECTION">Coleta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
