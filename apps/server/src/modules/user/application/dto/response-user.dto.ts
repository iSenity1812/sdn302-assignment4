import { Role } from "@/shared/types/role.enum";

export class ResponseUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isDeleted: boolean;
  createdAt: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    role: Role,
    isDeleted: boolean,
    createdAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.isDeleted = isDeleted;
    this.createdAt = createdAt;
  }
}
