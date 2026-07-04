from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class PublicDemoTenant(Base):
    __tablename__ = "public_demo_tenants"

    __table_args__ = (
        UniqueConstraint(
            "tenant_key",
            name="uq_public_demo_tenants_tenant_key",
        ),
        UniqueConstraint(
            "organization_id",
            name="uq_public_demo_tenants_organization_id",
        ),
        UniqueConstraint(
            "user_id",
            name="uq_public_demo_tenants_user_id",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    tenant_key: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
        index=True,
    )

    organization_id: Mapped[int] = mapped_column(
        ForeignKey("organizations.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    display_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    industry: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    reset_interval_hours: Mapped[int] = mapped_column(
        Integer,
        default=24,
        nullable=False,
    )

    last_reset_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
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
