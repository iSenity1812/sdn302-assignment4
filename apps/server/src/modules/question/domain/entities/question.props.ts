import { Option } from "@question/domain/value-objects/option.vo";
import { QuestionType } from "@question/domain/value-objects/question-type.vo";
import { Difficulty } from "@question/domain/value-objects/difficulty.vo";
import { QuestionStatus } from "@question/domain/value-objects/question-status.vo";

export interface QuestionProps {
  authorId: string;
  content: string;
  type: QuestionType;
  options: Option[];
  correctAnswer: string;
  difficulty: Difficulty;
  tags: string[]; // keywords for categorization
  explanation?: string; // optional explanation for the answer
  status: QuestionStatus;
  createdAt: Date;
  updatedAt: Date;
}
