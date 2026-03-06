import { DomainEvent } from "@/building-blocks/domain/domain-event.interface";

interface QuizCreatedEventSnapshot {
  quizId: string;
  title: string;
  description?: string;
  createdBy: string;
}

export class QuizCreatedEvent implements DomainEvent {
  public readonly occurredOn: Date;

  constructor(public readonly snapshot: QuizCreatedEventSnapshot) {
    this.occurredOn = new Date();
  }
}
