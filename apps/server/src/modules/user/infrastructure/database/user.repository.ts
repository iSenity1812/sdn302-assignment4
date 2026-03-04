import { injectable } from "inversify";
import { IUserRepository } from "../../domain/repositories/user-repository.interface";
import { User } from "../../domain/entities/user";
import { UserModel } from "./model/user.model";
import { UserMapper } from "./mappers/user.mapper";
import mongoose from "mongoose";

/**
 * This is the concrete implementation of the IUserRepository interface using MongoDB as the persistence layer.
 * It uses Mongoose for database interactions and maps between the User domain entity and the MongoDB document structure.
 * The repository is responsible for performing CRUD operations on the User collection in the database.
 */
@injectable()
export class UserRepository implements IUserRepository {
  async findById(userId: string): Promise<User | null> {
    const doc = await UserModel.findById(userId);
    return doc ? UserMapper.toDomain(doc) : null;
  }
  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    return doc ? UserMapper.toDomain(doc) : null;
  }
  async update(user: User): Promise<void> {
    await UserModel.findByIdAndUpdate(user.id, UserMapper.toPersistence(user));
  }
  async delete(userId: string): Promise<void> {
    await UserModel.deleteOne({ _id: userId });
  }
  async save(user: User): Promise<User> {
    const objectId = new mongoose.Types.ObjectId();
    const doc = await UserModel.create({
      _id: objectId,
      ...UserMapper.toPersistence(user),
    });
    return UserMapper.toDomain(doc);
  }
}
