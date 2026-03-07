import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../api/auth.api";
import { AuthLoginDto } from "../types/auth-login.dto";
import { useAuthStore } from "@/stores/auth.store";
import { authQueryKeys } from "../query-keys/auth.query-key";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: (data: AuthLoginDto) => login(data),
    onSuccess: (response) => {
      if (!response.success) {
        return;
      }

      const { accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
      queryClient.invalidateQueries({
        queryKey: authQueryKeys.me(),
      });
    },
  });
};
