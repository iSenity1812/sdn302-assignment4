# System Documentation

## 1. Document Purpose

This document provides a full system view for:

- Backend engineers
- Frontend engineers
- Business analysts and product stakeholders

It consolidates architecture, module behavior, API contracts, business workflows, and delivery notes from current source code and module overviews.

---

## 2. Product Scope

The current system is a quiz platform backend with initial frontend scaffolding.

Primary capabilities:

- User account lifecycle (register, profile lookup, update, soft delete)
- Authentication and session security (login, refresh, logout, password operations)
- Question bank management (CRUD-like lifecycle with search and shuffle)
- Quiz management (compose quizzes from questions, publish/archive)

Out of scope in current codebase:

- Quiz attempt/submission flow for end users
- Scoring and grading engine
- Analytics dashboards
- Notification/email provider integration (forgot-password currently returns token directly)

---

## 3. Stakeholders and Personas

Actors:

- `ADMIN`: manages questions, quizzes, and can perform all secured operations
- `USER`: consumes read-level quiz/question features and profile/auth features

Internal stakeholders:

- Backend team: maintain domain modules and API contracts
- Frontend team: consume API, manage auth/session UX, and implement quiz UI
- BA/PO: define functional scope, acceptance criteria, and roadmap priorities

---

## 4. High-Level Architecture

Architecture style:

- Modular monolith
- Clean Architecture-inspired layering
- Dependency injection with Inversify

Monorepo layout:

- `apps/server`: Express + TypeScript backend
- `apps/web`: Next.js frontend app (currently starter state)
- `apps/docs`: docs app
- `packages/ui`: shared UI components
- `packages/typescript-config`, `packages/eslint-config`: shared tooling

Backend stack:

- Express 5
- Inversify
- MongoDB + Mongoose
- Passport (local and JWT)
- JSON Web Tokens
- bcrypt

Frontend stack:

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- TanStack React Query (installed)
- Zustand (installed)
- Zod (installed)

---

## 5. Backend Runtime and Bootstrapping

Entry points:

- `apps/server/src/server.ts`: process bootstrap and HTTP listen
- `apps/server/src/app.ts`: app construction and route mounting

Container assembly (`buildContainer`):

1. Register database client (`registerDatabase`)
2. Register infrastructure (`logger`, `domain event publisher`)
3. Register system modules (`health`)
4. Register business modules (`user`, `auth`, `question`, `quiz`)

Request pipeline:

1. JSON body parsing
2. Passport initialization
3. Module routes mounted under `/api/v1`
4. Not found middleware
5. Global error middleware

---

## 6. Layering and Dependency Rules

Canonical dependency direction:

- `presentation -> application -> domain`
- `infrastructure` implements domain/application contracts

Layer responsibilities:

- `domain`: pure business rules, entities, value objects, events, repository interfaces
- `application`: use case orchestration, DTO shaping, pagination/query handling
- `presentation`: HTTP controllers/routes, auth guards, request/response handling
- `infrastructure`: persistence, external service adapters, logging/event publishers
- `shared`: cross-cutting concerns (error model, response builders, security decorators)
- `building-blocks`: reusable abstractions and core patterns

---

## 7. API Conventions

Base prefix:

- `API_PREFIX = /api/v1`

Response envelope:

- Success: - `success: true` - `data` - optional `message` - `meta.timestamp`
- Error: - `success: false` - `error: { code, message, details? }` - `meta.timestamp`
- Paginated success: - `meta.pagination: { page, limit, total, totalPages, hasNext, hasPrev }`

Error handling:

- Domain/application errors extend `AppError`
- Middleware maps to HTTP status and standard error envelope
- Unknown errors mapped to `500 INTERNAL_SERVER_ERROR`

---

## 8. Security Model

Authentication:

- Local strategy (`/auth/login`) validates email/password
- JWT strategy validates bearer access token
- JWT payload includes `type: access | refresh | reset`

Authorization:

- Role-based checks via `@Role(...)` + `roleGuard(...)`
- Roles: `ADMIN`, `USER`

Token model:

- Access token: short-lived, used for API authorization
- Refresh token: rotated and persisted as hash only
- Reset token: short-lived and stored as hash with expiration

Credential/session protection:

- Password hashing via bcrypt
- Refresh token hash invalidated on password change
- Soft-deleted users are blocked by auth strategies/use cases

---

## 9. Module Inventory

System modules:

- Health

Business modules:

- User
- Auth
- Question
- Quiz

Inter-module dependency:

- `quiz` module depends on `question` repository for question ingestion during quiz composition

---

## 10. Endpoint Catalog

### 10.1 Health

- `GET /api/v1/health/live` - Access: public - Purpose: liveness
- `GET /api/v1/health/ready` - Access: public - Purpose: readiness (dependency check)

### 10.2 User

- `POST /api/v1/users/register` - Access: public - Purpose: create user
- `GET /api/v1/users/:id` - Access: JWT + role-guarded - Purpose: get user profile by id
- `PUT /api/v1/users/:id` - Access: JWT + role-guarded - Purpose: update user
- `DELETE /api/v1/users/:id` - Access: JWT + role-guarded - Purpose: soft delete user

### 10.3 Auth

- `POST /api/v1/auth/login` - Access: public (local strategy) - Purpose: issue access/refresh tokens
- `GET /api/v1/auth/me` - Access: JWT + role-guarded - Purpose: current authenticated profile
- `POST /api/v1/auth/refresh` - Access: public (token in body) - Purpose: rotate token pair
- `POST /api/v1/auth/logout` - Access: JWT + role-guarded - Purpose: revoke refresh token
- `POST /api/v1/auth/change-password` - Access: JWT + role-guarded - Purpose: change password
- `POST /api/v1/auth/forgot-password` - Access: public - Purpose: issue reset flow token
- `POST /api/v1/auth/reset-password` - Access: public - Purpose: reset password using token

### 10.4 Question

- `POST /api/v1/questions` - Access: JWT + `ADMIN` - Purpose: create question
- `GET /api/v1/questions` - Access: JWT + `USER|ADMIN` - Purpose: paginated search - Filters: `page`, `limit`, `difficulty`, `status`, `authorId`, `tags`
- `GET /api/v1/questions/all` - Access: JWT + `USER|ADMIN` - Purpose: fetch all questions
- `GET /api/v1/questions/shuffle` - Access: JWT + `USER|ADMIN` - Purpose: paginated random active questions - Filters: `count`, `page`, `limit`, `difficulty`, `tags`
- `GET /api/v1/questions/:id` - Access: JWT + `USER|ADMIN` - Purpose: get by id
- `PUT /api/v1/questions/:id` - Access: JWT + `ADMIN` - Purpose: update question
- `PATCH /api/v1/questions/:id/archive` - Access: JWT + `ADMIN` - Purpose: archive question

### 10.5 Quiz

- `POST /api/v1/quizzes` - Access: JWT + `ADMIN` - Purpose: create quiz (starts as `DRAFT`)
- `GET /api/v1/quizzes` - Access: JWT + `USER|ADMIN` - Purpose: paginated search - Filters: `page`, `limit`, `createdBy`, `status`
- `GET /api/v1/quizzes/all` - Access: JWT + `USER|ADMIN` - Purpose: fetch all quizzes
- `GET /api/v1/quizzes/:id` - Access: JWT + `USER|ADMIN` - Purpose: get by id
- `PUT /api/v1/quizzes/:id` - Access: JWT + `ADMIN` - Purpose: update quiz metadata
- `POST /api/v1/quizzes/:id/questions` - Access: JWT + `ADMIN` - Purpose: add questions to quiz - Supports: - existing `questionIds` - inline `questions` payload (creates new question records)
- `DELETE /api/v1/quizzes/:id/questions/:questionId` - Access: JWT + `ADMIN` - Purpose: remove question snapshot from quiz
- `PATCH /api/v1/quizzes/:id/publish` - Access: JWT + `ADMIN` - Purpose: publish quiz
- `PATCH /api/v1/quizzes/:id/archive` - Access: JWT + `ADMIN` - Purpose: archive quiz

