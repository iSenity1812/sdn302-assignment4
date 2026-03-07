import { useQuery } from "@tanstack/react-query";
import { getQuizById } from "../api/quiz.api";
import { quizQueryKeys } from "../query-keys/quiz.query-key";

export const useGetQuiz = (id: string) => {
  return useQuery({
    queryKey: quizQueryKeys.detail(id),
    queryFn: () => getQuizById(id),
    enabled: !!id,
  });
};
