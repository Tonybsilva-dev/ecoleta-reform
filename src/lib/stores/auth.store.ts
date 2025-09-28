import type { UserType } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  hasSelectedRole: boolean;
  userType?: UserType;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasSelectedRole: boolean;
  userType: UserType | null;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updateUserRole: (userType: UserType) => void;
  clearAuth: () => void;
  setHasSelectedRole: (hasSelected: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hasSelectedRole: false,
      userType: null,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          hasSelectedRole: user?.hasSelectedRole || false,
          userType: user?.userType || null,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      updateUserRole: (userType) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              userType,
              hasSelectedRole: true,
            },
            hasSelectedRole: true,
            userType,
          });
        }
      },

      setHasSelectedRole: (hasSelected) => {
        set({ hasSelectedRole: hasSelected });
      },

      clearAuth: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          hasSelectedRole: false,
          userType: null,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        hasSelectedRole: state.hasSelectedRole,
        userType: state.userType,
      }),
    },
  ),
);
