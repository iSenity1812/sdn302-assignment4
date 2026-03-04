import { inject, injectable } from "inversify";
import { QUESTION_TYPES } from "../../di/question.token";
import type { IQuestionQueryRepository } from "../repositories/question-query-repository.interface";
import { PaginationQuery } from "@/building-blocks/application/pagination-query";
import { Page } from "@/building-blocks/application/page";
import { ResponseQuestion } from "../dto/response-question.dto";
import { QuestionOutputMapper } from "../mappers/question-output.mapper";
import {
  RandomQuestionParams,
  RandomQuestionQuery,
} from "../queries/random-question.query";

@injectable()
export class ShuffleQuestionUseCase {
  constructor(
    @inject(QUESTION_TYPES.QueryRepository)
    private readonly questionQueryRepository: IQuestionQueryRepository,
  ) {}

  async execute(params: RandomQuestionParams): Promise<Page<ResponseQuestion>> {
    const pagination = new PaginationQuery(params.page, params.limit);

    const queryParams: RandomQuestionQuery = {
      ...params,
      page: pagination.page,
      limit: pagination.limit,
      offset: pagination.offset,
    };

    const result = await this.questionQueryRepository.getShuffleQuestions(
      queryParams,
    );

    const responseItems = result.items.map((item) =>
      QuestionOutputMapper.toResponse(item),
    );

    return new Page(responseItems, result.total, result.page, result.limit);
  }
}