# ADR-003: Monorepo with pnpm Workspaces + Turborepo

**Status**: Accepted  
**Date**: 2025-01-15  
**Deciders**: Principal Architect

## Context

Three frontend apps (website, dashboard, mobile) and seven shared packages need coordinated development, versioning, and CI.

## Decision

Use a **pnpm workspace monorepo** orchestrated by **Turborepo** for build caching and task pipelines. Python backend lives in the same repo but outside the pnpm workspace.

## Consequences

### Positive
- Atomic cross-package changes in single PR
- Shared types stay in sync between frontend and API contracts
- Turborepo remote caching speeds CI

### Negative
- Larger repo clone size
- Backend (Python) not in Turborepo pipeline (separate CI job)

## Alternatives Considered

1. **Nx** — Viable but Turborepo chosen for simplicity
2. **Separate repos** — Rejected due to type sync and coordination overhead
