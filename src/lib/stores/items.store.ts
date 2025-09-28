import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ItemImage {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
}

interface Material {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
}

interface Organization {
  id: string;
  name: string;
  verified: boolean;
}

interface User {
  id: string;
  name?: string | null;
  email: string;
}

interface Item {
  id: string;
  title: string;
  description?: string | null;
  price?: number | null;
  quantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  material?: Material | null;
  organization?: Organization | null;
  createdBy?: User | null;
  images: ItemImage[];
  distance?: number | null; // Para itens com filtro geográfico
}

interface ItemsState {
  // Estado
  items: Item[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  // Filtros
  filters: {
    query?: string;
    materialId?: string;
    organizationId?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    latitude?: number;
    longitude?: number;
    radius?: number;
  };

  // Actions
  setItems: (items: Item[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: Partial<ItemsState["pagination"]>) => void;
  setFilters: (filters: Partial<ItemsState["filters"]>) => void;
  loadItems: (filters?: Partial<ItemsState["filters"]>) => Promise<void>;
  createItem: (itemData: any) => Promise<Item | null>;
  updateItem: (id: string, itemData: Partial<Item>) => Promise<Item | null>;
  deleteItem: (id: string) => Promise<boolean>;
  reset: () => void;
}

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {},
};

export const useItemsStore = create<ItemsState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setItems: (items) => set({ items }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      setPagination: (pagination) =>
        set((state) => ({
          pagination: { ...state.pagination, ...pagination },
        })),

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      loadItems: async (newFilters) => {
        const { isLoading, filters } = get();

        // Evitar múltiplas chamadas simultâneas
        if (isLoading) return;

        set({ isLoading: true, error: null });

        try {
          // Combinar filtros existentes com novos filtros
          const combinedFilters = { ...filters, ...newFilters };

          // Construir query string
          const searchParams = new URLSearchParams();
          Object.entries(combinedFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              searchParams.append(key, value.toString());
            }
          });

          const response = await fetch(`/api/items?${searchParams.toString()}`);

          if (!response.ok) {
            throw new Error("Erro ao carregar itens");
          }

          const result = await response.json();

          set({
            items: result.data.items || [],
            pagination: result.data.pagination || initialState.pagination,
            filters: combinedFilters,
            isLoading: false,
          });
        } catch (error) {
          console.error("Erro ao carregar itens:", error);
          set({
            error: error instanceof Error ? error.message : "Erro desconhecido",
            isLoading: false,
          });
        }
      },

      createItem: async (itemData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch("/api/items", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(itemData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao criar item");
          }

          const result = await response.json();
          const newItem = result.data;

          // Adicionar o novo item à lista
          set((state) => ({
            items: [newItem, ...state.items],
            isLoading: false,
          }));

          return newItem;
        } catch (error) {
          console.error("Erro ao criar item:", error);
          set({
            error: error instanceof Error ? error.message : "Erro desconhecido",
            isLoading: false,
          });
          return null;
        }
      },

      updateItem: async (id, itemData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/items/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(itemData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao atualizar item");
          }

          const result = await response.json();
          const updatedItem = result.data;

          // Atualizar o item na lista
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id ? updatedItem : item,
            ),
            isLoading: false,
          }));

          return updatedItem;
        } catch (error) {
          console.error("Erro ao atualizar item:", error);
          set({
            error: error instanceof Error ? error.message : "Erro desconhecido",
            isLoading: false,
          });
          return null;
        }
      },

      deleteItem: async (id) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/items/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao deletar item");
          }

          // Remover o item da lista
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
            isLoading: false,
          }));

          return true;
        } catch (error) {
          console.error("Erro ao deletar item:", error);
          set({
            error: error instanceof Error ? error.message : "Erro desconhecido",
            isLoading: false,
          });
          return false;
        }
      },

      reset: () => set(initialState),
    }),
    { name: "items-store" },
  ),
);
