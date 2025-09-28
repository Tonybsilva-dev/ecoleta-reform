import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface DashboardStats {
  totalItems: number;
  totalTransactions: number;
  ecoPoints: number;
}

interface DashboardItem {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  quantity: number;
  status: string;
  createdAt: string;
  material?: {
    id: string;
    name: string;
  } | null;
  organization?: {
    id: string;
    name: string;
    verified: boolean;
  } | null;
  images: Array<{
    id: string;
    url: string;
    altText: string;
    isPrimary: boolean;
  }>;
}

interface DashboardTransaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface DashboardState {
  // Estado
  isLoading: boolean;
  error: string | null;
  stats: DashboardStats;
  items: DashboardItem[];
  transactions: DashboardTransaction[];

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setStats: (stats: DashboardStats) => void;
  setItems: (items: DashboardItem[]) => void;
  setTransactions: (transactions: DashboardTransaction[]) => void;
  loadDashboardData: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  isLoading: false,
  error: null,
  stats: {
    totalItems: 0,
    totalTransactions: 0,
    ecoPoints: 0,
  },
  items: [],
  transactions: [],
};

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      setStats: (stats) => set({ stats }),

      setItems: (items) => set({ items }),

      setTransactions: (transactions) => set({ transactions }),

      loadDashboardData: async () => {
        const { isLoading } = get();

        // Evitar múltiplas chamadas simultâneas
        if (isLoading) return;

        set({ isLoading: true, error: null });

        try {
          // Simular delay de carregamento
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // TODO: Implementar chamadas reais para API
          // const [itemsResponse, transactionsResponse, statsResponse] = await Promise.all([
          //   fetch("/api/items"),
          //   fetch("/api/transactions"),
          //   fetch("/api/dashboard/stats"),
          // ]);

          // Simular dados do dashboard
          set({
            stats: {
              totalItems: 0,
              totalTransactions: 0,
              ecoPoints: 0,
            },
            items: [],
            transactions: [],
            isLoading: false,
          });
        } catch (error) {
          console.error("Erro ao carregar dados do dashboard:", error);
          set({
            error: error instanceof Error ? error.message : "Erro desconhecido",
            isLoading: false,
          });
        }
      },

      reset: () => set(initialState),
    }),
    { name: "dashboard-store" },
  ),
);
