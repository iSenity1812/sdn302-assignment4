import { inject, injectable } from "inversify";
import { QUESTION_TYPES } from "@question/di/question.token";
import type { IQuestionRepository } from "@question/domain/repositories/question-repository.interface";
import { ResponseQuestion } from "../dto/response-question.dto";
import { QuestionOutputMapper } from "../mappers/question-output.mapper";

@injectable()
export class GetAllQuestionUseCase {
  constructor(
    @inject(QUESTION_TYPES.Repository)
    private readonly questionRepository: IQuestionRepository,
  ) {}

  async execute(): Promise<ResponseQuestion[]> {
    const questions = await this.questionRepository.findAll();
    return questions.map(QuestionOutputMapper.toResponse);
  }
}
