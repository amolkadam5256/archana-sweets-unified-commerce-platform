# Backend — FastAPI Modular Monolith

Python 3.12 backend serving all business domains through a unified API gateway.

## Structure

Each module follows: `router.py` → `service.py` → `repository.py` → `models.py`

## Key Modules

| Module | Phase | Docs |
|--------|-------|------|
| auth, users | 1 | [API Architecture](../../docs/api/API_ARCHITECTURE.md) |
| ecommerce, orders | 1 | [Database Architecture](../../docs/database/DATABASE_ARCHITECTURE.md) |
| crm, inventory, production, delivery | 2 | [Development Roadmap](../../docs/guides/DEVELOPMENT_ROADMAP.md) |
| hrms, marketing, finance, analytics | 3 | |
| ai | 4 | [System Architecture](../../docs/architecture/SYSTEM_ARCHITECTURE.md) |

## Implementation Status

Architecture defined. Application code begins in Phase 1.
