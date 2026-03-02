import { inject, injectable } from "inversify";
import { USER_TYPES } from "../user.token";
import { RegisterUserUseCase } from "../application/usecases/register-user.usecase";
import { GetUserUseCase } from "../application/usecases/get-user.usecase";
import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import {
  InvalidIdentifierError,
  UserNotFoundError,
} from "@/shared/errors/domain.errors";
import { ok } from "@/shared/http/builder/response.factory";
import { RegisterUserInput } from "../application/dto/register-user-input.dto";

@injectable()
export class UserController {
  constructor(
    @inject(USER_TYPES.UseCase.RegisterUser)
    private readonly registerUserUseCase: RegisterUserUseCase,

    @inject(USER_TYPES.UseCase.GetUser)
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      if (typeof userId !== "string") {
        throw new InvalidIdentifierError("userId", userId, {
          location: "params",
        });
      }
      const user = await this.getUserUseCase.execute(userId);
      if (!user) {
        throw new UserNotFoundError(userId);
      }
      return res.status(200).json(ok(user));
    } catch (err) {
      return next(err);
    }
  }

  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const dto = plainToInstance(RegisterUserInput, {
        name,
        email,
        password,
      });

      const user = await this.registerUserUseCase.execute(dto);
      return res.status(201).json(ok(user));
    } catch (err) {
      return next(err);
    }
  }
}
