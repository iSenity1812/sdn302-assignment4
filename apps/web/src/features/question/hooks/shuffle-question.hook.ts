import { useQuery } from "@tanstack/react-query";
import { shuffleQuestions } from "../api/question.api";
import { questionQueryKeys } from "../query-keys/question.query-key";
import { QuestionShuffleQuery } from "../types/question-shuffle.query";

export const useShuffleQuestions = (params: QuestionShuffleQuery) => {
  return useQuery({
    queryKey: questionQueryKeys.shuffle(params),
    queryFn: () => shuffleQuestions(params),
    enabled: params.count > 0,
  });
};
