# User Module Overview

## 1. Purpose
The `user` module manages user lifecycle operations:
- Register user
- Get user by id
- Update user
- Soft delete user

This module follows **Clean Architecture** and is implemented as an isolated domain module in the modular monolith.

---

## 2. Module Structure

```text
user/
├── application/
│   ├── dto/
│   ├── mappers/
│   └── usecases/
├── domain/
│   ├── entities/
│   └── repositories/
├── infrastructure/
│   └── database/
└── presentation/
```

### Layer responsibilities
- **presentation**: HTTP controller and routes (`user.controller.ts`, `user.routes.ts`)
- **application**: orchestration use cases + DTO validation/mapping
- **domain**: core entity (`User`) + repository contract (`IUserRepository`)
- **infrastructure**: MongoDB/Mongoose repository implementation and mappers

---

## 3. Public HTTP API
Route prefix constants:
- `API_PREFIX = /api/v1`
- `USER_PREFIX = /users`

Effective endpoints:
- `POST /api/v1/users/register` → register user
- `GET /api/v1/users/:id` → get user by id
- `PUT /api/v1/users/:id` → update user
- `DELETE /api/v1/users/:id` → soft delete user

Responses are wrapped via shared response builder (`ok(...)`).

---

## 4. Dependency Injection (Inversify)
Registered in `user.module.ts`:
- `IUserRepository` → `UserRepository`
- `UserController`
- Use cases:
  - `RegisterUserUseCase`
  - `GetUserUseCase`
  - `UpdateUserUseCase`
  - `DeleteUserUseCase`

Token source: `user.token.ts`.

---

## 5. Core Business Flow

### Register user
1. Validate DTO (`class-validator`)
2. Check duplicated email (`findByEmail`)
3. Hash password (`bcrypt`)
4. Create domain entity `User`
5. Persist via repository

### Get user
1. Validate `id` from params
2. Load by `findById`
3. Throw `UserNotFoundError` when missing
4. Map to response DTO

### Update user
1. Validate `id`
2. Check existence
3. If email changed, check duplicate email
4. Apply domain update (`user.update(...)`)
5. Persist with `update(...)`

### Delete user
1. Validate `id`
2. Check existence
3. Mark soft delete (`user.delete()` sets `isDeleted = true`)
4. Persist with `update(...)`

---

## 6. Domain Model Notes
`User` entity fields:
- `id`, `name`, `email`, `password`
- `createdAt`, `updatedAt`
- `isDeleted`

Domain behaviors:
- `User.create(...)`
- `user.update(...)`
- `user.delete()` (soft delete)

---

## 7. Error Handling
Module-specific operations rely on shared domain errors, e.g.:
- `UserAlreadyExistsError`
- `UserNotFoundError`
- `InvalidIdentifierError`

Controllers forward errors through `next(err)` for centralized middleware handling.

---

## 8. Extension Guidelines
To extend this module safely:
1. Add/adjust use case in `application`
2. Keep rules in `domain` pure (no framework/database dependency)
3. Implement persistence changes in `infrastructure`
4. Expose new endpoint in `presentation`
5. Register new dependency in `user.module.ts`
