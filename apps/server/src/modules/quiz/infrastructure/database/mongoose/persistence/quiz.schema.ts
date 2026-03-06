import { Schema } from "mongoose";

export const QuizSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    createdBy: { type: String, required: true },
    status: { type: String, required: true },
    questions: [
      {
        id: { type: String, required: true },
        content: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: String, required: true },
        difficulty: { type: String, required: true },
        type: { type: String, required: true },
        explanation: { type: String },
      },
    ],
  },
  { timestamps: true },
);
