import { QuestionDto } from "../types/question.dto";
import { Question } from "../types/question";

export const QuestionMapper = (dto: QuestionDto): Question => ({
  id: dto.id,
  authorId: dto.authorId,
  content: dto.content,
  type: dto.type,
  options: dto.options,
  correctAnswer: dto.correctAnswer,
  difficulty: dto.difficulty,
  tags: dto.tags,
  explanation: dto.explanation,
  status: dto.status,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});
