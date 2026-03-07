import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createQuiz } from "../api/quiz.api";
import { quizQueryKeys } from "../query-keys/quiz.query-key";
import { QuizCreateDto } from "../types/quiz-create.dto";

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: QuizCreateDto) => createQuiz(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: quizQueryKeys.all,
      });
    },
  });
};
