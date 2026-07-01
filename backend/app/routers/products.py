from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.organization import CurrentOrganization, get_current_organization
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.services import product_service


router = APIRouter(prefix="/api/v1/products", tags=["Products"])


def validate_product_relations(
    db: Session,
    organization_id: int,
    category_id: int | None = None,
    supplier_id: int | None = None,
) -> None:
    if category_id is not None and not product_service.product_category_exists(
        db,
        organization_id,
        category_id,
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product category not found",
        )

    if supplier_id is not None and not product_service.supplier_exists(
        db,
        organization_id,
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
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
):
    existing_product = product_service.get_product_by_sku(
        db,
        current_organization.id,
        product_data.sku,
    )

    if existing_product:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Product SKU already exists",
        )

    validate_product_relations(
        db=db,
        organization_id=current_organization.id,
        category_id=product_data.category_id,
        supplier_id=product_data.supplier_id,
    )

    try:
        return product_service.create_product(
            db,
            current_organization.id,
            product_data,
            created_by_id=current_organization.user.id,
        )
    except product_service.ProductSkuConflictError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Product SKU already exists",
        )


@router.get("", response_model=list[ProductResponse])
def get_products(
    db: Annotated[Session, Depends(get_db)],
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
    search: str | None = Query(default=None),
    is_low_stock: bool | None = Query(default=None),
):
    return product_service.get_products(
        db=db,
        organization_id=current_organization.id,
        search=search,
        is_low_stock=is_low_stock,
    )


@router.get("/low-stock", response_model=list[ProductResponse])
def get_low_stock_products(
    db: Annotated[Session, Depends(get_db)],
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
):
    return product_service.get_products(
        db=db,
        organization_id=current_organization.id,
        is_low_stock=True,
        include_inactive=False,
    )


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
):
    product = product_service.get_product_by_id(
        db,
        current_organization.id,
        product_id,
        include_inactive=True,
    )

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
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
):
    product = product_service.get_product_by_id(
        db,
        current_organization.id,
        product_id,
        include_inactive=True,
    )

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    if product_data.sku and product_data.sku != product.sku:
        existing_product = product_service.get_product_by_sku(
            db,
            current_organization.id,
            product_data.sku,
        )

        if existing_product:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Product SKU already exists",
            )

    validate_product_relations(
        db=db,
        organization_id=current_organization.id,
        category_id=product_data.category_id,
        supplier_id=product_data.supplier_id,
    )

    try:
        return product_service.update_product(
            db,
            current_organization.id,
            product_id,
            product_data,
        )
    except product_service.ProductVersionConflictError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This product changed in another session. Refresh and try again.",
        )
    except product_service.ProductSkuConflictError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Product SKU already exists",
        )


@router.delete("/{product_id}", response_model=ProductResponse)
def delete_product(
    product_id: int,
    version: Annotated[int, Query(ge=1)],
    db: Annotated[Session, Depends(get_db)],
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
):
    product = product_service.get_product_by_id(
        db,
        current_organization.id,
        product_id,
        include_inactive=True,
    )

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    try:
        return product_service.deactivate_product(
            db,
            current_organization.id,
            product_id,
            version,
        )
    except product_service.ProductVersionConflictError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This product changed in another session. Refresh and try again.",
        )
