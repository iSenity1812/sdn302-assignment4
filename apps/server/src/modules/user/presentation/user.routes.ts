import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "./user.controller";
import { USER_PREFIX } from "@/config/api-prefix.config";
import passport from "passport";
import { roleGuard } from "@/shared/security/role.guard";
import { UnauthorizedError } from "@/shared/errors/domain.errors";
import { AuthenticatedUser } from "@/shared/security/authenticated-user.interface";

export function userRoutes(userController: UserController): Router {
  const router = Router();

  const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: Error | null, user: AuthenticatedUser | false | null) => {
        if (err) return next(err);
        if (!user) return next(new UnauthorizedError("Unauthorized"));
        req.user = user;
        return next();
      },
    )(req, res, next);
  };

  router.post(
    `${USER_PREFIX}/register`,
    userController.registerUser.bind(userController),
  );
  router.get(
    `${USER_PREFIX}/:id`,
    jwtAuth,
    roleGuard(userController, "getUser"),
    userController.getUser.bind(userController),
  );
  router.put(
    `${USER_PREFIX}/:id`,
    jwtAuth,
    roleGuard(userController, "updateUser"),
    userController.updateUser.bind(userController),
  );
  router.delete(
    `${USER_PREFIX}/:id`,
    jwtAuth,
    roleGuard(userController, "deleteUser"),
    userController.deleteUser.bind(userController),
  );

  return router;
}
