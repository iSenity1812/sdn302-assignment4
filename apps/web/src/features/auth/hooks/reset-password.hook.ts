import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../api/auth.api";
import { AuthResetPasswordDto } from "../types/auth-reset-password.dto";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: AuthResetPasswordDto) => resetPassword(data),
  });
};
