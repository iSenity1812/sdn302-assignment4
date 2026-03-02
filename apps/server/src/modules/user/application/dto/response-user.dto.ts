export class ResponseUser {
  id: string;
  name: string;
  email: string;
  isDeleted: boolean;
  createdAt: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    isDeleted: boolean,
    createdAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.isDeleted = isDeleted;
    this.createdAt = createdAt;
  }
}
