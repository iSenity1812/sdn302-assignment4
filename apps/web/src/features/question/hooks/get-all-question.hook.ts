import { useQuery } from "@tanstack/react-query";
import { getAllQuestions } from "../api/question.api";
import { questionQueryKeys } from "../query-keys/question.query-key";

export const useGetAllQuestions = () => {
  return useQuery({
    queryKey: questionQueryKeys.details(),
    queryFn: () => getAllQuestions(),
  });
};
