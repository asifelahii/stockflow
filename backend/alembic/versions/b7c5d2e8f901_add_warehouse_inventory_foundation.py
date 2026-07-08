"""add warehouse inventory foundation

Revision ID: b7c5d2e8f901
Revises: ae6c81c9f452
Create Date: 2026-07-09 00:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op


revision: str = "b7c5d2e8f901"
down_revision: str | Sequence[str] | None = "ae6c81c9f452"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "warehouses",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("organization_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("code", sa.String(length=50), nullable=False),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("organization_id", "code", name="uq_warehouses_organization_code"),
        sa.UniqueConstraint("organization_id", "id", name="uq_warehouses_organization_id"),
    )
    op.create_index(op.f("ix_warehouses_organization_id"), "warehouses", ["organization_id"], unique=False)

    op.create_table(
        "warehouse_inventory",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("organization_id", sa.Integer(), nullable=False),
        sa.Column("warehouse_id", sa.Integer(), nullable=False),
        sa.Column("product_id", sa.Integer(), nullable=False),
        sa.Column("quantity_on_hand", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("low_stock_threshold", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(
            ["organization_id", "product_id"],
            ["products.organization_id", "products.id"],
            name="fk_warehouse_inventory_organization_product",
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["organization_id", "warehouse_id"],
            ["warehouses.organization_id", "warehouses.id"],
            name="fk_warehouse_inventory_organization_warehouse",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "organization_id",
            "warehouse_id",
            "product_id",
            name="uq_warehouse_inventory_organization_warehouse_product",
        ),
    )
    op.create_index(op.f("ix_warehouse_inventory_organization_id"), "warehouse_inventory", ["organization_id"], unique=False)
    op.create_index(op.f("ix_warehouse_inventory_product_id"), "warehouse_inventory", ["product_id"], unique=False)
    op.create_index(op.f("ix_warehouse_inventory_warehouse_id"), "warehouse_inventory", ["warehouse_id"], unique=False)

    op.add_column("stock_movements", sa.Column("warehouse_id", sa.Integer(), nullable=True))
    op.add_column("stock_movements", sa.Column("previous_warehouse_stock", sa.Integer(), nullable=True))
    op.add_column("stock_movements", sa.Column("new_warehouse_stock", sa.Integer(), nullable=True))
    op.create_index(op.f("ix_stock_movements_warehouse_id"), "stock_movements", ["warehouse_id"], unique=False)

    op.execute(
        """
        INSERT INTO warehouses (organization_id, name, code, address, is_active, created_at, updated_at)
        SELECT id, 'Main Warehouse', 'MAIN', NULL, true, now(), now()
        FROM organizations
        """
    )

    op.execute(
        """
        INSERT INTO warehouse_inventory (
            organization_id,
            warehouse_id,
            product_id,
            quantity_on_hand,
            low_stock_threshold,
            updated_at
        )
        SELECT
            products.organization_id,
            warehouses.id,
            products.id,
            products.current_stock,
            products.low_stock_threshold,
            now()
        FROM products
        JOIN warehouses
          ON warehouses.organization_id = products.organization_id
         AND warehouses.code = 'MAIN'
        """
    )

    op.execute(
        """
        UPDATE stock_movements
        SET
            warehouse_id = warehouses.id,
            previous_warehouse_stock = stock_movements.previous_stock,
            new_warehouse_stock = stock_movements.new_stock
        FROM warehouses
        WHERE warehouses.organization_id = stock_movements.organization_id
          AND warehouses.code = 'MAIN'
        """
    )

    op.alter_column("stock_movements", "warehouse_id", nullable=False)
    op.alter_column("stock_movements", "previous_warehouse_stock", nullable=False)
    op.alter_column("stock_movements", "new_warehouse_stock", nullable=False)

    op.create_foreign_key(
        "fk_stock_movements_organization_warehouse",
        "stock_movements",
        "warehouses",
        ["organization_id", "warehouse_id"],
        ["organization_id", "id"],
    )


def downgrade() -> None:
    op.drop_constraint(
        "fk_stock_movements_organization_warehouse",
        "stock_movements",
        type_="foreignkey",
    )
    op.drop_index(op.f("ix_stock_movements_warehouse_id"), table_name="stock_movements")
    op.drop_column("stock_movements", "new_warehouse_stock")
    op.drop_column("stock_movements", "previous_warehouse_stock")
    op.drop_column("stock_movements", "warehouse_id")

    op.drop_index(op.f("ix_warehouse_inventory_warehouse_id"), table_name="warehouse_inventory")
    op.drop_index(op.f("ix_warehouse_inventory_product_id"), table_name="warehouse_inventory")
    op.drop_index(op.f("ix_warehouse_inventory_organization_id"), table_name="warehouse_inventory")
    op.drop_table("warehouse_inventory")

    op.drop_index(op.f("ix_warehouses_organization_id"), table_name="warehouses")
    op.drop_table("warehouses")
