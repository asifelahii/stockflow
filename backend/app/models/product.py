from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    ForeignKeyConstraint,
    Integer,
    JSON,
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

    short_description: Mapped[str | None] = mapped_column(
        String(300),
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    image_url: Mapped[str | None] = mapped_column(
        String(2048),
        nullable=True,
    )

    # Public delivery URLs are exposed to the Angular app. Storage IDs stay server-managed
    # so replaced or cancelled uploads can be removed from Cloudinary safely.
    image_public_id: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )

    # Primary image lives in image_url. image_urls stores up to five optional gallery images.
    image_urls: Mapped[list[str]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )

    # Each gallery URL has a same-index Cloudinary public ID when it was uploaded by StockFlow.
    # Legacy external image URLs are represented by a null entry.
    image_public_ids: Mapped[list[str | None]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )

    category_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    supplier_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    release_year: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
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

    discount_type: Mapped[str] = mapped_column(
        String(20),
        default="none",
        nullable=False,
    )

    discount_value: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False,
    )

    offer_starts_on: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    offer_ends_on: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    tax_rate: Mapped[Decimal] = mapped_column(
        Numeric(5, 2),
        default=0,
        nullable=False,
    )

    shipping_fee: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False,
    )

    additional_cost: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False,
    )

    attributes: Mapped[list[dict[str, str]]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )

    specifications: Mapped[list[dict[str, str]]] = mapped_column(
        JSON,
        default=list,
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
