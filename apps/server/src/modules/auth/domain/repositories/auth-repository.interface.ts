import { AuthUser } from "../model/auth-user.interface";

export interface IAuthRepository {
  findById(userId: string): Promise<AuthUser | null>;
  findByEmail(email: string): Promise<AuthUser | null>;
  setRefreshTokenHash(
    userId: string,
    refreshTokenHash: string | null,
  ): Promise<void>;
  setPasswordResetToken(
    userId: string,
    passwordResetTokenHash: string,
    expiresAt: Date,
  ): Promise<void>;
  clearPasswordResetToken(userId: string): Promise<void>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
}
