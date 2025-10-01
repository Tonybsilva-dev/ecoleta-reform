"use client";

import { Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui";
import {
  ErrorState,
  ItemDetailsSkeleton,
} from "@/components/ui/loading-states";

interface Item {
  id: string;
  title: string;
  description?: string;
  price?: number;
  quantity?: number;
  status: string;
  material?: {
    id: string;
    name: string;
    description?: string;
    category?: string;
  };
  images?: { url: string }[];
  createdBy?: {
    name?: string;
    email: string;
    profile?: {
      ecoScore?: number;
    };
  };
}

interface ItemDetailsClientProps {
  id: string;
}

export function ItemDetailsClient({ id }: ItemDetailsClientProps) {
  const { status } = useSession();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Se não estiver autenticado, não fazer a requisição
    if (status === "unauthenticated") {
      setLoading(false);
      return;
    }

    // Se ainda estiver carregando a sessão, aguardar
    if (status === "loading") {
      return;
    }

    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/items/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setItem(null);
          } else {
            throw new Error("Failed to fetch item");
          }
        } else {
          const data = await response.json();
          setItem(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, status]);

  if (loading) {
    return <ItemDetailsSkeleton />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="space-y-6">
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-8 w-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Ícone de cadeado"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="mb-2 font-medium text-gray-900 text-lg">
            Acesso Restrito
          </h3>
          <p className="mb-4 text-gray-500">
            Faça login para interagir com este item
          </p>
          <Button asChild>
            <Link href="/signin">Fazer Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorState
          message="Algo deu errado ao carregar o item"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Item não encontrado"
          description="O item solicitado não existe ou foi removido."
          actions={
            <Button
              className="flex cursor-pointer items-center justify-center gap-3 rounded-lg bg-green-600 px-8 py-6 font-medium text-lg text-white shadow-sm transition-colors hover:bg-green-700"
              asChild
            >
              <Link href="/dashboard/items">Voltar</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const primaryImage = item.images?.[0];
  const additionalImages = item.images?.slice(1, 5) || []; // Máximo 4 imagens adicionais

  return (
    <div className="space-y-6">
      <PageHeader
        title={item.title}
        description={item.description || ""}
        actions={
          <Button
            asChild
            className="flex cursor-pointer items-center justify-center gap-3 rounded-lg bg-green-600 px-8 py-6 font-medium text-lg text-white shadow-sm transition-colors hover:bg-green-700"
          >
            <Link href="/dashboard/items">Voltar</Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Seção de Imagens */}
        <div className="space-y-4">
          {/* Imagem Principal */}
          {primaryImage ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
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

        {/* Seção de Informações */}
        <div className="space-y-4">
          {/* Informações do Produto */}
          <div className="space-y-3">
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground text-xs">Preço</div>
              <div className="font-semibold text-lg">
                {item.price !== undefined && item.price !== null
                  ? new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                    }).format(Number(item.price))
                  : "—"}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground text-xs">Quantidade</div>
              <div className="font-semibold text-lg">
                {item.quantity ?? "—"}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground text-xs">Material</div>
              <div className="font-semibold text-lg">
                {item.material?.name ? (
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    <span>{item.material.name}</span>
                    {((item as any).material?.category?.name ||
                      item.material?.category) && (
                      <span className="text-muted-foreground text-sm">
                        (
                        {(item as any).material?.category?.name ||
                          item.material?.category}
                        )
                      </span>
                    )}
                  </div>
                ) : (
                  "—"
                )}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground text-xs">Status</div>
              <div className="font-semibold text-lg">{item.status}</div>
            </div>
          </div>

          {/* Informações do Anunciante */}
          {item.createdBy && (
            <div className="rounded-lg border p-4">
              <h3 className="mb-3 font-semibold text-gray-900 text-sm">
                Anunciado por
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">Nome:</span>
                  <span className="font-medium text-sm">
                    {item.createdBy.name || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">Email:</span>
                  <span className="font-medium text-sm">
                    {item.createdBy.email}
                  </span>
                </div>
                {item.createdBy.profile && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">
                      EcoPoints:
                    </span>
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <Leaf
                            key={`eco-point-${i}`}
                            className={`h-4 w-4 ${
                              i <
                              Math.floor(
                                ((item.createdBy?.profile?.ecoScore ??
                                  0) as number) / 20,
                              )
                                ? "text-green-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium text-green-600 text-sm">
                        {item.createdBy.profile.ecoScore ?? 0}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
