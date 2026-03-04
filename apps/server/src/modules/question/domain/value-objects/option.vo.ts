export class Option {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Option value must be a non-empty string");
    }
  }
}