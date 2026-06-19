import redis.asyncio as aioredis

from core.config import settings

_redis: aioredis.Redis | None = None


async def get_redis() -> aioredis.Redis:
    global _redis
    if _redis is None:
        _redis = aioredis.from_url(settings.redis_url, decode_responses=True)
    return _redis


async def close_redis() -> None:
    global _redis
    if _redis is not None:
        await _redis.close()
        _redis = None


async def ping_redis() -> bool:
    try:
        client = await get_redis()
        return await client.ping()
    except Exception:
        return False
