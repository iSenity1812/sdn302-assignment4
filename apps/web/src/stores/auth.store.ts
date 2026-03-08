import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  accessToken?: string;
  refreshToken?: string;
  isAuthenticated: boolean;

  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: undefined,
      refreshToken: undefined,
      isAuthenticated: false,

      setTokens: (accessToken: string, refreshToken: string) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      clearTokens: () =>
        set({
          accessToken: undefined,
          refreshToken: undefined,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
