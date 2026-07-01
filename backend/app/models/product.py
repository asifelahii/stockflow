from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    ForeignKeyConstraint,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Product(Base):
    __tablename__ = "products"

    __table_args__ = (
        UniqueConstraint(
            "organization_id",
            "sku",
            name="uq_products_organization_sku",
        ),
        UniqueConstraint(
            "organization_id",
            "id",
            name="uq_products_organization_id",
        ),
        ForeignKeyConstraint(
            ["organization_id", "category_id"],
            ["product_categories.organization_id", "product_categories.id"],
            name="fk_products_organization_category",
        ),
        ForeignKeyConstraint(
            ["organization_id", "supplier_id"],
            ["suppliers.organization_id", "suppliers.id"],
            name="fk_products_organization_supplier",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    organization_id: Mapped[int] = mapped_column(
        ForeignKey("organizations.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(String(150), nullable=False)

    sku: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    category_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    supplier_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    purchase_price: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False,
    )

    selling_price: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False,
    )

    current_stock: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    low_stock_threshold: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    version: Mapped[int] = mapped_column(
        Integer,
        default=1,
        server_default="1",
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )
