from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class StockMovementBase(BaseModel):
    product_id: int
    warehouse_id: int | None = None
    quantity: int = Field(..., gt=0)
    reason: str | None = None


class StockInCreate(StockMovementBase):
    pass


class StockOutCreate(StockMovementBase):
    pass


class StockAdjustmentCreate(BaseModel):
    product_id: int
    warehouse_id: int | None = None
    new_stock: int = Field(..., ge=0)
    reason: str | None = None


class StockMovementResponse(BaseModel):
    id: int
    product_id: int
    warehouse_id: int
    movement_type: str
    quantity: int
    previous_stock: int
    new_stock: int
    previous_warehouse_stock: int
    new_warehouse_stock: int
    reason: str | None
    created_by_id: int | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
