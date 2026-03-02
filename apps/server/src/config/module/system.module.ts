import { registerHealthModule } from "@/modules/health/health.module";
import { Container } from "inversify";

export function registerSystemModules(container: Container) {
  registerHealthModule(container);
}
