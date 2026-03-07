import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeQuizQuestion } from "../api/quiz.api";
import { quizQueryKeys } from "../query-keys/quiz.query-key";

export const useRemoveQuizQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      questionId,
    }: {
      quizId: string;
      questionId: string;
    }) => removeQuizQuestion(quizId, questionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: quizQueryKeys.detail(variables.quizId),
      });
      queryClient.invalidateQueries({
        queryKey: quizQueryKeys.all,
      });
    },
  });
};
