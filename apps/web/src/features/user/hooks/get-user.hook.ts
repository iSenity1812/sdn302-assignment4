import { useQuery } from "@tanstack/react-query";
import { userQueryKeys } from "../query-keys/user.query-key";
import { getUserById } from "../api/user.api";

export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: userQueryKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};
