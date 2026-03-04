export interface CreateQuestionInput {
  authorId: string;
  content: string;
  type: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
  tags: string[];
  explanation?: string;
}