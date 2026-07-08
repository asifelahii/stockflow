from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, Query, Response, UploadFile, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.organization import CurrentOrganization, get_current_organization
from app.schemas.product import (
    ProductCreate,
    ProductMediaDeleteRequest,
    ProductMediaUploadResponse,
    ProductResponse,
    ProductUpdate,
)
from app.services import product_media_service, product_service


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


def validate_product_media_references(
    organization_id: int,
    primary_public_id: str | None,
    gallery_public_ids: list[str | None] | None,
) -> None:
    try:
        product_media_service.validate_product_media_ownership(
            organization_id,
            primary_public_id,
            gallery_public_ids,
        )
    except product_media_service.ProductMediaValidationError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=str(error),
        ) from error


def map_media_error(error: Exception) -> HTTPException:
    if isinstance(error, product_media_service.ProductMediaConfigurationError):
        return HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Product image upload is temporarily unavailable.",
        )

    if isinstance(error, product_media_service.ProductMediaValidationError):
        return HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=str(error),
        )

    return HTTPException(
        status_code=status.HTTP_502_BAD_GATEWAY,
        detail="Product image storage is unavailable. Please try again.",
    )


@router.post("/media/upload", response_model=ProductMediaUploadResponse, status_code=status.HTTP_201_CREATED)
def upload_product_image(
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
    file: UploadFile = File(...),
):
    try:
        uploaded_media = product_media_service.upload_product_media(
            current_organization.id,
            file,
        )
    except (
        product_media_service.ProductMediaConfigurationError,
        product_media_service.ProductMediaValidationError,
        product_media_service.ProductMediaUploadError,
    ) as error:
        raise map_media_error(error) from error

    return ProductMediaUploadResponse(
        url=uploaded_media.url,
        public_id=uploaded_media.public_id,
        width=uploaded_media.width,
        height=uploaded_media.height,
        bytes=uploaded_media.bytes,
        format=uploaded_media.format,
    )


@router.delete("/media", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_images(
    media_data: ProductMediaDeleteRequest,
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
):
    try:
        product_media_service.delete_product_media(
            current_organization.id,
            media_data.public_ids,
        )
    except (
        product_media_service.ProductMediaConfigurationError,
        product_media_service.ProductMediaValidationError,
        product_media_service.ProductMediaUploadError,
    ) as error:
        raise map_media_error(error) from error

    return Response(status_code=status.HTTP_204_NO_CONTENT)


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
    validate_product_media_references(
        current_organization.id,
        product_data.image_public_id,
        product_data.image_public_ids,
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
    is_featured: bool | None = Query(default=None),
    has_active_offer: bool | None = Query(default=None),
):
    return product_service.get_products(
        db=db,
        organization_id=current_organization.id,
        search=search,
        is_low_stock=is_low_stock,
        is_featured=is_featured,
        has_active_offer=has_active_offer,
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

    primary_public_id = (
        product_data.image_public_id
        if "image_public_id" in product_data.model_fields_set
        else product.image_public_id
    )
    gallery_public_ids = (
        product_data.image_public_ids
        if "image_public_ids" in product_data.model_fields_set
        else product.image_public_ids
    )
    validate_product_media_references(
        current_organization.id,
        primary_public_id,
        gallery_public_ids,
    )

    existing_media_public_ids = product_service.get_product_media_public_ids(product)

    try:
        updated_product = product_service.update_product(
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
    except product_service.ProductCatalogValidationError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=error.detail,
        )

    removed_media_public_ids = existing_media_public_ids - product_service.get_product_media_public_ids(updated_product)

    if removed_media_public_ids:
        try:
            product_media_service.delete_product_media(
                current_organization.id,
                removed_media_public_ids,
            )
        except (
            product_media_service.ProductMediaConfigurationError,
            product_media_service.ProductMediaValidationError,
            product_media_service.ProductMediaUploadError,
        ):
            # The product update remains valid; this only leaves an orphaned storage asset
            # that can be removed later without losing the product record.
            pass

    return updated_product


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
