"use client";

import { MainLayout } from "@/components/layout";
import { Map as MapComponent } from "@/components/map";

export default function MapPage() {
  return (
    <MainLayout className="p-0">
      <div className="h-screen">
        <MapComponent />
      </div>
    </MainLayout>
  );
}
