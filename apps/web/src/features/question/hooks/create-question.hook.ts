import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createQuestion } from "../api/question.api";
import { QuestionCreateDto } from "../types/question-create.dto";
import { questionQueryKeys } from "../query-keys/question.query-key";

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: QuestionCreateDto) => createQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionQueryKeys.all,
      });
    },
  });
};
