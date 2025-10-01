"use client";

import {
  Filter,
  MapPin as LocationIcon,
  MapPin,
  Package,
  RefreshCw,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const handleFilterChange = (key: keyof MapFilters, value: string | number | undefined) => {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mapa de Materiais
              </h1>
              <p className="text-gray-600 mt-1">
                Encontre materiais para reciclagem próximos a você
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                {items.length} itens encontrados
              </Badge>
              <Button
                onClick={loadMapItems}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar com filtros */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Raio de busca */}
                <div>
                  <Label htmlFor="radius">Raio de busca (km)</Label>
                  <Select
                    value={filters.radius.toString()}
                    onValueChange={(value) =>
                      handleFilterChange("radius", parseInt(value, 10))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 km</SelectItem>
                      <SelectItem value="10">10 km</SelectItem>
                      <SelectItem value="25">25 km</SelectItem>
                      <SelectItem value="50">50 km</SelectItem>
                      <SelectItem value="100">100 km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Material */}
                <div>
                  <Label htmlFor="material">Material</Label>
                  <Select
                    value={filters.materialId || ""}
                    onValueChange={(value) =>
                      handleFilterChange("materialId", value || undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os materiais" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os materiais</SelectItem>
                      {materials.map((material) => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Organização */}
                <div>
                  <Label htmlFor="organization">Organização</Label>
                  <Select
                    value={filters.organizationId || ""}
                    onValueChange={(value) =>
                      handleFilterChange("organizationId", value || undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as organizações" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as organizações</SelectItem>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                          {org.verified && " ✓"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Preço mínimo */}
                <div>
                  <Label htmlFor="minPrice">Preço mínimo (R$)</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="0"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "minPrice",
                        e.target.value ? parseFloat(e.target.value) : undefined,
                      )
                    }
                  />
                </div>

                {/* Preço máximo */}
                <div>
                  <Label htmlFor="maxPrice">Preço máximo (R$)</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="999999"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "maxPrice",
                        e.target.value ? parseFloat(e.target.value) : undefined,
                      )
                    }
                  />
                </div>

                {/* Botão limpar filtros */}
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>

            {/* Lista de itens */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Itens Encontrados</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }, (_, i) => (
                      <Skeleton
                        key={`skeleton-${Date.now()}-${i}`}
                        className="h-16 w-full"
                      />
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center text-red-600 py-4">{error}</div>
                ) : items.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    Nenhum item encontrado
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">
                              {item.title}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">
                              {item.material?.name ||
                                "Material não especificado"}
                            </p>
                            <div className="flex items-center mt-1">
                              <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500">
                                {item.distance.toFixed(1)} km
                              </span>
                            </div>
                          </div>
                          {item.price && (
                            <div className="text-right">
                              <span className="text-sm font-medium text-green-600">
                                R${" "}
                                {typeof item.price === "number"
                                  ? item.price.toFixed(2)
                                  : parseFloat(item.price || "0").toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Mapa e Carousel */}
          <div className="lg:col-span-3 space-y-6">
            {/* Mapa */}
            <Card>
              <CardContent className="p-0">
                <div className="h-[400px] w-full">
                  <MapComponent
                    center={mapCenter}
                    zoom={mapZoom}
                    height="400px"
                    onMapMove={handleMapMove}
                    items={items}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Carousel de Itens */}
            {items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Itens Encontrados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Carousel className="w-full">
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {items.map((item) => (
                        <CarouselItem
                          key={item.id}
                          className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                        >
                          <Card className="h-full">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                {/* Header do Card */}
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm line-clamp-2">
                                      {item.title}
                                    </h4>
                                    <p className="text-xs text-gray-600 mt-1">
                                      {item.material?.name ||
                                        "Material não especificado"}
                                    </p>
                                  </div>
                                  {item.price && (
                                    <div className="text-right">
                                      <span className="text-sm font-bold text-green-600">
                                        R${" "}
                                        {typeof item.price === "number"
                                          ? item.price.toFixed(2)
                                          : parseFloat(
                                              item.price || "0",
                                            ).toFixed(2)}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Descrição */}
                                {item.description && (
                                  <p className="text-xs text-gray-500 line-clamp-2">
                                    {item.description}
                                  </p>
                                )}

                                {/* Informações adicionais */}
                                <div className="space-y-2">
                                  <div className="flex items-center text-xs text-gray-500">
                                    <LocationIcon className="w-3 h-3 mr-1" />
                                    <span>
                                      {item.distance.toFixed(1)} km de distância
                                    </span>
                                  </div>

                                  {item.organization && (
                                    <div className="text-xs text-gray-500">
                                      <span className="font-medium">
                                        Organização:
                                      </span>{" "}
                                      {item.organization.name}
                                    </div>
                                  )}

                                  {item.creator && (
                                    <div className="text-xs text-gray-500">
                                      <span className="font-medium">
                                        Criado por:
                                      </span>{" "}
                                      {item.creator.name}
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {item.status}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      Qtd: {item.quantity}
                                    </span>
                                  </div>
                                </div>

                                {/* Botão de ação */}
                                <div className="pt-2">
                                  <Button
                                    size="sm"
                                    className="w-full"
                                    onClick={() => {
                                      setMapCenter([
                                        item.location.latitude,
                                        item.location.longitude,
                                      ]);
                                      setMapZoom(15);
                                    }}
                                  >
                                    <MapPin className="w-3 h-3 mr-1" />
                                    Ver no Mapa
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </CardContent>
              </Card>
            )}

            {/* Estado vazio */}
            {!isLoading && items.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum item encontrado
                  </h3>
                  <p className="text-gray-500">
                    Tente ajustar os filtros ou expandir o raio de busca.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
