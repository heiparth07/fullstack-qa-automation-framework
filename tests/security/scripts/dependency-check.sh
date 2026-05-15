#!/bin/bash
set -e

echo "============================================"
echo "  Security Dependency Check"
echo "============================================"

echo ""
echo "[1/3] Running npm audit on backend..."
echo "--------------------------------------------"
cd backend && npm audit --production 2>&1 || true
cd ..

echo ""
echo "[2/3] Running npm audit on frontend..."
echo "--------------------------------------------"
cd frontend && npm audit --production 2>&1 || true
cd ..

echo ""
echo "[3/3] Checking for known vulnerabilities..."
echo "--------------------------------------------"

HIGH_VULNS=$(npm audit --json 2>/dev/null | grep -c '"severity":"high"' || echo "0")
CRITICAL_VULNS=$(npm audit --json 2>/dev/null | grep -c '"severity":"critical"' || echo "0")

echo ""
echo "============================================"
echo "  Summary"
echo "============================================"
echo "  High vulnerabilities:     $HIGH_VULNS"
echo "  Critical vulnerabilities: $CRITICAL_VULNS"

if [ "$CRITICAL_VULNS" -gt "0" ]; then
    echo ""
    echo "FAIL: Critical vulnerabilities found!"
    exit 1
fi

echo ""
echo "PASS: No critical vulnerabilities found."
exit 0
