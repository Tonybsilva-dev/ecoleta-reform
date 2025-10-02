"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { useMaterialsStore } from "@/lib/stores/materials.store";

export function MaterialsDebug() {
  const materials = useMaterialsStore((s) => s.materials);
  const loadMaterials = useMaterialsStore((s) => s.loadMaterials);
  const loadedOnce = useMaterialsStore((s) => s.loadedOnce);
  const isLoading = useMaterialsStore((s) => s.isLoading);
  const error = useMaterialsStore((s) => s.error);

  useEffect(() => {
    console.log("MaterialsDebug - Estado atual:", {
      materials: materials.length,
      loadedOnce,
      isLoading,
      error,
    });
  }, [materials, loadedOnce, isLoading, error]);

  const handleLoadMaterials = async () => {
    console.log("Iniciando carregamento de materiais...");
    try {
      await loadMaterials();
      console.log("Materiais carregados:", materials);
      toast.success(`Materiais carregados: ${materials.length} itens`);
    } catch (err) {
      console.error("Erro ao carregar materiais:", err);
      toast.error("Erro ao carregar materiais");
    }
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="font-semibold text-lg">Debug: Materiais</h3>

      <div className="space-y-2 text-sm">
        <div>
          <strong>Materiais carregados:</strong> {materials.length}
        </div>
        <div>
          <strong>Carregado uma vez:</strong> {loadedOnce ? "Sim" : "Não"}
        </div>
        <div>
          <strong>Carregando:</strong> {isLoading ? "Sim" : "Não"}
        </div>
        <div>
          <strong>Erro:</strong> {error || "Nenhum"}
        </div>
      </div>

      <button
        type="button"
        onClick={handleLoadMaterials}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Carregar Materiais
      </button>

      {materials.length > 0 && (
        <div>
          <h4 className="mb-2 font-medium">Materiais:</h4>
          <div className="max-h-40 space-y-1 overflow-y-auto">
            {materials.map((material) => (
              <div key={material.id} className="text-xs">
                {material.name} - {material.category?.name || "Sem categoria"}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
