import { QuizDto } from "@/features/quiz/types/quiz.dto";

export type ExamStage = "catalog" | "attempt" | "result";

export type ExamAnswers = Record<string, string>;

export type ExamSummary = {
  score: number;
  total: number;
  percent: number;
};

export type ActiveExam = {
  quiz: QuizDto;
  currentIndex: number;
  answers: ExamAnswers;
  stage: ExamStage;
};
