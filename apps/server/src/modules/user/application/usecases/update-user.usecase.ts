import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from "@/shared/errors/domain.errors";
import { USER_TYPES } from "@user/user.token";
import { UpdateUserInput } from "@user/application/dto/update-user-input.dto";
import type { IUserRepository } from "@user/domain/repositories/user-repository.interface";
import { User } from "@user/domain/entities/user";
import { inject, injectable } from "inversify";

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject(USER_TYPES.Repository)
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   *  Updates the user's information. It first checks if the user exists by their ID. If the user does not exist, it throws a UserNotFoundError. If the email is being updated, it checks if the new email is already in use by another user to prevent duplicates, throwing a UserAlreadyExistsError if it is. Finally, it updates the user's information and saves the changes to the repository.
   * @throws UserNotFoundError if the user with the given ID does not exist.
   * @throws UserAlreadyExistsError if the new email is already in use by another user.
   * @param userId
   * @param dto
   * @returns The updated User entity, or null if the update fails for some reason (though in this implementation it will throw an error instead of returning null).
   */
  async execute(userId: string, dto: UpdateUserInput): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    if (dto.email) {
      const existing = await this.userRepository.findByEmail(dto.email);
      if (existing && existing.id !== userId) {
        throw new UserAlreadyExistsError(
          `Email ${dto.email} is already in use by another user.`,
        );
      }
    }
    user.update(dto);
    await this.userRepository.update(user);
    return user;
  }
}
