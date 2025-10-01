"use client";

import { MapPin, Package, RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamic import do mapa para evitar SSR
const MapComponent = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] w-full items-center justify-center rounded-lg bg-gray-100">
      <div className="space-y-2 text-center">
        <Skeleton className="mx-auto h-4 w-32" />
        <Skeleton className="mx-auto h-4 w-24" />
        <Skeleton className="mx-auto h-4 w-28" />
      </div>
    </div>
  ),
});

interface MapItem {
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

interface MapFilters {
  materialId?: string;
  organizationId?: string;
  minPrice?: number;
  maxPrice?: number;
  radius: number;
}

interface Material {
  id: string;
  name: string;
  category: string;
}

interface Organization {
  id: string;
  name: string;
  verified: boolean;
}

export default function PublicMapPage() {
  const [items, setItems] = useState<MapItem[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    -23.5505, -46.6333,
  ]);
  const [mapZoom, setMapZoom] = useState(13);
  const [filters, setFilters] = useState<MapFilters>({
    radius: 10,
  });

  // Carregar materiais e organizações
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [materialsRes, organizationsRes] = await Promise.all([
          fetch("/api/materials"),
          fetch("/api/organizations"),
        ]);

        if (materialsRes.ok) {
          const materialsData = await materialsRes.json();
          setMaterials(materialsData.data?.materials || []);
        }

        if (organizationsRes.ok) {
          const organizationsData = await organizationsRes.json();
          setOrganizations(organizationsData.data || []);
        }
      } catch (err) {
        console.error("Erro ao carregar dados iniciais:", err);
      }
    };

    loadInitialData();
  }, []);

  // Carregar itens do mapa
  const loadMapItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        latitude: mapCenter[0].toString(),
        longitude: mapCenter[1].toString(),
        radius: filters.radius.toString(),
      });

      if (filters.materialId && filters.materialId !== "all") {
        params.append("materialId", filters.materialId);
      }
      if (filters.organizationId && filters.organizationId !== "all") {
        params.append("organizationId", filters.organizationId);
      }
      if (filters.minPrice !== undefined) {
        params.append("minPrice", filters.minPrice.toString());
      }
      if (filters.maxPrice !== undefined) {
        params.append("maxPrice", filters.maxPrice.toString());
      }

      const response = await fetch(`/api/items/map?${params}`);
      const data = await response.json();

      if (data.success) {
        setItems(data.data.items || []);
      } else {
        setError(data.error || "Erro ao carregar itens");
      }
    } catch (err) {
      setError("Erro de conexão");
      console.error("Erro ao carregar itens:", err);
    } finally {
      setIsLoading(false);
    }
  }, [mapCenter, filters]);

  // Carregar itens quando os filtros ou centro do mapa mudarem
  useEffect(() => {
    loadMapItems();
  }, [loadMapItems]);

  // Handler para mudança de centro do mapa
  const handleMapMove = useCallback(
    (newCenter: [number, number], newZoom: number) => {
      setMapCenter(newCenter);
      setMapZoom(newZoom);
    },
    [],
  );

  // Handler para mudança de filtros
  const handleFilterChange = (
    key: keyof MapFilters,
    value: string | number | undefined,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      radius: 10,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header compacto */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-2xl text-gray-900">
              Materiais para Reciclagem
            </h1>
            <p className="text-gray-600 text-sm">
              Encontre materiais próximos a você
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="text-sm">
              {items.length} itens
            </Badge>
            <Button
              onClick={loadMapItems}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Layout principal - Lista à esquerda, Mapa à direita */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Lista de itens - 2/3 da tela */}
        <div className="w-2/3 border-r bg-gray-50">
          {/* Filtros compactos */}
          <div className="border-b bg-white px-4 py-3">
            <div className="flex items-center space-x-4">
              {/* Filtros horizontais */}
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-600 text-sm">
                  Filtros:
                </span>

                {/* Raio */}
                <Select
                  value={filters.radius.toString()}
                  onValueChange={(value) =>
                    handleFilterChange("radius", parseInt(value, 10))
                  }
                >
                  <SelectTrigger className="h-8 w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5km</SelectItem>
                    <SelectItem value="10">10km</SelectItem>
                    <SelectItem value="25">25km</SelectItem>
                    <SelectItem value="50">50km</SelectItem>
                  </SelectContent>
                </Select>

                {/* Material */}
                <Select
                  value={filters.materialId || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "materialId",
                      value === "all" ? undefined : value,
                    )
                  }
                >
                  <SelectTrigger className="h-8 w-40">
                    <SelectValue placeholder="Material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {materials.map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Organização */}
                <Select
                  value={filters.organizationId || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "organizationId",
                      value === "all" ? undefined : value,
                    )
                  }
                >
                  <SelectTrigger className="h-8 w-40">
                    <SelectValue placeholder="Organização" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Preço */}
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Min R$"
                    className="h-8 w-20"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "minPrice",
                        e.target.value ? parseFloat(e.target.value) : undefined,
                      )
                    }
                  />
                  <span className="text-gray-400">-</span>
                  <Input
                    placeholder="Max R$"
                    className="h-8 w-20"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "maxPrice",
                        e.target.value ? parseFloat(e.target.value) : undefined,
                      )
                    }
                  />
                </div>

                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                  className="h-8"
                >
                  Limpar
                </Button>
              </div>
            </div>
          </div>

          {/* Lista de itens */}
          <div className="h-[calc(100%-60px)] overflow-y-auto">
            {isLoading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton
                    key={`skeleton-${Date.now()}-${i}`}
                    className="h-20 w-full"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-600">{error}</div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Package className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <p>Nenhum item encontrado</p>
                <p className="text-sm">Tente ajustar os filtros</p>
              </div>
            ) : (
              <div className="p-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="mb-2 w-full rounded-lg border bg-white p-4 text-left transition-shadow hover:shadow-sm"
                    onClick={() => {
                      setMapCenter([
                        item.location.latitude,
                        item.location.longitude,
                      ]);
                      setMapZoom(15);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      {/* Informações do item */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center space-x-2">
                          <h4 className="truncate font-semibold text-gray-900 text-sm">
                            {item.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {item.status}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-4 text-gray-500 text-xs">
                          <span className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {item.distance.toFixed(1)} km
                          </span>
                          <span>
                            {item.material?.name || "Material não especificado"}
                          </span>
                          <span>Qtd: {item.quantity}</span>
                        </div>

                        {item.description && (
                          <p className="mt-1 line-clamp-2 text-gray-600 text-xs">
                            {item.description}
                          </p>
                        )}

                        {item.organization && (
                          <p className="mt-1 text-gray-500 text-xs">
                            {item.organization.name}
                          </p>
                        )}
                      </div>

                      {/* Preço */}
                      {item.price && (
                        <div className="ml-4 text-right">
                          <span className="font-bold text-green-600 text-sm">
                            R${" "}
                            {typeof item.price === "number"
                              ? item.price.toFixed(2)
                              : parseFloat(item.price || "0").toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mapa - 1/3 da tela */}
        <div className="w-1/3">
          <div className="h-full">
            <MapComponent
              center={mapCenter}
              zoom={mapZoom}
              height="100%"
              onMapMove={handleMapMove}
              items={items}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
