#!/usr/bin/env bash
set -euo pipefail

echo "Starting Archana Commerce development environment..."

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
echo "Development services ready!"
echo "  PostgreSQL: localhost:5432"
echo "  Redis:      localhost:6379"
echo ""
echo "Next steps:"
echo "  pnpm install"
echo "  pnpm dev"
echo "  cd backend && uvicorn api.main:app --reload --port 8000"
