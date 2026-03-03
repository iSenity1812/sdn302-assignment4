import { ChangePasswordInput } from "@/modules/auth/application/dto/change-password.input.dto";
import type { IAuthRepository } from "@/modules/auth/domain/repositories/auth-repository.interface";
import { AUTH_TYPES } from "@/modules/auth/auth.token";
import {
  UnauthorizedError,
  UserNotFoundError,
  ValidationError,
} from "@/shared/errors/domain.errors";
import type { IPasswordHasher } from "@/shared/security/password-hasher.interface";
import { inject, injectable } from "inversify";

@injectable()
export class ChangePasswordUseCase {
  constructor(
    @inject(AUTH_TYPES.Repository)
    private readonly authRepository: IAuthRepository,

    @inject(AUTH_TYPES.PasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(userId: string, input: ChangePasswordInput): Promise<void> {
    if (input.currentPassword === input.newPassword) {
      throw new ValidationError(
        "New password must be different from current password",
      );
    }

    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    if (user.isDeleted) {
      throw new UnauthorizedError("Account is not active");
    }

    const isCurrentPasswordValid = await this.passwordHasher.compare(
      input.currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedError("Current password is incorrect");
    }

    const hashedPassword = await this.passwordHasher.hash(input.newPassword);
    await this.authRepository.updatePassword(user.id, hashedPassword);
  }
}
