export class AuthTokenDto {
  constructor(
    public accessToken: string,
    public refreshToken: string,
    public tokenType: string,
    public expiresIn: string,
  ) {}
}
