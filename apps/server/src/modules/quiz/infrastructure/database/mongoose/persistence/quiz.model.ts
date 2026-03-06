import { Document, model } from "mongoose";
import { QuizSchema } from "./quiz.schema";

export interface QuizQuestionDocument {
  id: string;
  content: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
  type: string;
  explanation?: string;
}

export interface QuizDocument extends Document {
  title: string;
  description?: string;
  createdBy: string;
  status: string;
  questions: QuizQuestionDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export const QuizModel = model<QuizDocument>("Quiz", QuizSchema);
