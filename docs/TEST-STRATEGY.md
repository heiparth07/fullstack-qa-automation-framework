# Test Strategy

## Test Pyramid

This project implements a multi-layer testing approach following the test pyramid principle, where faster and cheaper tests form the base, and slower, more comprehensive tests sit at the top.

### Layer 1: API Tests (Base)
- **Tool**: Jest + Supertest
- **Scope**: REST API endpoints, request/response contracts, validation
- **Speed**: Fast (~5s for full suite)
- **What we verify**:
  - CRUD operations return correct status codes and response shapes
  - Input validation rejects malformed data with proper error messages
  - Pagination, filtering, and sorting work correctly
  - Edge cases: duplicate data, max-length strings, empty bodies

### Layer 2: UI Tests (Middle)
- **Tool**: Playwright
- **Scope**: User workflows, component interactions, cross-browser behavior
- **Speed**: Medium (~30s per browser)
- **Design**: Page Object Model for maintainability
- **What we verify**:
  - Task creation, editing, deletion flows
  - Form validation (client-side error messages)
  - Navigation and routing
  - Filter and pagination UI behavior
  - Cross-browser compatibility (Chromium, Firefox, WebKit)

### Layer 3: Performance Tests (Upper)
- **Tool**: k6
- **Scope**: Response times, throughput, error rates under load
- **Profiles**:
  - **Smoke**: 1 VU, 30s - sanity check
  - **Load**: 50 VUs, 15m - standard load
  - **Stress**: 200 VUs, 9m - breaking point
  - **Spike**: 10→150→10 VUs - recovery testing

### Layer 4: Security Tests (Top)
- **Tools**: OWASP ZAP, npm audit, custom header checks
- **Scope**: OWASP Top 10 vulnerabilities, dependency vulnerabilities, security headers
- **What we verify**:
  - HTTP security headers (X-Content-Type-Options, X-Frame-Options, CSP)
  - No information disclosure (X-Powered-By removed)
  - XSS payloads stored as plain text
  - No known vulnerabilities in dependencies

## CI/CD Integration

| Pipeline | Trigger | Tests Run |
|----------|---------|-----------|
| CI (`ci.yml`) | Push/PR to main | Lint, API, UI, k6 smoke |
| Security (`security-scan.yml`) | PR + weekly schedule | npm audit, header check, ZAP baseline |

## Coverage Goals

| Layer | Target | Rationale |
|-------|--------|-----------|
| API | All endpoints + validation paths | API is the contract boundary |
| UI | Happy path + error states | Catch regression in user-facing flows |
| Performance | Smoke on every CI run | Catch performance regressions early |
| Security | Weekly + on PR | Balance thoroughness with speed |

## Test Data Strategy

- **Factories**: `validTask()`, `bulkTasks(n)` generate fresh data per test
- **API seeding**: UI tests seed data via API calls, not through the UI
- **Cleanup**: Every test cleans up before running (not after) to ensure isolation even if a previous test crashed
- **No shared database state**: Tests never depend on data from other tests
