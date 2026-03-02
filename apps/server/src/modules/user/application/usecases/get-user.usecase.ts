import { inject, injectable } from "inversify";
import { USER_TYPES } from "@user/user.token";
import type { IUserRepository } from "@user/domain/repositories/user-repository.interface";
import { ResponseUser } from "../dto/response-user.dto";
import { UserNotFoundError } from "@/shared/errors/domain.errors";
import { UserOutputMapper } from "../mappers/user-output.mapper";

@injectable()
export class GetUserUseCase {
  constructor(
    @inject(USER_TYPES.Repository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<ResponseUser | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    return UserOutputMapper.toResponse(user);
  }
}
