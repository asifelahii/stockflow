from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    __table_args__ = (
        Index(
            "ix_suppliers_organization_name",
            "organization_id",
            "name",
        ),
        UniqueConstraint(
            "organization_id",
            "id",
            name="uq_suppliers_organization_id",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    organization_id: Mapped[int] = mapped_column(
        ForeignKey("organizations.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    contact_person: Mapped[str | None] = mapped_column(String(100), nullable=True)

    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)

    email: Mapped[str | None] = mapped_column(String(255), nullable=True)

    address: Mapped[str | None] = mapped_column(Text, nullable=True)

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
