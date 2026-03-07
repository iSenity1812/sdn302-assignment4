import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addQuizQuestions } from "../api/quiz.api";
import { quizQueryKeys } from "../query-keys/quiz.query-key";
import { QuizAddQuestionsDto } from "../types/quiz-add-questions.dto";

export const useAddQuizQuestions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: QuizAddQuestionsDto }) =>
      addQuizQuestions(id, data),
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
