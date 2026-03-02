import { Router } from "express";
import { UserController } from "./user.controller";
import { USER_PREFIX } from "@/config/api-prefix.config";

export function userRoutes(userController: UserController): Router {
  const router = Router();

  router.post(
    `${USER_PREFIX}/register`,
    userController.registerUser.bind(userController),
  );
  router.get(`${USER_PREFIX}/:id`, userController.getUser.bind(userController));
  router.put(
    `${USER_PREFIX}/:id`,
    userController.updateUser.bind(userController),
  );
  router.delete(
    `${USER_PREFIX}/:id`,
    userController.deleteUser.bind(userController),
  );

  return router;
}
