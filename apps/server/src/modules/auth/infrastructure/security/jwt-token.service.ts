import {
  TokenPayload,
  TokenService,
} from "@/modules/auth/application/ports/token.service";
import { envConfig } from "@/config/env.config";
import { injectable } from "inversify";
import jwt from "jsonwebtoken";

type ExpiresInOption = jwt.SignOptions["expiresIn"];

@injectable()
export class JwtTokenService implements TokenService {
  getAccessTokenExpiresIn(): string {
    return envConfig.jwtAccessExpiresIn;
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, envConfig.jwtSecret, {
      expiresIn: envConfig.jwtAccessExpiresIn as ExpiresInOption,
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, envConfig.jwtRefreshSecret, {
      expiresIn: envConfig.jwtRefreshExpiresIn as ExpiresInOption,
    });
  }

  generatePasswordResetToken(payload: TokenPayload): string {
    return jwt.sign(payload, envConfig.jwtResetSecret, {
      expiresIn: envConfig.jwtResetExpiresIn as ExpiresInOption,
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, envConfig.jwtSecret) as TokenPayload;
  }

  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, envConfig.jwtRefreshSecret) as TokenPayload;
  }

  verifyPasswordResetToken(token: string): TokenPayload {
    return jwt.verify(token, envConfig.jwtResetSecret) as TokenPayload;
  }

  decode(token: string): jwt.JwtPayload | string | null {
    return jwt.decode(token);
  }
}
