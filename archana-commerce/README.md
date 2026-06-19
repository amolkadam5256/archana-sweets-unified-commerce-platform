# Archana Sweets — Unified Commerce Platform

Production-grade enterprise commerce operating system. One monorepo powering website, dashboard, mobile, CRM, ERP, HRMS, inventory, marketing, AI, analytics, and SaaS.

## Monorepo Layout

```
archana-commerce/
├── apps/           # Customer-facing & internal frontends + mobile
├── packages/       # Shared TypeScript libraries
├── backend/        # FastAPI modular monolith
├── database/       # Schema, migrations, seeders
├── infrastructure/ # Docker, K8s, nginx, monitoring
├── scripts/        # Setup, backup, migration, automation
└── docs/           # Architecture, API, database, guides
```

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind v4, Shadcn UI, Zustand, TanStack Query, Framer Motion |
| Mobile | React Native, Expo (single app, role-based screens) |
| Backend | Python 3.12, FastAPI, SQLAlchemy, Alembic, Pydantic V2 |
| Data | PostgreSQL 17, Redis, Elasticsearch |
| Jobs | Celery, RabbitMQ |
| AI | OpenAI, LangGraph, LangChain, LlamaIndex |
| Storage | AWS S3 |
| Deploy | Docker, Kubernetes, Cloudflare, AWS |

## Documentation Index

| Document | Path |
|----------|------|
| System Architecture | [docs/architecture/SYSTEM_ARCHITECTURE.md](docs/architecture/SYSTEM_ARCHITECTURE.md) |
| Dependency Map | [docs/architecture/DEPENDENCY_MAP.md](docs/architecture/DEPENDENCY_MAP.md) |
| API Architecture | [docs/api/API_ARCHITECTURE.md](docs/api/API_ARCHITECTURE.md) |
| Database Architecture | [docs/database/DATABASE_ARCHITECTURE.md](docs/database/DATABASE_ARCHITECTURE.md) |
| Coding Standards | [docs/guides/CODING_STANDARDS.md](docs/guides/CODING_STANDARDS.md) |
| Development Roadmap | [docs/guides/DEVELOPMENT_ROADMAP.md](docs/guides/DEVELOPMENT_ROADMAP.md) |

## Development Phases

1. **Phase 1** — Auth, RBAC, DB, Website, Dashboard, Products, Orders
2. **Phase 2** — CRM, Inventory, Production, Delivery
3. **Phase 3** — HRMS, Marketing, Analytics
4. **Phase 4** — AI Center, RAG, Agents, Forecasting
5. **Phase 5** — SaaS Multi-Tenant, Marketplace, Franchise, Vendor Portal

## Getting Started

### Prerequisites

- Node.js 20+, pnpm 9+
- Python 3.12+
- Docker Desktop

### Quick Start

```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Start infrastructure (PostgreSQL + Redis)
docker compose -f infrastructure/docker/docker-compose.dev.yml up -d postgres redis

# 3. Install frontend dependencies
pnpm install

# 4. Set up backend
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -e ".[dev]"
alembic upgrade head
uvicorn api.main:app --reload --port 8000

# 5. In another terminal — start frontends
pnpm dev
```

### URLs (Development)

| Service | URL |
|---------|-----|
| Website | http://localhost:3000 |
| Dashboard | http://localhost:3001 |
| API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| RabbitMQ UI | http://localhost:15672 |
| Elasticsearch | http://localhost:9200 |

### Windows Setup Script

```bat
scripts\setup\dev.bat
```

## License

Proprietary — Archana Sweets Pvt. Ltd.
