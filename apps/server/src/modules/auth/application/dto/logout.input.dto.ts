import { IsNotEmpty } from "class-validator";

export class LogoutInput {
  @IsNotEmpty()
  refreshToken!: string;
}
