export interface QuizOptionProps {
  value: string;
}

export class QuizOption {
  constructor(public props: QuizOptionProps) {}
  get value(): string {
    return this.props.value;
  }
}
