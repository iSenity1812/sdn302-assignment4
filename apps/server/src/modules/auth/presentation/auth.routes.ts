import { AUTH_PREFIX } from "@/config/api-prefix.config";
import { AuthController } from "@/modules/auth/presentation/auth.controller";
import { UnauthorizedError } from "@/shared/errors/domain.errors";
import { AuthenticatedUser } from "@/shared/security/authenticated-user.interface";
import { roleGuard } from "@/shared/security/role.guard";
import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";

export function authRoutes(authController: AuthController): Router {
  const router = Router();

  const localAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      { session: false },
      (err: Error | null, user: AuthenticatedUser | false) => {
        if (err) return next(err);
        if (!user)
          return next(new UnauthorizedError("Invalid email or password"));
        req.user = user;
        return next();
      },
    )(req, res, next);
  };

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
    `${AUTH_PREFIX}/login`,
    localAuth,
    authController.login.bind(authController),
  );

  router.get(
    `${AUTH_PREFIX}/me`,
    jwtAuth,
    roleGuard(authController, "me"),
    authController.me.bind(authController),
  );

  router.post(
    `${AUTH_PREFIX}/refresh`,
    authController.refresh.bind(authController),
  );
  router.post(
    `${AUTH_PREFIX}/logout`,
    jwtAuth,
    roleGuard(authController, "logout"),
    authController.logout.bind(authController),
  );

  router.post(
    `${AUTH_PREFIX}/change-password`,
    jwtAuth,
    roleGuard(authController, "changePassword"),
    authController.changePassword.bind(authController),
  );

  router.post(
    `${AUTH_PREFIX}/forgot-password`,
    authController.forgotPassword.bind(authController),
  );

  router.post(
    `${AUTH_PREFIX}/reset-password`,
    authController.resetPassword.bind(authController),
  );

  return router;
}
