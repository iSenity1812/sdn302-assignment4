import { Role } from "@/shared/types/role.enum";

export class CreateUserCommand {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public role: Role,
  ) {}
}
