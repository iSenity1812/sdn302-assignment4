export const questionEndpoints = {
  create: "/questions",
  search: "/questions",
  getAll: "/questions/all",
  getById: (id: string) => `/questions/${id}`,
  update: (id: string) => `/questions/${id}`,
  archive: (id: string) => `/questions/${id}/archive`,
  shuffle: "/questions/shuffle",
};
