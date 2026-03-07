import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../api/auth.api";
import { AuthForgotPasswordDto } from "../types/auth-forgot-password.dto";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: AuthForgotPasswordDto) => forgotPassword(data),
  });
};
