import {
  PaginationQueryInput,
  PaginationQueryParams,
} from "@/building-blocks/application/pagination-query";
import { Difficulty } from "../../domain/value-objects/difficulty.vo";

interface RandomQuestionFilters {
  count: number;
  difficulty?: Difficulty;
  tags?: string[];
}

export type RandomQuestionParams = PaginationQueryInput & RandomQuestionFilters;

export type RandomQuestionQuery = PaginationQueryParams & RandomQuestionFilters;
