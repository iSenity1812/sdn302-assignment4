import { request } from "@/infra/http/fetcher";
import { ApiResponse } from "@/shared/types/http/api-response";
import { UserDto } from "../types/user.dto";
import { userEndpoints } from "@/infra/http/endpoint/user.endpoint";
import { UserRegisterDto } from "../types/user-register.dto";

export const updateUser = (id: string, data: Partial<UserDto>) => {
  return request<ApiResponse<UserDto>>({
    url: userEndpoints.update(id),
    method: "PUT",
    data,
  });
};

export const getUserById = (id: string) => {
  return request<ApiResponse<UserDto>>({
    url: userEndpoints.get(id),
  });
};

export const registerUser = (data: UserRegisterDto) => {
  return request<ApiResponse<UserDto>>({
    url: userEndpoints.register,
    method: "POST",
    data,
  });
};

export const deleteUser = (id: string) => {
  return request<ApiResponse<null>>({
    url: userEndpoints.delete(id),
    method: "DELETE",
  });
};
