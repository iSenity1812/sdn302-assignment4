import {
  PaginationQueryInput,
  PaginationQueryParams,
} from "@/building-blocks/application/pagination-query";
import { Difficulty } from "../../domain/value-objects/difficulty.vo";
import { QuestionStatus } from "../../domain/value-objects/question-status.vo";

interface QuestionSearchFilters {
  difficulty?: Difficulty;
  tags?: string[];
  status?: QuestionStatus;
  authorId?: string;
}

export type QuestionSearchParams = PaginationQueryInput & QuestionSearchFilters;

export type QuestionSearchQuery = PaginationQueryParams & QuestionSearchFilters;
