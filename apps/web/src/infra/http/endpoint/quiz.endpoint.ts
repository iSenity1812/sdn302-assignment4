export const quizEndpoints = {
  create: "/quizzes",
  search: "/quizzes",
  getAll: "/quizzes/all",
  getById: (id: string) => `/quizzes/${id}`,
  update: (id: string) => `/quizzes/${id}`,
  archive: (id: string) => `/quizzes/${id}/archive`,
  publish: (id: string) => `/quizzes/${id}/publish`,
  addQuestions: (id: string) => `/quizzes/${id}/questions`,
  removeQuestion: (quizId: string, questionId: string) =>
    `/quizzes/${quizId}/questions/${questionId}`,
};
