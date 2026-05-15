#!/bin/bash
set -e

echo "============================================"
echo "  Running Full Test Suite"
echo "============================================"

cleanup() {
  echo ""
  echo "[Cleanup] Stopping Docker services..."
  docker compose -f docker/docker-compose.yml down
}
trap cleanup EXIT

echo ""
echo "[1/6] Starting Docker services..."
docker compose -f docker/docker-compose.yml up -d
echo "  Waiting for services to be healthy..."
sleep 10

echo ""
echo "[2/6] Running API tests..."
echo "--------------------------------------------"
npm -w tests run test:api || { echo "API tests FAILED"; exit 1; }

echo ""
echo "[3/6] Running UI tests..."
echo "--------------------------------------------"
npm -w tests run test:ui -- --project=chromium || { echo "UI tests FAILED"; exit 1; }

echo ""
echo "[4/6] Running Performance smoke test..."
echo "--------------------------------------------"
if command -v k6 &> /dev/null; then
  npm -w tests run test:perf || { echo "Performance tests FAILED"; exit 1; }
else
  echo "  k6 not installed, skipping performance tests"
  echo "  Install: https://k6.io/docs/getting-started/installation/"
fi

echo ""
echo "[5/6] Running Security header check..."
echo "--------------------------------------------"
npm -w tests run test:security:headers || { echo "Security header check FAILED"; exit 1; }

echo ""
echo "[6/6] Running Dependency audit..."
echo "--------------------------------------------"
bash tests/security/scripts/dependency-check.sh || true

echo ""
echo "============================================"
echo "  All tests completed successfully!"
echo "============================================"
