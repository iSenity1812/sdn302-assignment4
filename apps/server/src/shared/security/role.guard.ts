import { ForbiddenError, UnauthorizedError } from "@/shared/errors/domain.errors";
import { AuthenticatedUser } from "@/shared/security/authenticated-user.interface";
import { ROLE_METADATA_KEY } from "@/shared/security/role.decorator";
import { Role as UserRole } from "@/shared/types/role.enum";
import { NextFunction, Request, RequestHandler, Response } from "express";

export function roleGuard<T extends object>(
  controller: T,
  methodName: keyof T & string,
): RequestHandler {
  const requiredRoles = Reflect.getMetadata(
    ROLE_METADATA_KEY,
    Object.getPrototypeOf(controller),
    methodName,
  ) as UserRole[] | undefined;

  return (req: Request, _: Response, next: NextFunction) => {
    if (!requiredRoles || requiredRoles.length === 0) {
      return next();
    }

    const user = req.user as AuthenticatedUser | undefined;
    if (!user) {
      return next(new UnauthorizedError());
    }

    if (!requiredRoles.includes(user.role)) {
      return next(new ForbiddenError("You do not have permission"));
    }

    return next();
  };
}
