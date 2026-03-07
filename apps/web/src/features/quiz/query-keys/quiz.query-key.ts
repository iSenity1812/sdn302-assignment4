export const quizQueryKeys = {
  all: ["quizzes"] as const,
  details: () => [...quizQueryKeys.all, "details"] as const,
  detail: (id: string) => [...quizQueryKeys.all, "detail", id] as const,
  search: (params?: Record<string, unknown>) =>
    [...quizQueryKeys.all, "search", params ?? {}] as const,
};
