export interface ResponseQuestion {
  id: string;
  authorId: string;
  content: string;
  type: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
  tags: string[];
  explanation?: string;
  createdAt: Date;
  updatedAt: Date;
}
