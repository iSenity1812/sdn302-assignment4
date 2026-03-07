import { ApiMeta } from "@/shared/types/http/api-meta";

export interface QuizPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface QuizPaginatedMeta extends ApiMeta {
  pagination: QuizPagination;
}
