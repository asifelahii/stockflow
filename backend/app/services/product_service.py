from datetime import datetime

from sqlalchemy import or_, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.category import ProductCategory
from app.models.product import Product
from app.models.stock_movement import StockMovement
from app.models.supplier import Supplier
from app.schemas.product import ProductCreate, ProductUpdate


class ProductSkuConflictError(Exception):
    pass


class ProductVersionConflictError(Exception):
    pass


def get_product_by_id(
    db: Session,
    organization_id: int,
    product_id: int,
    include_inactive: bool = False,
) -> Product | None:
    query = db.query(Product).filter(
        Product.organization_id == organization_id,
        Product.id == product_id,
    )

    if not include_inactive:
        query = query.filter(Product.is_active.is_(True))

    return query.first()


def get_product_by_sku(
    db: Session,
    organization_id: int,
    sku: str,
) -> Product | None:
    return (
        db.query(Product)
        .filter(
            Product.organization_id == organization_id,
            Product.sku == sku,
        )
        .first()
    )


def get_products(
    db: Session,
    organization_id: int,
    search: str | None = None,
    is_low_stock: bool | None = None,
    include_inactive: bool = True,
) -> list[Product]:
    query = db.query(Product).filter(
        Product.organization_id == organization_id,
    )

    if not include_inactive:
        query = query.filter(Product.is_active.is_(True))

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_term),
                Product.sku.ilike(search_term),
            )
        )

    if is_low_stock is True:
        query = query.filter(
            Product.current_stock <= Product.low_stock_threshold,
        )

    return query.order_by(Product.id.desc()).all()


def product_category_exists(
    db: Session,
    organization_id: int,
    category_id: int,
) -> bool:
    return (
        db.query(ProductCategory)
        .filter(
            ProductCategory.organization_id == organization_id,
            ProductCategory.id == category_id,
            ProductCategory.is_active.is_(True),
        )
        .first()
        is not None
    )


def supplier_exists(
    db: Session,
    organization_id: int,
    supplier_id: int,
) -> bool:
    return (
        db.query(Supplier)
        .filter(
            Supplier.organization_id == organization_id,
            Supplier.id == supplier_id,
            Supplier.is_active.is_(True),
        )
        .first()
        is not None
    )


def create_product(
    db: Session,
    organization_id: int,
    product_data: ProductCreate,
    created_by_id: int | None = None,
) -> Product:
    try:
        product = Product(
            organization_id=organization_id,
            **product_data.model_dump(),
        )

        db.add(product)
        db.flush()

        if product.current_stock > 0:
            db.add(
                StockMovement(
                    organization_id=organization_id,
                    product_id=product.id,
                    movement_type="initial_stock",
                    quantity=product.current_stock,
                    previous_stock=0,
                    new_stock=product.current_stock,
                    reason="Initial stock recorded during product creation",
                    created_by_id=created_by_id,
                )
            )

        db.commit()
        db.refresh(product)

        return product

    except IntegrityError as error:
        db.rollback()
        raise ProductSkuConflictError from error


def _apply_product_update(
    db: Session,
    organization_id: int,
    product_id: int,
    expected_version: int,
    update_data: dict,
) -> Product:
    if not update_data:
        product = get_product_by_id(
            db,
            organization_id,
            product_id,
            include_inactive=True,
        )

        if product is None or product.version != expected_version:
            raise ProductVersionConflictError

        return product

    try:
        result = db.execute(
            update(Product)
            .where(
                Product.organization_id == organization_id,
                Product.id == product_id,
                Product.version == expected_version,
            )
            .values(
                **update_data,
                version=Product.version + 1,
                updated_at=datetime.utcnow(),
            )
        )

        if result.rowcount != 1:
            db.rollback()
            raise ProductVersionConflictError

        db.commit()
        db.expire_all()

        product = get_product_by_id(
            db,
            organization_id,
            product_id,
            include_inactive=True,
        )

        if product is None:
            raise ProductVersionConflictError

        return product

    except IntegrityError as error:
        db.rollback()
        raise ProductSkuConflictError from error


def update_product(
    db: Session,
    organization_id: int,
    product_id: int,
    product_data: ProductUpdate,
) -> Product:
    update_data = product_data.model_dump(exclude_unset=True)
    expected_version = update_data.pop("version")

    return _apply_product_update(
        db,
        organization_id,
        product_id,
        expected_version,
        update_data,
    )


def deactivate_product(
    db: Session,
    organization_id: int,
    product_id: int,
    expected_version: int,
) -> Product:
    return _apply_product_update(
        db,
        organization_id,
        product_id,
        expected_version,
        {"is_active": False},
    )
