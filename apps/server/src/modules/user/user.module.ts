import { Container } from "inversify";
import { IUserRepository } from "@user/domain/repositories/user-repository.interface";
import { USER_TYPES } from "@user/user.token";
import { UserRepository } from "@user/infrastructure/database/user.repository";
import { RegisterUserUseCase } from "./application/usecases/register-user.usecase";
import { GetUserUseCase } from "./application/usecases/get-user.usecase";
import { UpdateUserUseCase } from "./application/usecases/update-user.usecase";
import { DeleteUserUseCase } from "./application/usecases/delete-user.usecase";
import { UserController } from "./presentation/user.controller";

export function registerUserModule(container: Container) {
  container.bind<IUserRepository>(USER_TYPES.Repository).to(UserRepository);

  /* Controller */
  container.bind<UserController>(USER_TYPES.Controller).to(UserController);

  /**
   * In some cases, using an interface for the use case is essential for flexibility, testing, and future-proofing.
   * However, in simpler cases with no expected changes or testing requirements, directly binding the use case class might suffice.
   */
  container
    .bind<RegisterUserUseCase>(USER_TYPES.UseCase.RegisterUser)
    .to(RegisterUserUseCase);
  container.bind<GetUserUseCase>(USER_TYPES.UseCase.GetUser).to(GetUserUseCase);
  container
    .bind<UpdateUserUseCase>(USER_TYPES.UseCase.UpdateUser)
    .to(UpdateUserUseCase);
  container
    .bind<DeleteUserUseCase>(USER_TYPES.UseCase.DeleteUser)
    .to(DeleteUserUseCase);
}
