# Quiz Module Overview

## 1. Purpose

The `quiz` module manages quiz lifecycle and question composition workflows:

- Create quiz
- Get quiz by id
- Get all quizzes
- Search quizzes with filters + pagination
- Update quiz metadata
- Add questions into a quiz (existing question IDs and/or inline question payloads)
- Remove a question from quiz
- Publish quiz
- Archive quiz

This module follows **Clean Architecture** and is implemented as an isolated domain module in the modular monolith.

---

## 2. Module Structure

```text
quiz/
├── application/
│   ├── dto/
│   ├── mappers/
│   ├── queries/
│   ├── repositories/
│   └── usecases/
├── di/
├── domain/
│   ├── entities/
│   ├── errors/
│   ├── events/
│   ├── repositories/
│   └── value-objects/
├── infrastructure/
│   └── database/
│       └── mongoose/
└── presentation/
```

### Layer responsibilities

- **presentation**: HTTP routes/controller (`quiz.route.ts`, `quiz.controller.ts`), auth + role guard integration
- **application**: orchestration use cases, cross-module collaboration with question module, pagination/query shaping, response mapping
- **domain**: aggregate (`Quiz`), snapshot value objects (`QuizQuestion`, `QuizOption`), status enum, events, errors, repository contracts
- **infrastructure**: Mongoose schema/model, persistence mapper, repository/query-repository implementations

---

## 3. Public HTTP API

Route prefix constants:

- `API_PREFIX = /api/v1`
- `QUIZ_PREFIX = /quizzes`

All endpoints require JWT auth (`passport jwt`) and role guard.

Effective endpoints:

- `POST /api/v1/quizzes` (ADMIN) -> create quiz
- `GET /api/v1/quizzes` (USER, ADMIN) -> search quizzes
- `GET /api/v1/quizzes/all` (USER, ADMIN) -> get all quizzes
- `GET /api/v1/quizzes/:id` (USER, ADMIN) -> get quiz by id
- `PUT /api/v1/quizzes/:id` (ADMIN) -> update quiz metadata
- `POST /api/v1/quizzes/:id/questions` (ADMIN) -> add questions into quiz
- `DELETE /api/v1/quizzes/:id/questions/:questionId` (ADMIN) -> remove question from quiz
- `PATCH /api/v1/quizzes/:id/publish` (ADMIN) -> publish quiz
- `PATCH /api/v1/quizzes/:id/archive` (ADMIN) -> archive quiz

Common query params:

- Search: `page`, `limit`, `createdBy`, `status`

Responses are wrapped via shared response builders:

- `ok(...)` for single/list payloads
- `paginated(...)` for paged responses

---

## 4. Dependency Injection (Inversify)

Registered in `quiz.module.ts`:

- `IQuizRepository` -> `QuizRepository`
- `IQuizQueryRepository` -> `QuizQueryRepository`
- `QuizController`
- Use cases:
  - `CreateQuizUseCase`
  - `GetQuizUseCase`
  - `GetAllQuizUseCase`
  - `SearchQuizUseCase`
  - `UpdateQuizUseCase`
  - `AddQuizQuestionsUseCase`
  - `RemoveQuizQuestionUseCase`
  - `PublishQuizUseCase`
  - `ArchiveQuizUseCase`

Cross-module dependency:

- `AddQuizQuestionsUseCase` injects `IQuestionRepository` from the `question` module.

Token source: `di/quiz.token.ts`.

---

## 5. Core Business Flow

### Create quiz

1. Resolve `createdBy` from body or authenticated user
2. Build aggregate with `Quiz.create(...)` (initial status `DRAFT`)
3. Persist via repository
4. Publish domain events and clear events

### Get quiz

1. Validate `id` from route params
2. Load by `findById`
3. Map to `ResponseQuiz`

Note: current use case returns `null` when not found (does not throw `QuizNotFoundError`).

### Get all quizzes

1. Load all via repository
2. Map to `ResponseQuiz[]`

### Search quizzes

1. Normalize paging (`PaginationQuery`)
2. Build query filters (`createdBy`, `status`)
3. Query via query-repository (`search`)
4. Return `Page<ResponseQuiz>`

### Update quiz metadata

1. Validate `id` and load aggregate
2. Apply title/description changes (`updateQuiz`)
3. Persist, publish events, clear events

### Add questions to quiz

1. Validate quiz id and load quiz aggregate
2. Accept at least one source:
   - `questionIds` for existing questions
   - `questions` for inline question creation
3. For `questionIds`:
   - de-duplicate ids
   - ensure all ids exist
   - reject archived questions
4. For inline `questions`:
   - create and save new `Question` aggregates via question repository
   - default tags to `['quiz']` when omitted
5. Convert collected questions to quiz snapshots (`QuizQuestion` + `QuizOption`)
6. Add into quiz aggregate (`quiz.addQuestions`), persist, publish events, clear events

### Remove question from quiz

1. Validate identifiers and load aggregate
2. Remove question snapshot by id (`quiz.removeQuestion`)
3. Persist, publish events, clear events

### Publish quiz

1. Validate `id` and load aggregate
2. Call `quiz.publish()`
3. Enforce business rule: quiz must contain at least one question
4. Persist, publish events, clear events

### Archive quiz

1. Validate `id` and load aggregate
2. Call `quiz.archive()` (status -> `ARCHIVED`)
3. Persist, publish events, clear events

---

## 6. Domain Model Notes

`Quiz` aggregate fields:

- `id`, `title`, `description`, `createdBy`
- `status`, `questions`
- `createdAt`, `updatedAt`

Question snapshot in quiz:

- `id`, `content`, `options`, `correctAnswer`, `difficulty`, `type`, `explanation`

Status lifecycle:

- `DRAFT` -> `PUBLISHED` -> `ARCHIVED`

Domain behaviors:

- `Quiz.create(...)`
- `Quiz.reconstitute(...)`
- `addQuestions(...)`
- `removeQuestion(...)`
- `updateQuiz(...)`
- `publish()`
- `archive()`

Domain events:

- `QuizCreatedEvent`
- `QuizQuestionAddedEvent`
- `QuizRemoveQuestionEvent`
- `QuizUpdateEvent`

Important invariants:

- Duplicate question ids are not allowed inside one quiz
- Cannot remove a question that is not present in the quiz
- Cannot publish a quiz with zero questions

---

## 7. Error Handling

Module-specific errors include:

- `QuizValidationError`
- `QuizNotFoundError`
- `QuizError`

Controllers forward errors via `next(error)` for centralized middleware handling.

---

## 8. Extension Guidelines

To extend this module safely:

1. Add/adjust use case in `application/usecases`
2. Keep domain rules in `domain` pure (no framework/database dependencies)
3. Keep question snapshot structure stable when changing quiz-question shape
4. Update persistence mapper/schema in `infrastructure/database/mongoose`
5. Expose new endpoint in `presentation` and enforce role constraints
6. Register dependencies and new use case tokens in `quiz.module.ts`
