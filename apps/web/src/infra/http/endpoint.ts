/**
 * This file defines the API endpoints for the application. Each endpoint is a string that represents the URL path to the resource.
 */
export const endpoints = {
  auth: {
    login: "/auth/login",
    refreshToken: "/auth/refresh",
    me: "/auth/me",
    logout: "/auth/logout",
  },
  users: {
    list: "/users",
    create: "/users",
    get: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
};
