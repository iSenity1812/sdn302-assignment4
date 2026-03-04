import { Difficulty } from "../value-objects/difficulty.vo";
import { QuestionStatus } from "../value-objects/question-status.vo";

export interface QuestionSearchParams {
  difficulty?: Difficulty;
  tags?: string[];
  status?: QuestionStatus;
  authorId?: string;
}
