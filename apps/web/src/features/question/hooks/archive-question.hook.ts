import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveQuestion } from "../api/question.api";
import { questionQueryKeys } from "../query-keys/question.query-key";

export const useArchiveQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveQuestion(id),
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
