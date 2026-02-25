**Clean Architecture + Modular Monolith**
Stack: **TypeScript + Express + InversifyJS**

Bạn có thể đặt file này là:

```
docs/architecture-overview.md
```

---

# 🏗 Architecture Overview

## 1. Mục tiêu kiến trúc

Project được xây dựng theo:

- **Clean Architecture** → tách layer rõ ràng, dependency hướng vào trong
- **Modular Monolith** → chia hệ thống theo domain module độc lập
- Dễ maintain, scale, và tách microservice nếu cần

---

# 2. Tổng quan cấu trúc thư mục

```
src/
 ├── app.ts
 ├── server.ts
 │
 ├── config/
 ├── building-blocks/
 ├── modules/
 ├── infrastructure/
 ├── shared/
 │
 └── tests/
```

---

# 3. Giải thích từng phần

---

## 3.1 building-blocks/

### 🎯 Vai trò

Chứa các thành phần lõi dùng chung cho toàn bộ hệ thống.

### ❗ Không chứa:

- Business logic cụ thể
- Code phụ thuộc framework
- Database implementation

### Ví dụ:

```
building-blocks/
 ├── domain/
 │    ├── Entity.ts
 │    ├── AggregateRoot.ts
 │    ├── ValueObject.ts
 │    └── DomainEvent.ts
 │
 ├── application/
 │    ├── ICommand.ts
 │    ├── IQuery.ts
 │    ├── ICommandHandler.ts
 │    └── IQueryHandler.ts
 │
 └── result/
      ├── Result.ts
      └── AppError.ts
```

### 📌 Nguyên tắc

- Không import Express, Prisma, Logger, etc.
- Đây là tầng “core framework nội bộ”

---

## 3.2 modules/

### 🎯 Vai trò

Chứa toàn bộ business logic, chia theo domain.

Ví dụ:

```
modules/
 ├── user/
 ├── order/
 └── payment/
```

---

## Cấu trúc chuẩn của 1 module

```
user/
 ├── domain/
 ├── application/
 ├── infrastructure/
 ├── presentation/
 └── user.module.ts
```

---

### 3.2.1 domain/

Chứa business rules thuần TypeScript.

```
domain/
 ├── entities/
 ├── value-objects/
 ├── repositories/ (interface)
 └── events/
```

❌ Không phụ thuộc Express
❌ Không phụ thuộc DB

---

### 3.2.2 application/

Chứa use case.

```
application/
 ├── commands/
 ├── queries/
 ├── handlers/
 └── dto/
```

- Orchestrate domain
- Không biết DB implement thế nào
- Không biết Express

---

### 3.2.3 infrastructure/ (của module)

Chứa implementation chi tiết:

```
infrastructure/
 ├── persistence/
 ├── mappers/
 └── repositories/
```

- Implement repository interface
- Mapping DB ↔ Domain
- Phụ thuộc Prisma / ORM

---

### 3.2.4 presentation/

Chứa HTTP layer.

```
presentation/
 ├── http/
 │    ├── controller.ts
 │    ├── routes.ts
 │    └── middleware/
 └── validators/
```

- Express route
- Request validation
- Response mapping

---

## 3.3 infrastructure/ (global)

Chứa hạ tầng dùng chung toàn hệ thống:

```
infrastructure/
 ├── database/
 ├── logger/
 ├── cache/
 └── message-bus/
```

Ví dụ:

- Prisma client
- Logger config
- Redis
- Event bus

---

## 3.4 shared/

Chứa tiện ích kỹ thuật dùng chung:

```
shared/
 ├── middleware/
 ├── constants/
 ├── utils/
 └── types/
```

Ví dụ:

- error.middleware.ts
- auth.middleware.ts
- response wrapper
- custom decorators

⚠️ Không để business logic vào đây.

---

## 3.5 config/

Chứa cấu hình hệ thống:

```
config/
 ├── env.ts
 └── inversify.config.ts
```

- Environment config
- Dependency injection container

---

## 3.6 app.ts & server.ts

- `app.ts`: cấu hình Express
- `server.ts`: start HTTP server

---

# 4. Dependency Rule

Luồng phụ thuộc:

```
presentation → application → domain
infrastructure → implement interface của domain/application
```

### ❌ Không được:

- Domain import infrastructure
- Module import chéo trực tiếp
- Business logic nằm trong controller

---

# 5. Module Registration Pattern

Mỗi module expose:

```
user.module.ts
```

Có nhiệm vụ:

- Bind dependency vào Inversify container
- Export public API nếu cần

---

# 6. Testing Strategy

```
tests/
 ├── unit/
 ├── integration/
 └── e2e/
```

- Unit test → domain + application
- Integration test → repository + DB
- E2E → HTTP layer

---

# 7. Nguyên tắc quan trọng

1. Domain phải thuần
2. Module phải độc lập
3. Không có “God folder”
4. Enforce boundary bằng eslint + tsconfig path
5. Chỉ expose Public API của module

---

# 8. Lợi ích

- Maintain lâu dài
- Scale module dễ
- Refactor ít ảnh hưởng
- Có thể tách microservice sau này
- Team làm việc song song dễ dàng

---

# 9. Kết luận

Kiến trúc này giúp:

- Tách rõ business và framework
- Giữ domain sạch
- Duy trì module isolation
- Chuẩn production-level

---

Nếu bạn muốn, mình có thể viết thêm:

- File `coding-guidelines.md`
- File `dependency-rules.md`
- Template module chuẩn để copy tạo module mới
- Checklist review kiến trúc trước khi merge PR
