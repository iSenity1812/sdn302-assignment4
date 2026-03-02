# Health Module Overview

## 1. Purpose
The `health` module provides runtime health signals for service monitoring and orchestration:
- **Liveness** check (`/live`)
- **Readiness** check (`/ready`)

It follows the same Clean Architecture boundaries and is designed to be extensible through pluggable health indicators.

---

## 2. Module Structure

```text
health/
├── application/
│   ├── health-check.usecase.ts
│   ├── health-indicator.interface.ts
│   └── health.type.ts
├── Infrastructure/
│   └── indicators/
│       └── mongo-health.indicator.ts
├── interface/
│   └── dto/
└── presentation/
    └── http/
```

### Layer responsibilities
- **presentation/http**: expose health endpoints
- **application**: aggregate and evaluate indicator status
- **Infrastructure/indicators**: concrete checks (MongoDB indicator)
- **interface/dto**: API response contract

---

## 3. Public HTTP API
Route prefix constants:
- `API_PREFIX = /api/v1`
- `HEALTH_PREFIX = /health`

Effective endpoints:
- `GET /api/v1/health/live` → process is alive
- `GET /api/v1/health/ready` → dependencies are ready

---

## 4. Dependency Injection (Inversify)
Registered in `health.module.ts`:
- `HealthCheckUseCase` (self-binding)
- `HealthController` (self-binding)
- Multi-binding for `HealthIndicator` token:
  - `HEALTH_TYPES.Indicator` → `MongoHealthIndicator`

This multi-binding pattern allows registering additional indicators without changing controller logic.

---

## 5. Health Evaluation Flow

### `GET /live`
- Returns immediately with `{ status: "ok" }`
- Does not check downstream dependencies

### `GET /ready`
1. `HealthCheckUseCase.execute()` runs all injected indicators in parallel
2. Each indicator is wrapped with timeout guard (`3s`)
3. Collects `HealthIndicatorResult[]`
4. Final status:
   - `ok` if all indicators are `up`
   - `error` if any indicator is `down`
5. If not ready, controller forwards `ServiceUnavailableError` with indicator details

---

## 6. Indicator Contract
`HealthIndicator` interface:
- `name: string`
- `check(): Promise<HealthIndicatorResult>`

`HealthIndicatorResult`:
- `name`
- `status: "up" | "down"`
- optional `details`

`HealthCheckResult`:
- `status: "ok" | "error"`
- `results: HealthIndicatorResult[]`

---

## 7. Current Indicator: MongoDB
`MongoHealthIndicator`:
- Injects Mongo client from global database infrastructure
- Executes `db.command({ ping: 1 })`
- Returns `up` on success, `down` with error details on failure

---

## 8. Extension Guidelines
To add a new readiness check:
1. Implement `HealthIndicator`
2. Bind it to `HEALTH_TYPES.Indicator` in `health.module.ts`
3. Keep implementation in `Infrastructure/indicators`
4. Do not modify controller/use-case flow unless behavior changes globally

This preserves module isolation and keeps readiness aggregation centralized in the application layer.
