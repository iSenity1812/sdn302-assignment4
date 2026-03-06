import { Difficulty } from "@/modules/question/domain/value-objects/difficulty.vo";
import { QuestionStatus } from "@/modules/question/domain/value-objects/question-status.vo";
import { QuestionType } from "@/modules/question/domain/value-objects/question-type.vo";

export interface SeedQuestionInput {
  authorId: string;
  content: string;
  options: string[];
  correctAnswer: string;
  difficulty: Difficulty;
  tags: string[];
  explanation: string;
  status?: QuestionStatus;
}

export function buildQuestion(input: SeedQuestionInput) {
  return {
    authorId: input.authorId,
    content: input.content,
    type: QuestionType.MULTIPLE_CHOICE,
    options: input.options,
    correctAnswer: input.correctAnswer,
    difficulty: input.difficulty,
    tags: input.tags,
    explanation: input.explanation,
    status: input.status ?? QuestionStatus.ACTIVE,
  };
}
