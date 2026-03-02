import { inject, injectable } from "inversify";
import { USER_TYPES } from "@user/user.token";
import type { IUserRepository } from "@user/domain/repositories/user-repository.interface";
import { ResponseUser } from "../dto/response-user.dto";
import { UserNotFoundError } from "@/shared/errors/domain.errors";
import { UserOutputMapper } from "../mappers/user-output.mapper";
import type { ILogger } from "@/building-blocks/application/observability/logger.interface";
import { LOGGER_TYPES } from "@/infrastructure/observability/logging/logging.type";

@injectable()
export class GetUserUseCase {
  constructor(
    @inject(USER_TYPES.Repository)
    private readonly userRepository: IUserRepository,

    @inject(LOGGER_TYPES.AppLogger)
    private readonly logger: ILogger,
  ) {}

  async execute(userId: string): Promise<ResponseUser | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    this.logger.info("GetUserUseCase: User retrieved successfully", {
      userId: user.id,
    });

    return UserOutputMapper.toResponse(user);
  }
}
