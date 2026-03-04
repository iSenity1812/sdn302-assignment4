import { Document, model } from "mongoose";
import { QuestionSchema } from "./question.schema";

export interface QuestionDocument extends Document {
  authorId: string;
  content: string;
  type: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
  tags: string[];
  explanation?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export const QuestionModel = model<QuestionDocument>(
  "Question",
  QuestionSchema,
);
