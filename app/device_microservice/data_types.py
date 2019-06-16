from typing import Optional

from pydantic import BaseModel


class ChangeParams(BaseModel):
    time: int
    current_time: int
    targetTemp: int


class Device(BaseModel):
    id: int
    description: str
    status: str
    connected: bool
    targetTemp: Optional[float] = None
    timestamp: Optional[int] = None
    time: Optional[int] = None


class DeviceRequest(BaseModel):
    description: str
