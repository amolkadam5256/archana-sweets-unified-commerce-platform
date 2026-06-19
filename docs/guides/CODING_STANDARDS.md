# Coding Standards — Archana Commerce OS

## 1. General Principles

1. **Read before write** — Match existing patterns in the module you're editing
2. **Small PRs** — One feature or fix per pull request, < 400 lines preferred
3. **No drive-by refactors** — Don't reformat unrelated code
4. **Types everywhere** — No `any` in TypeScript; no untyped dicts in Python
5. **Test what matters** — Business logic and API contracts, not framework internals
6. **Security first** — Never log secrets, tokens, or PII

---

## 2. Repository Conventions

### Branch Naming

```
feature/{ticket-id}-{short-description}
fix/{ticket-id}-{short-description}
chore/{short-description}
release/v{major}.{minor}.{patch}
```

### Commit Messages (Conventional Commits)

```
feat(orders): add return initiation endpoint
fix(auth): handle expired refresh token rotation
chore(deps): bump fastapi to 0.115.0
docs(api): document pagination parameters
test(crm): add lead conversion unit tests
```

### PR Requirements

- [ ] Linked issue/ticket
- [ ] Tests added/updated
- [ ] No linter errors
- [ ] OpenAPI spec updated (if API change)
- [ ] Migration included (if schema change)
- [ ] `@archana/types` regenerated (if API change)

---

## 3. TypeScript / Frontend Standards

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ProductCard.tsx` |
| Hooks | camelCase with `use` prefix | `useProducts.ts` |
| Utils | camelCase | `formatCurrency.ts` |
| Types | PascalCase | `Order.ts` |
| Constants | SCREAMING_SNAKE in file | `PERMISSIONS.ts` |
| Pages (Next.js) | lowercase | `page.tsx`, `layout.tsx` |

### Component Structure

```tsx
// 1. Imports (external → internal → relative)
// 2. Types/interfaces
// 3. Component
// 4. Sub-components (if small and private)

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // hooks first
  // derived state
  // handlers
  // render
}
```

### Rules

- **Server Components by default** in Next.js App Router; add `'use client'` only when needed
- **No direct API calls in components** — use hooks from `@archana/hooks`
- **No inline styles** — Tailwind utility classes only
- **Zustand stores** in `apps/{app}/stores/`, not in shared packages
- **Zod validators** in `@archana/validators`; infer types with `z.infer<>`
- **Barrel exports** (`index.ts`) only at package boundaries, not in every folder

### Import Order (ESLint enforced)

```typescript
import { useState } from 'react';          // 1. React / Next
import { useQuery } from '@tanstack/react-query'; // 2. External libs
import { Button } from '@archana/ui';      // 3. Internal packages
import { useProducts } from '@archana/hooks';
import { ProductGallery } from './ProductGallery'; // 4. Relative
```

### Tailwind v4

- Use design tokens from `@archana/config/tailwind`
- No arbitrary values unless documented
- Responsive: mobile-first (`sm:`, `md:`, `lg:`)
- Dark mode: `class` strategy via Shadcn

---

## 4. Python / Backend Standards

### File Naming

- Modules: `snake_case.py`
- Classes: `PascalCase`
- Functions/variables: `snake_case`
- Constants: `SCREAMING_SNAKE_CASE`

### Module Layout (mandatory)

```python
# router.py — thin, no business logic
@router.get("/products", response_model=ProductListResponse)
async def list_products(
    filters: ProductFilters = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("ecommerce:read")),
):
    return await product_service.list_products(db, filters, current_user.tenant_id)

# service.py — business logic
async def list_products(db: AsyncSession, filters: ProductFilters, tenant_id: UUID) -> ProductListResponse:
    ...

# repository.py — data access only
async def get_products(db: AsyncSession, tenant_id: UUID, ...) -> list[Product]:
    ...
```

### Rules

- **Async everywhere** — `async def` routes, `AsyncSession`, `await`
- **Pydantic V2** for all request/response schemas; `model_config = ConfigDict(from_attributes=True)`
- **No raw SQL** in services — only in repositories (and migrations)
- **Tenant scoping** on every query: `WHERE tenant_id = :tenant_id`
- **Dependency injection** via FastAPI `Depends()` — no global state
- **Type hints** on all function signatures (enforced by mypy strict mode)

### Error Handling

```python
# Use custom exceptions, mapped in exception_handlers.py
class NotFoundError(AppException):
    status_code = 404
    code = "NOT_FOUND"

# In service layer
if not product:
    raise NotFoundError(f"Product {product_id} not found")
```

### Logging

```python
import structlog
logger = structlog.get_logger()

