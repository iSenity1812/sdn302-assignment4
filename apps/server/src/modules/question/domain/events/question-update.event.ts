import { DomainEvent } from "@/building-blocks/domain/domain-event.interface";

export class QuestionUpdatedEvent implements DomainEvent {
  public readonly occurredOn: Date;

  constructor(public readonly questionId: string) {
    this.occurredOn = new Date();
  }
}
