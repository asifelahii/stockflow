"""add social oauth tables

Revision ID: e4f2b9c6d8a1
Revises: d9b7c3e2f1a4
Create Date: 2026-07-06
"""

from alembic import op
import sqlalchemy as sa


revision = "e4f2b9c6d8a1"
down_revision = "d9b7c3e2f1a4"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "oauth_identities",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("provider", sa.String(length=20), nullable=False),
        sa.Column("provider_subject", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("display_name", sa.String(length=100), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("last_login_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name="fk_oauth_identities_user_id_users",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "provider",
            "provider_subject",
            name="uq_oauth_identities_provider_subject",
        ),
    )
    op.create_index(
        "ix_oauth_identities_user_id",
        "oauth_identities",
        ["user_id"],
        unique=False,
    )
    op.create_index(
        "ix_oauth_identities_user_provider",
        "oauth_identities",
        ["user_id", "provider"],
        unique=False,
    )

    op.create_table(
        "oauth_authorization_requests",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("provider", sa.String(length=20), nullable=False),
        sa.Column("state_hash", sa.String(length=64), nullable=False),
        sa.Column("nonce_hash", sa.String(length=64), nullable=False),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column("consumed_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "state_hash",
            name="uq_oauth_authorization_requests_state_hash",
        ),
    )
    op.create_index(
        "ix_oauth_authorization_requests_provider",
        "oauth_authorization_requests",
        ["provider"],
        unique=False,
    )
    op.create_index(
        "ix_oauth_authorization_requests_expires_at",
        "oauth_authorization_requests",
        ["expires_at"],
        unique=False,
    )

    op.create_table(
        "oauth_login_tickets",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("ticket_hash", sa.String(length=64), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("organization_id", sa.Integer(), nullable=False),
        sa.Column("organization_role", sa.String(length=50), nullable=False),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column("consumed_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["organization_id"],
            ["organizations.id"],
            name="fk_oauth_login_tickets_organization_id_organizations",
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name="fk_oauth_login_tickets_user_id_users",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "ticket_hash",
            name="uq_oauth_login_tickets_ticket_hash",
        ),
    )
    op.create_index(
        "ix_oauth_login_tickets_user_id",
        "oauth_login_tickets",
        ["user_id"],
        unique=False,
    )
    op.create_index(
        "ix_oauth_login_tickets_organization_id",
        "oauth_login_tickets",
        ["organization_id"],
        unique=False,
    )
    op.create_index(
        "ix_oauth_login_tickets_expires_at",
        "oauth_login_tickets",
        ["expires_at"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_oauth_login_tickets_expires_at", table_name="oauth_login_tickets")
    op.drop_index("ix_oauth_login_tickets_organization_id", table_name="oauth_login_tickets")
    op.drop_index("ix_oauth_login_tickets_user_id", table_name="oauth_login_tickets")
    op.drop_table("oauth_login_tickets")

    op.drop_index(
        "ix_oauth_authorization_requests_expires_at",
        table_name="oauth_authorization_requests",
    )
    op.drop_index(
        "ix_oauth_authorization_requests_provider",
        table_name="oauth_authorization_requests",
    )
    op.drop_table("oauth_authorization_requests")

    op.drop_index(
        "ix_oauth_identities_user_provider",
        table_name="oauth_identities",
    )
    op.drop_index(
        "ix_oauth_identities_user_id",
        table_name="oauth_identities",
    )
    op.drop_table("oauth_identities")
