import { Difficulty, QuestionStatus, QuestionType } from "./question.dto";

export type Question = {
  id: string;
  authorId: string;
  content: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  difficulty: Difficulty;
  tags: string[];
  explanation?: string;
  status?: QuestionStatus;
  createdAt: string;
  updatedAt: string;
};
