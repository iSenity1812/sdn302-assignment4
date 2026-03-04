import { Page } from "@/building-blocks/application/page";
import { QuestionSearchQuery } from "../queries/search-question.query";
import { Question } from "../../domain/entities/question";
import { RandomQuestionQuery } from "../queries/random-question.query";

export interface IQuestionQueryRepository {
  search(params: QuestionSearchQuery): Promise<Page<Question>>;
  getShuffleQuestions(params: RandomQuestionQuery): Promise<Page<Question>>;
}
