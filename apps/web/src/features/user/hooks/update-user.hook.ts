import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserDto } from "../types/user.dto";
import { updateUser } from "../api/user.api";
import { userQueryKeys } from "../query-keys/user.query-key";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserDto> }) =>
      updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.detail(variables.id),
      });
    },
  });
};
