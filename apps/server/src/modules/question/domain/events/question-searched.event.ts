import { DomainEvent } from "@/building-blocks/domain/domain-event.interface";
import { Difficulty } from "../value-objects/difficulty.vo";
import { QuestionStatus } from "../value-objects/question-status.vo";

interface QuestionSearchSnapshot {
  page: number;
  limit: number;
  difficulty?: Difficulty;
  status?: QuestionStatus;
  authorId?: string;
  tags?: string[];
}

export class QuestionSearchedEvent implements DomainEvent {
  public readonly occurredOn: Date;

  constructor(public readonly snapshot: QuestionSearchSnapshot) {
    this.occurredOn = new Date();
  }
}