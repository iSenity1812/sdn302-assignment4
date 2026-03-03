import { injectable } from "inversify";
import { IAuthRepository } from "@/modules/auth/domain/repositories/auth-repository.interface";
import { AuthUser } from "@/modules/auth/domain/model/auth-user.interface";
import { UserModel } from "@/modules/user/infrastructure/database/mongo/user.model";

@injectable()
export class AuthRepository implements IAuthRepository {
  async findById(userId: string): Promise<AuthUser | null> {
    const doc = await UserModel.findById(userId);
    if (!doc) {
      return null;
    }

    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      isDeleted: doc.isDeleted,
      refreshTokenHash: doc.refreshTokenHash,
      passwordResetTokenHash: doc.passwordResetTokenHash,
      passwordResetExpiresAt: doc.passwordResetExpiresAt,
    };
  }

  async findByEmail(email: string): Promise<AuthUser | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) {
      return null;
    }

    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      isDeleted: doc.isDeleted,
      refreshTokenHash: doc.refreshTokenHash,
      passwordResetTokenHash: doc.passwordResetTokenHash,
      passwordResetExpiresAt: doc.passwordResetExpiresAt,
    };
  }

  async setRefreshTokenHash(
    userId: string,
    refreshTokenHash: string | null,
  ): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      refreshTokenHash,
      updatedAt: new Date(),
    });
  }

  async setPasswordResetToken(
    userId: string,
    passwordResetTokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      passwordResetTokenHash,
      passwordResetExpiresAt: expiresAt,
      updatedAt: new Date(),
    });
  }

  async clearPasswordResetToken(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
      updatedAt: new Date(),
    });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
      refreshTokenHash: null,
      updatedAt: new Date(),
    });
  }
}
