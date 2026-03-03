import { Role } from "@/shared/types/role.enum";
import { AbstractUser } from "./user.abstract";

export class User extends AbstractUser {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: Role,
    public createdAt: Date,
    public updatedAt: Date,
    public isDeleted: boolean = false,
  ) {
    super(id, name, email, password);
  }

  getDisplayName(): string {
    return `${this.name} (${this.email})`;
  }

  static create(props: {
    id: string;
    name: string;
    email: string;
    password: string;
    role?: Role;
  }): User {
    return new User(
      props.id,
      props.name,
      props.email,
      props.password,
      props.role ?? Role.USER,
      new Date(),
      new Date(),
    );
  }

  update(
    fields: Partial<{
      email: string;
      name: string;
      password: string;
      role: Role;
    }>,
  ): void {
    if (fields.name) {
      this.name = fields.name;
    }
    if (fields.email) {
      this.email = fields.email;
    }
    if (fields.password) {
      this.password = fields.password;
    }
    if (fields.role) {
      this.role = fields.role;
    }
    this.updatedAt = new Date();
  }

  delete(): void {
    this.isDeleted = true;
    this.updatedAt = new Date();
  }
}
