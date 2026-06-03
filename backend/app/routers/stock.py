from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.stock_movement import (
    StockAdjustmentCreate,
    StockInCreate,
    StockMovementResponse,
    StockOutCreate,
)
from app.services import stock_service


router = APIRouter(prefix="/api/v1/stock", tags=["Stock"])


@router.post("/in", response_model=StockMovementResponse, status_code=status.HTTP_201_CREATED)
def create_stock_in(
    stock_data: StockInCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    product = stock_service.get_product_for_stock(db, stock_data.product_id)

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return stock_service.create_stock_in(
        db=db,
        product=product,
        stock_data=stock_data,
        created_by_id=current_user.id,
    )


@router.post("/out", response_model=StockMovementResponse, status_code=status.HTTP_201_CREATED)
def create_stock_out(
    stock_data: StockOutCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    product = stock_service.get_product_for_stock(db, stock_data.product_id)

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    if product.current_stock < stock_data.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient stock",
        )

    return stock_service.create_stock_out(
        db=db,
        product=product,
        stock_data=stock_data,
        created_by_id=current_user.id,
    )


@router.post("/adjust", response_model=StockMovementResponse, status_code=status.HTTP_201_CREATED)
def create_stock_adjustment(
    stock_data: StockAdjustmentCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    product = stock_service.get_product_for_stock(db, stock_data.product_id)

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return stock_service.create_stock_adjustment(
        db=db,
        product=product,
        stock_data=stock_data,
        created_by_id=current_user.id,
    )


@router.get("/movements", response_model=list[StockMovementResponse])
def get_stock_movements(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
    product_id: int | None = Query(default=None),
    movement_type: str | None = Query(default=None),
):
    return stock_service.get_stock_movements(
        db=db,
        product_id=product_id,
        movement_type=movement_type,
    )