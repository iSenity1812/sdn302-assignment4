import { Container } from "inversify";
import { LOGGER_TYPES } from "../../infrastructure/observability/logging/logging.type";
import { PinoLogger } from "../../infrastructure/observability/logging/pino-logger";
import { ILogger } from "@/building-blocks/application/observability/logger.interface";
import { CORE_TYPES } from "@/building-blocks/di/core.token";
import { IDomainEventPublisher } from "@/building-blocks/application/ports/domain-event-publisher.interface";
import { DomainEventPublisher } from "@/infrastructure/observability/logging/domain-event.publisher";

export function registerInfrastructure(container: Container) {
  /**
   * Currently, we don't have any infrastructure modules to register.
   * In the future, if we have any infrastructure that needs to be registered in the container, we can add it here.
   * For example: logging, caching, etc. (note that database is registered in a separate module)
   *
   */
  // Logging
  container
    .bind<ILogger>(LOGGER_TYPES.AppLogger)
    .to(PinoLogger)
    .inSingletonScope();

  container
    .bind<IDomainEventPublisher>(CORE_TYPES.Event.DomainEventPublisher)
    .to(DomainEventPublisher)
    .inSingletonScope();
}
