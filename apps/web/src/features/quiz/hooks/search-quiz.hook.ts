import { useQuery } from "@tanstack/react-query";
import { searchQuizzes } from "../api/quiz.api";
import { quizQueryKeys } from "../query-keys/quiz.query-key";
import { QuizSearchQuery } from "../types/quiz-search.query";

export const useSearchQuizzes = (params?: QuizSearchQuery) => {
  return useQuery({
    queryKey: quizQueryKeys.search(params),
    queryFn: () => searchQuizzes(params),
  });
};
