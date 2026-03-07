import { Difficulty, QuestionStatus } from "./question.dto";

export type QuestionSearchQuery = {
  page?: number;
  limit?: number;
  difficulty?: Difficulty;
  status?: QuestionStatus;
  authorId?: string;
  tags?: string | string[];
};
