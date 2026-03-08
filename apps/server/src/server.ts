import "reflect-metadata";
import { createApp } from "./app";
import { envConfig } from "./config/env.config";
import * as dotenv from "dotenv";

dotenv.config();

async function bootstrap() {
  const app = await createApp();
  const port = Number(process.env.PORT) || 3002;
  const host = process.env.HOST || "0.0.0.0";
  app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
