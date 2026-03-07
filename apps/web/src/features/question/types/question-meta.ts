import { ApiMeta } from "@/shared/types/http/api-meta";

export interface QuestionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface QuestionPaginatedMeta extends ApiMeta {
  pagination: QuestionPagination;
}
