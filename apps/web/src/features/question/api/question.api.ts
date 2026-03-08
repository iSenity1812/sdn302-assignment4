import { request } from "@/infra/http/fetcher";
import { questionEndpoints } from "@/infra/http/endpoint/question.endpoint";
import { ApiResponse } from "@/shared/types/http/api-response";
import { QuestionCreateDto } from "../types/question-create.dto";
import { QuestionDto } from "../types/question.dto";
import { QuestionPaginatedMeta } from "../types/question-meta";
import { QuestionArchiveResultDto } from "../types/question-result.dto";
import { QuestionSearchQuery } from "../types/question-search.query";
import { QuestionShuffleQuery } from "../types/question-shuffle.query";
import { QuestionUpdateDto } from "../types/question-update.dto";

export const createQuestion = (data: QuestionCreateDto) => {
  return request<ApiResponse<QuestionDto>>({
    url: questionEndpoints.create,
    method: "POST",
    data,
  });
};

export const searchQuestions = (params?: QuestionSearchQuery) => {
  return request<
    ApiResponse<QuestionDto[], string, unknown, QuestionPaginatedMeta>
  >({
    url: questionEndpoints.search,
    params,
  });
};

export const getAllQuestions = () => {
  return request<ApiResponse<QuestionDto[]>>({
    url: questionEndpoints.getAll,
  });
};

export const shuffleQuestions = (params: QuestionShuffleQuery) => {
  return request<
    ApiResponse<QuestionDto[], string, unknown, QuestionPaginatedMeta>
  >({
    url: questionEndpoints.shuffle,
    params,
  });
};

export const getQuestionById = (id: string) => {
  return request<ApiResponse<QuestionDto | null>>({
    url: questionEndpoints.getById(id),
  });
};

export const updateQuestion = (id: string, data: QuestionUpdateDto) => {
  return request<ApiResponse<QuestionDto>>({
    url: questionEndpoints.update(id),
    method: "PUT",
    data,
  });
};

export const removeQuestion = (id: string) => {
  return request<ApiResponse<void>>({
    url: questionEndpoints.remove(id),
    method: "DELETE",
  });
};

export const archiveQuestion = (id: string) => {
  return request<ApiResponse<QuestionArchiveResultDto>>({
    url: questionEndpoints.archive(id),
    method: "PATCH",
  });
};
