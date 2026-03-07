import { QuizStatus } from "./quiz.dto";

export type QuizSearchQuery = {
  page?: number;
  limit?: number;
  createdBy?: string;
  status?: QuizStatus;
};
