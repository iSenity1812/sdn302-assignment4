import { registerUserModule } from "@/modules/user/user.module";
import { registerAuthModule } from "@/modules/auth/auth.module";
import { Container } from "inversify";

export function registerBusinessModules(container: Container) {
  /**
   * Currently, we don't have any business modules to register.
   * In the future, if we have any business logic that needs to be registered in the container, we can add it here.
   * For example:
   * registerUserModule(container);
   *  */
  registerUserModule(container);
  registerAuthModule(container);
}
