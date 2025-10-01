"use client";

import {
  ArrowLeft,
  DollarSign,
  Filter,
  Gift,
  MapPin,
  Package,
  RefreshCw,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_NAME } from "@/lib";

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

// Tipos mínimos IBGE
interface IBGEUF {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGECity {
  id: number;
  nome: string;
}

export default function PublicMapPage() {
  const [items, setItems] = useState<MapItem[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [mapZoom, setMapZoom] = useState(13);
  const [filters, setFilters] = useState<MapFilters>({
    radius: 10,
  });

  // UF / Cidade (IBGE)
  const [ufs, setUfs] = useState<IBGEUF[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [selectedUf, setSelectedUf] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [isLoadingUfs, setIsLoadingUfs] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [skipNextLoad, setSkipNextLoad] = useState(false);

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

  // Carregar UFs do IBGE
  useEffect(() => {
    let mounted = true;
    setIsLoadingUfs(true);
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((r) => r.json())
      .then((data: IBGEUF[]) => {
        if (!mounted) return;
        // Ordenar por nome para melhor UX
        const sorted = data.sort((a, b) => a.nome.localeCompare(b.nome));
        setUfs(sorted);
      })
      .catch((err) => {
        console.error("Erro ao carregar UFs (IBGE):", err);
      })
      .finally(() => setIsLoadingUfs(false));
    return () => {
      mounted = false;
    };
  }, []);

  // Carregar cidades quando UF muda
  useEffect(() => {
    let mounted = true;
    if (!selectedUf) {
      setCities([]);
      setSelectedCity("");
      return;
    }
    setIsLoadingCities(true);
    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`,
    )
      .then((r) => r.json())
      .then((data: IBGECity[]) => {
        if (!mounted) return;
        const sorted = data.sort((a, b) => a.nome.localeCompare(b.nome));
        setCities(sorted);
      })
      .catch((err) => {
        console.error("Erro ao carregar cidades (IBGE):", err);
        setCities([]);
      })
      .finally(() => setIsLoadingCities(false));
    return () => {
      mounted = false;
    };
  }, [selectedUf]);

  // Ao selecionar cidade, centralizar mapa via Nominatim
  useEffect(() => {
    const centerByCity = async () => {
      if (!selectedUf || !selectedCity) return;
      try {
        const q = encodeURIComponent(`${selectedCity}, ${selectedUf}, Brasil`);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`,
          { headers: { "Accept-Language": "pt-BR" } },
        );
        const json: Array<{ lat: string; lon: string }> = await res.json();
        if (json[0]) {
          const lat = parseFloat(json[0].lat);
          const lon = parseFloat(json[0].lon);
          setMapCenter([lat, lon]);
          setMapZoom(12);
        }
      } catch (e) {
        console.error("Falha ao geocodificar cidade:", e);
      }
    };
    void centerByCity();
  }, [selectedUf, selectedCity]);

