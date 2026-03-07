export type AuthMeDto = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
};
