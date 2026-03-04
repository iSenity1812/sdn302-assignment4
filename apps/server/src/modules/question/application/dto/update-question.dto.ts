export interface UpdateQuestionInput {
  id: string;
  content?: string;
  options?: string[];
  correctAnswer?: string;
  difficulty?: string;
  tags?: string[];
  explanation?: string;
}