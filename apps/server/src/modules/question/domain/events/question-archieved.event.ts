import { DomainEvent } from "@/building-blocks/domain/domain-event.interface";

export class QuestionArchivedEvent implements DomainEvent {
  public readonly occurredOn: Date;

  constructor(public readonly questionId: string) {
    this.occurredOn = new Date();
  }
}
