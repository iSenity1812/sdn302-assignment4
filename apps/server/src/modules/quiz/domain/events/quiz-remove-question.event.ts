import { DomainEvent } from "@/building-blocks/domain/domain-event.interface";

interface QuizRemoveQuestionEventPayload {
  quizId: string;
  questionId: string;
}

export class QuizRemoveQuestionEvent implements DomainEvent {
  public readonly occurredOn: Date;
  constructor(public readonly payload: QuizRemoveQuestionEventPayload) {
    this.occurredOn = new Date();
  }
}
