@echo off
setlocal enabledelayedexpansion

echo Starting Archana Commerce development environment...
echo.

where docker >nul 2>nul
if errorlevel 1 (
    echo ERROR: Docker Desktop is not installed or docker.exe is not available in PATH.
    echo Install Docker Desktop, start it, then open a new terminal and run this script again.
    exit /b 1
)

where python >nul 2>nul
if errorlevel 1 (
    echo ERROR: Python 3.12 is not installed or python.exe is not available in PATH.
    echo Install Python 3.12 and enable "Add python.exe to PATH".
    exit /b 1
)

where pnpm >nul 2>nul
if errorlevel 1 (
    echo ERROR: pnpm is not installed or pnpm.cmd is not available in PATH.
    echo Install Node.js 20+, then run: corepack enable
    exit /b 1
)

docker compose -f infrastructure/docker/docker-compose.dev.yml up -d postgres redis
if errorlevel 1 (
    echo ERROR: Failed to start PostgreSQL and Redis with Docker Compose.
    exit /b 1
)

echo Waiting for PostgreSQL...
timeout /t 5 /nobreak > nul

cd backend
if not exist .venv (
    echo Creating Python virtual environment...
    python -m venv .venv
    if errorlevel 1 (
        echo ERROR: Failed to create Python virtual environment.
        cd ..
        exit /b 1
    )
)
call .venv\Scripts\activate
if errorlevel 1 (
    echo ERROR: Failed to activate Python virtual environment.
    cd ..
    exit /b 1
)

pip install -e ".[dev]" -q
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies.
    cd ..
    exit /b 1
)

alembic upgrade head
if errorlevel 1 (
    echo ERROR: Failed to run database migrations.
    cd ..
    exit /b 1
)
cd ..

echo.
echo Development dependencies are ready.
echo   PostgreSQL: localhost:5432
echo   Redis:      localhost:6379
echo   Demo database: Admin
echo   Demo database password: Admin
echo.
echo Next steps:
echo   pnpm install
echo   pnpm dev
echo   cd backend ^&^& uvicorn api.main:app --reload --port 8000
