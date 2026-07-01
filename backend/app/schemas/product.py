from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    sku: str = Field(..., min_length=2, max_length=100)
    description: str | None = None
    category_id: int | None = None
    supplier_id: int | None = None
    purchase_price: Decimal = Field(default=0, ge=0)
    selling_price: Decimal = Field(default=0, ge=0)
    current_stock: int = Field(default=0, ge=0)
    low_stock_threshold: int = Field(default=0, ge=0)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    version: int = Field(..., ge=1)

    name: str | None = Field(default=None, min_length=2, max_length=150)
    sku: str | None = Field(default=None, min_length=2, max_length=100)
    description: str | None = None
    category_id: int | None = None
    supplier_id: int | None = None
    purchase_price: Decimal | None = Field(default=None, ge=0)
    selling_price: Decimal | None = Field(default=None, ge=0)
    low_stock_threshold: int | None = Field(default=None, ge=0)
    is_active: bool | None = None

    model_config = ConfigDict(extra="forbid")


class ProductResponse(ProductBase):
    id: int
    version: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
