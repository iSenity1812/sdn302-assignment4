import { AuthTokenDto } from "@/modules/auth/application/dto/auth-token.dto";
import type { TokenService } from "@/modules/auth/application/ports/token.service";
import type { IAuthRepository } from "@/modules/auth/domain/repositories/auth-repository.interface";
import { AUTH_TYPES } from "@/modules/auth/auth.token";
import { UnauthorizedError } from "@/shared/errors/domain.errors";
import type { IPasswordHasher } from "@/shared/security/password-hasher.interface";
import { inject, injectable } from "inversify";

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject(AUTH_TYPES.Repository)
    private readonly authRepository: IAuthRepository,

    @inject(AUTH_TYPES.TokenService)
    private readonly tokenService: TokenService,

    @inject(AUTH_TYPES.PasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(refreshToken: string): Promise<AuthTokenDto> {
    const payload = this.tokenService.verifyRefreshToken(refreshToken);
    if (payload.type !== "refresh") {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const user = await this.authRepository.findById(payload.sub);
    if (!user || user.isDeleted || !user.refreshTokenHash) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const isMatch = await this.passwordHasher.compare(
      refreshToken,
      user.refreshTokenHash,
    );

    if (!isMatch) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const accessToken = this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      type: "access",
    });

    const newRefreshToken = this.tokenService.generateRefreshToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      type: "refresh",
    });

    const refreshTokenHash = await this.passwordHasher.hash(newRefreshToken);
    await this.authRepository.setRefreshTokenHash(user.id, refreshTokenHash);

    return new AuthTokenDto(
      accessToken,
      newRefreshToken,
      "Bearer",
      this.tokenService.getAccessTokenExpiresIn(),
    );
  }
}
