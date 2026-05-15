FROM mcr.microsoft.com/playwright:v1.42.0-jammy

WORKDIR /app

COPY package.json package-lock.json* ./
COPY tests/package.json tests/
COPY backend/package.json backend/

RUN npm ci

COPY tests/ tests/
COPY backend/ backend/

WORKDIR /app/tests

CMD ["npx", "playwright", "test", "--config", "ui/playwright.config.ts", "--project=chromium"]
