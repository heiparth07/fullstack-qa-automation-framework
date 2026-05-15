#!/bin/bash
set -e

echo "============================================"
echo "  SDET Portfolio Project - Setup"
echo "============================================"

echo ""
echo "[1/4] Installing dependencies..."
npm install

echo ""
echo "[2/4] Setting up environment..."
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "  Created backend/.env from .env.example"
else
  echo "  backend/.env already exists, skipping"
fi

echo ""
echo "[3/4] Installing Playwright browsers..."
npx -w tests playwright install --with-deps chromium

echo ""
echo "[4/4] Building Docker images..."
docker compose -f docker/docker-compose.yml build

echo ""
echo "============================================"
echo "  Setup complete!"
echo ""
echo "  Quick start:"
echo "    npm run docker:up      # Start all services"
echo "    npm run test:api       # Run API tests"
echo "    npm run test:ui        # Run UI tests"
echo "    npm run test:perf      # Run performance smoke test"
echo "============================================"
