from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.stock_movement import StockMovement
from app.schemas.stock_movement import (
    StockAdjustmentCreate,
    StockInCreate,
    StockOutCreate,
)


class InsufficientStockError(Exception):
    pass


def get_product_for_stock(
    db: Session,
    organization_id: int,
    product_id: int,
) -> Product | None:
    return (
        db.query(Product)
        .filter(
            Product.organization_id == organization_id,
            Product.id == product_id,
            Product.is_active.is_(True),
        )
        .with_for_update()
        .first()
    )


def get_stock_movements(
    db: Session,
    organization_id: int,
    product_id: int | None = None,
    movement_type: str | None = None,
) -> list[StockMovement]:
    query = db.query(StockMovement).filter(
        StockMovement.organization_id == organization_id,
    )

    if product_id is not None:
        query = query.filter(StockMovement.product_id == product_id)

    if movement_type is not None:
        query = query.filter(StockMovement.movement_type == movement_type)

    return query.order_by(StockMovement.id.desc()).all()


def _record_stock_change(
    db: Session,
    organization_id: int,
    product: Product,
    movement_type: str,
    quantity: int,
    previous_stock: int,
    new_stock: int,
    reason: str | None,
    created_by_id: int | None,
) -> StockMovement:
    product.current_stock = new_stock
    product.version += 1

    movement = StockMovement(
        organization_id=organization_id,
        product_id=product.id,
        movement_type=movement_type,
        quantity=quantity,
        previous_stock=previous_stock,
        new_stock=new_stock,
        reason=reason,
        created_by_id=created_by_id,
    )

    db.add(movement)
    db.commit()
    db.refresh(movement)

    return movement


def create_stock_in(
    db: Session,
    organization_id: int,
    product: Product,
    stock_data: StockInCreate,
    created_by_id: int | None = None,
) -> StockMovement:
    previous_stock = product.current_stock
    new_stock = previous_stock + stock_data.quantity

    return _record_stock_change(
        db=db,
        organization_id=organization_id,
        product=product,
        movement_type="stock_in",
        quantity=stock_data.quantity,
        previous_stock=previous_stock,
        new_stock=new_stock,
        reason=stock_data.reason,
        created_by_id=created_by_id,
    )


def create_stock_out(
    db: Session,
    organization_id: int,
    product: Product,
    stock_data: StockOutCreate,
    created_by_id: int | None = None,
) -> StockMovement:
    previous_stock = product.current_stock

    if previous_stock < stock_data.quantity:
        raise InsufficientStockError

    new_stock = previous_stock - stock_data.quantity

    return _record_stock_change(
        db=db,
        organization_id=organization_id,
        product=product,
        movement_type="stock_out",
        quantity=stock_data.quantity,
        previous_stock=previous_stock,
        new_stock=new_stock,
        reason=stock_data.reason,
        created_by_id=created_by_id,
    )


def create_stock_adjustment(
    db: Session,
    organization_id: int,
    product: Product,
    stock_data: StockAdjustmentCreate,
    created_by_id: int | None = None,
) -> StockMovement:
    previous_stock = product.current_stock
    new_stock = stock_data.new_stock
    quantity_difference = abs(new_stock - previous_stock)

    return _record_stock_change(
        db=db,
        organization_id=organization_id,
        product=product,
        movement_type="adjustment",
        quantity=quantity_difference,
        previous_stock=previous_stock,
        new_stock=new_stock,
        reason=stock_data.reason,
        created_by_id=created_by_id,
    )
