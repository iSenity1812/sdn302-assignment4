import { request } from "@/infra/http/fetcher";
import { quizEndpoints } from "@/infra/http/endpoint/quiz.endpoint";
import { ApiResponse } from "@/shared/types/http/api-response";
import { QuizAddQuestionsDto } from "../types/quiz-add-questions.dto";
import { QuizCreateDto } from "../types/quiz-create.dto";
import { QuizDto } from "../types/quiz.dto";
import { QuizPaginatedMeta } from "../types/quiz-meta";
import { QuizArchiveResultDto } from "../types/quiz-result.dto";
import { QuizSearchQuery } from "../types/quiz-search.query";
import { QuizUpdateDto } from "../types/quiz-update.dto";

export const createQuiz = (data: QuizCreateDto) => {
  return request<ApiResponse<QuizDto>>({
    url: quizEndpoints.create,
    method: "POST",
    data,
  });
};

export const searchQuizzes = (params?: QuizSearchQuery) => {
  return request<ApiResponse<QuizDto[], string, unknown, QuizPaginatedMeta>>({
    url: quizEndpoints.search,
    params,
  });
};

export const getAllQuizzes = () => {
  return request<ApiResponse<QuizDto[]>>({
    url: quizEndpoints.getAll,
  });
};

export const getQuizById = (id: string) => {
  return request<ApiResponse<QuizDto | null>>({
    url: quizEndpoints.getById(id),
  });
};

export const updateQuiz = (id: string, data: QuizUpdateDto) => {
  return request<ApiResponse<QuizDto>>({
    url: quizEndpoints.update(id),
    method: "PUT",
    data,
  });
};

export const addQuizQuestions = (id: string, data: QuizAddQuestionsDto) => {
  return request<ApiResponse<QuizDto>>({
    url: quizEndpoints.addQuestions(id),
    method: "POST",
    data,
  });
};

export const removeQuizQuestion = (quizId: string, questionId: string) => {
  return request<ApiResponse<QuizDto>>({
    url: quizEndpoints.removeQuestion(quizId, questionId),
    method: "DELETE",
  });
};

export const publishQuiz = (id: string) => {
  return request<ApiResponse<QuizDto>>({
    url: quizEndpoints.publish(id),
    method: "PATCH",
  });
};

export const archiveQuiz = (id: string) => {
  return request<ApiResponse<QuizArchiveResultDto>>({
    url: quizEndpoints.archive(id),
    method: "PATCH",
  });
};

export const removeQuiz = (id: string) => {
  return request<ApiResponse<void>>({
    url: quizEndpoints.remove(id),
    method: "DELETE",
  });
};
