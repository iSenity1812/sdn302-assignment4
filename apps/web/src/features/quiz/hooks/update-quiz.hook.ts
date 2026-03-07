import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateQuiz } from "../api/quiz.api";
import { quizQueryKeys } from "../query-keys/quiz.query-key";
import { QuizUpdateDto } from "../types/quiz-update.dto";

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: QuizUpdateDto }) =>
      updateQuiz(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: quizQueryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: quizQueryKeys.all,
      });
    },
  });
};
