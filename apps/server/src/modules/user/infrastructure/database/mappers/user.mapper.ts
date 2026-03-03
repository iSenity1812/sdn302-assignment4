import { User } from "@/modules/user/domain/entities/user";
import { Role } from "@/shared/types/role.enum";

interface UserDocumentShape {
  _id: { toString(): string };
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export class UserMapper {
  static toDomain(doc: UserDocumentShape): User {
    return new User(
      doc._id.toString(),
      doc.name,
      doc.email,
      doc.password,
      doc.role as Role,
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
      role: user.role,
      isDeleted: user.isDeleted,
    };
  }
}
