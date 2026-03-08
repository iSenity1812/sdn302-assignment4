import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { httpClient } from "./client";
import { useAuthStore } from "@/stores/auth.store";
import { refresh } from "@/features/auth/api/auth.api";
import { authEndpoints } from "./endpoint/auth.endpoint";

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

const getRequestUrl = (config?: InternalAxiosRequestConfig): string => {
  if (!config?.url) {
    return "";
  }

  return config.url;
};

const resolveAuthzResourceHeader = (url: string): string | undefined => {
  if (url.includes(authEndpoints.logout)) {
    return "logout";
  }

  if (url.startsWith("/quizzes")) {
    return "quiz";
  }

  if (url.startsWith("/questions")) {
    return "question";
  }

  return undefined;
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
  const url = getRequestUrl(config);
  const { accessToken } = useAuthStore.getState();

  if (accessToken && !url.includes(authEndpoints.refresh)) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  const resource = resolveAuthzResourceHeader(url);
  if (resource) {
    config.headers["x-auth-resource"] = resource;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    if (!error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const requestUrl = getRequestUrl(originalRequest);

    const { refreshToken, setTokens, clearTokens } = useAuthStore.getState();

    if (requestUrl.includes(authEndpoints.refresh)) {
      clearTokens();
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers = originalRequest.headers ?? {};
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

        originalRequest.headers = originalRequest.headers ?? {};
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
