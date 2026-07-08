from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.organization import CurrentOrganization, get_current_organization
from app.schemas.warehouse import (
    WarehouseCreate,
    WarehouseInventoryResponse,
    WarehouseResponse,
    WarehouseUpdate,
)
from app.services import warehouse_service


router = APIRouter(prefix="/api/v1/warehouses", tags=["Warehouses"])


@router.get("", response_model=list[WarehouseResponse])
def get_warehouses(
    db: Annotated[Session, Depends(get_db)],
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
    include_inactive: bool = Query(default=True),
):
    return warehouse_service.get_warehouses(
        db=db,
        organization_id=current_organization.id,
        include_inactive=include_inactive,
    )


@router.post("", response_model=WarehouseResponse, status_code=status.HTTP_201_CREATED)
def create_warehouse(
    warehouse_data: WarehouseCreate,
    db: Annotated[Session, Depends(get_db)],
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
):
    try:
        return warehouse_service.create_warehouse(
            db=db,
            organization_id=current_organization.id,
            name=warehouse_data.name,
            code=warehouse_data.code,
            address=warehouse_data.address,
            is_active=warehouse_data.is_active,
        )
    except warehouse_service.WarehouseCodeConflictError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A warehouse with this code already exists.",
        )


@router.get("/{warehouse_id}", response_model=WarehouseResponse)
def get_warehouse(
    warehouse_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
):
    warehouse = warehouse_service.get_warehouse_by_id(
        db=db,
        organization_id=current_organization.id,
        warehouse_id=warehouse_id,
        include_inactive=True,
    )

    if warehouse is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Warehouse not found.",
        )

    return warehouse


@router.put("/{warehouse_id}", response_model=WarehouseResponse)
def update_warehouse(
    warehouse_id: int,
    warehouse_data: WarehouseUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
):
    try:
        return warehouse_service.update_warehouse(
            db=db,
            organization_id=current_organization.id,
            warehouse_id=warehouse_id,
            update_data=warehouse_data.model_dump(exclude_unset=True),
        )
    except warehouse_service.WarehouseNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Warehouse not found.",
        )
    except warehouse_service.WarehouseCodeConflictError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A warehouse with this code already exists.",
        )


@router.delete("/{warehouse_id}", response_model=WarehouseResponse)
def deactivate_warehouse(
    warehouse_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
):
    try:
        return warehouse_service.deactivate_warehouse(
            db=db,
            organization_id=current_organization.id,
            warehouse_id=warehouse_id,
        )
    except warehouse_service.WarehouseNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Warehouse not found.",
        )


@router.get("/{warehouse_id}/inventory", response_model=list[WarehouseInventoryResponse])
def get_warehouse_inventory(
    warehouse_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
):
    warehouse = warehouse_service.get_warehouse_by_id(
        db=db,
        organization_id=current_organization.id,
        warehouse_id=warehouse_id,
        include_inactive=True,
    )

    if warehouse is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Warehouse not found.",
        )

    return warehouse_service.get_inventory_by_warehouse(
        db=db,
        organization_id=current_organization.id,
        warehouse_id=warehouse_id,
    )
