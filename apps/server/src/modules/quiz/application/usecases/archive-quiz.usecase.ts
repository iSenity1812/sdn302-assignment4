import { inject, injectable } from "inversify";
import { QUIZ_TYPES } from "../../di/quiz.token";
import type { IQuizRepository } from "../../domain/repositories/quiz-repository.interface";
import type { IDomainEventPublisher } from "@/building-blocks/application/ports/domain-event-publisher.interface";
import { CORE_TYPES } from "@/building-blocks/di/core.token";
import { QuizNotFoundError } from "../../domain/errors/quiz.error";

@injectable()
export class ArchiveQuizUseCase {
  constructor(
    @inject(QUIZ_TYPES.Repository)
    private readonly quizRepository: IQuizRepository,

    @inject(CORE_TYPES.Event.DomainEventPublisher)
    private readonly eventPublisher: IDomainEventPublisher,
  ) {}

  async execute(id: string): Promise<void> {
    const quiz = await this.quizRepository.findById(id);
    if (!quiz) {
      throw new QuizNotFoundError(`Quiz with id ${id} not found`);
    }

    quiz.archive();
    await this.quizRepository.update(quiz);
    await this.eventPublisher.publish(quiz.domainEvents);
    quiz.clearDomainEvents();
  }
}
