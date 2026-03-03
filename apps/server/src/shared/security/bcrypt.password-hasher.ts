import { injectable } from "inversify";
import { IPasswordHasher } from "./password-hasher.interface";
import bcrypt from "bcrypt";

@injectable()
export class BcryptPasswordHasher implements IPasswordHasher {
  async hash(raw: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(raw, saltRounds);
  }

  async compare(raw: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(raw, hashed);
  }
}