---

## 11. Domain and Data Model

### 11.1 User

Core fields:

- `id`, `name`, `email`, `password`, `role`
- `refreshTokenHash`, `passwordResetTokenHash`, `passwordResetExpiresAt`
- `isDeleted`, `createdAt`, `updatedAt`

Rules:

- Email uniqueness
- Soft delete only (logical deactivation)

### 11.2 Auth Projection

`AuthUser` represents auth-specific view of user fields.

Token payload:

- `sub`, `email`, `role`, `type`

### 11.3 Question

Core fields:

- `id`, `authorId`, `content`, `type`, `options`, `correctAnswer`
- `difficulty`, `tags`, `explanation`, `status`, `createdAt`, `updatedAt`

Enums:

- `QuestionType`: `MULTIPLE_CHOICE`
- `Difficulty`: `EASY | MEDIUM | HARD`
- `QuestionStatus`: `ACTIVE | ARCHIVED`

Rules:

- Non-empty content
- At least 2 unique options for multiple choice
- Correct answer must be present in options
- Archived questions are immutable

### 11.4 Quiz

Core fields:

- `id`, `title`, `description`, `createdBy`, `status`
- `questions[]` (snapshot records)
- `createdAt`, `updatedAt`

Status lifecycle:

- `DRAFT -> PUBLISHED -> ARCHIVED`

Rules:

- No duplicate question IDs inside a quiz
- Publish requires at least one question
- Cannot remove non-existing question from quiz

Snapshot model in quiz:

- `id`, `content`, `options`, `correctAnswer`, `difficulty`, `type`, `explanation`

---

## 12. Key Business Processes

### 12.1 User Onboarding and Access

1. User registers account
2. User logs in and receives access + refresh tokens
3. Frontend stores tokens per security policy
4. Access token used for protected APIs
5. Refresh endpoint rotates token pair when needed

### 12.2 Question Bank Management (Admin)

1. Admin creates questions with classification (`difficulty`, `tags`)
2. Admin updates content/options as needed
3. Admin archives deprecated questions
4. Users/admins query/search/shuffle active pool for consumption

### 12.3 Quiz Composition and Publishing (Admin)

1. Admin creates draft quiz metadata
2. Admin adds questions by existing IDs and/or inline creation
3. System validates source questions and archived state
4. Admin publishes quiz after composition complete
5. Admin can archive quiz when no longer active

### 12.4 Password Recovery

1. User submits forgot-password request
2. System generates reset token and stores token hash + expiry
3. User submits reset-password token + new password
4. System validates token hash and expiry
5. Password updated and reset token cleared

---

## 13. Frontend Integration Guide

### 13.1 Current Frontend State

`apps/web` currently contains scaffolded Next.js pages and shared HTTP response type utilities. Business feature pages are not yet implemented.

Existing useful foundations:

- Standard API response typings under `apps/web/src/shared/types/http`
- Installed stack for scalable data layer (`@tanstack/react-query`, `zod`, `zustand`)

### 13.2 Recommended Frontend Architecture

Suggested structure in `apps/web/src`:

- `features/auth`: login, token refresh orchestration, profile fetch
- `features/question`: search/filter/shuffle/create/update/archive flows
- `features/quiz`: create/edit/publish/archive flows
- `infra/http`: API client with interceptors and error mapping
- `stores`: auth/session store (token state + profile)

### 13.3 API Contract Alignment

Frontend should treat all responses as envelopes:

- Success path: read `response.success === true`, use `response.data`
- Error path: read `response.error.code`, `response.error.message`, `response.error.details`
- Pagination: consume `response.meta.pagination`

### 13.4 Authentication UX Requirements

