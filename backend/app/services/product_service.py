# # from sqlalchemy import or_
# # from sqlalchemy.orm import Session

# # from app.models.product import Product
# # from app.schemas.product import ProductCreate, ProductUpdate


# # def get_product_by_id(db: Session, product_id: int) -> Product | None:
# #     return db.query(Product).filter(Product.id == product_id).first()


# # def get_product_by_sku(db: Session, sku: str) -> Product | None:
# #     return db.query(Product).filter(Product.sku == sku).first()


# # def get_products(
# #     db: Session,
# #     search: str | None = None,
# #     is_low_stock: bool | None = None,
# # ) -> list[Product]:
# #     query = db.query(Product)

# #     if search:
# #         search_term = f"%{search}%"
# #         query = query.filter(
# #             or_(
# #                 Product.name.ilike(search_term),
# #                 Product.sku.ilike(search_term),
# #             )
# #         )

# #     if is_low_stock is True:
# #         query = query.filter(Product.current_stock <= Product.low_stock_threshold)

# #     return query.order_by(Product.id.desc()).all()


# # def create_product(db: Session, product_data: ProductCreate) -> Product:
# #     product = Product(**product_data.model_dump())

# #     db.add(product)
# #     db.commit()
# #     db.refresh(product)

# #     return product


# # def update_product(
# #     db: Session,
# #     product: Product,
# #     product_data: ProductUpdate,
# # ) -> Product:
# #     update_data = product_data.model_dump(exclude_unset=True)

# #     for field, value in update_data.items():
# #         setattr(product, field, value)

# #     db.commit()
# #     db.refresh(product)

# #     return product


# # def delete_product(db: Session, product: Product) -> Product:
# #     product.is_active = False

# #     db.commit()
# #     db.refresh(product)

# #     return product

# from sqlalchemy import or_
# from sqlalchemy.orm import Session

# from app.models.product import Product
# from app.schemas.product import ProductCreate, ProductUpdate


# def get_product_by_id(
#     db: Session,
#     product_id: int,
#     include_inactive: bool = False,
# ) -> Product | None:
#     query = db.query(Product).filter(Product.id == product_id)

#     if not include_inactive:
#         query = query.filter(Product.is_active.is_(True))

#     return query.first()


# def get_product_by_sku(db: Session, sku: str) -> Product | None:
#     return db.query(Product).filter(Product.sku == sku).first()


# def get_products(
#     db: Session,
#     search: str | None = None,
#     is_low_stock: bool | None = None,
# ) -> list[Product]:
#     query = db.query(Product).filter(Product.is_active.is_(True))

#     if search:
#         search_term = f"%{search}%"
#         query = query.filter(
#             or_(
#                 Product.name.ilike(search_term),
#                 Product.sku.ilike(search_term),
#             )
#         )

#     if is_low_stock is True:
#         query = query.filter(Product.current_stock <= Product.low_stock_threshold)

#     return query.order_by(Product.id.desc()).all()


# def create_product(db: Session, product_data: ProductCreate) -> Product:
#     product = Product(**product_data.model_dump())

#     db.add(product)
#     db.commit()
#     db.refresh(product)

#     return product


# def update_product(
#     db: Session,
#     product: Product,
#     product_data: ProductUpdate,
# ) -> Product:
#     update_data = product_data.model_dump(exclude_unset=True)

#     for field, value in update_data.items():
#         setattr(product, field, value)

#     db.commit()
#     db.refresh(product)

#     return product


# def delete_product(db: Session, product: Product) -> Product:
#     product.is_active = False

#     db.commit()
#     db.refresh(product)

#     return product

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.category import ProductCategory
from app.models.product import Product
from app.models.supplier import Supplier
from app.schemas.product import ProductCreate, ProductUpdate


def get_product_by_id(
    db: Session,
    product_id: int,
    include_inactive: bool = False,
) -> Product | None:
    query = db.query(Product).filter(Product.id == product_id)

    if not include_inactive:
        query = query.filter(Product.is_active.is_(True))

    return query.first()


def get_product_by_sku(db: Session, sku: str) -> Product | None:
    return db.query(Product).filter(Product.sku == sku).first()


def get_products(
    db: Session,
    search: str | None = None,
    is_low_stock: bool | None = None,
) -> list[Product]:
    query = db.query(Product).filter(Product.is_active.is_(True))

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_term),
                Product.sku.ilike(search_term),
            )
        )

    if is_low_stock is True:
        query = query.filter(Product.current_stock <= Product.low_stock_threshold)

    return query.order_by(Product.id.desc()).all()


def product_category_exists(db: Session, category_id: int) -> bool:
    return (
        db.query(ProductCategory)
        .filter(
            ProductCategory.id == category_id,
            ProductCategory.is_active.is_(True),
        )
        .first()
        is not None
    )


def supplier_exists(db: Session, supplier_id: int) -> bool:
    return (
        db.query(Supplier)
        .filter(
            Supplier.id == supplier_id,
            Supplier.is_active.is_(True),
        )
        .first()
        is not None
    )


def create_product(db: Session, product_data: ProductCreate) -> Product:
    product = Product(**product_data.model_dump())

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


def update_product(
    db: Session,
    product: Product,
    product_data: ProductUpdate,
) -> Product:
    update_data = product_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)

    return product


def delete_product(db: Session, product: Product) -> Product:
    product.is_active = False

    db.commit()
    db.refresh(product)

    return product