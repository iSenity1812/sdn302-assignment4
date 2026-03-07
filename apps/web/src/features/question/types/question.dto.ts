export type QuestionType = "MULTIPLE_CHOICE";

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type QuestionStatus = "ACTIVE" | "ARCHIVED";

export type QuestionDto = {
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
