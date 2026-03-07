import { request } from "@/infra/http/fetcher";
import { ApiResponse } from "@/shared/types/http/api-response";
import { AuthToken } from "../types/auth-token";
import { authEndpoints } from "@/infra/http/endpoint/auth.endpoint";
import { AuthLoginDto } from "../types/auth-login.dto";
import { AuthMeDto } from "../types/auth-me.dto";
import { AuthLogoutDto } from "../types/auth-logout.dto";
import { AuthChangePasswordDto } from "../types/auth-change-password.dto";
import { AuthForgotPasswordDto } from "../types/auth-forgot-password.dto";
import {
  AuthForgotPasswordResultDto,
  AuthFlagResultDto,
} from "../types/auth-result.dto";
import { AuthResetPasswordDto } from "../types/auth-reset-password.dto";

export const login = (data: AuthLoginDto) => {
  return request<ApiResponse<AuthToken>>({
    url: authEndpoints.login,
    method: "POST",
    data,
  });
};

export const refresh = (refreshToken: string) => {
  return request<ApiResponse<AuthToken>>({
    url: authEndpoints.refresh,
    method: "POST",
    data: { refreshToken },
  });
};

export const me = () => {
  return request<ApiResponse<AuthMeDto>>({
    url: authEndpoints.me,
  });
};

export const logout = (data: AuthLogoutDto) => {
  return request<ApiResponse<AuthFlagResultDto>>({
    url: authEndpoints.logout,
    method: "POST",
    data,
  });
};

export const changePassword = (data: AuthChangePasswordDto) => {
  return request<ApiResponse<AuthFlagResultDto>>({
    url: authEndpoints.changePassword,
    method: "POST",
    data,
  });
};

export const forgotPassword = (data: AuthForgotPasswordDto) => {
  return request<ApiResponse<AuthForgotPasswordResultDto>>({
    url: authEndpoints.forgotPassword,
    method: "POST",
    data,
  });
};

export const resetPassword = (data: AuthResetPasswordDto) => {
  return request<ApiResponse<AuthFlagResultDto>>({
    url: authEndpoints.resetPassword,
    method: "POST",
    data,
  });
};
