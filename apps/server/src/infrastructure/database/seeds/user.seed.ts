import { PinoLogger } from "@/infrastructure/observability/logging/pino-logger";
import { UserModel } from "@/modules/user/infrastructure/database/model/user.model";
import { IPasswordHasher } from "@/shared/security/password-hasher.interface";
import { Role } from "@/shared/types/role.enum";
import { faker } from "@faker-js/faker";

export interface SeededUsersResult {
  adminIds: string[];
  userIds: string[];
}

export async function seedUsers(
  hashedPassword: IPasswordHasher,
  logger?: PinoLogger,
): Promise<SeededUsersResult> {
  const hashedPassowrd = await hashedPassword.hash("123456");

  const buildSeedUser = (role: Role, index: number) => {
    const fullName = faker.person.fullName();
    return {
      name: fullName,
      email: `${role.toLowerCase()}.${index + 1}.${faker.string.alphanumeric({ length: 6, casing: "lower" })}@quizapp.local`,
      password: hashedPassowrd,
      role,
    };
  };

  const adminUsers = Array.from({ length: 2 }, (_, index) =>
    buildSeedUser(Role.ADMIN, index),
  );
  const learnerUsers = Array.from({ length: 4 }, (_, index) =>
    buildSeedUser(Role.USER, index),
  );

  const users = [...adminUsers, ...learnerUsers];

  const inserted = await UserModel.insertMany(users);
  const adminIds = inserted
    .filter((user) => user.role === Role.ADMIN)
    .map((user) => user._id.toString());
  const userIds = inserted
    .filter((user) => user.role === Role.USER)
    .map((user) => user._id.toString());

  logger?.info(`Seeded ${inserted.length} users`, {
    adminCount: adminIds.length,
    userCount: userIds.length,
  });

  return {
    adminIds,
    userIds,
  };
}
