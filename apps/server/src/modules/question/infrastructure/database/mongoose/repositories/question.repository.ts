import { Question } from "@/modules/question/domain/entities/question";
import { IQuestionRepository } from "@/modules/question/domain/repositories/question-repository.interface";
import { QuestionSearchParams } from "@/modules/question/domain/repositories/question-search-params.interface";
import { RandomQuestionParams } from "@/modules/question/domain/repositories/random-question-params.interface";
import { QuestionModel } from "../persistence/question.model";
import { QuestionPersistenceMapper } from "../mappers/question.persistence.mapper";

export class QuestionRepository implements IQuestionRepository {
  async save(question: Question): Promise<Question> {
    const data = QuestionPersistenceMapper.toPersistence(question);
    const doc = await QuestionModel.create(data);
    return QuestionPersistenceMapper.toDomain(doc);
  }
  async findById(questionId: string): Promise<Question | null> {
    const doc = await QuestionModel.findById(questionId);
    return doc ? QuestionPersistenceMapper.toDomain(doc) : null;
  }
  async findByIds(questionIds: string[]): Promise<Question[]> {
    const docs = await QuestionModel.find({ _id: { $in: questionIds } });
    return docs.map((doc) => QuestionPersistenceMapper.toDomain(doc));
  }
  async findByAuthorId(authorId: string): Promise<Question[]> {
    const docs = await QuestionModel.find({ authorId });
    return docs.map(QuestionPersistenceMapper.toDomain);
  }
  async findByActive(): Promise<Question[]> {
    const docs = await QuestionModel.find({ status: "ACTIVE" });
    return docs.map(QuestionPersistenceMapper.toDomain);
  }
  async update(question: Question): Promise<void> {
    const data = QuestionPersistenceMapper.toPersistence(question);
    await QuestionModel.updateOne({ _id: question.id }, data);
    return Promise.resolve();
  }
  async delete(questionId: string): Promise<void> {
    await QuestionModel.deleteOne({ _id: questionId });
    return Promise.resolve();
  }
  async search(params: QuestionSearchParams): Promise<Question[]> {
    const query: any = {};

    if (params.difficulty) {
      query.difficulty = params.difficulty;
    }
    if (params.tags) {
      query.tags = { $all: params.tags };
    }
    if (params.status) {
      query.status = params.status;
    }
    if (params.authorId) {
      query.authorId = params.authorId;
    }

    const docs = await QuestionModel.find(query);
    return docs.map((doc) => QuestionPersistenceMapper.toDomain(doc));
  }
  async getShuffleQuestions(params: RandomQuestionParams): Promise<Question[]> {
    const match: any = { status: "ACTIVE" };

    if (params.difficulty) {
      match.difficulty = params.difficulty;
    }

    if (params.tags && params.tags?.length > 0) {
      match.tags = { $all: params.tags };
    }

    const docs = await QuestionModel.aggregate([
      { $match: match },
      { $sample: { size: params.count } },
    ]);
    return docs.map((doc) => QuestionPersistenceMapper.toDomain(doc));
  }
}
