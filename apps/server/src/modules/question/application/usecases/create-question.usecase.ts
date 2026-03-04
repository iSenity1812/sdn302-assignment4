import { inject, injectable } from "inversify";
import { QUESTION_TYPES } from "@question/di/question.token";
import type { IQuestionRepository } from "@question/domain/repositories/question-repository.interface";
import type { IDomainEventPublisher } from "@/building-blocks/application/ports/domain-event-publisher.interface";
import { CORE_TYPES } from "@/building-blocks/di/core.token";
import { CreateQuestionInput } from "@question/application/dto/create-question.dto";
import { Question } from "@question/domain/entities/question";
import { QuestionType } from "../../domain/value-objects/question-type.vo";
import { Option } from "../../domain/value-objects/option.vo";
import { Difficulty } from "../../domain/value-objects/difficulty.vo";

@injectable()
export class CreateQuestionUseCase {
  constructor(
    @inject(QUESTION_TYPES.Repository)
    private readonly questionRepository: IQuestionRepository,

    @inject(CORE_TYPES.Event.DomainEventPublisher)
    private readonly eventPublisher: IDomainEventPublisher,
  ) {}

  async execute(input: CreateQuestionInput): Promise<Question | null> {
    // Create aggregate
    const question = Question.create({
      authorId: input.authorId,
      content: input.content,
      type: input.type as QuestionType,
      options: input.options.map((opt) => new Option(opt)),
      correctAnswer: input.correctAnswer,
      difficulty: input.difficulty as Difficulty,
      tags: input.tags,
      explanation: input.explanation,
    });

    // persist
    const saved = await this.questionRepository.save(question);

    // publish domain events
    await this.eventPublisher.publish(saved.domainEvents);

    // clear events after publishing
    saved.clearDomainEvents();

    return saved;
  }
}
