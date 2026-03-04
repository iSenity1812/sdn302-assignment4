import { Question } from "@question/domain/entities/question";
import { QuestionSearchParams } from "./question-search-params.interface";
import { RandomQuestionParams } from "./random-question-params.interface";

export interface IQuestionRepository {
  findById(questionId: string): Promise<Question | null>;
  findByIds(questionIds: string[]): Promise<Question[]>;
  findByAuthorId(authorId: string): Promise<Question[]>;
  findByActive(): Promise<Question[]>;
  save(question: Question): Promise<Question>;
  update(question: Question): Promise<void>;
  delete(questionId: string): Promise<void>;
  search(params: QuestionSearchParams): Promise<Question[]>;
  getShuffleQuestions(params: RandomQuestionParams): Promise<Question[]>;
}