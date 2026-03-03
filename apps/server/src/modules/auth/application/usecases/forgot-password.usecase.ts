import { ForgotPasswordInput } from "@/modules/auth/application/dto/forgot-password.input.dto";
import { ForgotPasswordOutput } from "@/modules/auth/application/dto/forgot-password.output.dto";
import type { TokenService } from "@/modules/auth/application/ports/token.service";
import { AUTH_TYPES } from "@/modules/auth/auth.token";
import type { IAuthRepository } from "@/modules/auth/domain/repositories/auth-repository.interface";
import type { IPasswordHasher } from "@/shared/security/password-hasher.interface";
import { inject, injectable } from "inversify";

@injectable()
export class ForgotPasswordUseCase {
  constructor(
    @inject(AUTH_TYPES.Repository)
    private readonly authRepository: IAuthRepository,

    @inject(AUTH_TYPES.TokenService)
    private readonly tokenService: TokenService,

    @inject(AUTH_TYPES.PasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: ForgotPasswordInput): Promise<ForgotPasswordOutput> {
    const user = await this.authRepository.findByEmail(input.email);

    if (!user || user.isDeleted) {
      return new ForgotPasswordOutput(
        "If the account exists, a reset token has been generated",
      );
    }

    const resetToken = this.tokenService.generatePasswordResetToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      type: "reset",
    });

    const decoded = this.tokenService.decode(resetToken) as {
      exp?: number;
    } | null;
    const expMs = decoded?.exp
      ? decoded.exp * 1000
      : Date.now() + 15 * 60 * 1000;

    const resetTokenHash = await this.passwordHasher.hash(resetToken);

    await this.authRepository.setPasswordResetToken(
      user.id,
      resetTokenHash,
      new Date(expMs),
    );

    return new ForgotPasswordOutput(
      "If the account exists, a reset token has been generated",
      resetToken,
    );
  }
}
