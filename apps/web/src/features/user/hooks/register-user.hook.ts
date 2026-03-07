import { useMutation } from "@tanstack/react-query";
import { UserRegisterDto } from "../types/user-register.dto";
import { registerUser } from "../api/user.api";

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: (data: UserRegisterDto) => registerUser(data),
  });
};
  