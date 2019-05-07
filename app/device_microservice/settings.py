import os

import aioredis

REDIS_HOST = os.environ["REDIS_HOST"]
REDIS_PORT = os.environ["REDIS_PORT"]


async def create_redis():
    await aioredis.create_redis(f"redis://{REDIS_HOST}:{REDIS_PORT}")
