from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class WarehouseBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    code: str = Field(..., min_length=1, max_length=50)
    address: str | None = None
    is_active: bool = True

    @field_validator("name", "code")
    @classmethod
    def strip_required_text(cls, value: str) -> str:
        cleaned = value.strip()

        if not cleaned:
            raise ValueError("Value cannot be empty.")

        return cleaned

    @field_validator("code")
    @classmethod
    def normalize_code(cls, value: str) -> str:
        return value.strip().upper().replace(" ", "-")


class WarehouseCreate(WarehouseBase):
    pass


class WarehouseUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    code: str | None = Field(default=None, min_length=1, max_length=50)
    address: str | None = None
    is_active: bool | None = None

    @field_validator("name", "code")
    @classmethod
    def strip_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return value

        cleaned = value.strip()

        if not cleaned:
            raise ValueError("Value cannot be empty.")

        return cleaned

    @field_validator("code")
    @classmethod
    def normalize_optional_code(cls, value: str | None) -> str | None:
        if value is None:
            return value

        return value.strip().upper().replace(" ", "-")


class WarehouseResponse(BaseModel):
    id: int
    organization_id: int
    name: str
    code: str
    address: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WarehouseInventoryResponse(BaseModel):
    id: int
    organization_id: int
    warehouse_id: int
    product_id: int
    quantity_on_hand: int
    low_stock_threshold: int
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
