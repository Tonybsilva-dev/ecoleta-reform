"use client";

import { Edit, MoreHorizontal, ReceiptTextIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useItemsStore } from "@/lib/stores";

interface ItemListRowProps {
  item: {
    id: string;
    title: string;
    description?: string | null;
    price?: number | null;
    quantity: number;
    status: string;
    transactionType: string;
    material?: {
      name: string;
    } | null;
    images: Array<{
      id: string;
      url: string;
      altText: string | null;
      isPrimary: boolean;
    }>;
  };
  onEdit?: (itemId: string) => void;
  onView?: (itemId: string) => void;
}

export function ItemListRow({ item, onEdit, onView }: ItemListRowProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteItem, updateItemStatus, updateItemTransactionType } =
    useItemsStore();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteItem(item.id);
      if (success) {
        setIsDeleteDialogOpen(false);
        toast.success("Item excluído com sucesso!");
      } else {
        toast.error("Erro ao excluir item");
      }
    } catch (error) {
      console.error("Erro ao excluir item:", error);
      toast.error("Erro ao excluir item");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const success = await updateItemStatus(item.id, newStatus);
      if (success) {
        toast.success("Status atualizado com sucesso!");
      } else {
        toast.error("Erro ao atualizar status");
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const handleTransactionTypeChange = async (newTransactionType: string) => {
    try {
      const success = await updateItemTransactionType(
        item.id,
        newTransactionType,
      );
      if (success) {
        toast.success("Tipo de transação atualizado com sucesso!");
      } else {
        toast.error("Erro ao atualizar tipo de transação");
      }
    } catch (error) {
      console.error("Erro ao atualizar tipo de transação:", error);
      toast.error("Erro ao atualizar tipo de transação");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
      case "SOLD":
        return "bg-blue-100 text-blue-800";
      case "DONATED":
        return "bg-purple-100 text-purple-800";
      case "COLLECTED":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "SALE":
        return "Venda";
      case "DONATION":
        return "Doação";
      case "COLLECTION":
        return "Coleta";
      default:
        return "Doação";
    }
  };

  const primaryImage =
    item.images?.find((img) => img.isPrimary) || item.images?.[0];
  const priceFormatted = item.price
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(item.price))
    : null;

  return (
    <>
      <div className="flex items-center gap-4 border-gray-100 border-b p-4 transition-colors hover:bg-gray-50">
        {/* Imagem do item */}
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText || item.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-xs">Sem imagem</span>
            </div>
          )}
        </div>

        {/* Conteúdo principal */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              {/* Título */}
              <h3 className="truncate font-semibold text-gray-900 text-lg">
                {item.title}
              </h3>

              {/* Material */}
              {item.material && (
                <p className="mt-1 text-gray-600 text-sm">
                  {item.material.name}
                </p>
              )}

              {/* Descrição */}
              {item.description && (
                <p className="mt-1 line-clamp-2 text-gray-500 text-sm">
                  {item.description}
                </p>
              )}
            </div>

            {/* Informações do lado direito */}
            <div className="ml-4 flex items-center gap-3">
              {/* Preço */}
              {priceFormatted && (
                <div className="text-right">
                  <p className="font-semibold text-green-600 text-sm">
                    {priceFormatted}
                  </p>
                  <p className="text-gray-500 text-xs">Qtd: {item.quantity}</p>
                </div>
              )}

              {/* Status e Tipo */}
              <div className="flex flex-col gap-1">
                <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                  {item.status}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getTransactionTypeLabel(item.transactionType)}
                </Badge>
              </div>

              {/* Botões de ação */}
              <div className="flex items-center gap-2">
                {/* Menu de ações */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {onView && (
                      <DropdownMenuItem onClick={() => onView(item.id)}>
                        <ReceiptTextIcon className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(item.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                    )}

                    {/* Separador */}
                    <div className="my-1 h-px bg-gray-100" />

                    {/* Opções de Status */}
                    <div className="px-2 py-1">
                      <div className="mb-1 font-medium text-gray-500 text-xs">
                        Status
                      </div>
                      <div className="space-y-1">
                        {[
                          "ACTIVE",
                          "INACTIVE",
                          "SOLD",
                          "DONATED",
                          "COLLECTED",
                        ].map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            className={`text-xs ${
                              item.status === status
                                ? "bg-green-50 font-medium text-green-700"
                                : "text-gray-600"
                            }`}
                          >
                            {status === "ACTIVE" && "Ativo"}
                            {status === "INACTIVE" && "Inativo"}
                            {status === "SOLD" && "Vendido"}
                            {status === "DONATED" && "Doado"}
                            {status === "COLLECTED" && "Coletado"}
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </div>

                    {/* Separador */}
                    <div className="my-1 h-px bg-gray-100" />

                    {/* Opções de Tipo de Transação */}
                    <div className="px-2 py-1">
                      <div className="mb-1 font-medium text-gray-500 text-xs">
                        Tipo
                      </div>
                      <div className="space-y-1">
                        {["SALE", "DONATION", "COLLECTION"].map((type) => (
                          <DropdownMenuItem
                            key={type}
                            onClick={() => handleTransactionTypeChange(type)}
                            className={`text-xs ${
                              item.transactionType === type
                                ? "bg-blue-50 font-medium text-blue-700"
                                : "text-gray-600"
                            }`}
                          >
                            {type === "SALE" && "Venda"}
                            {type === "DONATION" && "Doação"}
                            {type === "COLLECTION" && "Coleta"}
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </div>

                    {/* Separador */}
                    <div className="my-1 h-px bg-gray-100" />

                    <DropdownMenuItem
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o item "{item.title}"? Esta ação
              não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
