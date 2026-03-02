import { IsOptional, MinLength } from "class-validator";
import { IsEmail } from "class-validator";

export class UpdateUserInput {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;
}
