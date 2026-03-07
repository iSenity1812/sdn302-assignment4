export const questionQueryKeys = {
  all: ["questions"] as const,
  details: () => [...questionQueryKeys.all, "details"] as const,
  detail: (id: string) => [...questionQueryKeys.all, "detail", id] as const,
  search: (params?: Record<string, unknown>) =>
    [...questionQueryKeys.all, "search", params ?? {}] as const,
  shuffle: (params?: Record<string, unknown>) =>
    [...questionQueryKeys.all, "shuffle", params ?? {}] as const,
};
