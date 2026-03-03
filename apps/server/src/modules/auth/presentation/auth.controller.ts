import { AUTH_TYPES } from "@/modules/auth/auth.token";
import { LoginUseCase } from "@/modules/auth/application/usecases/login.usecase";
import { LogoutUseCase } from "@/modules/auth/application/usecases/logout.usecase";
import { RefreshTokenUseCase } from "@/modules/auth/application/usecases/refresh-token.usecase";
import { ChangePasswordUseCase } from "@/modules/auth/application/usecases/change-password.usecase";
import { ForgotPasswordUseCase } from "@/modules/auth/application/usecases/forgot-password.usecase";
import { ResetPasswordUseCase } from "@/modules/auth/application/usecases/reset-password.usecase";
import { ChangePasswordInput } from "@/modules/auth/application/dto/change-password.input.dto";
import { ForgotPasswordInput } from "@/modules/auth/application/dto/forgot-password.input.dto";
import { ResetPasswordInput } from "@/modules/auth/application/dto/reset-password.input.dto";
import { RefreshTokenInput } from "@/modules/auth/application/dto/refresh-token.input.dto";
import { LogoutInput } from "@/modules/auth/application/dto/logout.input.dto";
import { UnauthorizedError } from "@/shared/errors/domain.errors";
import { ok } from "@/shared/http/builder/response.factory";
import { AuthenticatedUser } from "@/shared/security/authenticated-user.interface";
import { Role } from "@/shared/security/role.decorator";
import { Role as UserRole } from "@/shared/types/role.enum";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { inject, injectable } from "inversify";
import type { NextFunction, Request, Response } from "express";

@injectable()
export class AuthController {
  constructor(
    @inject(AUTH_TYPES.UseCase.Login)
    private readonly loginUseCase: LoginUseCase,

    @inject(AUTH_TYPES.UseCase.Logout)
    private readonly logoutUseCase: LogoutUseCase,

    @inject(AUTH_TYPES.UseCase.Refresh)
    private readonly refreshTokenUseCase: RefreshTokenUseCase,

    @inject(AUTH_TYPES.UseCase.ChangePassword)
    private readonly changePasswordUseCase: ChangePasswordUseCase,

    @inject(AUTH_TYPES.UseCase.ForgotPassword)
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,

    @inject(AUTH_TYPES.UseCase.ResetPassword)
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Invalid email or password");
      }

      const token = await this.loginUseCase.execute(req.user);
      return res.status(200).json(ok(token, { message: "Login successful" }));
    } catch (error) {
      return next(error);
    }
  }

  @Role(UserRole.USER, UserRole.ADMIN)
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const user: AuthenticatedUser = req.user;
      return res.status(200).json(
        ok(
          {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          { message: "Current user profile" },
        ),
      );
    } catch (error) {
      return next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(RefreshTokenInput, req.body);
      await validateOrReject(dto);

      const token = await this.refreshTokenUseCase.execute(dto.refreshToken);
      return res.status(200).json(ok(token, { message: "Token refreshed" }));
    } catch (error) {
      return next(error);
    }
  }

  @Role(UserRole.USER, UserRole.ADMIN)
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(LogoutInput, req.body);
      await validateOrReject(dto);

      await this.logoutUseCase.execute(dto.refreshToken);
      return res
        .status(200)
        .json(ok({ loggedOut: true }, { message: "Logout successful" }));
    } catch (error) {
      return next(error);
    }
  }

  @Role(UserRole.USER, UserRole.ADMIN)
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const dto = new ChangePasswordInput(
        req.body?.currentPassword,
        req.body?.newPassword,
      );
      await validateOrReject(dto);

      await this.changePasswordUseCase.execute(req.user.id, dto);
      return res
        .status(200)
        .json(ok({ changed: true }, { message: "Password changed" }));
    } catch (error) {
      return next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(ForgotPasswordInput, req.body);
      await validateOrReject(dto);

      const result = await this.forgotPasswordUseCase.execute(dto);
      return res.status(200).json(ok(result, { message: result.message }));
    } catch (error) {
      return next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(ResetPasswordInput, req.body);
      await validateOrReject(dto);

      await this.resetPasswordUseCase.execute(dto);
      return res
        .status(200)
        .json(ok({ reset: true }, { message: "Password reset successful" }));
    } catch (error) {
      return next(error);
    }
  }
}
