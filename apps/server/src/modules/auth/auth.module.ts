import { Container } from "inversify";
import { AUTH_TYPES } from "@/modules/auth/auth.token";
import { IAuthRepository } from "@/modules/auth/domain/repositories/auth-repository.interface";
import { AuthRepository } from "@/modules/auth/infrastructure/database/auth.repository";
import { TokenService } from "@/modules/auth/application/ports/token.service";
import { JwtTokenService } from "@/modules/auth/infrastructure/security/jwt-token.service";
import { IPasswordHasher } from "@/shared/security/password-hasher.interface";
import { BcryptPasswordHasher } from "@/shared/security/bcrypt.password-hasher";
import { AuthController } from "@/modules/auth/presentation/auth.controller";
import { LoginUseCase } from "@/modules/auth/application/usecases/login.usecase";
import { LogoutUseCase } from "@/modules/auth/application/usecases/logout.usecase";
import { RefreshTokenUseCase } from "@/modules/auth/application/usecases/refresh-token.usecase";
import { ChangePasswordUseCase } from "@/modules/auth/application/usecases/change-password.usecase";
import { ForgotPasswordUseCase } from "@/modules/auth/application/usecases/forgot-password.usecase";
import { ResetPasswordUseCase } from "@/modules/auth/application/usecases/reset-password.usecase";

export function registerAuthModule(container: Container) {
  container.bind<IAuthRepository>(AUTH_TYPES.Repository).to(AuthRepository);

  container
    .bind<TokenService>(AUTH_TYPES.TokenService)
    .to(JwtTokenService)
    .inSingletonScope();

  container
    .bind<IPasswordHasher>(AUTH_TYPES.PasswordHasher)
    .to(BcryptPasswordHasher)
    .inSingletonScope();

  container.bind<AuthController>(AUTH_TYPES.Controller).to(AuthController);

  container.bind<LoginUseCase>(AUTH_TYPES.UseCase.Login).to(LoginUseCase);
  container.bind<LogoutUseCase>(AUTH_TYPES.UseCase.Logout).to(LogoutUseCase);
  container
    .bind<RefreshTokenUseCase>(AUTH_TYPES.UseCase.Refresh)
    .to(RefreshTokenUseCase);
  container
    .bind<ChangePasswordUseCase>(AUTH_TYPES.UseCase.ChangePassword)
    .to(ChangePasswordUseCase);
  container
    .bind<ForgotPasswordUseCase>(AUTH_TYPES.UseCase.ForgotPassword)
    .to(ForgotPasswordUseCase);
  container
    .bind<ResetPasswordUseCase>(AUTH_TYPES.UseCase.ResetPassword)
    .to(ResetPasswordUseCase);
}
