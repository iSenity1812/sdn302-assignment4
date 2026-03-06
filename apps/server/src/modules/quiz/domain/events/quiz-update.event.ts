import { DomainEvent } from "@/building-blocks/domain/domain-event.interface";

interface QuizUpdateEventPayload {
  quizId: string;
  title: string;
  description: string;
}

export class QuizUpdateEvent implements DomainEvent {
  public readonly occurredOn: Date;
  constructor(public readonly payload: QuizUpdateEventPayload) {
    this.occurredOn = new Date();
  }
}
