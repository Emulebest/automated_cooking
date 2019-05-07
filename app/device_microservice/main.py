import asyncio

import uvicorn
from aioredis import Redis
from aioredis.abc import AbcChannel
from aioredis.pubsub import Receiver
from fastapi import FastAPI
from starlette.types import Scope
from starlette.websockets import WebSocket, WebSocketDisconnect

from settings import create_redis

app = FastAPI()

redis = None


async def reader(mpsc: Receiver):
    async for channel, msg in mpsc.iter():
        assert isinstance(channel, AbcChannel)
        print(f"Got {msg} in channel {channel}", flush=True)


async def main(scope: Scope, receive, send):
    loop = asyncio.get_event_loop()
    global redis
    if redis is None:
        redis = await create_redis()
    mpsc = Receiver(loop=loop)
    await redis.subscribe(mpsc.channel('hello'))
    task = asyncio.ensure_future(reader(mpsc))
    await app(scope)(receive, send)
    await task


@app.get("/")
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
