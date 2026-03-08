import "reflect-metadata";
import { createApp } from "./app";
import { envConfig } from "./config/env.config";
import "tsconfig-paths/register";

async function bootstrap() {
  const app = await createApp();
  const port = envConfig.port;
  const host = envConfig.host;
  app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
