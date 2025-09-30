"use client";

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
  material?: { name: string };
  images?: { url: string }[];
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
            <Button asChild>
              <Link href="/dashboard/items">Voltar</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const primaryImage = item.images?.[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title={item.title}
        description={item.description || ""}
        actions={
          <Button asChild>
            <Link href="/dashboard/items">Voltar</Link>
          </Button>
        }
      />

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
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
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground text-xs">Preço</div>
            <div className="font-semibold text-lg">
              {item.price ? `R$ ${Number(item.price).toFixed(2)}` : "—"}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground text-xs">Quantidade</div>
            <div className="font-semibold text-lg">{item.quantity ?? "—"}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground text-xs">Material</div>
            <div className="font-semibold text-lg">
              {item.material?.name ?? "—"}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground text-xs">Status</div>
            <div className="font-semibold text-lg">{item.status}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
