from typing import Any

from fastapi import Request
from fastapi.responses import JSONResponse

from core.context import request_id_ctx
from core.exceptions import AppException
from shared.schemas.common import ApiMeta, ErrorBody, ErrorResponse


async def app_exception_handler(_request: Request, exc: AppException) -> JSONResponse:
    body = ErrorResponse(
        error=ErrorBody(
            code=exc.code,
            message=exc.message,
            details=exc.details,
        ),
        meta=ApiMeta(request_id=request_id_ctx.get()),
    )
    return JSONResponse(status_code=exc.status_code, content=body.model_dump())


async def unhandled_exception_handler(_request: Request, exc: Exception) -> JSONResponse:
    body = ErrorResponse(
        error=ErrorBody(
            code="INTERNAL_ERROR",
            message="An unexpected error occurred",
        ),
        meta=ApiMeta(request_id=request_id_ctx.get()),
    )
    return JSONResponse(status_code=500, content=body.model_dump())
