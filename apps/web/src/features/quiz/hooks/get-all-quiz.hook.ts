import { useQuery } from "@tanstack/react-query";
import { getAllQuizzes } from "../api/quiz.api";
import { quizQueryKeys } from "../query-keys/quiz.query-key";

export const useGetAllQuizzes = () => {
  return useQuery({
    queryKey: quizQueryKeys.details(),
    queryFn: () => getAllQuizzes(),
  });
};
