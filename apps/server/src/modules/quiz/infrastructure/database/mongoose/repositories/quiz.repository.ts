import { injectable } from "inversify";
import type { IQuizRepository } from "@/modules/quiz/domain/repositories/quiz-repository.interface";
import { Quiz } from "@/modules/quiz/domain/entities/quiz";
import { QuizModel } from "../persistence/quiz.model";
import { QuizPersistenceMapper } from "../mappers/quiz.persistence.mapper";

@injectable()
export class QuizRepository implements IQuizRepository {
  async findAll(): Promise<Quiz[]> {
    const docs = await QuizModel.find().lean().exec();
    return docs.map((doc) => QuizPersistenceMapper.toDomain(doc));
  }

  async findById(id: string): Promise<Quiz | null> {
    const doc = await QuizModel.findById(id).lean().exec();
    return doc ? QuizPersistenceMapper.toDomain(doc) : null;
  }

  async findByCreatorId(creatorId: string): Promise<Quiz[]> {
    const docs = await QuizModel.find({ createdBy: creatorId }).lean().exec();
    return docs.map((doc) => QuizPersistenceMapper.toDomain(doc));
  }

  async save(quiz: Quiz): Promise<Quiz> {
    const data = QuizPersistenceMapper.toPersistence(quiz);
    const doc = await QuizModel.create(data);
    return QuizPersistenceMapper.toDomain(doc);
  }

  async update(quiz: Quiz): Promise<void> {
    const data = QuizPersistenceMapper.toPersistence(quiz);
    await QuizModel.updateOne({ _id: quiz.id }, data).exec();
  }

  async delete(id: string): Promise<void> {
    await QuizModel.deleteOne({ _id: id }).exec();
  }
}
