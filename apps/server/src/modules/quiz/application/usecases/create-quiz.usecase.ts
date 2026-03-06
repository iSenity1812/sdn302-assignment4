import { inject, injectable } from "inversify";
import { QUIZ_TYPES } from "../../di/quiz.token";
import type { IQuizRepository } from "../../domain/repositories/quiz-repository.interface";
import type { IDomainEventPublisher } from "@/building-blocks/application/ports/domain-event-publisher.interface";
import { CORE_TYPES } from "@/building-blocks/di/core.token";
import { CreateQuizInput } from "../dto/create-quiz.dto";
import { Quiz } from "../../domain/entities/quiz";

@injectable()
export class CreateQuizUseCase {
  constructor(
    @inject(QUIZ_TYPES.Repository)
    private readonly quizRepository: IQuizRepository,

    @inject(CORE_TYPES.Event.DomainEventPublisher)
    private readonly eventPublisher: IDomainEventPublisher,
  ) {}

  async execute(input: CreateQuizInput): Promise<Quiz> {
    const quiz = Quiz.create({
      title: input.title,
      description: input.description,
      createdBy: input.createdBy,
    });

    const saved = await this.quizRepository.save(quiz);
    await this.eventPublisher.publish(saved.domainEvents);
    saved.clearDomainEvents();

    return saved;
  }
}
