export const QUESTION_TYPES = {
  Service: Symbol.for("Question.Service"),
  Repository: Symbol.for("Question.Repository"),
  Controller: Symbol.for("Question.Controller"),
  UseCase: {
    CreateQuestion: Symbol.for("Question.UseCase.CreateQuestion"),
  }
}