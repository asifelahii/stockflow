from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.supplier import Supplier
from app.schemas.supplier import SupplierCreate, SupplierUpdate


def get_supplier_by_id(
    db: Session,
    organization_id: int,
    supplier_id: int,
    include_inactive: bool = False,
) -> Supplier | None:
    query = db.query(Supplier).filter(
        Supplier.organization_id == organization_id,
        Supplier.id == supplier_id,
    )

    if not include_inactive:
        query = query.filter(Supplier.is_active.is_(True))

    return query.first()


def get_suppliers(
    db: Session,
    organization_id: int,
    search: str | None = None,
) -> list[Supplier]:
    query = db.query(Supplier).filter(
        Supplier.organization_id == organization_id,
    )

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Supplier.name.ilike(search_term),
                Supplier.contact_person.ilike(search_term),
                Supplier.phone.ilike(search_term),
                Supplier.email.ilike(search_term),
            )
        )

    return query.order_by(Supplier.id.desc()).all()


def create_supplier(
    db: Session,
    organization_id: int,
    supplier_data: SupplierCreate,
) -> Supplier:
    supplier = Supplier(
        organization_id=organization_id,
        **supplier_data.model_dump(),
    )

    db.add(supplier)
    db.commit()
    db.refresh(supplier)

    return supplier


def update_supplier(
    db: Session,
    supplier: Supplier,
    supplier_data: SupplierUpdate,
) -> Supplier:
    update_data = supplier_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(supplier, field, value)

    db.commit()
    db.refresh(supplier)

    return supplier


def delete_supplier(
    db: Session,
    supplier: Supplier,
) -> Supplier:
    supplier.is_active = False

    db.commit()
    db.refresh(supplier)

    return supplier
