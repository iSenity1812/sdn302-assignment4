import { registerDatabase } from "@/config/module/database.module";
import { registerHealthModule } from "@/modules/health/health.module";
import { Container } from "inversify";
import { registerSystemModules } from "./module/system.module";
import { registerInfrastructure } from "@/config/module/infrastructure.module";
import { registerBusinessModules } from "./module/business.module";

export async function buildContainer(): Promise<Container> {
  const container = new Container({
    defaultScope: "Singleton",
  });

  await registerDatabase(container);
  registerInfrastructure(container);
  registerSystemModules(container);
  registerBusinessModules(container);
  return container;
}
