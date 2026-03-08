import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeQuestion } from "../api/question.api";
import { questionQueryKeys } from "../query-keys/question.query-key";

export const useRemoveQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeQuestion(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: questionQueryKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: questionQueryKeys.all,
      });
    },
  });
};
