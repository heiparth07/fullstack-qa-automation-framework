# Architecture

## System Overview

```
                    ┌─────────────┐
                    │   Frontend  │
                    │  (React +   │
                    │   Vite)     │
                    │  Port 3000  │
                    └──────┬──────┘
                           │ /api proxy
                    ┌──────▼──────┐
                    │   Backend   │
                    │  (Express + │
                    │ TypeScript) │
                    │  Port 3001  │
                    └──────┬──────┘
                           │ SQL
                    ┌──────▼──────┐
                    │  PostgreSQL │
                    │  Port 5432  │
                    └─────────────┘
```

## Backend Layers

```
Routes → Controllers → Services → Models → Database
  │          │             │          │
  │     Parse request   Business   SQL queries
  │     Format response  logic     Data access
  │
  Validation middleware (Zod schemas)
```

### Layer Responsibilities

| Layer | Purpose | Example |
|-------|---------|---------|
| Routes | URL mapping, middleware chain | `POST /api/tasks` |
| Controllers | HTTP concerns: parsing, status codes | Parse query params, return 201 |
| Services | Business logic, error semantics | Throw `TaskNotFoundError` |
| Models | Data access, SQL queries | Parameterized queries with pg |

## Test Architecture

```
                    ┌────────────────────────────┐
                    │       Test Pyramid         │
                    │                            │
                    │      ┌──────────┐          │
                    │      │ Security │  ZAP +   │
                    │      │  Scans   │  Headers │
                    │     ┌┴──────────┴┐         │
                    │     │Performance │  k6     │
                    │    ┌┴────────────┴┐        │
                    │    │   UI Tests   │ PW     │
                    │   ┌┴──────────────┴┐       │
                    │   │   API Tests    │ Jest  │
                    │   └────────────────┘       │
                    └────────────────────────────┘
```

## Design Patterns

### Page Object Model (UI Tests)
```
BasePage (abstract)
  ├── HomePage
  │     ├── createTask()
  │     ├── deleteTaskByTitle()
  │     └── filterByStatus()
  └── TaskDetailPage
        ├── editTitle()
        ├── changeStatus()
        └── deleteTask()
```

### Data-Driven Testing
- API fixtures: Factory functions (`validTask()`, `bulkTasks(n)`)
- UI fixtures: Reusable test data objects in `test-data.ts`
- External JSON for performance thresholds

### Test Isolation
- Each test cleans up via API before running
- No shared state between specs
- Parallel execution enabled in Playwright

## Docker Architecture

```
docker-compose.yml (base)
  ├── postgres     (database)
  ├── backend      (API server)
  └── frontend     (nginx + SPA)

docker-compose.test.yml (extends base)
  ├── test-runner  (API + UI tests)
  ├── k6           (performance, --profile)
  └── zap          (security, --profile)
```
