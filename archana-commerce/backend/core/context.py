import uuid
from contextvars import ContextVar

request_id_ctx: ContextVar[str] = ContextVar("request_id", default="")
tenant_id_ctx: ContextVar[uuid.UUID | None] = ContextVar("tenant_id", default=None)
