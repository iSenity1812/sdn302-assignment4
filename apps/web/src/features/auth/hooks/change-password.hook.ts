import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../api/auth.api";
import { AuthChangePasswordDto } from "../types/auth-change-password.dto";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: AuthChangePasswordDto) => changePassword(data),
  });
};
