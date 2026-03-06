import { DomainEvent } from "@/building-blocks/domain/domain-event.interface";

interface QuizQuestionAddedEventPayload {
  quizId: string;
  questionId: string;
}

export class QuizQuestionAddedEvent implements DomainEvent {
  public readonly occurredOn: Date;
  constructor(public payload: QuizQuestionAddedEventPayload) {
    this.occurredOn = new Date();
  }
}
