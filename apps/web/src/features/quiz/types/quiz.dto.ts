export type QuizStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type QuizQuestionDto = {
  id: string;
  content: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
  type: string;
  explanation?: string;
};

export type QuizDto = {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  status: QuizStatus;
  questions: QuizQuestionDto[];
  createdAt: string;
  updatedAt: string;
};
