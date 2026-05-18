# Full-Stack Test Automation Framework

A production-grade test automation framework demonstrating end-to-end quality engineering across API, UI, performance, and security testing layers — with CI/CD integration and containerized infrastructure.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Backend** | Node.js, Express, TypeScript, PostgreSQL |
| **UI Testing** | Playwright (Chromium, Firefox, WebKit) |
| **API Testing** | Jest, Supertest |
| **Performance** | k6 (smoke, load, stress, spike profiles) |
| **Security** | OWASP ZAP, custom header checks, npm audit |
| **CI/CD** | GitHub Actions (2 pipelines) |
| **Infrastructure** | Docker, Docker Compose |

## Project Structure

```
sdet-portfolio-project/
├── backend/                 # Express REST API (TypeScript)
│   └── src/
│       ├── controllers/     # HTTP request handling
│       ├── services/        # Business logic layer
│       ├── models/          # Data access (parameterized SQL)
│       ├── middleware/       # Validation, rate limiting, error handling
│       └── routes/          # Endpoint definitions
├── frontend/                # React SPA (TypeScript + Vite)
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Route-level pages
│       ├── hooks/           # Custom React hooks
│       └── api/             # API client layer
├── tests/
│   ├── api/                 # API test suite
│   │   ├── fixtures/        # Test data factories
│   │   ├── helpers/         # Supertest client wrapper
│   │   └── specs/           # Test specifications
│   ├── ui/                  # UI test suite
│   │   ├── pages/           # Page Object Model classes
│   │   ├── fixtures/        # UI test data
│   │   ├── utils/           # Helper functions
│   │   └── specs/           # Playwright specs
│   ├── performance/         # k6 load test scripts
│   │   ├── scripts/         # smoke, load, stress, spike
│   │   └── thresholds/      # Performance SLAs
│   └── security/            # Security test suite
│       ├── zap/             # OWASP ZAP config
│       └── scripts/         # Header checks, dependency audit
├── docker/                  # Docker Compose configs
├── .github/workflows/       # CI/CD pipelines
├── docs/                    # Architecture & test strategy docs
└── scripts/                 # Setup & orchestration scripts
```

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- k6 (optional, for performance tests)

### Setup

```bash
# Clone and install
git clone https://github.com/heiparth07/fullstack-qa-automation-framework.git
cd fullstack-qa-automation-framework
bash scripts/setup.sh

# Or manually:
npm install
cp backend/.env.example backend/.env
```

### Run the Application

```bash
# Start all services with Docker
npm run docker:up

# Or run locally for development
npm run dev:backend   # Backend on port 3001
npm run dev:frontend  # Frontend on port 5173
```

### Run Tests

```bash
# API tests
npm run test:api

# UI tests (all browsers)
npm run test:ui

# UI tests (headed mode for debugging)
npm -w tests run test:ui:headed

# Performance smoke test
npm run test:perf

# Security header check
npm -w tests run test:security:headers

# Run everything
bash scripts/run-all-tests.sh
```

## Design Patterns

### Page Object Model (POM)
UI tests use an abstract `BasePage` class extended by `HomePage` and `TaskDetailPage`, encapsulating locators and actions per page. This separates test logic from page structure.

### Data-Driven Testing
Test data is externalized into factory functions (`validTask()`, `bulkTasks(n)`) and fixture files, enabling the same test logic to run with multiple data sets.

### Test Isolation
Every test cleans up via API calls before execution (not after), ensuring no shared state even if a previous test crashed.

### Three-Layer Backend
Controller → Service → Model separation mirrors production architectures and makes the codebase testable at each layer independently.

## CI/CD Pipelines

### CI Pipeline (`ci.yml`)
Triggered on every push/PR to main:
1. **Lint & Type Check** — ESLint + TypeScript compiler
2. **API Tests** — Jest + Supertest against test database
3. **UI Tests** — Playwright against built application
4. **Performance Smoke** — k6 sanity check (runs after API tests pass)

### Security Pipeline (`security-scan.yml`)
Triggered on PRs + weekly schedule:
1. **Dependency Audit** — npm audit for known CVEs
2. **Header Check** — OWASP security header validation
3. **ZAP Baseline** — Passive vulnerability scan

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/tasks` | List tasks (paginated, filterable) |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

See [API Documentation](docs/API.md) for full request/response details.

## Test Coverage

| Test Type | Specs | What's Covered |
|-----------|-------|---------------|
| API (Jest) | 3 spec files, 20+ tests | CRUD, validation, pagination, XSS prevention |
| UI (Playwright) | 4 spec files, 20+ tests | Create, edit, delete, list/filter flows |
| Performance (k6) | 4 profiles | Smoke, load, stress, spike scenarios |
| Security | 3 tools | Headers, dependencies, OWASP ZAP scan |

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — System design, layers, patterns
- [Test Strategy](docs/TEST-STRATEGY.md) — Test pyramid, coverage goals, data strategy
- [API Reference](docs/API.md) — Endpoint contracts and examples
