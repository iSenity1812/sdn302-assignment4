import { Page } from "@/building-blocks/application/page";
import { Quiz } from "../../domain/entities/quiz";
import { SearchQuizQuery } from "../queries/search-quiz.query";

export interface IQuizQueryRepository {
  search(params: SearchQuizQuery): Promise<Page<Quiz>>;
}
