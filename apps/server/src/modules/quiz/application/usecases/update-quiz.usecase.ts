import { inject, injectable } from "inversify";
import { QUIZ_TYPES } from "../../di/quiz.token";
import type { IQuizRepository } from "../../domain/repositories/quiz-repository.interface";
import type { IDomainEventPublisher } from "@/building-blocks/application/ports/domain-event-publisher.interface";
import { CORE_TYPES } from "@/building-blocks/di/core.token";
import { UpdateQuizInput } from "../dto/update-quiz.dto";
import { QuizNotFoundError } from "../../domain/errors/quiz.error";
import { ResponseQuiz } from "../dto/response-quiz.dto";
import { QuizOutputMapper } from "../mappers/quiz-output.mapper";

@injectable()
export class UpdateQuizUseCase {
  constructor(
    @inject(QUIZ_TYPES.Repository)
    private readonly quizRepository: IQuizRepository,

    @inject(CORE_TYPES.Event.DomainEventPublisher)
    private readonly eventPublisher: IDomainEventPublisher,
  ) {}

  async execute(input: UpdateQuizInput): Promise<ResponseQuiz> {
    const quiz = await this.quizRepository.findById(input.id);
    if (!quiz) {
      throw new QuizNotFoundError(`Quiz with id ${input.id} not found`);
    }

    quiz.updateQuiz(input.title, input.description);
    await this.quizRepository.update(quiz);
    await this.eventPublisher.publish(quiz.domainEvents);
    quiz.clearDomainEvents();

    return QuizOutputMapper.toResponse(quiz);
  }
}