- Login stores both tokens
- Attach access token as bearer header
- On `401` from protected endpoint: - attempt refresh once - retry original request - on refresh failure, force logout
- Logout clears local auth state and calls `/auth/logout`

---

## 14. Business Analysis View

### 14.1 Functional Capability Matrix

- Authentication and session management: implemented
- User profile lifecycle: implemented
- Question bank management: implemented
- Quiz authoring and publishing: implemented
- Quiz taking/assessment workflow: not implemented yet

### 14.2 Business Rules Summary

- Only admins can mutate questions and quizzes
- Users can read/search question and quiz resources
- Archived questions cannot be modified and cannot be added to quizzes
- Quizzes cannot be published without questions
- Refresh/reset tokens are never stored in plaintext

### 14.3 Candidate Acceptance Criteria (Release-Oriented)

Auth:

- Valid credentials return token pair
- Invalid credentials return `401 UNAUTHORIZED`
- Refresh rotates and invalidates old refresh token

Question:

- Creating invalid option sets fails with validation error
- Shuffle rejects missing/invalid `count`
- Archiving sets question status and blocks future updates

Quiz:

- Adding archived/missing questions fails with validation error
- Publish fails when quiz has zero questions
- Remove question updates quiz snapshot list correctly

### 14.4 KPIs to Track (Suggested)

- Login success/failure rate
- Question pool growth and archive ratio
- Average time from quiz draft to publish
- API latency by module and endpoint
- Error code distribution over time

---

## 15. Non-Functional Requirements

Security:

- Hash all sensitive tokens/passwords
- Enforce role guard on all protected business mutations

Reliability:

- Readiness endpoint should reflect dependency status
- Global error handling must always return structured envelope

Performance:

- Paginate search endpoints for large datasets
- Use filtered Mongo queries and count in parallel where applicable

Maintainability:

- Keep module boundaries strict
- Keep domain logic framework-agnostic
- Favor interface-driven dependencies

Observability:

- Domain events published through centralized publisher
- Structured logging (Pino)

---

## 16. Environment and Configuration

Key environment variables:

- `PORT`, `HOST`, `NODE_ENV`, `LOG_LEVEL`
- `MONGODB_URI`, `MONGODB_DB_NAME`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_RESET_SECRET`
- `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `JWT_RESET_EXPIRES_IN`

Default runtime behavior:

- API host defaults to `0.0.0.0`
- API port defaults to `3000`
- MongoDB defaults to local instance

---

## 17. Risks and Gaps

Current implementation gaps:

- Frontend business pages are not yet implemented
- Forgot-password flow currently returns reset token in response (acceptable for dev, not production)
- Get-by-id use cases for quiz/question return `null` instead of standardized not-found errors
- No explicit API versioning strategy beyond `/api/v1` prefix policy
- No automated test suite wired yet in `apps/server`

Mitigation priorities:

1. Implement frontend feature modules and shared API client
2. Harden reset-password delivery via email provider and hide token in API response
3. Standardize not-found semantics across all read endpoints
4. Add integration tests for auth, question, and quiz critical paths

---

## 18. Delivery Roadmap (Suggested)

Phase 1:

- Frontend authentication shell and protected route handling
- Question and quiz list/search pages

Phase 2:

- Admin authoring flows (question create/update/archive, quiz compose/publish)
- Better validation and UX feedback mapping from API error codes

Phase 3:

- Quiz attempt domain/module (user attempt, scoring, result history)
- Reporting and analytics features

Phase 4:

- Production security hardening, monitoring dashboards, CI test gates

---

## 19. Appendix: Source of Truth Documents

Module overviews used to compose this document:

- `apps/server/src/modules/auth/overview.md`
- `apps/server/src/modules/user/overview.md`
- `apps/server/src/modules/question/overview.md`
- `apps/server/src/modules/quiz/overview.md`

Supporting implementation references:

- `apps/server/src/app.ts`
- `apps/server/src/server.ts`
- `apps/server/src/config/inversify.config.ts`
- `apps/server/src/shared/http/builder/response.factory.ts`
