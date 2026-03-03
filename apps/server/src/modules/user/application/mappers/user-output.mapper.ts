import { ResponseUser } from "@user/application/dto/response-user.dto";
import { User } from "@/modules/user/domain/entities/user";

export class UserOutputMapper {
  static toResponse(user: User): ResponseUser {
    return new ResponseUser(
      user.id,
      user.name,
      user.email,
      user.role,
      user.isDeleted,
      user.createdAt,
    );
  }
}
