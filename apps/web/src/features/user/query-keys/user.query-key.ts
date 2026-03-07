export const userQueryKeys = {
  all: ["users"] as const,
  detail: (id: string) => [...userQueryKeys.all, "detail", id] as const,
  details: () => [...userQueryKeys.all, "details"] as const,
};
