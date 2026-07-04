"""create public demo tenants

Revision ID: d9b7c3e2f1a4
Revises: 8a9fe4666c5b
Create Date: 2026-07-05
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "d9b7c3e2f1a4"
down_revision: Union[str, Sequence[str], None] = "8a9fe4666c5b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "public_demo_tenants",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("tenant_key", sa.String(length=64), nullable=False),
        sa.Column("organization_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("display_name", sa.String(length=150), nullable=False),
        sa.Column("industry", sa.String(length=100), nullable=False),
        sa.Column(
            "reset_interval_hours",
            sa.Integer(),
            nullable=False,
            server_default=sa.text("24"),
        ),
        sa.Column("last_reset_at", sa.DateTime(), nullable=True),
        sa.Column(
            "is_active",
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.ForeignKeyConstraint(
            ["organization_id"],
            ["organizations.id"],
            name="fk_public_demo_tenants_organization",
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name="fk_public_demo_tenants_user",
            ondelete="RESTRICT",
        ),
        sa.UniqueConstraint(
            "tenant_key",
            name="uq_public_demo_tenants_tenant_key",
        ),
        sa.UniqueConstraint(
            "organization_id",
            name="uq_public_demo_tenants_organization_id",
        ),
        sa.UniqueConstraint(
            "user_id",
            name="uq_public_demo_tenants_user_id",
        ),
    )

    op.create_index(
        "ix_public_demo_tenants_active",
        "public_demo_tenants",
        ["is_active"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_public_demo_tenants_active",
        table_name="public_demo_tenants",
    )

    op.drop_table("public_demo_tenants")
