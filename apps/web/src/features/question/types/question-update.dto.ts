import { Difficulty } from "./question.dto";

export type QuestionUpdateDto = {
  content?: string;
  options?: string[];
  correctAnswer?: string;
  difficulty?: Difficulty;
  tags?: string[];
  explanation?: string;
};
