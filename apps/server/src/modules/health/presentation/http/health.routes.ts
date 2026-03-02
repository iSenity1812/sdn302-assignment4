import { HEALTH_PREFIX } from "@/config/api-prefix.config";
import { HealthController } from "./health.controller";
import { Router } from "express";

export function healthRoutes(healthController: HealthController): Router {
  const router = Router();

  router.get(
    `${HEALTH_PREFIX}/live`,
    healthController.live.bind(healthController),
  );
  router.get(
    `${HEALTH_PREFIX}/ready`,
    healthController.ready.bind(healthController),
  );
  return router;
}
