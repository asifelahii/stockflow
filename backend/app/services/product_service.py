from datetime import date, datetime

from pydantic import ValidationError
from sqlalchemy import and_, not_, or_, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.category import ProductCategory
from app.models.product import Product
from app.models.stock_movement import StockMovement
from app.models.supplier import Supplier
from app.schemas.product import ProductCreate, ProductUpdate
from app.services import warehouse_service


class ProductSkuConflictError(Exception):
    pass


class ProductVersionConflictError(Exception):
    pass


class ProductCatalogValidationError(Exception):
    def __init__(self, detail: str):
        super().__init__(detail)
        self.detail = detail


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
    is_featured: bool | None = None,
    has_active_offer: bool | None = None,
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

    if is_featured is not None:
        query = query.filter(Product.is_featured.is_(is_featured))

    if has_active_offer is not None:
        today = date.today()
        active_offer_filter = and_(
            Product.discount_type != "none",
            Product.discount_value > 0,
            or_(
                Product.offer_starts_on.is_(None),
                Product.offer_starts_on <= today,
            ),
            or_(
                Product.offer_ends_on.is_(None),
                Product.offer_ends_on >= today,
            ),
        )
        query = query.filter(
            active_offer_filter if has_active_offer else not_(active_offer_filter)
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


        default_warehouse = warehouse_service.get_or_create_default_warehouse(
            db,
            organization_id,
        )
        warehouse_inventory = warehouse_service.get_or_create_inventory_record(
            db=db,
            organization_id=organization_id,
            warehouse_id=default_warehouse.id,
            product_id=product.id,
            low_stock_threshold=product.low_stock_threshold,
        )
        warehouse_inventory.quantity_on_hand = product.current_stock
        warehouse_inventory.low_stock_threshold = product.low_stock_threshold

        if product.current_stock > 0:
            db.add(
                StockMovement(
                    organization_id=organization_id,
                    warehouse_id=default_warehouse.id,
                    product_id=product.id,
                    movement_type="initial_stock",
                    quantity=product.current_stock,
                    previous_stock=0,
                    new_stock=product.current_stock,
                    previous_warehouse_stock=0,
                    new_warehouse_stock=product.current_stock,
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


def _catalog_validation_payload(product: Product) -> dict:
    return {
        "name": product.name,
        "sku": product.sku,
        "short_description": product.short_description,
        "description": product.description,
        "image_url": product.image_url,
        "image_public_id": product.image_public_id,
        "image_urls": product.image_urls or [],
        "image_public_ids": product.image_public_ids or [],
        "category_id": product.category_id,
        "supplier_id": product.supplier_id,
        "release_year": product.release_year,
        "is_featured": product.is_featured,
        "purchase_price": product.purchase_price,
        "selling_price": product.selling_price,
        "discount_type": product.discount_type,
        "discount_value": product.discount_value,
        "offer_starts_on": product.offer_starts_on,
        "offer_ends_on": product.offer_ends_on,
        "tax_rate": product.tax_rate,
        "shipping_fee": product.shipping_fee,
        "additional_cost": product.additional_cost,
        "attributes": product.attributes or [],
        "specifications": product.specifications or [],
        "current_stock": product.current_stock,
        "low_stock_threshold": product.low_stock_threshold,
    }


def _validate_and_normalize_product_update(
    product: Product,
    update_data: dict,
) -> dict:
    effective_data = _catalog_validation_payload(product)
    effective_data.update(update_data)

    try:
        validated_product = ProductCreate.model_validate(effective_data)
    except ValidationError as error:
        messages = [
            str(item.get("msg", "Invalid product catalogue value")).replace("Value error, ", "")
            for item in error.errors()
        ]
        raise ProductCatalogValidationError("; ".join(messages)) from error

    normalized_data = validated_product.model_dump()
    normalized_update_data: dict = {}

    for field_name, value in update_data.items():
        if field_name in normalized_data:
            normalized_update_data[field_name] = normalized_data[field_name]
        elif field_name == "is_active":
            # is_active is validated by ProductUpdate, not ProductCreate.
            normalized_update_data[field_name] = value
        else:
            raise ProductCatalogValidationError(
                f"Unsupported product update field: {field_name}"
            )

    return normalized_update_data


def update_product(
    db: Session,
    organization_id: int,
    product_id: int,
    product_data: ProductUpdate,
) -> Product:
    update_data = product_data.model_dump(exclude_unset=True)
    expected_version = update_data.pop("version")

    if not update_data:
        return _apply_product_update(
            db,
            organization_id,
            product_id,
            expected_version,
            update_data,
        )

    product = get_product_by_id(
        db,
        organization_id,
        product_id,
        include_inactive=True,
    )

    if product is None:
        raise ProductVersionConflictError

    normalized_update_data = _validate_and_normalize_product_update(product, update_data)

    return _apply_product_update(
        db,
        organization_id,
        product_id,
        expected_version,
        normalized_update_data,
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


def get_product_media_public_ids(product: Product) -> set[str]:
    public_ids = {public_id for public_id in [product.image_public_id, *(product.image_public_ids or [])] if public_id}
    return public_ids
