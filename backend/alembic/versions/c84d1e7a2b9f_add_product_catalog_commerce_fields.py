"""add product catalog commerce fields

Revision ID: c84d1e7a2b9f
Revises: e4f2b9c6d8a1
Create Date: 2026-07-07
"""

from alembic import op
import sqlalchemy as sa


revision = "c84d1e7a2b9f"
down_revision = "e4f2b9c6d8a1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "products",
        sa.Column("short_description", sa.String(length=300), nullable=True),
    )
    op.add_column(
        "products",
        sa.Column("image_url", sa.String(length=2048), nullable=True),
    )
    op.add_column(
        "products",
        sa.Column("release_year", sa.Integer(), nullable=True),
    )
    op.add_column(
        "products",
        sa.Column(
            "is_featured",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )
    op.add_column(
        "products",
        sa.Column(
            "discount_type",
            sa.String(length=20),
            nullable=False,
            server_default=sa.text("'none'"),
        ),
    )
    op.add_column(
        "products",
        sa.Column(
            "discount_value",
            sa.Numeric(precision=12, scale=2),
            nullable=False,
            server_default=sa.text("0"),
        ),
    )
    op.add_column(
        "products",
        sa.Column("offer_starts_on", sa.Date(), nullable=True),
    )
    op.add_column(
        "products",
        sa.Column("offer_ends_on", sa.Date(), nullable=True),
    )
    op.add_column(
        "products",
        sa.Column(
            "tax_rate",
            sa.Numeric(precision=5, scale=2),
            nullable=False,
            server_default=sa.text("0"),
        ),
    )
    op.add_column(
        "products",
        sa.Column(
            "shipping_fee",
            sa.Numeric(precision=12, scale=2),
            nullable=False,
            server_default=sa.text("0"),
        ),
    )
    op.add_column(
        "products",
        sa.Column(
            "additional_cost",
            sa.Numeric(precision=12, scale=2),
            nullable=False,
            server_default=sa.text("0"),
        ),
    )
    op.add_column(
        "products",
        sa.Column(
            "attributes",
            sa.JSON(),
            nullable=False,
            server_default=sa.text("'[]'"),
        ),
    )
    op.add_column(
        "products",
        sa.Column(
            "specifications",
            sa.JSON(),
            nullable=False,
            server_default=sa.text("'[]'"),
        ),
    )

    op.create_index(
        "ix_products_organization_featured",
        "products",
        ["organization_id", "is_featured"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_products_organization_featured", table_name="products")

    op.drop_column("products", "specifications")
    op.drop_column("products", "attributes")
    op.drop_column("products", "additional_cost")
    op.drop_column("products", "shipping_fee")
    op.drop_column("products", "tax_rate")
    op.drop_column("products", "offer_ends_on")
    op.drop_column("products", "offer_starts_on")
    op.drop_column("products", "discount_value")
    op.drop_column("products", "discount_type")
    op.drop_column("products", "is_featured")
    op.drop_column("products", "release_year")
    op.drop_column("products", "image_url")
    op.drop_column("products", "short_description")
