# Question Module Overview

## 1. Purpose

The `question` module manages question lifecycle and retrieval workflows:

- Create question
- Get question by id
- Get all questions
- Search questions with filters + pagination
- Shuffle random active questions with filters + pagination
- Update question
- Archive question

This module follows **Clean Architecture** and is implemented as an isolated domain module in the modular monolith.

---

## 2. Module Structure

```text
question/
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

- **presentation**: HTTP controller and routes (`question.controller.ts`, `question.route.ts`), auth + role guard integration
- **application**: use case orchestration, paging/query shaping, response mapping
- **domain**: aggregate (`Question`), value objects, invariants, domain errors, domain events, repository contracts
- **infrastructure**: Mongoose schema/model, persistence mapper, repository and query-repository implementations

---

## 3. Public HTTP API

Route prefix constants:

- `API_PREFIX = /api/v1`
- `QUESTION_PREFIX = /questions`

All endpoints require JWT auth (`passport jwt`) and role guard.

Effective endpoints:

- `POST /api/v1/questions` (ADMIN) -> create question
- `GET /api/v1/questions` (USER, ADMIN) -> search questions
- `GET /api/v1/questions/all` (USER, ADMIN) -> get all questions
- `GET /api/v1/questions/shuffle` (USER, ADMIN) -> get shuffled active questions
- `GET /api/v1/questions/:id` (USER, ADMIN) -> get question by id
- `PUT /api/v1/questions/:id` (ADMIN) -> update question
- `PATCH /api/v1/questions/:id/archive` (ADMIN) -> archive question

Common query params:

- Search: `page`, `limit`, `difficulty`, `status`, `authorId`, `tags` (comma-separated or array)
- Shuffle: `count` (required), `page`, `limit`, `difficulty`, `tags`

Responses are wrapped via shared response builders:

- `ok(...)` for single/list payloads
- `paginated(...)` for paged responses

---

## 4. Dependency Injection (Inversify)

Registered in `question.module.ts`:

- `IQuestionRepository` -> `QuestionRepository`
- `IQuestionQueryRepository` -> `questionQueryRepository`
- `QuestionController`
- Use cases:
  - `CreateQuestionUseCase`
  - `GetQuestionUseCase`
  - `GetAllQuestionUseCase`
  - `SearchQuestionUseCase`
  - `ShuffleQuestionUseCase`
  - `UpdateQuestionUseCase`
  - `ArchiveQuestionUseCase`

Token source: `di/question.token.ts`.

---

## 5. Core Business Flow

### Create question

1. Resolve `authorId` from body or authenticated user
2. Build aggregate with `Question.create(...)`
3. Validate domain invariants (content/options/correct answer)
4. Persist through repository
5. Publish domain events and clear pending events

### Get question

1. Validate `id` from route params
2. Load by `findById`
3. Map to `ResponseQuestion`

Note: current use case returns `null` when not found (does not throw `QuestionNotFoundError`).

### Get all questions

1. Load all via repository
2. Map each aggregate to `ResponseQuestion`

### Search questions

1. Normalize paging (`PaginationQuery`)
2. Build search filters (`difficulty`, `status`, `authorId`, `tags`)
3. Query via query-repository (`search`)
4. Publish `QuestionSearchedEvent`
5. Return `Page<ResponseQuestion>`

### Shuffle questions

1. Require `count > 0`
2. Normalize paging (`PaginationQuery`)
3. Query active questions via random sampling (`getShuffleQuestions`)
4. Return `Page<ResponseQuestion>`

### Update question

1. Validate `id` and load aggregate
2. Apply partial updates (`content`, `options/correctAnswer`, `difficulty`, `tags`, `explanation`)
3. Enforce domain constraints and archived protections
4. Call `commitChanges()` to append update event when dirty
5. Persist, publish events, clear events

### Archive question

1. Validate `id` and load aggregate
2. Apply `question.archive()` (state to `ARCHIVED`)
3. Persist, publish events, clear events

---

## 6. Domain Model Notes

`Question` aggregate fields:

- `id`, `authorId`, `content`, `type`
- `options`, `correctAnswer`
- `difficulty`, `tags`, `explanation`
- `status`, `createdAt`, `updatedAt`

Core enums/value objects:

- `QuestionType`: `MULTIPLE_CHOICE`
- `Difficulty`: `EASY | MEDIUM | HARD`
- `QuestionStatus`: `ACTIVE | ARCHIVED`
- `Option` value object for option normalization/validation

Domain behaviors:

- `Question.create(...)`
- `Question.reconstitute(...)`
- `updateContent`, `updateOptions`, `updateDifficulty`, `updateTags`, `updateExplanation`
- `archive()`, `commitChanges()`

Domain events:

- `QuestionCreatedEvent`
- `QuestionUpdatedEvent`
- `QuestionArchivedEvent`
- `QuestionSearchedEvent`

Important invariants:

- Question content cannot be empty
- Multiple-choice question requires at least 2 unique options
- Correct answer must exist in options
- Archived questions cannot be modified

---

## 7. Error Handling

Module-specific errors include:

- `QuestionValidationError`
- `QuestionEmptyOptionError`
- `QuestionNotEnoughOptionsError`
- `QuestionNotFoundError`
- `QuestionNotAnswerableError`

Controllers forward errors via `next(error)` for centralized middleware handling.

---

## 8. Extension Guidelines

To extend this module safely:

1. Add/adjust use case in `application/usecases`
2. Keep domain rules in `domain` pure (no framework/database dependencies)
3. Implement new persistence/query behavior in `infrastructure/database/mongoose`
4. Expose endpoint in `presentation` and enforce role constraints
5. Register dependencies and use case tokens in `question.module.ts`
6. Keep response mapping in `application/mappers` to avoid leaking domain internals
