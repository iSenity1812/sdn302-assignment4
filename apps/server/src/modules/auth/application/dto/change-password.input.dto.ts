import { IsNotEmpty, MinLength } from "class-validator";

export class ChangePasswordInput {
  @IsNotEmpty()
  @MinLength(6)
  currentPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  constructor(currentPassword: string, newPassword: string) {
    this.currentPassword = currentPassword;
    this.newPassword = newPassword;
  }
}
