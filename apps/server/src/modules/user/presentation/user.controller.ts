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
import { UpdateUserInput } from "../application/dto/update-user-input.dto";
import { UpdateUserUseCase } from "../application/usecases/update-user.usecase";
import { DeleteUserUseCase } from "../application/usecases/delete-user.usecase";

@injectable()
export class UserController {
  constructor(
    @inject(USER_TYPES.UseCase.RegisterUser)
    private readonly registerUserUseCase: RegisterUserUseCase,

    @inject(USER_TYPES.UseCase.GetUser)
    private readonly getUserUseCase: GetUserUseCase,

    @inject(USER_TYPES.UseCase.UpdateUser)
    private readonly updateUserUseCase: UpdateUserUseCase,

    @inject(USER_TYPES.UseCase.DeleteUser)
    private readonly deleteUserUseCase: DeleteUserUseCase,
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
      return res.status(200).json(
        ok(user, {
          message: `User with id '${user.name}' has been retrieved`,
        }),
      );
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
      return res
        .status(201)
        .json(ok(user, { message: `User '${user?.name}' has been created` }));
    } catch (err) {
      return next(err);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      if (typeof userId !== "string") {
        throw new InvalidIdentifierError("userId", userId, {
          location: "params",
        });
      }
      const { name, email, password } = req.body;
      const dto = plainToInstance(UpdateUserInput, {
        name,
        email,
        password,
      });
      const user = await this.updateUserUseCase.execute(userId, dto);
      if (!user) {
        throw new UserNotFoundError(userId);
      }
      return res
        .status(200)
        .json(
          ok(user, { message: `User with id '${user.name}' has been updated` }),
        );
    } catch (err) {
      return next(err);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      if (typeof userId !== "string") {
        throw new InvalidIdentifierError("userId", userId, {
          location: "params",
        });
      }
      const user = await this.deleteUserUseCase.execute(userId);
      return res
        .status(200)
        .json(
          ok(
            { deleted: true, user },
            { message: `User with '${user?.name}' has been deleted` },
          ),
        );
    } catch (err) {
      return next(err);
    }
  }
}
