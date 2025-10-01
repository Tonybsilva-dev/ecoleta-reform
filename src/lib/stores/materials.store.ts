"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Material {
  id: string;
  name: string;
  description?: string | null;
  category?: { name: string; icon?: string | null } | null;
}

interface MaterialsState {
  materials: Material[];
  isLoading: boolean;
  error: string | null;
  loadedOnce: boolean;
  loadMaterials: () => Promise<void>;
  setMaterials: (materials: Material[]) => void;
}

export const useMaterialsStore = create<MaterialsState>()(
  devtools((set) => ({
    materials: [],
    isLoading: false,
    error: null,
    loadedOnce: false,

    setMaterials: (materials) => set({ materials }),

    loadMaterials: async () => {
      set({ isLoading: true, error: null });
      try {
        const res = await fetch("/api/materials");
        const json = await res.json();
        const materials: Material[] = json?.data?.materials ?? [];
        set({ materials, loadedOnce: true });
      } catch (e: any) {
        set({ error: e?.message || "Falha ao carregar materiais" });
      } finally {
        set({ isLoading: false });
      }
    },
  })),
);
