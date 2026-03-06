import { QuizStatus } from "../../domain/value-objects/quiz-status.vo";

export interface ResponseQuizQuestion {
  id: string;
  content: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
  type: string;
  explanation?: string;
}

export interface ResponseQuiz {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  status: QuizStatus;
  questions: ResponseQuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}
