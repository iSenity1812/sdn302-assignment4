import { inject, injectable } from "inversify";
import { USER_TYPES } from "../../user.token";
import type { IUserRepository } from "../../domain/repositories/user-repository.interface";
import type { ILogger } from "@/building-blocks/application/observability/logger.interface";
import { RegisterUserInput } from "../dto/register-user-input.dto";
import { User } from "../../domain/entities/user";
import { UserAlreadyExistsError } from "@/shared/errors/domain.errors";
import bcrypt from "bcrypt";
import { validateOrReject } from "class-validator";
import { LOGGER_TYPES } from "@/infrastructure/observability/logging/logging.type";

@injectable()
export class RegisterUserUseCase {
  constructor(
    @inject(USER_TYPES.Repository)
    private readonly userRepository: IUserRepository,

    @inject(LOGGER_TYPES.AppLogger)
    private readonly logger: ILogger,
  ) {}

  /**
   * Hashes the user's password using bcrypt before saving it to the database. This is a critical step for security, as it ensures that even if the database is compromised, the attackers will not have access to the plaintext passwords. The saltRounds parameter determines the computational cost of hashing, with higher values being more secure but also more resource-intensive.
   * @param password
   * @param saltRounds
   * @returns The hashed password as a string.
   */
  private async hashPassword(
    password: string,
    saltRounds: number = 10,
  ): Promise<string> {
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Registers a new user in the system. It first checks if a user with the same email already exists to prevent duplicates. If the email is unique, it hashes the user's password for security before creating a new User entity and saving it to the repository.
   * @throws UserAlreadyExistsError if a user with the given email already exists in the system.
   * @param input
   * @returns The newly created User entity, or null if the registration fails for some reason (though in this implementation it will throw an error instead of returning null).
   */
  async execute(input: RegisterUserInput): Promise<User | null> {
    // validate password length
    await validateOrReject(input);

    // Check if a user with the same email already exists
    const existing = await this.userRepository.findByEmail(input.email);

    if (existing) {
      this.logger.warn("RegisterUserUseCase: User with email already exists", {
        email: input.email,
      });
      throw new UserAlreadyExistsError(input.email);
    }

    const hashedPassword = await this.hashPassword(input.password);
    // const objectId = new mongoose.Types.ObjectId();
    const user = await this.userRepository.save(
      User.create({
        id: "",
        name: input.name,
        email: input.email,
        password: hashedPassword,
      }),
    );

    this.logger.info("RegisterUserUseCase: User registered successfully", {
      userId: user.id,
      email: user.email,
    });

    return user;
  }
}
