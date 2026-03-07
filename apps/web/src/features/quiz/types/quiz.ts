import { QuizQuestionDto, QuizStatus } from "./quiz.dto";

export type Quiz = {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  status: QuizStatus;
  questions: QuizQuestionDto[];
  createdAt: string;
  updatedAt: string;
};
