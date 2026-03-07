import { Difficulty } from "./question.dto";

export type QuestionShuffleQuery = {
  count: number;
  page?: number;
  limit?: number;
  difficulty?: Difficulty;
  tags?: string | string[];
};
