import { ILogger } from "@/building-blocks/application/observability/logger.interface";
import { envConfig } from "@/config/env.config";
import { injectable } from "inversify";
import pino, { Logger } from "pino";

@injectable()
export class PinoLogger implements ILogger {
  private readonly logger: Logger;

  constructor() {
    this.logger = pino({
      level: envConfig.logLevel,
      transport:
        envConfig.nodeEnv !== "production"
          ? { target: "pino-pretty", options: { colorize: true } }
          : undefined,
    });
  }
  info(message: string, meta?: unknown): void {
    this.logger.info(meta ?? {}, message);
  }
  warn(message: string, meta?: unknown): void {
    this.logger.warn(meta ?? {}, message);
  }
  error(message: string, meta?: unknown): void {
    this.logger.error(meta ?? {}, message);
  }
  debug(message: string, meta?: unknown): void {
    this.logger.debug(meta ?? {}, message);
  }
}
