from pydantic import BaseModel


class Device(BaseModel):
    id: int
    description: str
    status: str
    connected: bool


class DeviceRequest(BaseModel):
    description: str
