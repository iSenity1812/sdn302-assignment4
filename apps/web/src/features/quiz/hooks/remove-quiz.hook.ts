import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeQuiz } from "../api/quiz.api";
import { quizQueryKeys } from "../query-keys/quiz.query-key";

export const useRemoveQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeQuiz(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: quizQueryKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: quizQueryKeys.all,
      });
    },
  });
};
