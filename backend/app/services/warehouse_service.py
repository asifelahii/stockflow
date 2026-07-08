from datetime import datetime

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.warehouse import Warehouse
from app.models.warehouse_inventory import WarehouseInventory


DEFAULT_WAREHOUSE_CODE = "MAIN"
DEFAULT_WAREHOUSE_NAME = "Main Warehouse"


class WarehouseCodeConflictError(Exception):
    pass


class WarehouseNotFoundError(Exception):
    pass


def normalize_warehouse_code(code: str) -> str:
    return code.strip().upper().replace(" ", "-")


def get_warehouses(
    db: Session,
    organization_id: int,
    include_inactive: bool = True,
) -> list[Warehouse]:
    query = db.query(Warehouse).filter(Warehouse.organization_id == organization_id)

    if not include_inactive:
        query = query.filter(Warehouse.is_active.is_(True))

    return query.order_by(Warehouse.id.asc()).all()


def get_warehouse_by_id(
    db: Session,
    organization_id: int,
    warehouse_id: int,
    include_inactive: bool = False,
) -> Warehouse | None:
    query = db.query(Warehouse).filter(
        Warehouse.organization_id == organization_id,
        Warehouse.id == warehouse_id,
    )

    if not include_inactive:
        query = query.filter(Warehouse.is_active.is_(True))

    return query.first()


def get_or_create_default_warehouse(
    db: Session,
    organization_id: int,
) -> Warehouse:
    warehouse = (
        db.query(Warehouse)
        .filter(
            Warehouse.organization_id == organization_id,
            Warehouse.code == DEFAULT_WAREHOUSE_CODE,
        )
        .with_for_update()
        .first()
    )

    if warehouse is not None:
        return warehouse

    warehouse = Warehouse(
        organization_id=organization_id,
        name=DEFAULT_WAREHOUSE_NAME,
        code=DEFAULT_WAREHOUSE_CODE,
        is_active=True,
    )

    db.add(warehouse)
    db.flush()

    return warehouse


def create_warehouse(
    db: Session,
    organization_id: int,
    name: str,
    code: str,
    address: str | None = None,
    is_active: bool = True,
) -> Warehouse:
    try:
        warehouse = Warehouse(
            organization_id=organization_id,
            name=name.strip(),
            code=normalize_warehouse_code(code),
            address=address,
            is_active=is_active,
        )

        db.add(warehouse)
        db.commit()
        db.refresh(warehouse)

        return warehouse

    except IntegrityError as error:
        db.rollback()
        raise WarehouseCodeConflictError from error


def update_warehouse(
    db: Session,
    organization_id: int,
    warehouse_id: int,
    update_data: dict,
) -> Warehouse:
    warehouse = get_warehouse_by_id(
        db,
        organization_id,
        warehouse_id,
        include_inactive=True,
    )

    if warehouse is None:
        raise WarehouseNotFoundError

    if "name" in update_data and update_data["name"] is not None:
        warehouse.name = update_data["name"].strip()

    if "code" in update_data and update_data["code"] is not None:
        warehouse.code = normalize_warehouse_code(update_data["code"])

    if "address" in update_data:
        warehouse.address = update_data["address"]

    if "is_active" in update_data and update_data["is_active"] is not None:
        warehouse.is_active = update_data["is_active"]

    warehouse.updated_at = datetime.utcnow()

    try:
        db.commit()
        db.refresh(warehouse)

        return warehouse

    except IntegrityError as error:
        db.rollback()
        raise WarehouseCodeConflictError from error


def deactivate_warehouse(
    db: Session,
    organization_id: int,
    warehouse_id: int,
) -> Warehouse:
    return update_warehouse(
        db,
        organization_id,
        warehouse_id,
        {"is_active": False},
    )


def get_or_create_inventory_record(
    db: Session,
    organization_id: int,
    warehouse_id: int,
    product_id: int,
    low_stock_threshold: int = 0,
) -> WarehouseInventory:
    inventory = (
        db.query(WarehouseInventory)
        .filter(
            WarehouseInventory.organization_id == organization_id,
            WarehouseInventory.warehouse_id == warehouse_id,
            WarehouseInventory.product_id == product_id,
        )
        .with_for_update()
        .first()
    )

    if inventory is not None:
        return inventory

    inventory = WarehouseInventory(
        organization_id=organization_id,
        warehouse_id=warehouse_id,
        product_id=product_id,
        quantity_on_hand=0,
        low_stock_threshold=low_stock_threshold,
    )

    db.add(inventory)
    db.flush()

    return inventory


def get_inventory_by_warehouse(
    db: Session,
    organization_id: int,
    warehouse_id: int,
) -> list[WarehouseInventory]:
    return (
        db.query(WarehouseInventory)
        .filter(
            WarehouseInventory.organization_id == organization_id,
            WarehouseInventory.warehouse_id == warehouse_id,
        )
        .order_by(WarehouseInventory.product_id.asc())
        .all()
    )


def get_inventory_for_product(
    db: Session,
    organization_id: int,
    product_id: int,
) -> list[WarehouseInventory]:
    return (
        db.query(WarehouseInventory)
        .filter(
            WarehouseInventory.organization_id == organization_id,
            WarehouseInventory.product_id == product_id,
        )
        .order_by(WarehouseInventory.warehouse_id.asc())
        .all()
    )
