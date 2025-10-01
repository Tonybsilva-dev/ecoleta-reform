"use client";

import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

type MapItem = {
  id: string;
  title: string;
  description?: string | null;
  price?: number | null;
  quantity?: number;
  distance?: number;
  material?: { name: string } | null;
  organization?: { name: string } | null;
  images: Array<{
    id: string;
    url: string;
    altText: string | null;
    isPrimary: boolean;
  }>;
  location?: { latitude: number; longitude: number };
};

export function MapItemCard({
  item,
  onFocusOnMap,
}: {
  item: MapItem;
  onFocusOnMap?: (lat: number, lng: number) => void;
}) {
  const orderedImages = useMemo(() => {
    const primary = item.images?.find((i) => i.isPrimary);
    const rest = (item.images || []).filter((i) => !i.isPrimary);
    return primary ? [primary, ...rest] : rest;
  }, [item.images]);

  const [idx, setIdx] = useState(0);
  const hasImages = orderedImages && orderedImages.length > 0;

  const formatPrice = (value: number | null | undefined) => {
    if (value === null || value === undefined) return null;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(Number(value));
  };

  const goPrev = () =>
    setIdx((p) => (p <= 0 ? orderedImages.length - 1 : p - 1));
  const goNext = () => setIdx((p) => (p + 1) % orderedImages.length);

  return (
    <div className="mb-3 w-full overflow-hidden bg-white shadow-sm transition-shadow hover:shadow">
      {/* Media */}
      <div className="relative aspect-video w-full bg-gray-100">
        {hasImages ? (
          <>
            {(() => {
              const current = orderedImages[idx] ?? orderedImages[0]!;
              return (
                <Image
                  src={current.url}
                  alt={current.altText || item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={false}
                />
              );
            })()}
            {orderedImages.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Imagem anterior"
                  onClick={goPrev}
                  className="left-2 absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-1 text-gray-700 shadow hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Próxima imagem"
                  onClick={goNext}
                  className="right-2 absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-1 text-gray-700 shadow hover:bg-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="bottom-2 left-1/2 absolute -translate-x-1/2 rounded-full bg-black/30 px-2 py-0.5 text-white text-xs">
                  {idx + 1}/{orderedImages.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            Sem imagem
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        <div className="mb-1 flex items-start justify-between">
          <h4 className="line-clamp-1 font-semibold text-gray-900 text-sm">
            {item.title}
          </h4>
          {item.price !== null && item.price !== undefined && (
            <span className="ml-2 shrink-0 font-semibold text-green-600 text-sm">
              {formatPrice(item.price)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-gray-500 text-xs">
          {typeof item.distance === "number" && (
            <span className="flex items-center">
              <MapPin className="mr-1 h-3 w-3" />
              {item.distance.toFixed(1)} km
            </span>
          )}
          {item.material?.name && <span>{item.material.name}</span>}
          {item.quantity !== undefined && <span>Qtd: {item.quantity}</span>}
        </div>

        {item.organization?.name && (
          <div className="mt-1 text-gray-500 text-xs">
            {item.organization.name}
          </div>
        )}

        {onFocusOnMap && item.location && (
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (!item.location) return;
                onFocusOnMap?.(item.location.latitude, item.location.longitude);
              }}
              className="rounded-md border px-2 py-1 text-gray-700 text-xs hover:bg-gray-50"
            >
              Ver no mapa
            </button>
            <a
              href={`/signin?redirect=/items/${item.id}`}
              className="rounded-md border px-2 py-1 text-blue-700 text-xs hover:bg-blue-50"
            >
              Ver detalhes
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
