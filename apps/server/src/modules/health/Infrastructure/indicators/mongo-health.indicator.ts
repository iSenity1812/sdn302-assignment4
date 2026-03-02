import { inject, injectable } from "inversify";
import { HealthIndicator } from "../../application/health-indicator.interface";
import { MongoClient } from "mongodb";
import { HealthIndicatorResult } from "../../application/health.type";
import { DATABASE_TYPES } from "@/infrastructure/database/database.type";

@injectable()
export class MongoHealthIndicator implements HealthIndicator {
  name = "MongoDB";

  constructor(
    @inject(DATABASE_TYPES.MongoClient)
    private readonly client: MongoClient,
  ) {}
  async check(): Promise<HealthIndicatorResult> {
    try {
      await this.client.db().command({ ping: 1 });
      return {
        name: this.name,
        status: "up",
      };
    } catch (error) {
      return {
        name: this.name,
        status: "down",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
