import { Role } from "@/shared/types/role.enum";

export interface TokenPayload {
  sub: string; // user ID
  email: string;
  role: Role;
  type: "access" | "refresh" | "reset";
}

export interface TokenService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
  generatePasswordResetToken(payload: TokenPayload): string;
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): TokenPayload;
  verifyPasswordResetToken(token: string): TokenPayload;
  decode(token: string): unknown;
  getAccessTokenExpiresIn(): string;
}
