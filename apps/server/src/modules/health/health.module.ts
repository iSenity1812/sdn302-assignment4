import { Container } from "inversify";
import { HealthCheckUseCase } from "./application/health-check.usecase";
import { HealthController } from "./presentation/http/health.controller";
import { HEALTH_TYPES } from "./health.token";
import { MongoHealthIndicator } from "./Infrastructure/indicators/mongo-health.indicator";
import { HealthIndicator } from "./application/health-indicator.interface";

export function registerHealthModule(container: Container) {
  container.bind(HealthCheckUseCase).toSelf();
  container.bind(HealthController).toSelf();

  container
    .bind<HealthIndicator>(HEALTH_TYPES.Indicator)
    .to(MongoHealthIndicator);
}
