import type { UserType } from "@prisma/client";
import { create } from "zustand";

interface OnboardingState {
  selectedType: UserType | null;
  isLoading: boolean;
  error: string | null;
  isRedirecting: boolean;

  // Actions
  setSelectedType: (type: UserType | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setRedirecting: (redirecting: boolean) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  selectedType: null,
  isLoading: false,
  error: null,
  isRedirecting: false,

  setSelectedType: (type) => {
    set({ selectedType: type, error: null });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error, isLoading: false });
  },

  setRedirecting: (redirecting) => {
    set({ isRedirecting: redirecting });
  },

  reset: () => {
    set({
      selectedType: null,
      isLoading: false,
      error: null,
      isRedirecting: false,
    });
  },
}));
