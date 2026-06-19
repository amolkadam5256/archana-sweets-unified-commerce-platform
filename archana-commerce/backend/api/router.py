from fastapi import APIRouter

from api.health import router as health_router

api_v1 = APIRouter(prefix="/api/v1")

api_v1.include_router(health_router)

# Phase 1.2+ module routers will be mounted here:
# api_v1.include_router(auth_router, prefix="/auth", tags=["Auth"])
# api_v1.include_router(users_router, prefix="/users", tags=["Users"])
