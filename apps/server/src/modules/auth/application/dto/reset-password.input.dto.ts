import { IsNotEmpty, MinLength } from "class-validator";

export class ResetPasswordInput {
  @IsNotEmpty()
  token!: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword!: string;
}
