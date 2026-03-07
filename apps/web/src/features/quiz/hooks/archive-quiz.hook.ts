import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveQuiz } from "../api/quiz.api";
import { quizQueryKeys } from "../query-keys/quiz.query-key";

export const useArchiveQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveQuiz(id),
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
