import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateQuestion } from "../api/question.api";
import { questionQueryKeys } from "../query-keys/question.query-key";
import { QuestionUpdateDto } from "../types/question-update.dto";

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: QuestionUpdateDto }) =>
      updateQuestion(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: questionQueryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: questionQueryKeys.all,
      });
    },
  });
};
