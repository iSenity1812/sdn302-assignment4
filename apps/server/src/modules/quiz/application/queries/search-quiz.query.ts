import {
  PaginationQueryInput,
  PaginationQueryParams,
} from "@/building-blocks/application/pagination-query";
import { QuizStatus } from "../../domain/value-objects/quiz-status.vo";

interface QuizSearchFilters {
  createdBy?: string;
  status?: QuizStatus;
}

export type SearchQuizParams = PaginationQueryInput & QuizSearchFilters;

export type SearchQuizQuery = PaginationQueryParams & QuizSearchFilters;
