import { inject, injectable } from "inversify";
import { QUIZ_TYPES } from "../../di/quiz.token";
import type { IQuizRepository } from "../../domain/repositories/quiz-repository.interface";
import type { IDomainEventPublisher } from "@/building-blocks/application/ports/domain-event-publisher.interface";
import { CORE_TYPES } from "@/building-blocks/di/core.token";
import {
  QuizNotFoundError,
  QuizValidationError,
} from "../../domain/errors/quiz.error";
import type { IQuestionRepository } from "@question/domain/repositories/question-repository.interface";
import { QUESTION_TYPES } from "@question/di/question.token";
import { QuestionStatus } from "@question/domain/value-objects/question-status.vo";
import { Question } from "@question/domain/entities/question";
import { QuestionType } from "@question/domain/value-objects/question-type.vo";
import { Option } from "@question/domain/value-objects/option.vo";
import { Difficulty } from "@question/domain/value-objects/difficulty.vo";
import { QuizQuestion } from "../../domain/value-objects/quiz-question.snapshot";
import { QuizOption } from "../../domain/value-objects/quiz-option.snapshot";
import { ResponseQuiz } from "../dto/response-quiz.dto";
import { QuizOutputMapper } from "../mappers/quiz-output.mapper";
import { QuizQuestionInput } from "../dto/quiz-question.dto";

export interface AddQuizQuestionsInput {
  id: string;
  authorId: string;
  questionIds?: string[];
  questions?: QuizQuestionInput[];
}

@injectable()
export class AddQuizQuestionsUseCase {
  constructor(
    @inject(QUIZ_TYPES.Repository)
    private readonly quizRepository: IQuizRepository,

    @inject(QUESTION_TYPES.Repository)
    private readonly questionRepository: IQuestionRepository,

    @inject(CORE_TYPES.Event.DomainEventPublisher)
    private readonly eventPublisher: IDomainEventPublisher,
  ) {}

  async execute(input: AddQuizQuestionsInput): Promise<ResponseQuiz> {
    const quiz = await this.quizRepository.findById(input.id);
    if (!quiz) {
      throw new QuizNotFoundError(`Quiz with id ${input.id} not found`);
    }

    const existingQuestionIds = input.questionIds ?? [];
    const newQuestions = input.questions ?? [];

    if (existingQuestionIds.length === 0 && newQuestions.length === 0) {
      throw new QuizValidationError(
        "Provide at least one source: questionIds or questions",
      );
    }

    const collectedQuestions = [];

    if (existingQuestionIds.length > 0) {
      const uniqueQuestionIds = [...new Set(existingQuestionIds)];

      const existingQuestions = await this.questionRepository.findByIds(
        uniqueQuestionIds,
      );

      if (existingQuestions.length !== uniqueQuestionIds.length) {
        const foundIds = new Set(existingQuestions.map((question) => question.id));
        const missingQuestionIds = uniqueQuestionIds.filter(
          (questionId) => !foundIds.has(questionId),
        );

        throw new QuizValidationError(
          "Some question IDs do not exist",
          missingQuestionIds,
        );
      }

      const archivedQuestions = existingQuestions.filter(
        (question) => question.status === QuestionStatus.ARCHIVED,
      );

      if (archivedQuestions.length > 0) {
        throw new QuizValidationError("Cannot add archived questions to quiz", {
          questionIds: archivedQuestions.map((question) => question.id),
        });
      }

      collectedQuestions.push(...existingQuestions);
    }

    if (newQuestions.length > 0) {
      const createdQuestions = [];

      for (const questionInput of newQuestions) {
        const domainQuestion = Question.create({
          authorId: input.authorId,
          content: questionInput.content,
          type: QuestionType.MULTIPLE_CHOICE,
          options: questionInput.options.map((option) => new Option(option)),
          correctAnswer: questionInput.correctAnswer,
          difficulty: questionInput.difficulty as Difficulty,
          tags: questionInput.tags ?? ["quiz"],
          explanation: questionInput.explanation,
        });

        const savedQuestion = await this.questionRepository.save(domainQuestion);
        createdQuestions.push(savedQuestion);
      }

      collectedQuestions.push(...createdQuestions);
    }

    const questions = collectedQuestions.map(
      (question) =>
        new QuizQuestion({
          id: question.id,
          content: question.content,
          options: question.options.map((option) =>
            new QuizOption({ value: option.value }),
          ),
          correctAnswer: question.correctAnswer,
          difficulty: question.difficulty,
          type: question.type,
          explanation: question.explanation,
        }),
    );

    quiz.addQuestions(questions);
    await this.quizRepository.update(quiz);
    await this.eventPublisher.publish(quiz.domainEvents);
    quiz.clearDomainEvents();

    return QuizOutputMapper.toResponse(quiz);
  }
}
