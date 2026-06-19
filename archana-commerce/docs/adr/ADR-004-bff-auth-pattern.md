# ADR-004: BFF Auth Pattern for Next.js Apps

**Status**: Accepted  
**Date**: 2025-01-15  
**Deciders**: Principal Architect

## Context

Website and dashboard need secure authentication without exposing tokens to client-side JavaScript.

## Decision

Use the **Backend-for-Frontend (BFF)** pattern: Next.js Route Handlers (`/api/auth/*`) manage HttpOnly cookies for access/refresh tokens. Client-side code never directly handles JWT strings.

## Consequences

### Positive
- Tokens not accessible to XSS attacks
- Simplified client auth state (cookie-based session)
- Server Components can authenticate directly

### Negative
- Auth logic duplicated across website and dashboard route handlers (mitigated by shared `@archana/utils/auth-server`)
- Mobile app still uses token-based auth (no cookie support in native)

## Alternatives Considered

1. **localStorage tokens** — Rejected due to XSS vulnerability
2. **NextAuth.js** — Considered; custom BFF chosen for full control over RBAC integration