logger.info("order_created", order_id=order.id, tenant_id=tenant_id, total=order.total)
# NEVER: logger.info(f"User password: {password}")
```

---

## 5. API Standards

- All endpoints documented with FastAPI `summary`, `description`, `response_model`
- Request validation via Pydantic — no manual `if` checks for types
- Response envelope consistent (see API_ARCHITECTURE.md)
- Pagination on all list endpoints
- `Idempotency-Key` header on POST mutations that create resources
- Version breaking changes require new `/api/v2/` prefix

---

## 6. Database Standards

- Table names: `snake_case`, plural (`orders`, `order_items`)
- Column names: `snake_case`
- Primary keys: `id UUID DEFAULT gen_random_uuid()`
- Every business table has: `tenant_id`, `created_at`, `updated_at`
- Soft-deletable tables add: `deleted_at TIMESTAMPTZ`
- Foreign keys with explicit `ON DELETE` behavior documented
- Migrations named: `{revision}_{description}.py`
- No `SELECT *` in repositories — explicit column selection

---

## 7. Testing Standards

### Frontend (Vitest + Testing Library)

```
apps/website/__tests__/
packages/ui/src/__tests__/
```

- Test user behavior, not implementation
- Mock API at the fetch/client level, not individual hooks
- Coverage target: 70% on `packages/*`, 50% on `apps/*`

### Backend (pytest + pytest-asyncio)

```
backend/tests/
├── unit/           # Service layer tests (mocked repos)
├── integration/    # API endpoint tests (test DB)
└── conftest.py     # Fixtures: db session, test client, auth headers
```

- Every service function has at least one unit test
- Every API endpoint has integration test for happy path + 401/403
- Use factory fixtures (factory_boy) for test data
- Coverage target: 80% on `service.py` files

### E2E (Playwright)

```
e2e/
├── website/
├── dashboard/
└── fixtures/
```

- Critical paths: login, browse products, add to cart, checkout, admin product CRUD

---

## 8. Security Standards

| Rule | Detail |
|------|--------|
| Secrets | AWS Secrets Manager / `.env.local` (gitignored) |
| Passwords | bcrypt, cost factor 12 |
| JWT | RS256 signing, 15min access, 7d refresh with rotation |
| Input | Pydantic validation + SQLAlchemy parameterized queries |
| Output | No stack traces in production responses |
| CORS | Explicit allowed origins per environment |
| File upload | Validate MIME, size limit, scan, store in S3 |
| RBAC | Check permissions in service layer, not just router |
| Audit | Log all create/update/delete to `audit_logs` |

---

## 9. Git & Code Review

### Reviewer Checklist

- [ ] Does it follow module boundaries (dependency map)?
- [ ] Is tenant_id scoped on all DB queries?
- [ ] Are permissions checked?
- [ ] Is error handling consistent?
- [ ] Are types/schemas in sync (Python ↔ TypeScript)?
- [ ] Is there a migration if schema changed?
- [ ] No secrets or debug code committed?

### Code Ownership (CODEOWNERS)

```
/apps/website/       @frontend-team
/apps/dashboard/     @frontend-team
/apps/mobile/        @mobile-team
/backend/            @backend-team
/packages/           @frontend-team
/database/           @backend-team @dba
/infrastructure/     @devops-team
/docs/               @architect-team
```

---

## 10. Linting & Formatting

### Frontend

| Tool | Config Location |
|------|----------------|
| ESLint | `packages/config/eslint/` |
| Prettier | `packages/config/prettier/` |
| TypeScript | `packages/config/tsconfig/` |
| Tailwind | `packages/config/tailwind/` |

```bash
pnpm lint          # ESLint all packages
pnpm typecheck     # tsc --noEmit
pnpm format        # Prettier write
```

### Backend

| Tool | Config |
|------|--------|
| Ruff | `backend/pyproject.toml` (lint + format) |
| mypy | `backend/pyproject.toml` (strict) |
| import-linter | `backend/.importlinter` |

```bash
ruff check backend/
ruff format backend/
mypy backend/
lint-imports     # Verify module boundaries
```

---

## 11. Environment Variables

### Naming

```
# Backend
DATABASE_URL=postgresql+asyncpg://...
REDIS_URL=redis://...
JWT_PRIVATE_KEY=...
OPENAI_API_KEY=sk-...

# Frontend (NEXT_PUBLIC_ prefix for client-side)
NEXT_PUBLIC_API_URL=https://api.archanasweets.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
```

### Files

| File | Committed | Purpose |
|------|-----------|---------|
| `.env.example` | Yes | Template with dummy values |
| `.env.local` | No | Local developer overrides |
| `.env.test` | Yes | CI test environment |

---

## 12. Documentation Standards

- **Code**: Docstrings on public service functions (Google style)
- **API**: Auto-generated OpenAPI + manual descriptions on complex endpoints
- **Architecture**: ADRs in `docs/adr/` for significant decisions
- **README**: Every `apps/*` and `backend/` module gets a README when implemented
- **Comments**: Explain *why*, not *what* — code should be self-documenting

---

## 13. Mobile-Specific Standards

- Expo Router for navigation
- Role determined at login → stored in secure storage → navigator switches
- Shared business logic from `@archana/hooks` and `@archana/utils`
- Platform-specific code in `.ios.ts` / `.android.ts` suffix files
- No direct AsyncStorage for tokens — use `expo-secure-store`

---

## 14. AI Module Standards

- All LLM calls go through `backend/ai/core/llm_client.py` — no direct OpenAI calls in agents
- Token usage logged per request
- User input sanitized before prompt injection
- RAG context always includes `tenant_id` filter
- AI responses never bypass RBAC — user permissions checked before data retrieval
- Streaming responses use SSE with proper error boundaries
- Cost tracking per tenant in `ai_usage_logs` table (Phase 4)
