"""create organizations and memberships

Revision ID: 15c13102bb98
Revises: 6dc84a7a7f32
Create Date: 2026-07-01 07:50:38.595068
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "15c13102bb98"
down_revision: Union[str, Sequence[str], None] = "6dc84a7a7f32"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "organizations",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_organizations_name",
        "organizations",
        ["name"],
        unique=False,
    )

    op.create_table(
        "organization_members",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("organization_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("role", sa.String(length=20), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.CheckConstraint(
            "role IN ('owner', 'admin', 'staff')",
            name="ck_organization_members_role",
        ),
        sa.ForeignKeyConstraint(
            ["organization_id"],
            ["organizations.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "organization_id",
            "user_id",
            name="uq_organization_members_organization_user",
        ),
    )
    op.create_index(
        "ix_organization_members_organization_id",
        "organization_members",
        ["organization_id"],
        unique=False,
    )
    op.create_index(
        "ix_organization_members_user_id",
        "organization_members",
        ["user_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_organization_members_user_id",
        table_name="organization_members",
    )
    op.drop_index(
        "ix_organization_members_organization_id",
        table_name="organization_members",
    )
    op.drop_table("organization_members")

    op.drop_index(
        "ix_organizations_name",
        table_name="organizations",
    )
    op.drop_table("organizations")
