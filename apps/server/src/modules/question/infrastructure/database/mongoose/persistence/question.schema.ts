import { Schema } from "mongoose";

export const QuestionSchema = new Schema(
  {
    authorId: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    difficulty: { type: String, required: true },
    tags: [{ type: String }],
    explanation: { type: String },
    status: { type: String, required: true },
  },
  { timestamps: true }, // creates createdAt and updatedAt fields automatically
);
