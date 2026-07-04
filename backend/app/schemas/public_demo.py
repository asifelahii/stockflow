from typing import Literal

from pydantic import BaseModel


class DemoLoginRequest(BaseModel):
    tenant_key: Literal["tenant_1", "tenant_2"]


class PublicDemoResetResponse(BaseModel):
    reset_count: int
    reset_tenants: list[str]
