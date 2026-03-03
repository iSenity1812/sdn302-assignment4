import { IsOptional, MinLength } from "class-validator";
import { IsEmail } from "class-validator";
import { IsEnum } from "class-validator";
import { Role } from "@/shared/types/role.enum";

export class UpdateUserInput {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
