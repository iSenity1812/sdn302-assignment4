import express, { Application } from "express";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./shared/middleware/error.middleware";
import { buildContainer } from "./config/inversify.config";
import { HealthController } from "./modules/health/presentation/http/health.controller";
import { API_PREFIX } from "./config/api-prefix.config";
import { healthRoutes } from "./modules/health/presentation/http/health.routes";
import { UserController } from "./modules/user/presentation/user.controller";
import { userRoutes } from "./modules/user/presentation/user.routes";
import { USER_TYPES } from "./modules/user/user.token";

export async function createApp(): Promise<Application> {
  const app = express();
  const container = await buildContainer();

  // Get controllers
  const healthController = container.get(HealthController);
  const userController = container.get<UserController>(USER_TYPES.Controller);

  // Middleware
  app.use(express.json());

  // health check
  app.use(API_PREFIX, healthRoutes(healthController));
  // user routes
  app.use(API_PREFIX, userRoutes(userController));

  // error handling middleware
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
