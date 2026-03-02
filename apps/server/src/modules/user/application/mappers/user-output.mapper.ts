import { ResponseUser } from "@user/application/dto/response-user.dto";

export class UserOutputMapper {
  static toResponse(user: any): ResponseUser {
    return new ResponseUser(user.id, user.name, user.email, user.createdAt);
  }
}
