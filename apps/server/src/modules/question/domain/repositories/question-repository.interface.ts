import { Question } from "@question/domain/entities/question";

export interface IQuestionRepository {
  findAll(): Promise<Question[]>;
  findById(questionId: string): Promise<Question | null>;
  findByIds(questionIds: string[]): Promise<Question[]>;
  findByAuthorId(authorId: string): Promise<Question[]>;
  findByActive(): Promise<Question[]>;
  save(question: Question): Promise<Question>;
  update(question: Question): Promise<void>;
  delete(questionId: string): Promise<void>;
}
