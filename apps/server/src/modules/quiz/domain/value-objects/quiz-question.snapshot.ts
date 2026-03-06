import { QuizOption } from "./quiz-option.snapshot";

export interface QuizQuestionProps {
  id: string;
  content: string;
  options: QuizOption[];
  correctAnswer: string;
  difficulty: string; // e.g., "easy", "medium", "hard"
  type: string; // e.g., "multiple-choice", "true-false"
  explanation?: string;
}

export class QuizQuestion {
  constructor(public props: QuizQuestionProps) {}

  get id(): string {
    return this.props.id;
  }

  get content() {
    return this.props.content;
  }

  get options() {
    return this.props.options;
  }

  get correctAnswer() {
    return this.props.correctAnswer;
  }

  get difficulty() {
    return this.props.difficulty;
  }

  get type() {
    return this.props.type;
  }

  get explanation() {
    return this.props.explanation;
  }
}
