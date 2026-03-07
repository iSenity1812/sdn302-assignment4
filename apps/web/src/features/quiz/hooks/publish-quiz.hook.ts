import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publishQuiz } from "../api/quiz.api";
import { quizQueryKeys } from "../query-keys/quiz.query-key";

export const usePublishQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => publishQuiz(id),
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
