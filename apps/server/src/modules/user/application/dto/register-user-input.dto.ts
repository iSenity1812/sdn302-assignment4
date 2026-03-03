import { Role } from "@/shared/types/role.enum";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from "class-validator";

export class RegisterUserInput {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  constructor(email: string, name: string, password: string, role?: Role) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.role = role;
  }
}
