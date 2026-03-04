import { Difficulty } from "../value-objects/difficulty.vo";

export interface RandomQuestionParams {
  count: number;
  difficulty?: Difficulty;
  tags?: string[];
}
