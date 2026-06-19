# System Architecture — Archana Commerce OS

## 1. Architectural Vision

Archana Commerce is a **modular monolith** with a **monorepo frontend**. All business domains (e-commerce, CRM, ERP, HRMS, AI) share one PostgreSQL database, one API surface, and one deployment pipeline — avoiding the operational cost of microservices while preserving domain boundaries through strict module isolation.

### Design Principles

| Principle | Implementation |
|-----------|----------------|
| Single source of truth | PostgreSQL 17 with tenant-scoped rows |
| Domain isolation | Backend modules with explicit public interfaces |
| Shared UI DNA | `@archana/ui`, `@archana/types` packages |
| API-first | OpenAPI 3.1 contract per module |
| Security by default | JWT + RBAC + tenant context on every request |
| Observable | Structured logs, metrics, traces from day one |
| AI as a module | `backend/ai/` isolated; never bypasses auth |

---

## 2. High-Level Architecture Diagram

```mermaid
flowchart TB
    subgraph Clients["Client Layer"]
        WEB["Website<br/>Next.js 16"]
        DASH["Dashboard<br/>Next.js 16"]
        MOB["Mobile<br/>Expo RN"]
        DOCS["Docs Site<br/>Next.js"]
    end

    subgraph Edge["Edge Layer"]
        CF["Cloudflare<br/>CDN + WAF + DNS"]
        NGINX["Nginx Ingress<br/>K8s"]
    end

    subgraph Apps["Application Layer"]
        API["FastAPI API Gateway<br/>backend/api"]
        CELERY["Celery Workers"]
        AI["AI Service Layer<br/>backend/ai"]
    end

    subgraph Data["Data Layer"]
        PG[("PostgreSQL 17")]
        REDIS[("Redis<br/>Cache + Sessions")]
        ES[("Elasticsearch<br/>Search")]
        S3[("AWS S3<br/>Media + Exports")]
        RMQ[("RabbitMQ<br/>Job Queue")]
    end

    subgraph External["External Integrations"]
        OPENAI["OpenAI API"]
        WA["WhatsApp Business"]
        GMAPS["Google Maps"]
        PAY["Payment Gateway"]
    end

    WEB --> CF
    DASH --> CF
    MOB --> CF
    DOCS --> CF
    CF --> NGINX
    NGINX --> API

    API --> PG
    API --> REDIS
    API --> ES
    API --> S3
    API --> RMQ
    API --> AI

    RMQ --> CELERY
    CELERY --> PG
    CELERY --> S3
    CELERY --> WA

    AI --> OPENAI
    AI --> PG
    AI --> ES
    AI --> REDIS

    API --> PAY
    API --> GMAPS
```

---

## 3. Monorepo Topology

```mermaid
graph LR
    subgraph apps["apps/"]
        W[website]
        D[dashboard]
        M[mobile]
        DOC[docs]
    end

    subgraph pkgs["packages/"]
        UI[ui]
        TYPES[types]
        HOOKS[hooks]
        UTILS[utils]
        CONST[constants]
        VAL[validators]
        CFG[config]
    end

    subgraph be["backend/"]
        API_MOD[api]
        AUTH[auth]
        CRM[crm]
        EC[ecommerce]
        INV[inventory]
        PROD[production]
        ORD[orders]
        DEL[delivery]
        HR[hrms]
        MKT[marketing]
        FIN[finance]
        ANA[analytics]
        AI_MOD[ai]
    end

    W --> UI & TYPES & HOOKS & UTILS & CONST & VAL & CFG
    D --> UI & TYPES & HOOKS & UTILS & CONST & VAL & CFG
    M --> TYPES & UTILS & CONST & VAL & CFG

    W & D & M -->|HTTPS REST| API_MOD
    API_MOD --> AUTH & CRM & EC & INV & PROD & ORD & DEL & HR & MKT & FIN & ANA & AI_MOD
```

---

## 4. Request Lifecycle

```mermaid
sequenceDiagram
    participant C as Client
    participant CF as Cloudflare
    participant NG as Nginx
    participant API as FastAPI
    participant MW as Middleware Stack
    participant MOD as Domain Module
    participant DB as PostgreSQL
    participant R as Redis

    C->>CF: HTTPS Request
    CF->>NG: Forward (TLS terminated)
    NG->>API: Route /api/v1/*
    API->>MW: CORS, Rate Limit, Request ID
    MW->>MW: Extract JWT + Tenant Context
    MW->>MW: RBAC Permission Check
    MW->>MOD: Dispatch to module router
    MOD->>R: Cache lookup (optional)
    alt Cache miss
        MOD->>DB: SQLAlchemy query (tenant-scoped)
        DB-->>MOD: Result
        MOD->>R: Cache write
    end
    MOD-->>API: Pydantic response model
    API-->>C: JSON + X-Request-ID
```

