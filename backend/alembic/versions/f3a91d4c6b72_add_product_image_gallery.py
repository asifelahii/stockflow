"""add product image gallery

Revision ID: f3a91d4c6b72
Revises: c84d1e7a2b9f
Create Date: 2026-07-08
"""

from alembic import op
import sqlalchemy as sa


revision = "f3a91d4c6b72"
down_revision = "c84d1e7a2b9f"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "products",
        sa.Column(
            "image_urls",
            sa.JSON(),
            nullable=False,
            server_default=sa.text("'[]'"),
        ),
    )


def downgrade() -> None:
    op.drop_column("products", "image_urls")
