import { QuestionCreateDto } from "@/features/question/types/question-create.dto";

export type QuizAddQuestionsDto = {
  questionIds?: string[];
  questions?: QuestionCreateDto[];
};
