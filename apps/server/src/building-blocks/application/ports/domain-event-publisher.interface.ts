import { DomainEvent } from "@/building-blocks/domain/domain-event.interface";

export interface IDomainEventPublisher {
  publish(events: DomainEvent[]): Promise<void>;
}
