export const authQueryKeys = {
  all: ["auth"] as const,
  me: () => [...authQueryKeys.all, "me"] as const,
  login: () => [...authQueryKeys.all, "login"] as const,
  refresh: () => [...authQueryKeys.all, "refresh"] as const,
  logout: () => [...authQueryKeys.all, "logout"] as const,
  changePassword: () => [...authQueryKeys.all, "change-password"] as const,
  forgotPassword: () => [...authQueryKeys.all, "forgot-password"] as const,
  resetPassword: () => [...authQueryKeys.all, "reset-password"] as const,
};
