"use client";

import { Map as MapComponent } from "@/components/map";

export default function PublicMapPage() {
  return (
    <div className="min-h-screen">
      <div className="h-screen">
        <MapComponent />
      </div>
    </div>
  );
}
