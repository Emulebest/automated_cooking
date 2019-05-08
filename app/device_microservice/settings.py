import os

import aioredis
import sqlalchemy

REDIS_HOST = os.environ["REDIS_HOST"]
REDIS_PORT = os.environ["REDIS_PORT"]
DATABASE_URL = os.environ["DATABASE_URL"]

engine = sqlalchemy.create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)


async def create_redis():
    return await aioredis.create_redis(f"redis://{REDIS_HOST}:{REDIS_PORT}")
