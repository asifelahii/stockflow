"""scope business records by organization

Revision ID: 8a9fe4666c5b
Revises: 15c13102bb98
Create Date: 2026-07-01 08:02:08.597748
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "8a9fe4666c5b"
down_revision: Union[str, Sequence[str], None] = "15c13102bb98"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


TENANT_TABLES = (
    "product_categories",
    "expense_categories",
    "suppliers",
    "products",
    "stock_movements",
    "financial_transactions",
)


def upgrade() -> None:
    # Add nullable tenant ownership first so existing rows can be safely backfilled.
    for table_name in TENANT_TABLES:
        op.add_column(
            table_name,
            sa.Column("organization_id", sa.Integer(), nullable=True),
        )

    op.add_column(
        "products",
        sa.Column(
            "version",
            sa.Integer(),
            nullable=False,
            server_default=sa.text("1"),
        ),
    )

    # Preserve old shared records during migration. They will be intentionally
    # removed later by the separate demo reset-and-seed command.
    op.execute(
        """
        INSERT INTO organizations (
            name,
            is_active,
            created_at,
            updated_at
        )
        VALUES (
            'Legacy Workspace',
            TRUE,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )
        """
    )

    for table_name in TENANT_TABLES:
        op.execute(
            f"""
            UPDATE {table_name}
            SET organization_id = (
                SELECT id
                FROM organizations
                WHERE name = 'Legacy Workspace'
                ORDER BY id
                LIMIT 1
            )
            WHERE organization_id IS NULL
            """
        )

    op.execute(
        """
        INSERT INTO organization_members (
            organization_id,
            user_id,
            role,
            is_active,
            created_at,
            updated_at
        )
        SELECT
            (
                SELECT id
                FROM organizations
                WHERE name = 'Legacy Workspace'
                ORDER BY id
                LIMIT 1
            ),
            users.id,
            'owner',
            TRUE,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        FROM users
        """
    )

    for table_name in TENANT_TABLES:
        op.alter_column(
            table_name,
            "organization_id",
            existing_type=sa.Integer(),
            nullable=False,
        )

    # Direct organization ownership.
    op.create_foreign_key(
        "fk_product_categories_organization",
        "product_categories",
        "organizations",
        ["organization_id"],
        ["id"],
        ondelete="RESTRICT",
    )
    op.create_foreign_key(
        "fk_expense_categories_organization",
        "expense_categories",
        "organizations",
        ["organization_id"],
        ["id"],
        ondelete="RESTRICT",
    )
    op.create_foreign_key(
        "fk_suppliers_organization",
        "suppliers",
        "organizations",
        ["organization_id"],
        ["id"],
        ondelete="RESTRICT",
    )
    op.create_foreign_key(
        "fk_products_organization",
        "products",
        "organizations",
        ["organization_id"],
        ["id"],
        ondelete="RESTRICT",
    )
    op.create_foreign_key(
        "fk_stock_movements_organization",
        "stock_movements",
        "organizations",
        ["organization_id"],
        ["id"],
        ondelete="RESTRICT",
    )
    op.create_foreign_key(
        "fk_financial_transactions_organization",
        "financial_transactions",
        "organizations",
        ["organization_id"],
        ["id"],
        ondelete="RESTRICT",
    )

    # Tenant-scoped uniqueness.
    op.drop_index("ix_product_categories_name", table_name="product_categories")
    op.drop_index("ix_expense_categories_name", table_name="expense_categories")
    op.drop_index("ix_products_sku", table_name="products")

    op.create_unique_constraint(
        "uq_product_categories_organization_name",
        "product_categories",
        ["organization_id", "name"],
    )
    op.create_unique_constraint(
        "uq_expense_categories_organization_name",
        "expense_categories",
        ["organization_id", "name"],
    )
    op.create_unique_constraint(
        "uq_products_organization_sku",
        "products",
        ["organization_id", "sku"],
    )

    # Composite keys allow PostgreSQL itself to prevent cross-organization links.
    op.create_unique_constraint(
        "uq_product_categories_organization_id",
        "product_categories",
        ["organization_id", "id"],
    )
    op.create_unique_constraint(
        "uq_expense_categories_organization_id",
        "expense_categories",
        ["organization_id", "id"],
    )
    op.create_unique_constraint(
        "uq_suppliers_organization_id",
        "suppliers",
        ["organization_id", "id"],
    )
    op.create_unique_constraint(
        "uq_products_organization_id",
        "products",
        ["organization_id", "id"],
    )

    # Tenant filtering and report-query indexes.
    op.create_index(
        "ix_product_categories_organization_id",
        "product_categories",
        ["organization_id"],
        unique=False,
    )
    op.create_index(
        "ix_expense_categories_organization_id",
        "expense_categories",
        ["organization_id"],
        unique=False,
    )
    op.create_index(
        "ix_suppliers_organization_id",
        "suppliers",
        ["organization_id"],
        unique=False,
    )
    op.create_index(
        "ix_suppliers_organization_name",
        "suppliers",
        ["organization_id", "name"],
        unique=False,
    )
    op.create_index(
        "ix_products_organization_id",
        "products",
        ["organization_id"],
        unique=False,
    )
    op.create_index(
        "ix_stock_movements_organization_id",
        "stock_movements",
        ["organization_id"],
        unique=False,
    )
    op.create_index(
        "ix_stock_movements_organization_created_at",
        "stock_movements",
        ["organization_id", "created_at"],
        unique=False,
    )
    op.create_index(
        "ix_financial_transactions_organization_id",
        "financial_transactions",
        ["organization_id"],
        unique=False,
    )
    op.create_index(
        "ix_financial_transactions_organization_date",
        "financial_transactions",
        ["organization_id", "transaction_date"],
        unique=False,
    )

    # Replace global child relations with organization-safe composite relations.
    op.execute(
        "ALTER TABLE products "
        "DROP CONSTRAINT IF EXISTS products_category_id_fkey"
    )
    op.execute(
        "ALTER TABLE products "
        "DROP CONSTRAINT IF EXISTS products_supplier_id_fkey"
    )
    op.execute(
        "ALTER TABLE stock_movements "
        "DROP CONSTRAINT IF EXISTS stock_movements_product_id_fkey"
    )
    op.execute(
        "ALTER TABLE financial_transactions "
        "DROP CONSTRAINT IF EXISTS financial_transactions_expense_category_id_fkey"
    )

    op.create_foreign_key(
        "fk_products_organization_category",
        "products",
        "product_categories",
        ["organization_id", "category_id"],
        ["organization_id", "id"],
        ondelete="RESTRICT",
    )
    op.create_foreign_key(
        "fk_products_organization_supplier",
        "products",
        "suppliers",
        ["organization_id", "supplier_id"],
        ["organization_id", "id"],
        ondelete="RESTRICT",
    )
    op.create_foreign_key(
        "fk_stock_movements_organization_product",
        "stock_movements",
        "products",
        ["organization_id", "product_id"],
        ["organization_id", "id"],
        ondelete="RESTRICT",
    )
    op.create_foreign_key(
        constraint_name="fk_financial_transactions_organization_expense_category",
        source_table="financial_transactions",
        referent_table="expense_categories",
        local_cols=["organization_id", "expense_category_id"],
        remote_cols=["organization_id", "id"],
        ondelete="RESTRICT",
    )


def downgrade() -> None:
    op.drop_constraint(
        "fk_financial_transactions_organization_expense_category",
        "financial_transactions",
        type_="foreignkey",
    )
    op.drop_constraint(
        "fk_stock_movements_organization_product",
        "stock_movements",
        type_="foreignkey",
    )
    op.drop_constraint(
        "fk_products_organization_supplier",
        "products",
        type_="foreignkey",
    )
    op.drop_constraint(
        "fk_products_organization_category",
        "products",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "financial_transactions_expense_category_id_fkey",
        "financial_transactions",
        "expense_categories",
        ["expense_category_id"],
        ["id"],
    )
    op.create_foreign_key(
        "stock_movements_product_id_fkey",
        "stock_movements",
        "products",
        ["product_id"],
        ["id"],
    )
    op.create_foreign_key(
        "products_supplier_id_fkey",
        "products",
        "suppliers",
        ["supplier_id"],
        ["id"],
    )
    op.create_foreign_key(
        "products_category_id_fkey",
        "products",
        "product_categories",
        ["category_id"],
        ["id"],
    )

    for index_name, table_name in (
        ("ix_financial_transactions_organization_date", "financial_transactions"),
        ("ix_financial_transactions_organization_id", "financial_transactions"),
        ("ix_stock_movements_organization_created_at", "stock_movements"),
        ("ix_stock_movements_organization_id", "stock_movements"),
        ("ix_products_organization_id", "products"),
        ("ix_suppliers_organization_name", "suppliers"),
        ("ix_suppliers_organization_id", "suppliers"),
        ("ix_expense_categories_organization_id", "expense_categories"),
        ("ix_product_categories_organization_id", "product_categories"),
    ):
        op.drop_index(index_name, table_name=table_name)

    for constraint_name, table_name in (
        ("uq_products_organization_id", "products"),
        ("uq_suppliers_organization_id", "suppliers"),
        ("uq_expense_categories_organization_id", "expense_categories"),
        ("uq_product_categories_organization_id", "product_categories"),
        ("uq_products_organization_sku", "products"),
        ("uq_expense_categories_organization_name", "expense_categories"),
        ("uq_product_categories_organization_name", "product_categories"),
    ):
        op.drop_constraint(
            constraint_name,
            table_name,
            type_="unique",
        )

    op.create_index(
        "ix_products_sku",
        "products",
        ["sku"],
        unique=True,
    )
    op.create_index(
        "ix_expense_categories_name",
        "expense_categories",
        ["name"],
        unique=True,
    )
    op.create_index(
        "ix_product_categories_name",
        "product_categories",
        ["name"],
        unique=True,
    )

    for constraint_name, table_name in (
        ("fk_financial_transactions_organization", "financial_transactions"),
        ("fk_stock_movements_organization", "stock_movements"),
        ("fk_products_organization", "products"),
        ("fk_suppliers_organization", "suppliers"),
        ("fk_expense_categories_organization", "expense_categories"),
        ("fk_product_categories_organization", "product_categories"),
    ):
        op.drop_constraint(
            constraint_name,
            table_name,
            type_="foreignkey",
        )

    for table_name in TENANT_TABLES:
        op.drop_column(table_name, "organization_id")

    op.drop_column("products", "version")
