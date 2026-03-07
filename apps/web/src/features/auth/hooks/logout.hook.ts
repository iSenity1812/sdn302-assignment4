import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../api/auth.api";
import { authQueryKeys } from "../query-keys/auth.query-key";
import { useAuthStore } from "@/stores/auth.store";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  return useMutation({
    mutationFn: () => logout({ refreshToken: refreshToken ?? "" }),
    onSettled: () => {
      clearTokens();
      queryClient.removeQueries({
        queryKey: authQueryKeys.me(),
      });
    },
  });
};
