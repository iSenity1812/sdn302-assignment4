import { inject, injectable } from "inversify";
import { QUESTION_TYPES } from "@question/di/question.token";
import type { IQuestionRepository } from "@question/domain/repositories/question-repository.interface";
import type { IDomainEventPublisher } from "@/building-blocks/application/ports/domain-event-publisher.interface";
import { CORE_TYPES } from "@/building-blocks/di/core.token";
import { UpdateQuestionInput } from "../dto/update-question.dto";
import {
  QuestionNotAnswerableError,
  QuestionNotFoundError,
} from "@question/domain/errors/question.error";
import { Option } from "@question/domain/value-objects/option.vo";
import { Difficulty } from "../../domain/value-objects/difficulty.vo";
import { Question } from "../../domain/entities/question";

@injectable()
export class UpdateQuestionUseCase {
  constructor(
    @inject(QUESTION_TYPES.Repository)
    private readonly questionRepository: IQuestionRepository,

    @inject(CORE_TYPES.Event.DomainEventPublisher)
    private readonly eventPublisher: IDomainEventPublisher,
  ) {}

  async execute(input: UpdateQuestionInput): Promise<Question> {
    // Find existing question
    const question = await this.questionRepository.findById(input.id);

    if (!question) {
      throw new QuestionNotFoundError(input.id);
    }

    if (input.content !== undefined) {
      question.updateContent(input.content);
    }

    if (input.options !== undefined) {
      if (!input.correctAnswer) {
        throw new QuestionNotAnswerableError(
          "Correct answer must be provided when updating options",
        );
      }

      question.updateOptions(
        input.options.map((o) => new Option(o)),
        input.correctAnswer,
      );
    }

    if (input.difficulty !== undefined) {
      question.updateDifficulty(input.difficulty as Difficulty);
    }

    if (input.tags !== undefined) {
      question.updateTags(input.tags);
    }

    if (input.explanation !== undefined) {
      question.updateExplanation(input.explanation);
    }

    // Commit changes and generate events if there were any updates
    question.commitChanges();

    // Persist changes
    await this.questionRepository.update(question);

    // publish events
    await this.eventPublisher.publish(question.domainEvents);

    question.clearDomainEvents();

    return question;
  }
}
