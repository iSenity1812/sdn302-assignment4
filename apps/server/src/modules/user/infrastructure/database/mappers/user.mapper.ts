import { User } from "@/modules/user/domain/entities/user";

export class UserMapper {
  static toDomain(doc: any): User {
    return new User(
      doc._id.toString(),
      doc.name,
      doc.email,
      doc.password,
      doc.createdAt,
      doc.updatedAt,
      doc.isDeleted,
    );
  }

  static toPersistence(user: User) {
    return {
      email: user.email,
      name: user.name,
      password: user.password,
      isDeleted: user.isDeleted,
    };
  }
}
