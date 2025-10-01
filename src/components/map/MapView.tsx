"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export interface MapItem {
  id: string;
  title: string;
  description: string | null;
  status: string;
  transactionType: string;
  price: number | null;
  quantity: number;
  location: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  material: {
    name: string;
  } | null;
  organization: {
    name: string;
  } | null;
  creator: {
    name: string;
  } | null;
  images: Array<{
    id: string;
    url: string;
    altText: string | null;
    isPrimary: boolean;
  }>;
}

export interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  height?: string;
  children?: React.ReactNode;
  items?: MapItem[];
  onMapMove?: (center: [number, number], zoom: number) => void;
}

export default function MapView({
  center = [-23.5505, -46.6333], // São Paulo coordinates
  zoom = 13,
  className = "",
  height = "400px",
  children,
  items = [],
  onMapMove,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const containerIdRef = useRef<string>(
    `sustainable-map-${Math.random().toString(36).slice(2)}`,
  );
  const programmaticMoveRef = useRef<boolean>(false);

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamic import of Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      if (!mapRef.current) return;

      // Reuse map instance if already created for this container (guards against double init)
      const globalAny = window as unknown as {
        _sustainableMaps?: Record<string, L.Map>;
      };
      globalAny._sustainableMaps = globalAny._sustainableMaps || {};
      const existing =
        globalAny._sustainableMaps[containerIdRef.current as unknown as string];
      if (existing) {
        mapInstanceRef.current = existing;
        return;
      }

      // Fix for default markers in Leaflet with Next.js
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
        ._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      // Initialize map
      const map = L.map(mapRef.current).setView(center, zoom);

      // Use theme configuration or default to light theme
      const themeConfig = {
        tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      };

      // Add tile layer based on theme
      L.tileLayer(themeConfig.tileUrl, {
        attribution: themeConfig.attribution,
        maxZoom: 19,
      }).addTo(map);

      // Add event listeners for map movement
      if (onMapMove) {
        map.on("moveend", () => {
          if (programmaticMoveRef.current) {
            // Ignore moveend triggered by setView we performed programmatically
            programmaticMoveRef.current = false;
            return;
          }
          const c = map.getCenter();
          const z = map.getZoom();
          onMapMove([c.lat, c.lng], z);
        });
      }

      mapInstanceRef.current = map;
      globalAny._sustainableMaps[containerIdRef.current as unknown as string] =
        map;
    });

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {
          /* ignore */
        }
        const globalAny = window as unknown as {
          _sustainableMaps?: Record<string, L.Map>;
        };
        if (globalAny._sustainableMaps)
          delete globalAny._sustainableMaps[
            containerIdRef.current as unknown as string
          ];
        mapInstanceRef.current = null;
      }
    };
  }, [onMapMove, center, zoom]);

  // Keep view in sync when center/zoom props change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    // Mark programmatic change so we skip emitting onMapMove for this cycle
    programmaticMoveRef.current = true;
    mapInstanceRef.current.setView(center, zoom, { animate: true });
  }, [center, zoom]);

  // Update markers when items change
  useEffect(() => {
    if (!mapInstanceRef.current || !items.length) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    import("leaflet").then((L) => {
      items.forEach((item) => {
        const getMarkerInfo = (
          transactionType: string,
          price: number | null,
        ) => {
          switch (transactionType) {
            case "SALE":
              return {
                label: price ? `R$ ${Number(price).toFixed(2)}` : "Venda",
                bg: "#10b981", // green
              };
            case "DONATION":
              return {
                label: "Doação",
                bg: "#ec4899", // pink
              };
            case "COLLECTION":
              return {
                label: "Coleta",
                bg: "#3b82f6", // blue
              };
            default:
              return {
                label: "Doação",
                bg: "#ec4899", // pink
              };
          }
        };

        const markerInfo = getMarkerInfo(
          item.transactionType || "DONATION",
          item.price,
        );
        const label = markerInfo.label;
        const bg = markerInfo.bg;
        const html = `
          <div style="
            display:inline-flex;align-items:center;justify-content:center;
            padding:4px 8px;border-radius:9999px;color:white;font-weight:600;
            background:${bg};box-shadow:0 1px 2px rgba(0,0,0,.25);font-size:12px;
            border:2px solid white
          ">${label}</div>`;

        const icon = L.divIcon({
          html,
          className: "sustainable-badge-icon",
          iconSize: [80, 28],
          iconAnchor: [40, 14],
        });

        const marker = L.marker(
          [item.location.latitude, item.location.longitude],
          { icon },
        ).addTo(mapInstanceRef.current!);

        // Create popup content (custom layout)
        const primaryImage =
          (item.images || []).find((im) => im.isPrimary)?.url ||
          (item.images || [])[0]?.url ||
          "";
        const orgName =
          item.organization?.name || item.creator?.name || "Particular";
        const getTransactionDisplay = (
          transactionType: string,
          price: number | null,
        ) => {
          switch (transactionType) {
            case "SALE":
              return price
                ? `<span style="color:#059669;font-weight:600">R$ ${Number(price).toFixed(2)}</span>`
                : `<span style="color:#059669;font-weight:600">Preço a negociar</span>`;
            case "DONATION":
              return `<span style="color:#ec4899;font-weight:600">Gratuito</span>`;
            case "COLLECTION":
              return `<span style="color:#3b82f6;font-weight:600">Solicitar coleta</span>`;
            default:
              return `<span style="color:#ec4899;font-weight:600">Gratuito</span>`;
          }
        };

        const transactionHtml = getTransactionDisplay(
          item.transactionType || "DONATION",
          item.price,
        );

        const popupContent = `
          <div style="min-width:240px;max-width:280px"> 
            <div style="display:grid;grid-template-columns:64px 1fr;gap:12px;align-items:center">
              <div style="width:64px;height:64px;border-radius:8px;background:#f3f4f6;overflow:hidden">
                ${primaryImage ? `<img src="${primaryImage}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover"/>` : ""}
              </div>
              <div>
                <div style="font-weight:600;color:#111827;font-size:14px;line-height:1.2">${orgName}</div>
                <div style="margin-top:4px;color:#6b7280;font-size:12px">${item.material?.name || "Material não especificado"} • ${item.distance.toFixed(1)} km</div>
                <div style="margin-top:4px;font-size:12px">${transactionHtml}</div>
              </div>
            </div>
            <div style="margin-top:10px">
              <a href="/signin?redirect=/items/${item.id}" style="display:block;text-align:center;padding:8px 10px;border:1px solid #e5e7eb;border-radius:8px;color:#1d4ed8;font-size:12px;text-decoration:none">Ver detalhes</a>
            </div>
          </div>`;

        marker.bindPopup(popupContent);
        markersRef.current.push(marker);
      });
    });
  }, [items]);

  return (
    <div
      ref={mapRef}
      id={containerIdRef.current as unknown as string}
      className={`w-full ${className}`}
      style={{ height }}
    >
      {children}
    </div>
  );
}
