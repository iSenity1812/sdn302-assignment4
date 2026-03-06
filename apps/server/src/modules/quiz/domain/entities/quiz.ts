import { AggregateRoot } from "@/building-blocks/domain/aggregate-root.abstract";
import { QuizProps } from "./quiz.props";
import { QuizCreatedEvent } from "../events/quiz-created.event";
import { QuizQuestion } from "../value-objects/quiz-question.snapshot";
import { QuizError } from "../errors/quiz.error";
import { QuizQuestionAddedEvent } from "../events/quiz-question-added.event";
import { QuizRemoveQuestionEvent } from "../events/quiz-remove-question.event";
import { QuizStatus } from "../value-objects/quiz-status.vo";
import { QuizUpdateEvent } from "../events/quiz-update.event";

export class Quiz extends AggregateRoot<QuizProps> {
  private constructor(id: string, props: QuizProps) {
    super(id, props);
  }

  static create(
    props: Omit<QuizProps, "questions" | "status" | "createdAt" | "updatedAt">,
  ): Quiz {
    const quiz = new Quiz("", {
      ...props,
      questions: [],
      status: QuizStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    quiz.addDomainEvent(
      new QuizCreatedEvent({
        quizId: quiz.id,
        title: quiz.props.title,
        description: quiz.props.description,
        createdBy: quiz.props.createdBy,
      }),
    );
    return quiz;
  }

  static reconstitute(id: string, props: QuizProps): Quiz {
    return new Quiz(id, props);
  }

  addQuestions(questions: QuizQuestion[]): void {
    for (const question of questions) {
      const exists = this.props.questions.some((q) => q.id === question.id);
      if (exists) {
        throw new QuizError(
          `Question with id ${question.id} already exists in the quiz`,
          { questionId: question.id },
          400,
        );
      }
      this.props.questions.push(question);
      this.addDomainEvent(
        new QuizQuestionAddedEvent({
          quizId: this.id,
          questionId: question.id,
        }),
      );
    }
    this.touch();
  }

  removeQuestion(questionId: string): void {
    const index = this.props.questions.findIndex((q) => q.id === questionId);
    if (index === -1) {
      throw new QuizError(
        `Question with id ${questionId} not found in the quiz`,
        { questionId },
        404,
      );
    }
    this.props.questions.splice(index, 1);
    this.touch();
    this.addDomainEvent(
      new QuizRemoveQuestionEvent({ quizId: this.id, questionId }),
    );
  }

  updateQuiz(title?: string, description?: string): void {
    let changed = false;

    if (title && title !== this.props.title) {
      this.props.title = title;
      changed = true;
    }

    if (description && description !== this.props.description) {
      this.props.description = description;
      changed = true;
    }

    if (!changed) return;

    this.touch();

    this.addDomainEvent(
      new QuizUpdateEvent({
        quizId: this.id,
        title: this.props.title ?? "",
        description: this.props.description ?? "",
      }),
    );
  }

  publish(): void {
    if (this.props.questions.length === 0) {
      throw new QuizError("Cannot publish a quiz with no questions", {}, 400);
    }
    this.props.status = QuizStatus.PUBLISHED;
    this.touch();
  }

  archive(): void {
    if (this.props.status === QuizStatus.ARCHIVED) {
      return;
    }
    this.props.status = QuizStatus.ARCHIVED;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  get title() {
    return this.props.title;
  }

  get questions() {
    return this.props.questions;
  }

  get createdBy() {
    return this.props.createdBy;
  }

  get description() {
    return this.props.description;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
