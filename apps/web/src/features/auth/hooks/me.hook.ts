import { useQuery } from "@tanstack/react-query";
import { me } from "../api/auth.api";
import { authQueryKeys } from "../query-keys/auth.query-key";
import { useAuthStore } from "@/stores/auth.store";

export const useMe = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: authQueryKeys.me(),
    queryFn: () => me(),
    enabled: isAuthenticated,
  });
};
