import { inject, injectable } from "inversify";
import type { IUserRepository } from "@user/domain/repositories/user-repository.interface";
import { USER_TYPES } from "@user/user.token";
import { UserNotFoundError } from "@/shared/errors/domain.errors";
import { User } from "../../domain/entities/user";

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject(USER_TYPES.Repository)
    private readonly userRepository: IUserRepository,
  ) {}
  /**
   * Soft delete the user by setting isDeleted to true. This allows us to keep the user data for auditing or potential recovery, while preventing it from being active in the system.
   * @param userId
   * @throws UserNotFoundError if the user with the given ID does not exist.
   * @returns void
   */
  async execute(userId: string): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    user.delete();

    await this.userRepository.update(user);
    return user;
  }
}
