import { injectable } from "inversify";
import { Page } from "@/building-blocks/application/page";
import type { IQuizQueryRepository } from "@/modules/quiz/application/repositories/quiz-query-repository.interface";
import { SearchQuizQuery } from "@/modules/quiz/application/queries/search-quiz.query";
import { Quiz } from "@/modules/quiz/domain/entities/quiz";
import { QuizModel } from "../persistence/quiz.model";
import { QuizPersistenceMapper } from "../mappers/quiz.persistence.mapper";

@injectable()
export class QuizQueryRepository implements IQuizQueryRepository {
  async search(params: SearchQuizQuery): Promise<Page<Quiz>> {
    const { page, limit, createdBy, status } = params;

    const filter = {
      ...(createdBy && { createdBy }),
      ...(status && { status }),
    };

    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      QuizModel.find(filter).skip(skip).limit(limit).lean().exec(),
      QuizModel.countDocuments(filter).exec(),
    ]);

    return new Page(
      docs.map((doc) => QuizPersistenceMapper.toDomain(doc)),
      total,
      page,
      limit,
    );
  }
}
