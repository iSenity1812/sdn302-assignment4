import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { httpClient } from "./client";
import { useAuthStore } from "@/stores/auth.store";
import { refresh } from "@/features/auth/api/auth.api";

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

const processQueue = (error: unknown, token?: string) => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else if (token) {
      p.resolve(token);
    }
  });

  failedQueue = [];
};

httpClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const { refreshToken, setTokens, clearTokens } = useAuthStore.getState();

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(httpClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await refresh(refreshToken);

        if (!res.success) {
          throw new Error("Failed to refresh token");
        }
        const token = res.data;
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          token;

        setTokens(newAccessToken, newRefreshToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return httpClient(originalRequest);
      } catch (err) {
        processQueue(err);
        clearTokens();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
