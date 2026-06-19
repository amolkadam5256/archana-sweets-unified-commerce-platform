# Archana Commerce — Complete Folder Structure

```
archana-commerce/
│
├── README.md
├── package.json                          # Monorepo root (pnpm + Turborepo)
├── pnpm-workspace.yaml
├── turbo.json
├── .gitignore
│
├── apps/                                 # ── FRONTEND APPLICATIONS ──
│   │
│   ├── website/                          # Customer-facing e-commerce site
│   │   └── app/
│   │       ├── page.tsx                  # Homepage
│   │       ├── shop/                     # Product listing
│   │       ├── category/                 # Category pages
│   │       ├── product/                  # Product detail
│   │       ├── cart/                     # Shopping cart
│   │       ├── checkout/                 # Checkout flow
│   │       ├── account/                  # User account
│   │       ├── wishlist/                 # Wishlist
│   │       ├── loyalty/                  # Loyalty program
│   │       ├── orders/                   # Order history
│   │       ├── blog/                     # Blog
│   │       ├── franchise/                # Franchise inquiry
│   │       ├── corporate/                # Corporate gifting
│   │       ├── bulk-order/               # Bulk orders
│   │       ├── store-locator/            # Store finder
│   │       ├── contact/                  # Contact page
│   │       ├── about/                    # About us
│   │       └── track-order/              # Order tracking
│   │
│   ├── dashboard/                        # Internal admin & operations dashboard
│   │   └── app/
│   │       ├── dashboard/                # Overview KPIs
│   │       ├── crm/                      # CRM module
│   │       ├── ecommerce/                # Product/category management
│   │       ├── inventory/                # Stock management
│   │       ├── production/               # Production planning
│   │       ├── orders/                   # Order management
│   │       ├── delivery/                 # Delivery management
│   │       ├── hrms/                     # HR management
│   │       ├── marketing/                # Marketing campaigns
│   │       ├── finance/                  # Financial management
│   │       ├── analytics/                # Analytics dashboards
│   │       ├── ai-center/                # AI tools & conversations
│   │       ├── reports/                  # Report generation
│   │       ├── settings/                 # System settings
│   │       └── administration/           # User/role/tenant admin
│   │
│   ├── mobile/                           # Single Expo app (role-based)
│   │   └── src/
│   │       ├── customer/                 # Customer shopping screens
│   │       ├── admin/                    # Admin quick actions
│   │       ├── inventory/                # Stock scanning & movements
│   │       ├── delivery/                 # Driver delivery screens
│   │       ├── crm/                      # CRM mobile views
│   │       ├── marketing/                # Campaign monitoring
│   │       ├── profile/                  # User profile
│   │       ├── notifications/            # Push notifications
│   │       └── settings/                 # App settings
│   │
│   └── docs/                             # API & platform documentation site
│
├── packages/                             # ── SHARED TYPESCRIPT PACKAGES ──
│   ├── ui/                               # Shadcn UI design system
│   ├── types/                            # Shared TypeScript interfaces
│   ├── hooks/                            # TanStack Query hooks
│   ├── utils/                            # API client, formatters, helpers
│   ├── constants/                        # Routes, permissions, enums
│   ├── validators/                       # Zod validation schemas
│   └── config/                           # ESLint, TSConfig, Tailwind presets
│
├── backend/                              # ── FASTAPI MODULAR MONOLITH ──
│   ├── api/                              # API gateway, middleware, router aggregation
│   ├── core/                             # Config, database, cache, storage, events
│   ├── shared/                           # Shared models, exceptions, utilities
│   ├── auth/                             # Login, OTP, Google OAuth, JWT
│   ├── users/                            # User profiles, roles, permissions
│   ├── crm/                              # Leads, customers, follow-ups, activities
│   ├── ecommerce/                        # Products, categories, cart, checkout
│   ├── inventory/                        # Raw materials, finished goods, suppliers
│   ├── production/                       # Recipes, batches, planning
│   ├── orders/                           # Orders, returns, refunds
│   ├── delivery/                         # Routes, tracking, OTP
│   ├── hrms/                             # Employees, attendance, payroll
│   ├── marketing/                        # WhatsApp, email, SEO campaigns
│   ├── loyalty/                          # Points, tiers, rewards
│   ├── finance/                          # Invoicing, payments, ledger
│   ├── analytics/                        # Revenue, sales, customer metrics
│   ├── ai/                               # ── AI CENTER ──
│   │   ├── chatbot/                      # Customer support chatbot
│   │   ├── recommendations/              # Product recommendations
│   │   ├── forecasting/                  # Demand forecasting
│   │   ├── seo-writer/                   # SEO content generation
│   │   ├── marketing-assistant/          # Marketing copy AI
│   │   ├── analytics-assistant/          # NL analytics queries
│   │   ├── vector-db/                    # Vector embedding storage
│   │   ├── rag/                          # Retrieval-augmented generation
│   │   └── agents/                       # LangGraph AI agents
│   ├── notifications/                    # Email, SMS, push, in-app
│   ├── reports/                          # PDF/Excel report generation
│   ├── settings/                         # Tenant & system configuration
│   └── tests/                            # pytest unit + integration tests
│
├── database/                             # ── DATABASE LAYER ──
│   ├── schema/                           # Reference SQL schema files
│   ├── migrations/                       # Alembic migration revisions
│   ├── seeders/                          # Idempotent seed scripts
│   └── backups/                          # Backup storage (gitignored)
│
├── infrastructure/                       # ── DEVOPS & DEPLOYMENT ──
│   ├── docker/                           # Dockerfiles, docker-compose
│   ├── kubernetes/                       # K8s manifests, Helm charts
│   ├── nginx/                            # Reverse proxy configs
│   ├── monitoring/                       # Prometheus, Grafana, alerts
│   └── deployment/                       # CI/CD, environment configs
│
├── scripts/                              # ── AUTOMATION SCRIPTS ──
│   ├── setup/                            # Dev environment setup
│   ├── backup/                           # Database & service backups
│   ├── migration/                        # Migration helpers
│   └── automation/                       # Cron jobs, scheduled tasks
│
└── docs/                                 # ── ARCHITECTURE DOCUMENTATION ──
    ├── architecture/
    │   ├── SYSTEM_ARCHITECTURE.md        # System design & diagrams
    │   ├── DEPENDENCY_MAP.md             # Module & package dependencies
    │   └── FOLDER_STRUCTURE.md           # This file
    ├── api/
    │   └── API_ARCHITECTURE.md           # REST API design & endpoints
    ├── database/
    │   └── DATABASE_ARCHITECTURE.md      # Schema, ERD, migrations
    ├── guides/
    │   ├── CODING_STANDARDS.md           # Development conventions
    │   └── DEVELOPMENT_ROADMAP.md        # 5-phase implementation plan
    ├── adr/                              # Architecture Decision Records
    └── diagrams/                         # Exported architecture diagrams
```

## Directory Counts

| Area | Directories |
|------|------------|
| apps/ | 40 |
| packages/ | 7 |
| backend/ | 28 |
| database/ | 4 |
| infrastructure/ | 5 |
| scripts/ | 4 |
| docs/ | 6 |
| **Total** | **97** |

## Conventions

- Every leaf directory contains a `.gitkeep` until implementation begins
- Application code is added per [DEVELOPMENT_ROADMAP.md](../guides/DEVELOPMENT_ROADMAP.md)
- Module READMEs are added when Phase implementation starts for that module
