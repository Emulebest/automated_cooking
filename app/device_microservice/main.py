import asyncio

from aioredis import Redis
from aioredis.abc import AbcChannel
from aioredis.pubsub import Receiver
from fastapi import FastAPI
from starlette.types import Scope
from starlette.websockets import WebSocket, WebSocketDisconnect

from settings import create_redis

app = FastAPI()

redis: Redis


async def reader(mpsc: Receiver):
    async for channel, msg in mpsc.iter():
        assert isinstance(channel, AbcChannel)
        print(f"Got {msg} in channel {channel}")


async def main(scope: Scope):
    loop = asyncio.get_event_loop()
    global redis
    redis = await create_redis()
    mpsc = Receiver(loop=loop)
    await asyncio.ensure_future(reader(mpsc))
    app(scope)


@app.websocket_route("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message text was: {data}")
    except WebSocketDisconnect:
        await websocket.close()
