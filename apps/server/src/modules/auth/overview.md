# Auth Module Overview

## 1. Purpose
The `auth` module manages authentication and credential security operations:
- Login and issue JWT token pair
- Get current authenticated user profile
- Refresh access token
- Logout (revoke refresh token)
- Change password
- Forgot password (generate reset token)
- Reset password

This module follows **Clean Architecture-inspired layering** and is implemented as an isolated domain module in the modular monolith.

---

## 2. Module Structure

```text
auth/
├── application/
│   ├── dto/
│   ├── ports/
│   └── usecases/
├── domain/
│   ├── model/
│   └── repositories/
├── infrastructure/
│   ├── database/
│   └── security/
└── presentation/
```

### Layer responsibilities
- **presentation**: HTTP controller and routes (`auth.controller.ts`, `auth.routes.ts`)
- **application**: use case orchestration + DTO validation + service ports (`TokenService`)
- **domain**: auth-facing user model (`AuthUser`) + repository contract (`IAuthRepository`)
- **infrastructure**: MongoDB repository implementation and JWT/Passport integration

---

## 3. Public HTTP API
Route prefix constants:
- `API_PREFIX = /api/v1`
- `AUTH_PREFIX = /auth`

Effective endpoints:
- `POST /api/v1/auth/login` → authenticate with email/password and issue tokens
- `GET /api/v1/auth/me` → get current authenticated user profile (JWT required)
- `POST /api/v1/auth/refresh` → rotate access + refresh tokens
- `POST /api/v1/auth/logout` → revoke refresh token (JWT required)
- `POST /api/v1/auth/change-password` → change current user password (JWT required)
- `POST /api/v1/auth/forgot-password` → generate password reset token
- `POST /api/v1/auth/reset-password` → reset password using reset token

Responses are wrapped via shared response builder (`ok(...)`).

---

## 4. Dependency Injection (Inversify)
Registered in `auth.module.ts`:
- `IAuthRepository` → `AuthRepository`
- `TokenService` → `JwtTokenService` (singleton)
- `IPasswordHasher` → `BcryptPasswordHasher` (singleton)
- `AuthController`
- Use cases:
  - `LoginUseCase`
  - `LogoutUseCase`
  - `RefreshTokenUseCase`
  - `ChangePasswordUseCase`
  - `ForgotPasswordUseCase`
  - `ResetPasswordUseCase`

Token source: `auth.token.ts`.

---

## 5. Core Business Flow

### Login
1. Validate credentials using Passport local strategy (`email`, `password`)
2. Reject deleted/non-existing users
3. Generate access token (`type=access`) and refresh token (`type=refresh`)
4. Hash refresh token with bcrypt and persist `refreshTokenHash`
5. Return `AuthTokenDto`

### Me
1. Authenticate bearer token using Passport JWT strategy
2. Ensure token payload type is `access`
3. Load current user and reject deleted users
4. Return profile (`id`, `name`, `email`, `role`)

### Refresh token
1. Validate refresh token signature and payload type (`refresh`)
2. Load user and verify account is active
3. Compare provided refresh token with stored `refreshTokenHash`
4. Rotate token pair (new access + new refresh)
5. Re-hash and persist new refresh token hash

### Logout
1. Validate refresh token
2. Load user and verify stored refresh token hash
3. Compare token hash
4. Clear stored refresh token hash (`refreshTokenHash = null`)

### Change password
1. Require authenticated user (`req.user`)
2. Validate input and ensure new password differs from current password
3. Verify current password against stored hash
4. Hash new password and persist update
5. Invalidate session by clearing refresh token hash in repository update

### Forgot password
1. Accept email and find account
2. Return generic success message even if account does not exist
3. Generate password reset JWT (`type=reset`)
4. Hash reset token and store with expiration (`passwordResetExpiresAt`)
5. Return response containing message (and reset token in current implementation)

### Reset password
1. Verify reset token signature and payload type (`reset`)
2. Load user and ensure reset token hash/expiry exists and is still valid
3. Compare provided token with stored `passwordResetTokenHash`
4. Hash and update new password
5. Clear reset token fields after successful reset

---

## 6. Domain Model Notes
`AuthUser` model fields:
- `id`, `name`, `email`, `password`, `role`
- `isDeleted`
- `refreshTokenHash`
- `passwordResetTokenHash`, `passwordResetExpiresAt`

Token payload contract (`TokenPayload`):
- `sub`, `email`, `role`
- `type`: `access | refresh | reset`

---

## 7. Error Handling
Module operations rely on shared domain errors, e.g.:
- `UnauthorizedError` (invalid credentials/token, inactive account)
- `UserNotFoundError` (user not found for password operations)
- `ValidationError` (e.g., new password equals current password)

Controllers forward errors through `next(error)` for centralized middleware handling.

---

## 8. Security Notes
- Local strategy validates credentials and blocks deleted users.
- JWT strategy only accepts bearer tokens signed with access secret and `type=access`.
- Refresh tokens are never persisted in plaintext (hash-only storage).
- Reset tokens are hash-stored with expiration and cleared after successful reset.
- `@Role(...)` + `roleGuard(...)` protect role-restricted endpoints (`me`, `logout`, `change-password`).

---

## 9. Extension Guidelines
To extend this module safely:
1. Add/adjust use case in `application/usecases`
2. Keep authentication rules in domain/contracts pure (no framework coupling)
3. Extend persistence behavior in `infrastructure/database`
4. Add route/controller endpoint in `presentation`
5. Register new dependencies/tokens in `auth.module.ts` / `auth.token.ts`
6. Update Passport/token service only when authentication mechanism changes