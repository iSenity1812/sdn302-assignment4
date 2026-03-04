import { inject, injectable } from "inversify";
import { QUESTION_TYPES } from "@question/di/question.token";
import type { IQuestionRepository } from "@question/domain/repositories/question-repository.interface";
import type { IDomainEventPublisher } from "@/building-blocks/application/ports/domain-event-publisher.interface";
import { CORE_TYPES } from "@/building-blocks/di/core.token";
import { ResponseQuestion } from "../dto/response-question.dto";
import { QuestionOutputMapper } from "../mappers/question-output.mapper";

@injectable()
export class GetQuestionUseCase {
  constructor(
    @inject(QUESTION_TYPES.Repository)
    private readonly questionRepository: IQuestionRepository,

    @inject(CORE_TYPES.Event.DomainEventPublisher)
    private readonly eventPublisher: IDomainEventPublisher,
  ) {}

  async execute(id: string): Promise<ResponseQuestion | null> {
    const question = await this.questionRepository.findById(id);
    if (!question) {
      return null;
    }
    return QuestionOutputMapper.toResponse(question);
  }
}
