import os

import aioredis
import sqlalchemy

REDIS_HOST = os.environ["REDIS_HOST"]
REDIS_PORT = os.environ["REDIS_PORT"]
DATABASE_URL = os.environ["DATABASE_URL"]

SECRET = "$sc7z*$mub!&n6ppy6x&c$irlk84=#5i-7jqm)xyj@=qd=nnf1"
ALGORITHM = "HS256"

engine = sqlalchemy.create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)


async def create_redis():
    return await aioredis.create_redis(f"redis://{REDIS_HOST}:{REDIS_PORT}")
