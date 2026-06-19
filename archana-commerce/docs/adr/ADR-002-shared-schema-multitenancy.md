# ADR-002: Shared-Schema Multi-Tenancy

**Status**: Accepted  
**Date**: 2025-01-15  
**Deciders**: Principal Architect

## Context

Phase 5 requires SaaS multi-tenancy. We must choose an isolation strategy.

## Decision

**Shared schema** with `tenant_id` column on every business table, enforced by application-layer filtering and PostgreSQL Row-Level Security (RLS) as defense-in-depth.

## Consequences

### Positive
- Simple operations (one database, one migration path)
- Cost-effective for hundreds of tenants
- Easy cross-tenant analytics for platform operator

### Negative
- Risk of data leakage if tenant_id filter is missed (mitigated by RLS + CI tests)
- Noisy neighbor potential (mitigated by rate limiting per tenant)

## Alternatives Considered

1. **Database-per-tenant** — Rejected due to migration and operational complexity
2. **Schema-per-tenant** — Rejected due to PostgreSQL schema limit concerns at scale
