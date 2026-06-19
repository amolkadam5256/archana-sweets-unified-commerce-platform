from typing import Any, Generic, TypeVar

from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class ApiMeta(BaseModel):
    request_id: str
    pagination: dict[str, Any] | None = None


class ApiResponse(BaseModel, Generic[T]):
    data: T
    meta: ApiMeta


class ErrorDetail(BaseModel):
    field: str | None = None
    message: str


class ErrorBody(BaseModel):
    code: str
    message: str
    details: list[ErrorDetail] | None = None


class ErrorResponse(BaseModel):
    error: ErrorBody
    meta: ApiMeta


class HealthStatus(BaseModel):
    status: str
    version: str
    services: dict[str, str]


class MessageResponse(BaseModel):
    message: str

    model_config = ConfigDict(from_attributes=True)
