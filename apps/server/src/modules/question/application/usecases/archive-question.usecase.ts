import { inject, injectable } from "inversify";
import { QUESTION_TYPES } from "@question/di/question.token";
import type { IQuestionRepository } from "@question/domain/repositories/question-repository.interface";
import type { IDomainEventPublisher } from "@/building-blocks/application/ports/domain-event-publisher.interface";
import { CORE_TYPES } from "@/building-blocks/di/core.token";
import { QuestionNotFoundError } from "../../domain/errors/question.error";

@injectable()
export class ArchiveQuestionUseCase {
  constructor(
    @inject(QUESTION_TYPES.Repository)
    private readonly questionRepository: IQuestionRepository,

    @inject(CORE_TYPES.Event.DomainEventPublisher)
    private readonly eventPublisher: IDomainEventPublisher,
  ) {}

  async execute(id: string): Promise<void> {
    const question = await this.questionRepository.findById(id);
    if (!question) {
      throw new QuestionNotFoundError(`Question with id ${id} not found`);
    }

    // Should check if question is in use before archiving, but for simplicity we will skip that step here
    question.archive();
    await this.questionRepository.update(question);
    await this.eventPublisher.publish(question.domainEvents);
    question.clearDomainEvents();
  }
}
