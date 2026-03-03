import { ResetPasswordInput } from "@/modules/auth/application/dto/reset-password.input.dto";
import type { TokenService } from "@/modules/auth/application/ports/token.service";
import type { IAuthRepository } from "@/modules/auth/domain/repositories/auth-repository.interface";
import { AUTH_TYPES } from "@/modules/auth/auth.token";
import {
  UnauthorizedError,
  UserNotFoundError,
} from "@/shared/errors/domain.errors";
import type { IPasswordHasher } from "@/shared/security/password-hasher.interface";
import { inject, injectable } from "inversify";

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject(AUTH_TYPES.Repository)
    private readonly authRepository: IAuthRepository,

    @inject(AUTH_TYPES.TokenService)
    private readonly tokenService: TokenService,

    @inject(AUTH_TYPES.PasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: ResetPasswordInput): Promise<void> {
    const payload = this.tokenService.verifyPasswordResetToken(input.token);
    if (payload.type !== "reset") {
      throw new UnauthorizedError("Invalid reset token");
    }

    const user = await this.authRepository.findById(payload.sub);
    if (!user) {
      throw new UserNotFoundError(payload.sub);
    }

    if (
      !user.passwordResetTokenHash ||
      !user.passwordResetExpiresAt ||
      user.passwordResetExpiresAt.getTime() < Date.now()
    ) {
      throw new UnauthorizedError("Reset token has expired or is invalid");
    }

    const isMatch = await this.passwordHasher.compare(
      input.token,
      user.passwordResetTokenHash,
    );
    if (!isMatch) {
      throw new UnauthorizedError("Invalid reset token");
    }

    const hashedPassword = await this.passwordHasher.hash(input.newPassword);
    await this.authRepository.updatePassword(user.id, hashedPassword);
    await this.authRepository.clearPasswordResetToken(user.id);
  }
}
