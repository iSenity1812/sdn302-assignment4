import { inject, injectable } from "inversify";
import { QUESTION_TYPES } from "../../di/question.token";
import type { IDomainEventPublisher } from "@/building-blocks/application/ports/domain-event-publisher.interface";
import { CORE_TYPES } from "@/building-blocks/di/core.token";
import type { IQuestionQueryRepository } from "../repositories/question-query-repository.interface";
import {
  QuestionSearchParams,
  QuestionSearchQuery,
} from "../queries/search-question.query";
import { PaginationQuery } from "@/building-blocks/application/pagination-query";
import { Page } from "@/building-blocks/application/page";
import { ResponseQuestion } from "../dto/response-question.dto";
import { QuestionOutputMapper } from "../mappers/question-output.mapper";
import { QuestionSearchedEvent } from "@/modules/question/domain/events/question-searched.event";

@injectable()
export class SearchQuestionUseCase {
  constructor(
    @inject(QUESTION_TYPES.QueryRepository)
    private readonly questionQueryRepository: IQuestionQueryRepository,

    @inject(CORE_TYPES.Event.DomainEventPublisher)
    private readonly eventPublisher: IDomainEventPublisher,
  ) {}

  async execute(params: QuestionSearchParams): Promise<Page<ResponseQuestion>> {
    const pagination = new PaginationQuery(params.page, params.limit);

    // Build query params
    const queryParams: QuestionSearchQuery = {
      ...params,
      page: pagination.page,
      limit: pagination.limit,
      offset: pagination.offset,
    };

    // Execute query
    const result = await this.questionQueryRepository.search(queryParams);

    await this.eventPublisher.publish([
      new QuestionSearchedEvent({
        page: queryParams.page,
        limit: queryParams.limit,
        difficulty: queryParams.difficulty,
        status: queryParams.status,
        authorId: queryParams.authorId,
        tags: queryParams.tags,
      }),
    ]);

    const responseItems = result.items.map((item) =>
      QuestionOutputMapper.toResponse(item),
    );
    return new Page(responseItems, result.total, result.page, result.limit);
  }
}
