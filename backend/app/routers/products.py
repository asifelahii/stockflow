# from typing import Annotated

# from fastapi import APIRouter, Depends, HTTPException, Query, status
# from sqlalchemy.orm import Session

# from app.db.database import get_db
# from app.dependencies.auth import get_current_user
# from app.models.user import User
# from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
# from app.services import product_service


# router = APIRouter(prefix="/api/v1/products", tags=["Products"])


# @router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
# def create_product(
#     product_data: ProductCreate,
#     db: Annotated[Session, Depends(get_db)],
#     current_user: Annotated[User, Depends(get_current_user)],
# ):
#     existing_product = product_service.get_product_by_sku(db, product_data.sku)

#     if existing_product:
#         raise HTTPException(
#             status_code=status.HTTP_409_CONFLICT,
#             detail="Product SKU already exists",
#         )

#     return product_service.create_product(db, product_data)


# @router.get("", response_model=list[ProductResponse])
# def get_products(
#     db: Annotated[Session, Depends(get_db)],
#     current_user: Annotated[User, Depends(get_current_user)],
#     search: str | None = Query(default=None),
#     is_low_stock: bool | None = Query(default=None),
# ):
#     return product_service.get_products(
#         db=db,
#         search=search,
#         is_low_stock=is_low_stock,
#     )


# @router.get("/low-stock", response_model=list[ProductResponse])
# def get_low_stock_products(
#     db: Annotated[Session, Depends(get_db)],
#     current_user: Annotated[User, Depends(get_current_user)],
# ):
#     return product_service.get_products(
#         db=db,
#         is_low_stock=True,
#     )


# @router.get("/{product_id}", response_model=ProductResponse)
# def get_product(
#     product_id: int,
#     db: Annotated[Session, Depends(get_db)],
#     current_user: Annotated[User, Depends(get_current_user)],
# ):
#     product = product_service.get_product_by_id(db, product_id)

#     if product is None:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Product not found",
#         )

#     return product


# @router.put("/{product_id}", response_model=ProductResponse)
# def update_product(
#     product_id: int,
#     product_data: ProductUpdate,
#     db: Annotated[Session, Depends(get_db)],
#     current_user: Annotated[User, Depends(get_current_user)],
# ):
#     product = product_service.get_product_by_id(db, product_id)

#     if product is None:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Product not found",
#         )

#     if product_data.sku and product_data.sku != product.sku:
#         existing_product = product_service.get_product_by_sku(db, product_data.sku)

#         if existing_product:
#             raise HTTPException(
#                 status_code=status.HTTP_409_CONFLICT,
#                 detail="Product SKU already exists",
#             )

#     return product_service.update_product(db, product, product_data)


# @router.delete("/{product_id}", response_model=ProductResponse)
# def delete_product(
#     product_id: int,
#     db: Annotated[Session, Depends(get_db)],
#     current_user: Annotated[User, Depends(get_current_user)],
# ):
#     product = product_service.get_product_by_id(db, product_id)

#     if product is None:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Product not found",
#         )

#     return product_service.delete_product(db, product)

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.services import product_service


router = APIRouter(prefix="/api/v1/products", tags=["Products"])


def validate_product_relations(
    db: Session,
    category_id: int | None = None,
    supplier_id: int | None = None,
) -> None:
    if category_id is not None and not product_service.product_category_exists(
        db,
        category_id,
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product category not found",
        )

    if supplier_id is not None and not product_service.supplier_exists(
        db,
        supplier_id,
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supplier not found",
        )


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: ProductCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    existing_product = product_service.get_product_by_sku(db, product_data.sku)

    if existing_product:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Product SKU already exists",
        )

    validate_product_relations(
        db=db,
        category_id=product_data.category_id,
        supplier_id=product_data.supplier_id,
    )

    return product_service.create_product(db, product_data)


@router.get("", response_model=list[ProductResponse])
def get_products(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
    search: str | None = Query(default=None),
    is_low_stock: bool | None = Query(default=None),
):
    return product_service.get_products(
        db=db,
        search=search,
        is_low_stock=is_low_stock,
    )


@router.get("/low-stock", response_model=list[ProductResponse])
def get_low_stock_products(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    return product_service.get_products(
        db=db,
        is_low_stock=True,
    )


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    product = product_service.get_product_by_id(db, product_id)

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    product = product_service.get_product_by_id(db, product_id)

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    if product_data.sku and product_data.sku != product.sku:
        existing_product = product_service.get_product_by_sku(db, product_data.sku)

        if existing_product:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Product SKU already exists",
            )

    validate_product_relations(
        db=db,
        category_id=product_data.category_id,
        supplier_id=product_data.supplier_id,
    )

    return product_service.update_product(db, product, product_data)


@router.delete("/{product_id}", response_model=ProductResponse)
def delete_product(
    product_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    product = product_service.get_product_by_id(db, product_id)

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return product_service.delete_product(db, product)