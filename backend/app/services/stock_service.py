from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.stock_movement import StockMovement
from app.schemas.stock_movement import (
    StockAdjustmentCreate,
    StockInCreate,
    StockOutCreate,
)


def get_product_for_stock(db: Session, product_id: int) -> Product | None:
    return (
        db.query(Product)
        .filter(
            Product.id == product_id,
            Product.is_active.is_(True),
        )
        .first()
    )


def get_stock_movements(
    db: Session,
    product_id: int | None = None,
    movement_type: str | None = None,
) -> list[StockMovement]:
    query = db.query(StockMovement)

    if product_id is not None:
        query = query.filter(StockMovement.product_id == product_id)

    if movement_type is not None:
        query = query.filter(StockMovement.movement_type == movement_type)

    return query.order_by(StockMovement.id.desc()).all()


def create_stock_in(
    db: Session,
    product: Product,
    stock_data: StockInCreate,
    created_by_id: int | None = None,
) -> StockMovement:
    previous_stock = product.current_stock
    new_stock = previous_stock + stock_data.quantity

    product.current_stock = new_stock

    movement = StockMovement(
        product_id=product.id,
        movement_type="stock_in",
        quantity=stock_data.quantity,
        previous_stock=previous_stock,
        new_stock=new_stock,
        reason=stock_data.reason,
        created_by_id=created_by_id,
    )

    db.add(movement)
    db.commit()
    db.refresh(movement)

    return movement


def create_stock_out(
    db: Session,
    product: Product,
    stock_data: StockOutCreate,
    created_by_id: int | None = None,
) -> StockMovement:
    previous_stock = product.current_stock
    new_stock = previous_stock - stock_data.quantity

    product.current_stock = new_stock

    movement = StockMovement(
        product_id=product.id,
        movement_type="stock_out",
        quantity=stock_data.quantity,
        previous_stock=previous_stock,
        new_stock=new_stock,
        reason=stock_data.reason,
        created_by_id=created_by_id,
    )

    db.add(movement)
    db.commit()
    db.refresh(movement)

    return movement


def create_stock_adjustment(
    db: Session,
    product: Product,
    stock_data: StockAdjustmentCreate,
    created_by_id: int | None = None,
) -> StockMovement:
    previous_stock = product.current_stock
    new_stock = stock_data.new_stock
    quantity_difference = abs(new_stock - previous_stock)

    product.current_stock = new_stock

    movement = StockMovement(
        product_id=product.id,
        movement_type="adjustment",
        quantity=quantity_difference,
        previous_stock=previous_stock,
        new_stock=new_stock,
        reason=stock_data.reason,
        created_by_id=created_by_id,
    )

    db.add(movement)
    db.commit()
    db.refresh(movement)

    return movement