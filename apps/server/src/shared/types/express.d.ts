import { AuthenticatedUser } from "@/shared/security/authenticated-user.interface";

declare global {
  namespace Express {
    interface User extends AuthenticatedUser {}
  }
}

export {};
