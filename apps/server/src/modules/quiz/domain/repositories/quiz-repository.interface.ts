import { Quiz } from "../entities/quiz";

export interface IQuizRepository {
  findAll(): Promise<Quiz[]>;
  findById(id: string): Promise<Quiz | null>;
  findByCreatorId(creatorId: string): Promise<Quiz[]>;
  save(quiz: Quiz): Promise<Quiz>;
  update(quiz: Quiz): Promise<void>;
  delete(id: string): Promise<void>;
}
