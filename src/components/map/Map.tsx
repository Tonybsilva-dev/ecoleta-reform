"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamic import to avoid SSR issues
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center rounded-lg bg-gray-100">
      <div className="space-y-2 text-center">
        <Skeleton className="mx-auto h-4 w-32" />
        <Skeleton className="mx-auto h-4 w-24" />
        <Skeleton className="mx-auto h-4 w-28" />
      </div>
    </div>
  ),
});

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

export interface MapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  height?: string;
  children?: React.ReactNode;
  items?: MapItem[];
  onMapMove?: (center: [number, number], zoom: number) => void;
}

export default function MapComponent(props: MapProps) {
  return <MapView {...props} />;
}
