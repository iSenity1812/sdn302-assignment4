import { Role } from "@/shared/types/role.enum";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isDeleted: boolean;
}
