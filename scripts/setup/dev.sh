#!/usr/bin/env bash
set -euo pipefail

echo "Starting Archana Commerce development environment..."
echo ""

if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: Docker is not installed or not available in PATH."
  echo "Install Docker Desktop or Docker Engine, start it, then run this script again."
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "ERROR: Python 3.12 is not installed or python3 is not available in PATH."
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "ERROR: pnpm is not installed or not available in PATH."
  echo "Install Node.js 20+, then run: corepack enable"
  exit 1
fi

docker compose -f infrastructure/docker/docker-compose.dev.yml up -d postgres redis

echo "Waiting for PostgreSQL..."
sleep 5

cd backend
if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
pip install -e ".[dev]" -q
alembic upgrade head
cd ..

echo ""
echo "Development dependencies are ready."
echo "  PostgreSQL: localhost:5432"
echo "  Redis:      localhost:6379"
echo "  Demo database: Admin"
echo "  Demo database password: Admin"
echo ""
echo "Next steps:"
echo "  pnpm install"
echo "  pnpm dev"
echo "  cd backend && uvicorn api.main:app --reload --port 8000"
