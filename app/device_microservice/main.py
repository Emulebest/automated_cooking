import asyncio
from typing import List, Callable

import jwt
from aioredis import RedisConnection
from aioredis.abc import AbcChannel
from aioredis.pubsub import Receiver
from fastapi import FastAPI
import databases
from starlette.middleware.authentication import AuthenticationMiddleware
from starlette.requests import Request
from starlette.websockets import WebSocket, WebSocketDisconnect
from models import devices
from settings import create_redis, DATABASE_URL, SECRET, ALGORITHM
from data_types import Device

from data_types import DeviceRequest

from backend import BasicAuthBackend

app = FastAPI()
app.add_middleware(AuthenticationMiddleware, backend=BasicAuthBackend())

redis: RedisConnection = None

# DATABASE_URL = "sqlite:///./test.db"
# DATABASE_URL = "postgresql://user:password@postgresserver/db"

database = databases.Database(DATABASE_URL)


async def reader(mpsc: Receiver):
    async for channel, msg in mpsc.iter():
        assert isinstance(channel, AbcChannel)
        print(f"Got {msg} in channel {channel}", flush=True)


@app.on_event("startup")
async def startup():
    await database.connect()
    global redis
    redis = await create_redis()
    loop = asyncio.get_event_loop()
    mpsc = Receiver(loop=loop)
    await redis.subscribe(mpsc.channel('hello'))
    asyncio.ensure_future(reader(mpsc))


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()
    await redis.close()


@app.get("/devices/", response_model=List[Device])
async def read_devices(request: Request):
    query = devices.select().where(devices.c.user == request.user.display_name)
    return await database.fetch_all(query)


@app.post("/devices/", response_model=Device, status_code=201)
async def create_device(request: Request, device: DeviceRequest):
    query = devices.insert().values(description=device.description, status=device.status,
                                    user=request.user.display_name)
    record_id = await database.execute(query)
    return {**device.dict(), "id": record_id}


@app.get("/test")
async def root():
    return {"message": "Hello World"}


@app.websocket_route("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message text was: {data}")
    except WebSocketDisconnect:
        await websocket.close()
