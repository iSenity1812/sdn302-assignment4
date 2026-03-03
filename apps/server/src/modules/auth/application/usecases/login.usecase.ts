import { AuthTokenDto } from "@/modules/auth/application/dto/auth-token.dto";
import type { TokenService } from "@/modules/auth/application/ports/token.service";
import type { IAuthRepository } from "@/modules/auth/domain/repositories/auth-repository.interface";
import { AUTH_TYPES } from "@/modules/auth/auth.token";
import { UnauthorizedError } from "@/shared/errors/domain.errors";
import { AuthenticatedUser } from "@/shared/security/authenticated-user.interface";
import type { IPasswordHasher } from "@/shared/security/password-hasher.interface";
import { inject, injectable } from "inversify";

@injectable()
export class LoginUseCase {
  constructor(
    @inject(AUTH_TYPES.Repository)
    private readonly authRepository: IAuthRepository,

    @inject(AUTH_TYPES.TokenService)
    private readonly tokenService: TokenService,

    @inject(AUTH_TYPES.PasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(user: AuthenticatedUser): Promise<AuthTokenDto> {
    if (user.isDeleted) {
      throw new UnauthorizedError("Account is not active");
    }

    const accessToken = this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      type: "access",
    });

    const refreshToken = this.tokenService.generateRefreshToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      type: "refresh",
    });

    const refreshTokenHash = await this.passwordHasher.hash(refreshToken);
    await this.authRepository.setRefreshTokenHash(user.id, refreshTokenHash);

    return new AuthTokenDto(
      accessToken,
      refreshToken,
      "Bearer",
      this.tokenService.getAccessTokenExpiresIn(),
    );
  }
}
