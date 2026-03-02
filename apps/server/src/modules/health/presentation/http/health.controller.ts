import { inject, injectable } from "inversify";
import { HealthCheckUseCase } from "../../application/health-check.usecase";
import { HealthCheckResponse } from "../../interface/dto/health.response";
import { NextFunction, Request, Response } from "express";
import { ok } from "@/shared/http/builder/response.factory";
import { ServiceUnavailableError } from "@/shared/errors/domain.errors";

@injectable()
export class HealthController {
  constructor(
    @inject(HealthCheckUseCase)
    private readonly healthCheckUseCase: HealthCheckUseCase,
  ) {}

  live(_: Request, res: Response) {
    return res.status(200).json(ok<HealthCheckResponse>({ status: "ok" }));
  }

  async ready(_: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.healthCheckUseCase.execute();

      if (result.status !== "ok") {
        return next(
          new ServiceUnavailableError("Service is not ready", {
            indicators: result.results,
          }),
        );
      }

      return res
        .status(200)
        .json(ok<HealthCheckResponse>({ status: "ok", message: "Ready" }));
    } catch (err) {
      return next(err);
    }
  }
}
