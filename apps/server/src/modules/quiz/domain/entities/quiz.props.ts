import { QuizQuestion } from "../value-objects/quiz-question.snapshot";
import { QuizStatus } from "../value-objects/quiz-status.vo";

export interface QuizProps {
  title: string;
  description?: string;
  questions: QuizQuestion[];
  createdBy: string;
  status: QuizStatus;
  createdAt: Date;
  updatedAt: Date;
}
