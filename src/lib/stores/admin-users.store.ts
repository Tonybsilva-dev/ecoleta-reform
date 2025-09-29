import { create } from "zustand";

type Role = "ADMIN" | "MEMBER" | "OWNER";
type UserType = "CITIZEN" | "COLLECTOR" | "COMPANY" | "NGO";

export interface AdminUserRow {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: string;
  profile: { role: Role | null; userType: UserType; isActive: boolean } | null;
}

interface AdminUsersState {
  users: AdminUserRow[];
  total: number;
  page: number;
  pageSize: number;
  query: string;
  loading: boolean;
  error: string | null;
  isUpdatingId: string | null;
  setQuery: (q: string) => void;
  setPage: (p: number) => void;
  fetchUsers: () => Promise<void>;
  updateUser: (
    userId: string,
    updates: Partial<{ role: Role | null; isActive: boolean }>,
  ) => Promise<boolean>;
}

export const useAdminUsersStore = create<AdminUsersState>((set, get) => ({
  users: [],
  total: 0,
  page: 1,
  pageSize: 10,
  query: "",
  loading: false,
  error: null,
  isUpdatingId: null,
  setQuery: (q) => set({ query: q }),
  setPage: (p) => set({ page: p }),
  fetchUsers: async () => {
    const { page, pageSize, query } = get();
    set({ loading: true, error: null });
    try {
      const r = await fetch(
        `/api/user?page=${page}&pageSize=${pageSize}&q=${encodeURIComponent(query)}`,
      );
      if (!r.ok) throw new Error("Falha ao carregar usuários");
      const json = (await r.json()) as {
        data: AdminUserRow[];
        pagination: { total: number };
      };
      set({ users: json.data, total: json.pagination.total });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Erro desconhecido";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
  updateUser: async (userId, updates) => {
    const prevUsers = get().users;
    try {
      set({ isUpdatingId: userId, error: null });

      // Otimista: atualizar usuário no estado local
      if (updates.role !== undefined || typeof updates.isActive === "boolean") {
        set({
          users: prevUsers.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  profile: {
                    userType: u.profile?.userType ?? "CITIZEN",
                    role:
                      updates.role !== undefined
                        ? updates.role
                        : (u.profile?.role ?? null),
                    isActive:
                      typeof updates.isActive === "boolean"
                        ? updates.isActive
                        : !!u.profile?.isActive,
                  },
                }
              : u,
          ),
        });
      }

      // Chamar API
      const res = await fetch(`/api/user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...updates }),
      });
      if (!res.ok) throw new Error("Falha ao atualizar usuário");
      // Mantemos estado otimista; poderíamos reconciliar com response se necessário
      return true;
    } catch (e) {
      // Reverter estado em caso de falha
      set({ users: prevUsers });
      const message = e instanceof Error ? e.message : "Erro desconhecido";
      set({ error: message });
      return false;
    } finally {
      set({ isUpdatingId: null });
    }
  },
}));
