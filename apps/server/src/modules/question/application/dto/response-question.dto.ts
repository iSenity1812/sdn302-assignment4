import { Expose } from "class-transformer";

export class ResponseQuestion {
  @Expose() id!: string;
  @Expose() authorId!: string;
  @Expose() content!: string;
  @Expose() type!: string;
  @Expose() options!: string[];
  @Expose() correctAnswer!: string;
  @Expose() difficulty!: string;
  @Expose() tags!: string[];
  @Expose() explanation?: string;
  @Expose() createdAt!: Date;
  @Expose() updatedAt!: Date;
}
