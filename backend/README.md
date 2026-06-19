# Backend - FastAPI Modular Monolith

Python 3.12 backend serving all business domains through a unified API gateway.

## Structure

Each module follows: `router.py` -> `service.py` -> `repository.py` -> `models.py`.

## Key Modules

| Module | Phase | Docs |
| --- | --- | --- |
| auth, users | 1 | [API Architecture](../../docs/api/API_ARCHITECTURE.md) |
| ecommerce, orders | 1 | [Database Architecture](../../docs/database/DATABASE_ARCHITECTURE.md) |
| crm, inventory, production, delivery | 2 | [Development Roadmap](../../docs/guides/DEVELOPMENT_ROADMAP.md) |
| hrms, marketing, finance, analytics | 3 | |
| ai | 4 | [System Architecture](../../docs/architecture/SYSTEM_ARCHITECTURE.md) |

## Implementation Status

Architecture is defined, but most business modules are still scaffolds. The active backend currently includes FastAPI startup, health endpoints, database session setup, Redis health checks, request IDs, exception handlers, Alembic, and platform models.

## Development Database

The local demo database is named `Admin` and uses password `Admin`.

```text
DATABASE_URL=postgresql+asyncpg://archana:Admin@localhost:5432/Admin
```

## Setup

From the repository root, run the setup script first:

```powershell
scripts\setup\dev.bat
```

Then start the API from this directory:

```powershell
.\.venv\Scripts\activate
uvicorn api.main:app --reload --port 8000
```

## Migrations

After activating the virtual environment, run:

```powershell
alembic upgrade head
```

## Health Checks

```text
GET http://localhost:8000/health
GET http://localhost:8000/ready
```
