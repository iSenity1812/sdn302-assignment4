import { User } from "../entities/user";

export interface IUserRepository {
  findById(userId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(user: User): Promise<void>;
  delete(userId: string): Promise<void>;
  save(user: Omit<User, "id">): Promise<User>;
}
