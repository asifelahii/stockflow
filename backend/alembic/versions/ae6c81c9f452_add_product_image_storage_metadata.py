"""add product image storage metadata

Revision ID: ae6c81c9f452
Revises: f3a91d4c6b72
Create Date: 2026-07-08
"""

from alembic import op
import sqlalchemy as sa


revision = "ae6c81c9f452"
down_revision = "f3a91d4c6b72"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "products",
        sa.Column("image_public_id", sa.String(length=512), nullable=True),
    )
    op.add_column(
        "products",
        sa.Column(
            "image_public_ids",
            sa.JSON(),
            nullable=False,
            server_default=sa.text("'[]'"),
        ),
    )

    # Legacy gallery URLs have no Cloudinary storage ID. Keep the two arrays aligned
    # by adding null placeholders, so existing product records remain editable.
    op.execute(
        """
        UPDATE products
        SET image_public_ids = (
            SELECT COALESCE(jsonb_agg(NULL::text), '[]'::jsonb)
            FROM jsonb_array_elements(COALESCE(image_urls::jsonb, '[]'::jsonb))
        )
        WHERE COALESCE(jsonb_array_length(image_public_ids::jsonb), 0)
              <> COALESCE(jsonb_array_length(image_urls::jsonb), 0)
        """
    )


def downgrade() -> None:
    op.drop_column("products", "image_public_ids")
    op.drop_column("products", "image_public_id")
