import "reflect-metadata";
import { createApp } from "./app";
import { envConfig } from "./config/env.config";

async function bootstrap() {
  const app = await createApp();
  const port = envConfig.port;

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
