from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from core.cache import ping_redis
from core.config import settings
from core.database import get_db
from core.context import request_id_ctx
from fastapi import APIRouter, Depends
from shared.schemas.common import ApiMeta, ApiResponse, HealthStatus

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=ApiResponse[HealthStatus])
async def health_check(db: AsyncSession = Depends(get_db)) -> ApiResponse[HealthStatus]:
    services: dict[str, str] = {}

    try:
        await db.execute(text("SELECT 1"))
        services["database"] = "up"
    except Exception:
        services["database"] = "down"

    services["redis"] = "up" if await ping_redis() else "down"

    all_up = all(v == "up" for v in services.values())
    status = "healthy" if all_up else "degraded"

    return ApiResponse(
        data=HealthStatus(
            status=status,
            version=settings.app_version,
            services=services,
        ),
        meta=ApiMeta(request_id=request_id_ctx.get()),
    )


@router.get("/ready")
async def readiness() -> dict[str, str]:
    return {"status": "ready"}
