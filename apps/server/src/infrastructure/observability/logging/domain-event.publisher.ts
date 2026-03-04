import { IDomainEventPublisher } from "@/building-blocks/application/ports/domain-event-publisher.interface";
import { DomainEvent } from "@/building-blocks/domain/domain-event.interface";
import { injectable, inject } from "inversify";
import { LOGGER_TYPES } from "./logging.type";
import type { ILogger } from "@/building-blocks/application/observability/logger.interface";

@injectable()
export class DomainEventPublisher implements IDomainEventPublisher {
  constructor(
    @inject(LOGGER_TYPES.AppLogger)
    private readonly logger: ILogger,
  ) {}

  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      this.logger.info("Domain event published", {
        eventName: event.constructor.name,
        occurredOn: event.occurredOn,
        payload: event,
      });
    }
  }
}