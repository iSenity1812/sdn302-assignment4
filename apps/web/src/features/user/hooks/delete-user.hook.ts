import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../api/user.api";
import { userQueryKeys } from "../query-keys/user.query-key";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),

    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: userQueryKeys.detail(id),
      });
    },
  });
};
