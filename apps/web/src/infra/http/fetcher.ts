import { AxiosRequestConfig } from "axios";
import { httpClient } from "./client";
import "./interceptor";

export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const res = await httpClient.request<T>({
    method: config.method ?? "GET",
    ...config,
  });
  return res.data;
};
