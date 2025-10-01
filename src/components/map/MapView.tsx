"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export interface MapItem {
  id: string;
  title: string;
  description: string | null;
  status: string;
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

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamic import of Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      if (!mapRef.current) return;

      // Fix for default markers in Leaflet with Next.js
      delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
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
          const center = map.getCenter();
          const zoom = map.getZoom();
          onMapMove([center.lat, center.lng], zoom);
        });
      }

      mapInstanceRef.current = map;
    });

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, onMapMove]);

  // Update markers when items change
  useEffect(() => {
    if (!mapInstanceRef.current || !items.length) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    import("leaflet").then((L) => {
      items.forEach((item) => {
        const marker = L.marker([
          item.location.latitude,
          item.location.longitude,
        ]).addTo(mapInstanceRef.current);

        // Create popup content
        const popupContent = `
          <div class="p-2 min-w-[200px]">
            <h3 class="font-semibold text-sm mb-1">${item.title}</h3>
            <p class="text-xs text-gray-600 mb-2">${item.material?.name || "Material não especificado"}</p>
            ${item.price ? `<p class="text-sm font-medium text-green-600 mb-2">R$ ${item.price.toFixed(2)}</p>` : ""}
            <p class="text-xs text-gray-500 mb-2">${item.distance.toFixed(1)} km de distância</p>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-500">${item.organization?.name || "Particular"}</span>
              <a href="/items/${item.id}" class="text-xs text-blue-600 hover:text-blue-800">Ver detalhes</a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        markersRef.current.push(marker);
      });
    });
  }, [items]);

  return (
    <div ref={mapRef} className={`w-full ${className}`} style={{ height }}>
      {children}
    </div>
  );
}
