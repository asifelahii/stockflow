from datetime import datetime

from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.stock_movement import StockMovement
from app.models.warehouse import Warehouse
from app.models.warehouse_inventory import WarehouseInventory
from app.schemas.stock_movement import (
    StockAdjustmentCreate,
    StockInCreate,
    StockOutCreate,
)
from app.services import warehouse_service


class InsufficientStockError(Exception):
    pass


class WarehouseNotFoundError(Exception):
    pass


class InsufficientWarehouseStockError(Exception):
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


def get_warehouse_for_stock(
    db: Session,
    organization_id: int,
    warehouse_id: int | None,
) -> Warehouse:
    if warehouse_id is None:
        return warehouse_service.get_or_create_default_warehouse(
            db,
            organization_id,
        )

    warehouse = warehouse_service.get_warehouse_by_id(
        db=db,
        organization_id=organization_id,
        warehouse_id=warehouse_id,
        include_inactive=False,
    )

    if warehouse is None:
        raise WarehouseNotFoundError

    return warehouse


def get_stock_movements(
    db: Session,
    organization_id: int,
    product_id: int | None = None,
    movement_type: str | None = None,
    warehouse_id: int | None = None,
) -> list[StockMovement]:
    query = db.query(StockMovement).filter(
        StockMovement.organization_id == organization_id,
    )

    if product_id is not None:
        query = query.filter(StockMovement.product_id == product_id)

    if movement_type is not None:
        query = query.filter(StockMovement.movement_type == movement_type)

    if warehouse_id is not None:
        query = query.filter(StockMovement.warehouse_id == warehouse_id)

    return query.order_by(StockMovement.id.desc()).all()


def _get_locked_inventory_record(
    db: Session,
    organization_id: int,
    warehouse: Warehouse,
    product: Product,
) -> WarehouseInventory:
    return warehouse_service.get_or_create_inventory_record(
        db=db,
        organization_id=organization_id,
        warehouse_id=warehouse.id,
        product_id=product.id,
        low_stock_threshold=product.low_stock_threshold,
    )


def _record_stock_change(
    db: Session,
    organization_id: int,
    product: Product,
    warehouse: Warehouse,
    warehouse_inventory: WarehouseInventory,
    movement_type: str,
    quantity: int,
    previous_stock: int,
    new_stock: int,
    previous_warehouse_stock: int,
    new_warehouse_stock: int,
    reason: str | None,
    created_by_id: int | None,
) -> StockMovement:
    product.current_stock = new_stock
    product.version += 1

    warehouse_inventory.quantity_on_hand = new_warehouse_stock
    warehouse_inventory.low_stock_threshold = product.low_stock_threshold
    warehouse_inventory.updated_at = datetime.utcnow()

    movement = StockMovement(
        organization_id=organization_id,
        warehouse_id=warehouse.id,
        product_id=product.id,
        movement_type=movement_type,
        quantity=quantity,
        previous_stock=previous_stock,
        new_stock=new_stock,
        previous_warehouse_stock=previous_warehouse_stock,
        new_warehouse_stock=new_warehouse_stock,
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
    warehouse = get_warehouse_for_stock(
        db,
        organization_id,
        stock_data.warehouse_id,
    )
    warehouse_inventory = _get_locked_inventory_record(
        db,
        organization_id,
        warehouse,
        product,
    )

    previous_stock = product.current_stock
    previous_warehouse_stock = warehouse_inventory.quantity_on_hand
    new_stock = previous_stock + stock_data.quantity
    new_warehouse_stock = previous_warehouse_stock + stock_data.quantity

    return _record_stock_change(
        db=db,
        organization_id=organization_id,
        product=product,
        warehouse=warehouse,
        warehouse_inventory=warehouse_inventory,
        movement_type="stock_in",
        quantity=stock_data.quantity,
        previous_stock=previous_stock,
        new_stock=new_stock,
        previous_warehouse_stock=previous_warehouse_stock,
        new_warehouse_stock=new_warehouse_stock,
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
    warehouse = get_warehouse_for_stock(
        db,
        organization_id,
        stock_data.warehouse_id,
    )
    warehouse_inventory = _get_locked_inventory_record(
        db,
        organization_id,
        warehouse,
        product,
    )

    previous_stock = product.current_stock
    previous_warehouse_stock = warehouse_inventory.quantity_on_hand

    if previous_stock < stock_data.quantity:
        raise InsufficientStockError

    if previous_warehouse_stock < stock_data.quantity:
        raise InsufficientWarehouseStockError

    new_stock = previous_stock - stock_data.quantity
    new_warehouse_stock = previous_warehouse_stock - stock_data.quantity

    return _record_stock_change(
        db=db,
        organization_id=organization_id,
        product=product,
        warehouse=warehouse,
        warehouse_inventory=warehouse_inventory,
        movement_type="stock_out",
        quantity=stock_data.quantity,
        previous_stock=previous_stock,
        new_stock=new_stock,
        previous_warehouse_stock=previous_warehouse_stock,
        new_warehouse_stock=new_warehouse_stock,
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
    warehouse = get_warehouse_for_stock(
        db,
        organization_id,
        stock_data.warehouse_id,
    )
    warehouse_inventory = _get_locked_inventory_record(
        db,
        organization_id,
        warehouse,
        product,
    )

    previous_stock = product.current_stock
    previous_warehouse_stock = warehouse_inventory.quantity_on_hand
    new_warehouse_stock = stock_data.new_stock
    quantity_difference = abs(new_warehouse_stock - previous_warehouse_stock)
    new_stock = previous_stock + (new_warehouse_stock - previous_warehouse_stock)

    return _record_stock_change(
        db=db,
        organization_id=organization_id,
        product=product,
        warehouse=warehouse,
        warehouse_inventory=warehouse_inventory,
        movement_type="adjustment",
        quantity=quantity_difference,
        previous_stock=previous_stock,
        new_stock=new_stock,
        previous_warehouse_stock=previous_warehouse_stock,
        new_warehouse_stock=new_warehouse_stock,
        reason=stock_data.reason,
        created_by_id=created_by_id,
    )
