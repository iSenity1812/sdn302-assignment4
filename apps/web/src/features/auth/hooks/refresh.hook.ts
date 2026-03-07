import { useMutation } from "@tanstack/react-query";
import { refresh } from "../api/auth.api";
import { useAuthStore } from "@/stores/auth.store";

export const useRefresh = () => {
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: (refreshToken: string) => refresh(refreshToken),
    onSuccess: (response) => {
      if (!response.success) {
        return;
      }

      const { accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
    },
  });
};
