import { useQuery } from "@tanstack/react-query";
import { searchQuestions } from "../api/question.api";
import { questionQueryKeys } from "../query-keys/question.query-key";
import { QuestionSearchQuery } from "../types/question-search.query";

export const useSearchQuestions = (params?: QuestionSearchQuery) => {
  return useQuery({
    queryKey: questionQueryKeys.search(params),
    queryFn: () => searchQuestions(params),
  });
};