  // Geolocalização inicial do usuário
  useEffect(() => {
    let mounted = true;
    if (!mapCenter && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!mounted) return;
          setMapCenter([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          if (!mounted) return;
          setMapCenter([-23.5505, -46.6333]); // fallback SP
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 },
      );
    } else if (!mapCenter) {
      setMapCenter([-23.5505, -46.6333]);
    }
    return () => {
      mounted = false;
    };
  }, [mapCenter]);

  // Carregar itens do mapa
  const loadMapItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (skipNextLoad) {
        setSkipNextLoad(false);
        setIsLoading(false);
        return;
      }
      const center = mapCenter ?? ([-23.5505, -46.6333] as [number, number]);
      const params = new URLSearchParams({
        latitude: center[0].toString(),
        longitude: center[1].toString(),
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
  }, [mapCenter, filters, skipNextLoad]);

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
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header compacto */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold text-2xl text-gray-900">{APP_NAME}</h1>
              <p className="text-gray-600 text-sm">
                Veja como funciona nossa plataforma de economia circular
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-sm">
              {items.length} itens
            </Badge>
            <Select
              value={filters.radius.toString()}
              onValueChange={(value) =>
                handleFilterChange("radius", parseInt(value, 10))
              }
            >
              <SelectTrigger className="h-8 w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[10000]">
                <SelectItem value="5">5km</SelectItem>
                <SelectItem value="10">10km</SelectItem>
                <SelectItem value="25">25km</SelectItem>
                <SelectItem value="50">50km</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={loadMapItems}
              disabled={isLoading}
              variant="outline"
              size="icon"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
            <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Filtros</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Material */}
                  <div>
                    <label
                      htmlFor="material-filter"
                      className="font-medium text-gray-700 text-sm"
                    >
                      Material
                    </label>
                    <Select
                      value={filters.materialId || "all"}
                      onValueChange={(value) =>
                        handleFilterChange(
                          "materialId",
                          value === "all" ? undefined : value,
                        )
                      }
                    >
                      <SelectTrigger id="material-filter" className="mt-1">
                        <SelectValue placeholder="Selecione o material" />
                      </SelectTrigger>
                      <SelectContent className="z-[10001] max-h-72 overflow-y-auto">
                        <SelectItem value="all">Todos</SelectItem>
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
                    <label
                      htmlFor="organization-filter"
                      className="font-medium text-gray-700 text-sm"
                    >
                      Organização
                    </label>
                    <Select
                      value={filters.organizationId || "all"}
                      onValueChange={(value) =>
                        handleFilterChange(
                          "organizationId",
                          value === "all" ? undefined : value,
                        )
                      }
                    >
                      <SelectTrigger id="organization-filter" className="mt-1">
                        <SelectValue placeholder="Selecione a organização" />
                      </SelectTrigger>
                      <SelectContent className="z-[10001] max-h-72 overflow-y-auto">
                        <SelectItem value="all">Todas</SelectItem>
                        {organizations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* UF (Estado) */}
                  <div>
                    <label
                      htmlFor="uf-filter"
                      className="font-medium text-gray-700 text-sm"
                    >
                      Estado
                    </label>
                    <Select
                      value={selectedUf || ""}
                      onValueChange={(value) => {
                        setSelectedUf(value);
                        setSelectedCity("");
                      }}
                    >
                      <SelectTrigger
                        id="uf-filter"
                        className="mt-1"
                        disabled={isLoadingUfs}
                      >
                        <SelectValue
                          placeholder={
                            isLoadingUfs
                              ? "Carregando UFs..."
                              : "Selecione o estado"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="z-[10001] max-h-72 overflow-y-auto">
                        {ufs.map((uf) => (
                          <SelectItem key={uf.id} value={uf.sigla}>
                            {uf.nome} ({uf.sigla})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cidade */}
                  <div>
                    <label
                      htmlFor="city-filter"
                      className="font-medium text-gray-700 text-sm"
                    >
                      Cidade
                    </label>
                    <Select
                      value={selectedCity || ""}
                      onValueChange={(value) => setSelectedCity(value)}
                    >
                      <SelectTrigger
                        id="city-filter"
                        className="mt-1"
                        disabled={!selectedUf || isLoadingCities}
                      >
                        <SelectValue
                          placeholder={
                            !selectedUf
                              ? "Selecione um estado"
                              : isLoadingCities
                                ? "Carregando cidades..."
                                : "Selecione a cidade"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="z-[10001] max-h-72 overflow-y-auto">
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.nome}>
                            {city.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Preço */}
                  <div>
                    <label
                      htmlFor="min-price-filter"
                      className="font-medium text-gray-700 text-sm"
                    >
                      Faixa de Preço
                    </label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Input
                        id="min-price-filter"
                        placeholder="Min R$"
                        className="flex-1"
                        value={filters.minPrice || ""}
                        onChange={(e) =>
                          handleFilterChange(
                            "minPrice",
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          )
                        }
                      />
                      <span className="text-gray-400">-</span>
                      <Input
                        id="max-price-filter"
                        placeholder="Max R$"
                        className="flex-1"
                        value={filters.maxPrice || ""}
                        onChange={(e) =>
                          handleFilterChange(
                            "maxPrice",
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={clearFilters}>
                      Limpar Filtros
                    </Button>
                    <Button onClick={() => setIsFiltersOpen(false)}>
                      Aplicar Filtros
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Layout principal - Lista à esquerda, Mapa à direita */}
      <div className="flex flex-1 overflow-hidden">
        {/* Lista de itens - 3/5 da tela (estilo LinkedIn) */}
        <div className="w-3/5 border-r bg-gray-50">
          {/* Lista de itens - estilo LinkedIn */}
          <div className="h-full overflow-y-auto">
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
              <div className="divide-y p-2">
                {items.map((item) => {
                  const initials = (
                    item.organization?.name ||
                    item.creator?.name ||
                    "?"
                  )
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();
                  const price =
                    item.price !== null && item.price !== undefined
                      ? new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(item.price))
                      : null;
                  // Tag de tipo e ícone (aproximação até existir campo dedicado)
                  const isSale =
                    item.price !== null &&
                    item.price !== undefined &&
                    Number(item.price) > 0;
                  const TypeIcon = isSale ? DollarSign : Gift; // fallback Doação
                  const typeLabel = isSale ? "Venda" : "Doação";
                  const typeColor = isSale ? "text-green-600" : "text-pink-600";
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className="relative flex w-full items-start gap-3 rounded-lg p-3 text-left hover:bg-white"
                      onClick={() => {
                        setSkipNextLoad(true);
                        setMapCenter([
                          item.location.latitude,
                          item.location.longitude,
                        ]);
                        setMapZoom(15);
                      }}
                    >
                      {/* Avatar */}
                      <div className="mt-0.5 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 font-semibold text-gray-600">
                        {initials}
                      </div>
                      {/* Conteúdo */}
                      <div className="min-w-0 flex-1">
                        {/* Nome Pessoa/Organização */}
                        <div className="flex items-center justify-between">
                          <h4 className="truncate font-medium text-gray-900">
                            {item.organization?.name ||
                              item.creator?.name ||
                              "Anunciante"}
                          </h4>
                          {price && (
                            <span className="ml-2 shrink-0 font-semibold text-green-600 text-sm">
                              {price}
                            </span>
                          )}
                        </div>
                        {/* Distância, Material e Quantidade */}
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-4 text-gray-500 text-xs">
                          <span className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {item.distance.toFixed(1)} km
                          </span>
                          {item.material?.name && (
                            <span>{item.material.name}</span>
                          )}
                          <span>Qtd: {item.quantity}</span>
                        </div>
                        {/* Descrição */}
                        {item.description && (
                          <p className="mt-1 line-clamp-2 text-gray-600 text-xs">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {/* Tag de tipo (com ícone e cor) */}
                      <span className="pointer-events-none absolute right-3 bottom-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs shadow">
                        <TypeIcon className={`h-3.5 w-3.5 ${typeColor}`} />
                        <span className="text-gray-700">{typeLabel}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Mapa - 2/5 da tela (maior) */}
        <div className="relative z-0 w-2/5">
          <div className="h-full">
            {mapCenter && (
              <MapComponent
                center={mapCenter}
                zoom={mapZoom}
                height="100%"
                onMapMove={handleMapMove}
                items={items}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
