import {
  IsBoolean,
  IsEmail,
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
  @IsBoolean()
  isAdmin?: boolean;

  constructor(email: string, name: string, password: string, isAdmin?: boolean) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.isAdmin = isAdmin;
  }
}
