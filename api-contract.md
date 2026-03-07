# API Contract for Frontend

## 1. Scope

This document defines the HTTP contract between `apps/web` and `apps/server`.

Base URL:

- Local: `http://localhost:3000/api/v1`

Content type:

- Request: `application/json`
- Response: `application/json`

Authentication:

- Protected endpoints require `Authorization: Bearer <accessToken>`

Roles:

- `ADMIN`
- `USER`

---

## 2. Global Response Envelope

Success response shape:

```json
{
  "success": true,
  "data": {},
  "message": "optional",
  "meta": {
    "timestamp": "2026-03-07T10:10:10.000Z"
  }
}
```

Error response shape:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation error",
    "details": {}
  },
  "meta": {
    "timestamp": "2026-03-07T10:10:10.000Z"
  }
}
```

Paginated success shape:

```json
{
  "success": true,
  "data": [],
  "message": "optional",
  "meta": {
    "timestamp": "2026-03-07T10:10:10.000Z",
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 23,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

Notes:

- Date fields are serialized as ISO strings in JSON responses.
- Some read endpoints return `200` with `data: null` when record is not found.

---

## 3. Shared Enums

```ts
export type Role = "ADMIN" | "USER";
export type QuestionType = "MULTIPLE_CHOICE";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type QuestionStatus = "ACTIVE" | "ARCHIVED";
export type QuizStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
```

---

## 4. Core Data Models (Frontend)

```ts
export interface ResponseUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isDeleted: boolean;
  createdAt: string;
}

export interface AuthTokenDto {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: string;
}

export interface ResponseQuestion {
  id: string;
  authorId: string;
  content: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  difficulty: Difficulty;
  tags: string[];
  explanation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResponseQuizQuestion {
  id: string;
  content: string;
  options: string[];
  correctAnswer: string;
  difficulty: Difficulty | string;
  type: QuestionType | string;
  explanation?: string;
}

export interface ResponseQuiz {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  status: QuizStatus;
  questions: ResponseQuizQuestion[];
  createdAt: string;
  updatedAt: string;
}
```

---

## 5. Health APIs

### GET `/health/live`

- Auth: none
- Purpose: liveness probe

Success `200`:

```json
{
  "success": true,
  "data": { "status": "ok" },
  "meta": { "timestamp": "2026-03-07T10:10:10.000Z" }
}
```

### GET `/health/ready`

- Auth: none
- Purpose: readiness probe

Success `200`:

```json
{
  "success": true,
  "data": { "status": "ok", "message": "Ready" },
  "meta": { "timestamp": "2026-03-07T10:10:10.000Z" }
}
```

Failure `503`:

- `error.code = SERVICE_UNAVAILABLE`

---

## 6. Auth APIs

### POST `/auth/login`

- Auth: none
- Body:

```json
{
  "email": "admin@example.com",
  "password": "secret123"
}
```

Success `200` data (`AuthTokenDto`):

```json
{
  "accessToken": "<jwt>",
  "refreshToken": "<jwt>",
  "tokenType": "Bearer",
  "expiresIn": "15m"
}
```

Failure:

- `401 UNAUTHORIZED` for invalid credentials

### GET `/auth/me`

- Auth: bearer access token
- Role: `ADMIN` or `USER`
- Body: none

Success `200` data:

```json
{
  "id": "user-id",
  "name": "Alice",
  "email": "alice@example.com",
  "role": "USER"
}
```

### POST `/auth/refresh`

- Auth: none
- Body:

```json
{
  "refreshToken": "<jwt>"
}
```

Success `200` data: `AuthTokenDto`

Failure:

- `401 UNAUTHORIZED` for invalid/expired refresh token
- `400 VALIDATION_ERROR` when body missing

### POST `/auth/logout`

- Auth: bearer access token
- Role: `ADMIN` or `USER`
- Body:

```json
{
  "refreshToken": "<jwt>"
}
```

Success `200` data:

```json
{
  "loggedOut": true
}
```

### POST `/auth/change-password`

- Auth: bearer access token
- Role: `ADMIN` or `USER`
- Body:

```json
{
  "currentPassword": "oldpass",
  "newPassword": "newpass123"
}
```

Success `200` data:

```json
{
  "changed": true
}
```

### POST `/auth/forgot-password`

- Auth: none
- Body:

```json
{
  "email": "alice@example.com"
}
```

Success `200` data (current implementation):

```json
{
  "message": "If the account exists, reset instructions have been generated.",
  "resetToken": "<jwt-may-be-present>"
}
```

Note:

- `resetToken` is currently returned by backend implementation for development flow.

### POST `/auth/reset-password`

- Auth: none
- Body:

```json
{
  "token": "<reset-jwt>",
  "newPassword": "newpass123"
}
```

Success `200` data:

```json
{
  "reset": true
}
```

---

## 7. User APIs

### POST `/users/register`

- Auth: none
- Body:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123",
  "role": "USER"
}
```

Success `201` data: `ResponseUser`

Validation rules:

- `email` must be valid
- `password` min length `6`
- `role` optional (`ADMIN` or `USER`)

### GET `/users/:id`

- Auth: bearer access token
- Role: `ADMIN`
- Path params:
- `id: string`

Success `200` data: `ResponseUser`

Failure:

- `404 USER_NOT_FOUND`

### PUT `/users/:id`

- Auth: bearer access token
- Role: `ADMIN` or `USER`
- Body (all optional):

```json
{
  "name": "Alice 2",
  "email": "alice2@example.com",
  "password": "newpass123",
  "role": "USER"
}
```

Success `200` data: `ResponseUser`

Validation rules:

- `email` must be valid if provided
- `password` min length `6` if provided

### DELETE `/users/:id`

- Auth: bearer access token
- Role: `ADMIN` or `USER`

Success `200` data:

```json
{
  "deleted": true,
  "user": {
    "id": "user-id",
    "name": "Alice",
    "email": "alice@example.com",
    "role": "USER",
    "isDeleted": true,
    "createdAt": "2026-03-07T10:10:10.000Z"
  }
}
```

---

## 8. Question APIs

### POST `/questions`

- Auth: bearer access token
- Role: `ADMIN`
- Body:

```json
{
  "authorId": "user-id-optional-if-token-present",
  "content": "2 + 2 = ?",
  "type": "MULTIPLE_CHOICE",
  "options": ["1", "2", "4", "5"],
  "correctAnswer": "4",
  "difficulty": "EASY",
  "tags": ["math", "basic"],
  "explanation": "2 plus 2 equals 4"
}
```

Success `201` data: `ResponseQuestion`

Behavior:

- If `authorId` missing in body, backend uses `req.user.id`.

### GET `/questions`

- Auth: bearer access token
- Role: `ADMIN` or `USER`
- Query params:
- `page?: number`
- `limit?: number`
- `difficulty?: EASY|MEDIUM|HARD`
- `status?: ACTIVE|ARCHIVED`
- `authorId?: string`
- `tags?: string | string[]` where string is comma-separated

Success `200` data: `ResponseQuestion[]` with paginated meta

### GET `/questions/all`

- Auth: bearer access token
- Role: `ADMIN` or `USER`

Success `200` data: `ResponseQuestion[]`

### GET `/questions/shuffle`

- Auth: bearer access token
- Role: `ADMIN` or `USER`
- Query params:
- `count: number` (required, > 0)
- `page?: number`
- `limit?: number`
- `difficulty?: EASY|MEDIUM|HARD`
- `tags?: string | string[]`

Success `200` data: `ResponseQuestion[]` with paginated meta

Failure:

- `400 QUESTION_VALIDATION_ERROR` when `count` invalid

### GET `/questions/:id`

- Auth: bearer access token
- Role: `ADMIN` or `USER`

Success `200` data:

- `ResponseQuestion` when found
- `null` when not found (current behavior)

### PUT `/questions/:id`

- Auth: bearer access token
- Role: `ADMIN`
- Body (all optional, but domain validations apply):

```json
{
  "content": "Updated question",
  "options": ["A", "B", "C"],
  "correctAnswer": "B",
  "difficulty": "MEDIUM",
  "tags": ["updated"],
  "explanation": "Updated explanation"
}
```

Rules:

- If `options` is provided, `correctAnswer` is required.

Success `200` data: `ResponseQuestion`

### PATCH `/questions/:id/archive`

- Auth: bearer access token
- Role: `ADMIN`

Success `200` data:

```json
{
  "archived": true,
  "id": "question-id"
}
```

---

## 9. Quiz APIs

### POST `/quizzes`

- Auth: bearer access token
- Role: `ADMIN`
- Body:

```json
{
  "title": "Midterm Quiz",
  "description": "Chapter 1-3",
  "createdBy": "user-id-optional-if-token-present"
}
```

Success `201` data: `ResponseQuiz`

Behavior:

- If `createdBy` missing in body, backend uses `req.user.id`.
- Initial status is `DRAFT`.

### GET `/quizzes`

- Auth: bearer access token
- Role: `ADMIN` or `USER`
- Query params:
- `page?: number`
- `limit?: number`
- `createdBy?: string`
- `status?: DRAFT|PUBLISHED|ARCHIVED`

Success `200` data: `ResponseQuiz[]` with paginated meta

### GET `/quizzes/all`

- Auth: bearer access token
- Role: `ADMIN` or `USER`

Success `200` data: `ResponseQuiz[]`

### GET `/quizzes/:id`

- Auth: bearer access token
- Role: `ADMIN` or `USER`

Success `200` data:

- `ResponseQuiz` when found
- `null` when not found (current behavior)

### PUT `/quizzes/:id`

- Auth: bearer access token
- Role: `ADMIN`
- Body:

```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

Success `200` data: `ResponseQuiz`

### POST `/quizzes/:id/questions`

- Auth: bearer access token
- Role: `ADMIN`
- Body:

```json
{
  "questionIds": ["q1", "q2"],
  "questions": [
    {
      "content": "What is 10 / 2?",
      "options": ["2", "5", "10"],
      "correctAnswer": "5",
      "difficulty": "EASY",
      "type": "MULTIPLE_CHOICE",
      "tags": ["math"],
      "explanation": "10 divided by 2 equals 5"
    }
  ]
}
```

Rules:

- At least one of `questionIds` or `questions` must be provided.
- `questionIds` must be an array of strings.
- `questions` must be an array when provided.
- Archived questions cannot be added.

Success `200` data: `ResponseQuiz`

### DELETE `/quizzes/:id/questions/:questionId`

- Auth: bearer access token
- Role: `ADMIN`

Success `200` data: `ResponseQuiz`

### PATCH `/quizzes/:id/publish`

- Auth: bearer access token
- Role: `ADMIN`

Success `200` data: `ResponseQuiz`

Failure:

- `400 QUIZ_ERROR` when quiz has no questions

### PATCH `/quizzes/:id/archive`

- Auth: bearer access token
- Role: `ADMIN`

Success `200` data:

```json
{
  "archived": true,
  "id": "quiz-id"
}
```

---

## 10. Common Error Codes

Frontend should map these codes to user messages/actions:

- `UNAUTHORIZED`
- `FORBIDDEN`
- `VALIDATION_ERROR`
- `NOT_FOUND`
- `USER_NOT_FOUND`
- `INVALID_IDENTIFIER`
- `QUESTION_NOT_FOUND`
- `QUESTION_VALIDATION_ERROR`
- `QUESTION_EMPTY_OPTION`
- `QUESTION_NOT_ENOUGH_OPTIONS`
- `QUESTION_NOT_ANSWERABLE`
- `QUIZ_NOT_FOUND`
- `QUIZ_VALIDATION_ERROR`
- `QUIZ_ERROR`
- `SERVICE_UNAVAILABLE`
- `INTERNAL_SERVER_ERROR`

---

## 11. Frontend Integration Checklist

- Use one shared HTTP client with base URL `/api/v1`.
- Attach bearer token for protected APIs.
- Implement one-time refresh retry on `401`.
- Parse envelope first (`success` boolean), not raw `data` directly.
- For paginated endpoints, use `meta.pagination` for UI controls.
- Handle `200` + `data: null` for `GET /questions/:id` and `GET /quizzes/:id`.
- Treat `forgot-password` response token as development-only behavior.
