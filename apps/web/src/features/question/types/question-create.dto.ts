import { Difficulty, QuestionType } from "./question.dto";

export type QuestionCreateDto = {
  authorId?: string;
  content: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  difficulty: Difficulty;
  tags: string[];
  explanation?: string;
};
