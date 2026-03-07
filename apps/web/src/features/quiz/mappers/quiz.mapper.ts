import { Quiz } from "../types/quiz";
import { QuizDto } from "../types/quiz.dto";

export const QuizMapper = (dto: QuizDto): Quiz => ({
  id: dto.id,
  title: dto.title,
  description: dto.description,
  createdBy: dto.createdBy,
  status: dto.status,
  questions: dto.questions,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});
