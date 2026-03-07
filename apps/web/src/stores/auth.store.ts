import { create } from "zustand";

type AuthStore = {
  accessToken?: string;
  refreshToken?: string;
  isAuthenticated: boolean;

  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
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
}));