---

## 5. Backend Module Architecture

Each backend module follows a **hexagonal (ports & adapters)** layout:

```
backend/{module}/
├── __init__.py
├── router.py          # FastAPI routes (thin)
├── schemas.py         # Pydantic V2 request/response
├── service.py         # Business logic
├── repository.py      # SQLAlchemy data access
├── models.py          # ORM models (or imports from shared)
├── dependencies.py    # FastAPI Depends()
├── events.py          # Domain events → Celery
├── permissions.py     # Module-specific RBAC rules
└── tests/
```

### Module Registry

| Module | Responsibility | Phase |
|--------|---------------|-------|
| `auth` | Login, OTP, Google OAuth, JWT, refresh tokens | 1 |
| `users` | User profiles, roles, permissions | 1 |
| `ecommerce` | Products, categories, cart, checkout | 1 |
| `orders` | Orders, returns, refunds | 1 |
| `crm` | Leads, customers, follow-ups, activities | 2 |
| `inventory` | Raw materials, finished goods, suppliers | 2 |
| `production` | Recipes, batches, planning | 2 |
| `delivery` | Routes, tracking, OTP | 2 |
| `hrms` | Employees, attendance, payroll | 3 |
| `marketing` | WhatsApp, email, SEO campaigns | 3 |
| `loyalty` | Points, tiers, rewards | 3 |
| `finance` | Invoicing, payments, ledger | 3 |
| `analytics` | Revenue, sales, customer metrics | 3 |
| `ai` | Chatbot, RAG, agents, forecasting | 4 |
| `notifications` | Push, email, SMS, in-app | 1+ |
| `reports` | PDF/Excel exports | 3 |
| `settings` | Tenant & system configuration | 1 |

### Inter-Module Communication Rules

1. **Synchronous**: Import only from `{module}/service.py` public functions — never from `repository.py`.
2. **Asynchronous**: Publish domain events via `events.py` → RabbitMQ → Celery consumers.
3. **Forbidden**: Direct cross-module SQL joins; use service calls or materialized views in `analytics`.
4. **AI module**: Read-only access to domain data via service interfaces; writes go through owning module.

---

## 6. Frontend Architecture

### Website (`apps/website`)

- **App Router** (Next.js 16) with RSC for catalog, CSR for cart/checkout
- **Route groups**: `(shop)`, `(account)`, `(marketing)`
- **Data fetching**: TanStack Query with server prefetch via RSC
- **State**: Zustand for cart, wishlist, UI chrome
- **Auth**: HttpOnly cookie session via BFF pattern (`/api/auth/*` route handlers)

### Dashboard (`apps/dashboard`)

- **App Router** with layout per domain (`/crm`, `/inventory`, etc.)
- **RBAC-gated navigation** from `@archana/constants/permissions`
- **Shared data tables, forms, charts** from `@archana/ui`
- **Real-time**: WebSocket/SSE for order & delivery updates (Phase 2)

### Mobile (`apps/mobile`)

- **Single Expo app** with role-based navigator switching
- **Roles**: `customer`, `admin`, `inventory`, `delivery`, `crm`, `marketing`
- **Shared API client** from `@archana/utils/api`
- **Offline-first** for delivery & inventory scanning (Phase 2)

### Shared Packages

| Package | Purpose |
|---------|---------|
| `@archana/ui` | Shadcn-based design system |
| `@archana/types` | Shared TypeScript interfaces mirroring Pydantic schemas |
| `@archana/hooks` | TanStack Query hooks per domain |
| `@archana/utils` | API client, formatters, date/currency helpers |
| `@archana/constants` | Routes, permissions, enums |
| `@archana/validators` | Zod schemas (mirror Pydantic) |
| `@archana/config` | ESLint, TSConfig, Tailwind presets |

---

## 7. AI Center Architecture

```mermaid
flowchart LR
    subgraph AI["backend/ai/"]
        CB[chatbot]
        REC[recommendations]
        FC[forecasting]
        SEO[seo-writer]
        MA[marketing-assistant]
        AA[analytics-assistant]
        VDB[vector-db]
        RAG[rag]
        AG[agents]
    end

    subgraph Pipelines["AI Pipelines"]
        ING["Ingestion<br/>Products, Blogs, FAQs"]
        EMB["Embedding<br/>OpenAI / Local"]
        RET["Retrieval<br/>LlamaIndex + ES"]
        GEN["Generation<br/>LangChain + LangGraph"]
    end

    ING --> EMB --> VDB
    RET --> VDB & ES
    GEN --> RET
    AG --> GEN

    CB & REC & FC & SEO & MA & AA --> AG
```

