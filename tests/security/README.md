# Security Tests

OWASP-aligned security testing for the Task Manager application.

## Components

### 1. Security Header Checks
Validates HTTP security headers against OWASP recommendations.

```bash
npm -w tests run test:security:headers
```

**Headers checked:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY/SAMEORIGIN`
- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Powered-By` (should NOT be present)

### 2. OWASP ZAP Baseline Scan
Passive scan for common vulnerabilities.

```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.test.yml --profile security up zap
```

### 3. Dependency Audit
Checks for known vulnerabilities in npm dependencies.

```bash
bash tests/security/scripts/dependency-check.sh
```

## OWASP Top 10 Coverage

| # | Category | How We Test |
|---|----------|-------------|
| A01 | Broken Access Control | API tests verify endpoint authorization |
| A02 | Cryptographic Failures | ZAP scans for insecure transport |
| A03 | Injection | API validation tests + ZAP active scan |
| A05 | Security Misconfiguration | Header checks + ZAP baseline |
| A06 | Vulnerable Components | npm audit + dependency check |
| A09 | Security Logging | Backend logs all requests with pino |
