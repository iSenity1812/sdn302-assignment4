import { useQuery } from "@tanstack/react-query";
import { getQuestionById } from "../api/question.api";
import { questionQueryKeys } from "../query-keys/question.query-key";

export const useGetQuestion = (id: string) => {
  return useQuery({
    queryKey: questionQueryKeys.detail(id),
    queryFn: () => getQuestionById(id),
    enabled: !!id,
  });
};
