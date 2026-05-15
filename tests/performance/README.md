# Performance Tests

k6 performance test scripts for the Task Manager API.

## Test Profiles

| Profile | VUs | Duration | Purpose |
|---------|-----|----------|---------|
| Smoke | 1 | 30s | Sanity check under minimal load |
| Load | 20-50 | 15m | Standard load testing |
| Stress | 50-200 | 9m | Find breaking point |
| Spike | 10-150-10 | 4m30s | Test recovery from sudden bursts |

## Running

```bash
# Smoke test
k6 run tests/performance/scripts/smoke.js

# Load test
k6 run tests/performance/scripts/load.js

# Stress test
k6 run tests/performance/scripts/stress.js

# Spike test
k6 run tests/performance/scripts/spike.js

# With custom API URL
API_BASE_URL=http://staging:3001 k6 run tests/performance/scripts/load.js
```

## Thresholds

Default thresholds are defined in `thresholds/default.json`:
- **p95 response time**: < 500ms
- **p99 response time**: < 1000ms
- **Error rate**: < 1%
- **Throughput**: > 50 req/s
