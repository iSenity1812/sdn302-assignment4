export class ForgotPasswordOutput {
  constructor(
    public message: string,
    public resetToken?: string,
  ) {}
}
