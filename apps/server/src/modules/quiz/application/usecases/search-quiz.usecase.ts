import { inject, injectable } from "inversify";
import { QUIZ_TYPES } from "../../di/quiz.token";
import type { IQuizQueryRepository } from "../repositories/quiz-query-repository.interface";
import { PaginationQuery } from "@/building-blocks/application/pagination-query";
import {
  SearchQuizParams,
  SearchQuizQuery,
} from "../queries/search-quiz.query";
import { Page } from "@/building-blocks/application/page";
import { ResponseQuiz } from "../dto/response-quiz.dto";
import { QuizOutputMapper } from "../mappers/quiz-output.mapper";

@injectable()
export class SearchQuizUseCase {
  constructor(
    @inject(QUIZ_TYPES.QueryRepository)
    private readonly quizQueryRepository: IQuizQueryRepository,
  ) {}

  async execute(params: SearchQuizParams): Promise<Page<ResponseQuiz>> {
    const pagination = new PaginationQuery(params.page, params.limit);

    const query: SearchQuizQuery = {
      ...params,
      page: pagination.page,
      limit: pagination.limit,
      offset: pagination.offset,
    };

    const result = await this.quizQueryRepository.search(query);

    return new Page(
      result.items.map(QuizOutputMapper.toResponse),
      result.total,
      result.page,
      result.limit,
    );
  }
}
