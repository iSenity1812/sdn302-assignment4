import { ValidationError } from "@/shared/errors/domain.errors";
import { AbstractUser } from "./user.abstract";

export class User extends AbstractUser {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
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
  }): User {
    return new User(
      props.id,
      props.name,
      props.email,
      props.password,
      new Date(),
      new Date(),
    );
  }

  update(
    fields: Partial<{ email: string; name: string; password: string }>,
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
    this.updatedAt = new Date();
  }

  delete(): void {
    this.isDeleted = true;
    this.updatedAt = new Date();
  }
}
