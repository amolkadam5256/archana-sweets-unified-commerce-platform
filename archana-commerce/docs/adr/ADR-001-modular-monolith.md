# ADR-001: Modular Monolith over Microservices

**Status**: Accepted  
**Date**: 2025-01-15  
**Deciders**: Principal Architect

## Context

Archana Commerce spans 12+ business domains (e-commerce, CRM, ERP, HRMS, AI, analytics). We need to decide between microservices and a monolithic architecture for the initial platform and near-term scale.

## Decision

Adopt a **modular monolith** with strict domain module boundaries in a single FastAPI application and single PostgreSQL database.

## Consequences

### Positive
- Single deployment pipeline reduces operational complexity
- ACID transactions across domains (orders + inventory) without distributed transactions
- Faster development velocity for a team of 6–10 engineers
- Module boundaries enforced via import-linter allow future extraction

### Negative
- All modules scale together (mitigated by horizontal pod autoscaling)
- Single database becomes a bottleneck at very high scale (mitigated by read replicas)
- Requires discipline to maintain module isolation

## Alternatives Considered

1. **Microservices** — Rejected for initial build due to operational overhead
2. **Database-per-service** — Rejected due to cross-domain transaction needs
