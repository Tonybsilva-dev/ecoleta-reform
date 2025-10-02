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
        console.log("🔍 Carregando materiais...");
        const res = await fetch("/api/materials");
        console.log("📡 Resposta da API:", res.status, res.ok);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const json = await res.json();
        console.log("📦 Dados recebidos:", {
          success: json.success,
          materialsCount: json?.data?.materials?.length || 0,
          total: json?.data?.total || 0,
        });

        const materials: Material[] = json?.data?.materials ?? [];
        console.log("✅ Materiais processados:", materials.length);

        set({ materials, loadedOnce: true });
      } catch (e: unknown) {
        console.error("❌ Erro ao carregar materiais:", e);
        set({
          error: e instanceof Error ? e.message : "Falha ao carregar materiais",
        });
      } finally {
        set({ isLoading: false });
      }
    },
  })),
);
