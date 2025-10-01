import { z } from "zod";

// Schema para validação dos parâmetros de busca no mapa
const MapItemsParamsSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(0.1).max(100).default(10),
  materialId: z.string().optional(),
  organizationId: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  status: z.enum(["ACTIVE", "RESERVED", "SOLD", "COLLECTED"]).optional(),
});

export type MapItemsParams = z.infer<typeof MapItemsParamsSchema>;

// Interface para item do mapa
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

// Interface para resposta da API
export interface MapItemsResponse {
  success: boolean;
  data: {
    items: MapItem[];
    center: {
      latitude: number;
      longitude: number;
    };
    radius: number;
    total: number;
  };
  error?: string;
}

/**
 * Busca itens geo-localizados para exibição no mapa
 */
export async function getMapItems(
  params: MapItemsParams,
): Promise<MapItemsResponse> {
  try {
    // Validar parâmetros
    const validatedParams = MapItemsParamsSchema.parse(params);

    // Construir query string
    const searchParams = new URLSearchParams();
    searchParams.set("latitude", validatedParams.latitude.toString());
    searchParams.set("longitude", validatedParams.longitude.toString());
    searchParams.set("radius", validatedParams.radius.toString());

    if (validatedParams.materialId) {
      searchParams.set("materialId", validatedParams.materialId);
    }

    if (validatedParams.organizationId) {
      searchParams.set("organizationId", validatedParams.organizationId);
    }

    if (validatedParams.minPrice !== undefined) {
      searchParams.set("minPrice", validatedParams.minPrice.toString());
    }

    if (validatedParams.maxPrice !== undefined) {
      searchParams.set("maxPrice", validatedParams.maxPrice.toString());
    }

    if (validatedParams.status) {
      searchParams.set("status", validatedParams.status);
    }

    const response = await fetch(`/api/items/map?${searchParams.toString()}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao buscar itens do mapa");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar itens do mapa:", error);
    return {
      success: false,
      data: {
        items: [],
        center: { latitude: 0, longitude: 0 },
        radius: 10,
        total: 0,
      },
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Busca um item específico por ID
 */
export async function getItemById(id: string) {
  try {
    const response = await fetch(`/api/items/${id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao buscar item");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar item:", error);
    throw error;
  }
}
