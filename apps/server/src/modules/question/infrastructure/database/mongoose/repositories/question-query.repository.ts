import { Page } from "@/building-blocks/application/page";
import { QuestionSearchQuery } from "@/modules/question/application/queries/search-question.query";
import { IQuestionQueryRepository } from "@/modules/question/application/repositories/question-query-repository.interface";
import { injectable } from "inversify";
import { QuestionDocument, QuestionModel } from "../persistence/question.model";
import { PipelineStage, QueryFilter } from "mongoose";
import { Question } from "@/modules/question/domain/entities/question";
import { QuestionPersistenceMapper } from "../mappers/question.persistence.mapper";
import { RandomQuestionQuery } from "@/modules/question/application/queries/random-question.query";

@injectable()
export class questionQueryRepository implements IQuestionQueryRepository {
  async search(query: QuestionSearchQuery): Promise<Page<Question>> {
    const { page, limit, ...filters } = query;

    const mongooseFilter: QueryFilter<QuestionDocument> = {
      ...(filters.difficulty && { difficulty: filters.difficulty }),
      ...(filters.status && { status: filters.status }),
      ...(filters.authorId && { authorId: filters.authorId }),
      ...(filters.tags?.length && { tags: { $all: filters.tags } }),
    };

    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      QuestionModel.find(mongooseFilter).skip(skip).limit(limit).lean().exec(),
      QuestionModel.countDocuments(mongooseFilter).exec(),
    ]);
    const items = docs.map((doc) => QuestionPersistenceMapper.toDomain(doc));

    return new Page(items, total, page, limit);
  }

  async getShuffleQuestions(
    query: RandomQuestionQuery,
  ): Promise<Page<Question>> {
    const { page, limit, ...filters } = query;

    const mongooseFilter: QueryFilter<QuestionDocument> = {
      status: "ACTIVE",
      ...(filters.difficulty && { difficulty: filters.difficulty }),
      ...(filters.tags?.length && { tags: { $all: filters.tags } }),
    };

    const skip = (page - 1) * limit;

    /**
     * Using aggregation pipeline to perform random sampling with filters and pagination.
     */
    const matchStage: PipelineStage.Match = {
      $match: mongooseFilter,
    };
    const pipeline: PipelineStage[] = [
      matchStage,
      {
        $facet: {
          items: [
            { $sample: { size: skip + limit } },
            { $skip: skip },
            { $limit: limit },
          ],
          total: [{ $count: "total" }],
        },
      },
    ];

    // Execute the aggregation pipeline
    const result = await QuestionModel.aggregate(pipeline);

    // Extract items and total count from the aggregation result
    const itemsRaw = result[0]?.items || [];
    const total = result[0]?.total[0]?.total || 0;

    const items = itemsRaw.map((doc: QuestionDocument) =>
      QuestionPersistenceMapper.toDomain(doc),
    );

    return new Page(items, total, page, limit);
  }
}
