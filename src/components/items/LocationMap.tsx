"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Importar componentes do Leaflet dinamicamente para evitar problemas de SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);

interface LocationMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  className?: string;
}

// Componente para capturar cliques no mapa
function MapClickHandler({
  onLocationChange,
}: {
  onLocationChange: (lat: number, lng: number) => void;
}) {
  // Importar useMapEvents dinamicamente dentro do componente
  const { useMapEvents } = require("react-leaflet");

  useMapEvents({
    click: (e: { latlng: { lat: number; lng: number } }) => {
      const { lat, lng } = e.latlng;
      onLocationChange(lat, lng);
    },
  });
  return null;
}

export function LocationMap({
  latitude,
  longitude,
  onLocationChange,
  className,
}: LocationMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    latitude,
    longitude,
  ]);

  useEffect(() => {
    console.log("🗺️ LocationMap: Inicializando cliente");
    setIsClient(true);
  }, []);

  useEffect(() => {
    console.log("📍 LocationMap: Atualizando centro do mapa:", {
      latitude,
      longitude,
    });
    setMapCenter([latitude, longitude]);
  }, [latitude, longitude]);

  if (!isClient) {
    return (
      <div
        className={`flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 ${className}`}
      >
        <div className="text-center">
          <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
          <p className="text-gray-600 text-sm">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-64 w-full overflow-hidden rounded-lg border border-gray-200 ${className}`}
    >
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]} />
        <MapClickHandler onLocationChange={onLocationChange} />
      </MapContainer>
    </div>
  );
}
