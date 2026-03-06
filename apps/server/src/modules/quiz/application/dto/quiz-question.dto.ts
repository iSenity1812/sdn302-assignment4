export interface QuizQuestionInput {
  id?: string;
  content: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
  type?: string;
  tags?: string[];
  explanation?: string;
}
