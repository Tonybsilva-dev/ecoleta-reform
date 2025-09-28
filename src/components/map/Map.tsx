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

export interface MapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  height?: string;
  children?: React.ReactNode;
}

export default function MapComponent(props: MapProps) {
  return <MapView {...props} />;
}
