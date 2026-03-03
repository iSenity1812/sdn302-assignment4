import { Role } from "@/shared/types/role.enum";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  isDeleted: boolean;
  refreshTokenHash?: string | null;
  passwordResetTokenHash?: string | null;
  passwordResetExpiresAt?: Date | null;
}
