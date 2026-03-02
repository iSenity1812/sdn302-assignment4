import { Role } from "../types/role.enum";

export class User {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public roles: Role,
  ) {}
}
