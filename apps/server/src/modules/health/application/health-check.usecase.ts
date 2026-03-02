import { injectable, multiInject } from "inversify";
import { HealthIndicator } from "./health-indicator.interface";
import { HEALTH_TYPES } from "@/modules/health/health.token";
import { HealthCheckResult, HealthIndicatorResult } from "./health.type";

@injectable()
export class HealthCheckUseCase {
  constructor(
    @multiInject(HEALTH_TYPES.Indicator)
    private readonly indicators: HealthIndicator[],
  ) {}

  async execute(): Promise<HealthCheckResult> {
    const results = await Promise.all(
      this.indicators.map((indicator) => this.runWithTimeout(indicator)),
    );

    const isHealthy = results.every((r) => r.status === "up");
    return {
      status: isHealthy ? "ok" : "error",
      results,
    };
  }

  private async runWithTimeout(
    indicator: HealthIndicator,
  ): Promise<HealthIndicatorResult> {
    const timeout = new Promise<HealthIndicatorResult>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 3000),
    );

    try {
      return await Promise.race<HealthIndicatorResult>([
        indicator.check(),
        timeout,
      ]);
    } catch (error) {
      return {
        name: indicator.name,
        status: "down",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
