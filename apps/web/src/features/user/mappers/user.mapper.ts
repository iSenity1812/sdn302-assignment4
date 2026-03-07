import { UserDto } from "../types/user.dto";

export const UserMapper = (dto: UserDto) => ({
  id: dto.id,
  username: dto.name,
  email: dto.email,
  role: dto.role as "ADMIN" | "USER",
});