### AI Feature Matrix

| Feature | Sub-module | Data Sources | Output |
|---------|-----------|--------------|--------|
| Customer Support AI | `chatbot/` | FAQs, orders, products (RAG) | Chat responses |
| WhatsApp AI | `agents/` | CRM, orders | Automated replies |
| SEO AI | `seo-writer/` | Products, blogs | Meta, content drafts |
| Marketing AI | `marketing-assistant/` | Campaigns, segments | Copy, A/B variants |
| Inventory AI | `forecasting/` | Sales, stock levels | Reorder suggestions |
| Sales AI | `recommendations/` | Order history | Product suggestions |
| Analytics AI | `analytics-assistant/` | Aggregated metrics | NL queries → charts |

---

## 8. Multi-Tenant SaaS Architecture (Phase 5)

```mermaid
flowchart TB
    REQ["Incoming Request"]
    TENANT["Tenant Resolver<br/>subdomain / header / JWT claim"]
    CTX["Tenant Context<br/>contextvars"]
    RL["Row-Level Security<br/>tenant_id filter"]
    PG[("PostgreSQL")]

    REQ --> TENANT --> CTX
    CTX --> RL --> PG
```

- **Tenant isolation**: `tenant_id` UUID on every business table
- **PostgreSQL RLS** policies as defense-in-depth
- **Subdomain routing**: `{tenant}.archanasweets.com`
- **Shared schema** (not database-per-tenant) for operational simplicity
- **Franchise & vendor portals** as tenant-scoped role views

---

## 9. Infrastructure & Deployment

```mermaid
flowchart TB
    subgraph AWS["AWS"]
        EKS["EKS Cluster"]
        RDS["RDS PostgreSQL 17"]
        ELASTICACHE["ElastiCache Redis"]
        S3B["S3 Buckets"]
        ES_CLOUD["OpenSearch / ES"]
        MQ["Amazon MQ / RabbitMQ"]
    end

    subgraph K8s["Kubernetes (EKS)"]
        ING["Ingress Controller"]
        API_POD["API Deployment<br/>HPA 2-20"]
        WORKER_POD["Celery Workers<br/>HPA 1-10"]
        AI_POD["AI Workers<br/>GPU optional"]
    end

    CF2["Cloudflare"] --> ING
    ING --> API_POD & WORKER_POD & AI_POD
    API_POD --> RDS & ELASTICACHE & S3B & ES_CLOUD & MQ
    WORKER_POD --> RDS & S3B & MQ
    AI_POD --> RDS & ES_CLOUD
```

### Environment Tiers

| Environment | Purpose | Infra |
|-------------|---------|-------|
| `local` | Developer machines | Docker Compose |
| `dev` | Integration testing | Single-node K8s / ECS |
| `staging` | Pre-production | EKS (scaled down) |
| `production` | Live traffic | EKS + RDS Multi-AZ |

---

## 10. Security Architecture

| Layer | Control |
|-------|---------|
| Edge | Cloudflare WAF, DDoS, bot management |
| Transport | TLS 1.3 everywhere |
| Auth | JWT (15m access) + refresh rotation (7d) |
| AuthZ | RBAC with permission strings (`orders:read`, `crm:write`) |
| Data | Tenant-scoped queries, PII encryption at rest |
| API | Rate limiting (Redis), input validation (Pydantic) |
| Audit | `audit_logs` table on all mutations |
| Secrets | AWS Secrets Manager, never in repo |

---

## 11. Observability

| Signal | Tool | Location |
|--------|------|----------|
| Logs | Structured JSON → CloudWatch / Loki | `infrastructure/monitoring/` |
| Metrics | Prometheus + Grafana | `infrastructure/monitoring/` |
| Traces | OpenTelemetry → Tempo/Jaeger | API middleware |
| Alerts | PagerDuty via Alertmanager | SLO-based |
| Uptime | Cloudflare + synthetic checks | Edge |

---

## 12. Decision Records

Architecture decisions are logged in `docs/adr/` using the format:

```
ADR-{NNN}: {Title}
Status: Accepted | Proposed | Deprecated
Context → Decision → Consequences
```

Initial ADRs to create during Phase 1:

- ADR-001: Modular monolith over microservices
- ADR-002: Shared-schema multi-tenancy
- ADR-003: Monorepo with pnpm workspaces + Turborepo
- ADR-004: BFF auth pattern for Next.js apps
