export abstract class AbstractUser {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
  ) {}

  abstract getDisplayName(): string;
}
