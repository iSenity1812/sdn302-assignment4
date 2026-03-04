import { AggregateRoot } from "@/building-blocks/domain/aggregate-root.abstract";
import { QuestionProps } from "./question.props";
import { QuestionStatus } from "@question/domain/value-objects/question-status.vo";
import {
  QuestionEmptyOptionError,
  QuestionNotEnoughOptionsError,
  QuestionValidationError,
} from "@question/domain/errors/question.error";
import { QuestionType } from "@question/domain/value-objects/question-type.vo";
import { QuestionCreatedEvent } from "@question/domain/events/question-created.event";
import { Option } from "../value-objects/option.vo";
import { Difficulty } from "../value-objects/difficulty.vo";
import { QuestionUpdatedEvent } from "../events/question-update.event";
import { QuestionArchivedEvent } from "../events/question-archieved.event";

export class Question extends AggregateRoot<QuestionProps> {
  /**
   * The _isDirty flag is used to track whether the question has been modified since it was last persisted.
   * This allows us to optimize event publishing by only emitting a QuestionUpdatedEvent if there were actual changes to the question's state.
   * However, this is a simple implementation and may not cover all edge cases (e.g, if you want to track specific changes or have more complex business logic). In a real application, you might want to implement a more robust change tracking mechanism or use a library that supports this out of the box.
   */
  private _isDirty = false;
  private constructor(id: string, props: QuestionProps) {
    super(id, props);
  }

  /* Factory method to create a new Question instance */
  static create(
    props: Omit<QuestionProps, "status" | "createdAt" | "updatedAt">,
  ): Question {
    const question = new Question("", {
      ...props,
      status: QuestionStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    question.validate();

    // Add domain event
    question.addDomainEvent(new QuestionCreatedEvent(question.id));

    return question;
  }

  /* Reconstitute a Question instance from props */
  static reconstitute(id: string, props: QuestionProps): Question {
    return new Question(id, props);
  }

  /* Business Methods */
  archive(): void {
    if (this.props.status === QuestionStatus.ARCHIVED) {
      throw new QuestionValidationError("Question is already archived");
    }
    this.props.status = QuestionStatus.ARCHIVED;
    this.touch();
    this.addDomainEvent(new QuestionArchivedEvent(this.id));
  }

  updateContent(content: string): void {
    this.ensureNotArchived();

    if (!content || content.trim() === "") {
      throw new QuestionValidationError("Question content cannot be empty");
    }
    this.props.content = content;
    this.touch();
    this._isDirty = true;
  }

  updateOptions(options: Option[], correctAnswer: string) {
    this.ensureNotArchived();

    if (options.length < 2) {
      throw new QuestionValidationError("Must have at least 2 options");
    }

    const unique = new Set(options.map((o) => o.value));
    if (unique.size !== options.length) {
      throw new QuestionValidationError("Options must be unique");
    }

    const correctExists = options.some((o) => o.value === correctAnswer);
    if (!correctExists) {
      throw new QuestionValidationError("Correct answer must exist in options");
    }

    this.props.options = options;
    this.props.correctAnswer = correctAnswer;
    this.touch();
    this._isDirty = true;
  }

  updateDifficulty(difficulty: Difficulty): void {
    this.ensureNotArchived();
    this.props.difficulty = difficulty;
    this.touch();
    this._isDirty = true;
  }

  updateTags(tags: string[]): void {
    this.ensureNotArchived();
    this.props.tags = tags;
    this.touch();
    this._isDirty = true;
  }

  updateExplanation(explanation: string): void {
    this.ensureNotArchived();
    this.props.explanation = explanation;
    this.touch();
    this._isDirty = true;
  }

  commitChanges(): void {
    if (this._isDirty) {
      this.addDomainEvent(new QuestionUpdatedEvent(this.id));
      this._isDirty = false;
    }
  }

  /* Validate the question's properties */
  private validate(): void {
    if (!this.props.content || this.props.content.trim() === "") {
      throw new QuestionEmptyOptionError("Question content cannot be empty");
    }

    if (this.props.type === QuestionType.MULTIPLE_CHOICE) {
      this.validateMultipleChoice();
    }
  }

  private validateMultipleChoice(): void {
    if (!this.props.options || this.props.options.length < 2) {
      throw new QuestionNotEnoughOptionsError();
    }

    const unique = new Set(this.props.options.map((opt) => opt.value));

    if (unique.size !== this.props.options.length) {
      throw new QuestionValidationError(
        "Multiple choice options must be unique",
      );
    }

    const correctExists = this.props.options.some(
      (opt) => opt.value === this.props.correctAnswer,
    );

    if (!correctExists) {
      throw new QuestionValidationError(
        "Correct answer must be one of the options",
      );
    }
  }

  private ensureNotArchived(): void {
    if (this.props.status === QuestionStatus.ARCHIVED) {
      throw new QuestionValidationError("Cannot modify an archived question");
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  // GETTER

  get authorId() {
    return this.props.authorId;
  }
  get content() {
    return this.props.content;
  }
  get options() {
    return this.props.options;
  }
  get correctAnswer() {
    return this.props.correctAnswer;
  }
  get type() {
    return this.props.type;
  }
  get difficulty() {
    return this.props.difficulty;
  }
  get tags() {
    return this.props.tags;
  }
  get status() {
    return this.props.status;
  }
  get explanation() {
    return this.props.explanation;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
}
