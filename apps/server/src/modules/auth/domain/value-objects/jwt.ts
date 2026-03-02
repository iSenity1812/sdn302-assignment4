export class JWT {
  constructor(
    public accessToken: string,
    public refreshToken: string,
    public expiresIn: number,
  ) {}
}
