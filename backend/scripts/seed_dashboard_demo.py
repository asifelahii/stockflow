from __future__ import annotations

import argparse
import sys
from calendar import monthrange
from datetime import date, datetime, time
from decimal import Decimal
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]

if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.db.database import get_db
from app.models.category import ExpenseCategory, ProductCategory
from app.models.financial_transaction import FinancialTransaction
from app.models.organization import Organization, OrganizationMember
from app.models.product import Product
from app.models.stock_movement import StockMovement
from app.models.user import User
from app.models.supplier import Supplier


DEMO_TAG = "stockflow_dashboard_demo_v1"

PRODUCTS = (
    {
        "name": "Wireless Mouse",
        "sku": "DEMO-MOUSE-001",
        "category": "Demo - Accessories",
        "supplier": "Demo - TechSource",
        "purchase_price": "620.00",
        "selling_price": "990.00",
        "low_stock_threshold": 15,
        "base_in": 24,
        "base_out": 18,
        "in_step": 1,
        "out_step": 1,
        "offset": 0,
        "mid_adjustment": 1,
        "target_stock": 82,
    },
    {
        "name": "USB-C Hub 7-in-1",
        "sku": "DEMO-HUB-001",
        "category": "Demo - Accessories",
        "supplier": "Demo - TechSource",
        "purchase_price": "1250.00",
        "selling_price": "1850.00",
        "low_stock_threshold": 10,
        "base_in": 10,
        "base_out": 9,
        "in_step": 1,
        "out_step": 1,
        "offset": 1,
        "mid_adjustment": -1,
        "target_stock": 6,
    },
    {
        "name": "Mechanical Keyboard",
        "sku": "DEMO-KEY-001",
        "category": "Demo - Electronics",
        "supplier": "Demo - TechSource",
        "purchase_price": "2400.00",
        "selling_price": "3550.00",
        "low_stock_threshold": 8,
        "base_in": 16,
        "base_out": 12,
        "in_step": 1,
        "out_step": 1,
        "offset": 2,
        "mid_adjustment": 0,
        "target_stock": 32,
    },
    {
        "name": "A4 Office Notebook Pack",
        "sku": "DEMO-NOTE-001",
        "category": "Demo - Office Supplies",
        "supplier": "Demo - OfficeMart",
        "purchase_price": "180.00",
        "selling_price": "290.00",
        "low_stock_threshold": 25,
        "base_in": 48,
        "base_out": 38,
        "in_step": 2,
        "out_step": 1,
        "offset": 0,
        "mid_adjustment": 2,
        "target_stock": 150,
    },
    {
        "name": "Laser Printer Toner",
        "sku": "DEMO-TONER-001",
        "category": "Demo - Office Supplies",
        "supplier": "Demo - OfficeMart",
        "purchase_price": "2850.00",
        "selling_price": "3900.00",
        "low_stock_threshold": 6,
        "base_in": 5,
        "base_out": 4,
        "in_step": 1,
        "out_step": 0,
        "offset": 1,
        "mid_adjustment": -1,
        "target_stock": 4,
    },
    {
        "name": "HDMI Cable 2m",
        "sku": "DEMO-HDMI-001",
        "category": "Demo - Accessories",
        "supplier": "Demo - TechSource",
        "purchase_price": "260.00",
        "selling_price": "450.00",
        "low_stock_threshold": 5,
        "base_in": 16,
        "base_out": 16,
        "in_step": 1,
        "out_step": 1,
        "offset": 2,
        "mid_adjustment": 0,
        "target_stock": 0,
        "match_out_to_in": True,
    },
    {
        "name": "Wireless Headset",
        "sku": "DEMO-HEADSET-001",
        "category": "Demo - Electronics",
        "supplier": "Demo - TechSource",
        "purchase_price": "1850.00",
        "selling_price": "2750.00",
        "low_stock_threshold": 7,
        "base_in": 13,
        "base_out": 11,
        "in_step": 1,
        "out_step": 1,
        "offset": 3,
        "mid_adjustment": -1,
        "target_stock": 23,
    },
    {
        "name": "Adjustable Monitor Stand",
        "sku": "DEMO-STAND-001",
        "category": "Demo - Electronics",
        "supplier": "Demo - TechSource",
        "purchase_price": "1450.00",
        "selling_price": "2200.00",
        "low_stock_threshold": 5,
        "base_in": 10,
        "base_out": 9,
        "in_step": 1,
        "out_step": 1,
        "offset": 1,
        "mid_adjustment": 0,
        "target_stock": 11,
    },
    {
        "name": "Full HD Webcam",
        "sku": "DEMO-WEBCAM-001",
        "category": "Demo - Electronics",
        "supplier": "Demo - TechSource",
        "purchase_price": "1950.00",
        "selling_price": "2900.00",
        "low_stock_threshold": 6,
        "base_in": 11,
        "base_out": 10,
        "in_step": 1,
        "out_step": 1,
        "offset": 2,
        "mid_adjustment": 1,
        "target_stock": 16,
    },
)


def shift_month(reference: date, offset: int) -> date:
    month_index = reference.year * 12 + reference.month - 1 + offset
    return date(month_index // 12, month_index % 12 + 1, 1)


def event_date(month: date, preferred_day: int) -> date:
    today = date.today()
    max_day = monthrange(month.year, month.month)[1]

    if month.year == today.year and month.month == today.month:
        preferred_day = min(preferred_day, today.day)

    return date(month.year, month.month, min(preferred_day, max_day))


def event_datetime(month: date, day: int, hour: int) -> datetime:
    return datetime.combine(event_date(month, day), time(hour, 0))


def get_or_create_product_category(db, organization_id: int, name: str) -> ProductCategory:
    record = (
        db.query(ProductCategory)
        .filter(
            ProductCategory.organization_id == organization_id,
            ProductCategory.name == name,
        )
        .one_or_none()
    )

    if record is None:
        record = ProductCategory(
            organization_id=organization_id,
            name=name,
            description=DEMO_TAG,
            is_active=True,
        )
        db.add(record)
        db.flush()

    return record


def get_or_create_expense_category(db, organization_id: int, name: str) -> ExpenseCategory:
    record = (
        db.query(ExpenseCategory)
        .filter(
            ExpenseCategory.organization_id == organization_id,
            ExpenseCategory.name == name,
        )
        .one_or_none()
    )

    if record is None:
        record = ExpenseCategory(
            organization_id=organization_id,
            name=name,
            description=DEMO_TAG,
            is_active=True,
        )
        db.add(record)
        db.flush()

    return record


def get_or_create_supplier(db, organization_id: int, name: str) -> Supplier:
    record = (
        db.query(Supplier)
        .filter(
            Supplier.organization_id == organization_id,
            Supplier.name == name,
        )
        .one_or_none()
    )

    if record is None:
        record = Supplier(
            organization_id=organization_id,
            name=name,
            contact_person="Demo Contact",
            phone="01700000000",
            email="demo@example.com",
            address="Development data only",
            is_active=True,
        )
        db.add(record)
        db.flush()

    return record


def add_movement(
    db,
    product: Product,
    movement_type: str,
    quantity: int,
    reason: str,
    occurred_at: datetime,
    created_by_id: int | None,
) -> None:
    previous_stock = product.current_stock

    if movement_type == "stock_in":
        new_stock = previous_stock + quantity
    elif movement_type == "stock_out":
        new_stock = previous_stock - quantity
    else:
        new_stock = previous_stock + quantity

    if new_stock < 0:
        raise ValueError(
            f"Demo movement would make {product.sku} stock negative."
        )

    db.add(
        StockMovement(
            organization_id=product.organization_id,
            product_id=product.id,
            movement_type=movement_type,
            quantity=quantity,
            previous_stock=previous_stock,
            new_stock=new_stock,
            reason=reason,
            created_by_id=created_by_id,
            created_at=occurred_at,
        )
    )

    product.current_stock = new_stock
    product.version += 1


def list_organizations(db) -> None:
    organizations = (
        db.query(Organization)
        .filter(Organization.is_active.is_(True))
        .order_by(Organization.id.asc())
        .all()
    )

    if not organizations:
        print("No active organizations found.")
        return

    print("Available active organizations:")

    for organization in organizations:
        member_count = (
            db.query(OrganizationMember)
            .filter(
                OrganizationMember.organization_id == organization.id,
                OrganizationMember.is_active.is_(True),
            )
            .count()
        )

        print(
            f"  ID {organization.id}: {organization.name} "
            f"({member_count} active member(s))"
        )


def seed_dashboard_data(db, organization_id: int, months: int) -> None:
    organization = (
        db.query(Organization)
        .filter(
            Organization.id == organization_id,
            Organization.is_active.is_(True),
        )
        .one_or_none()
    )

    if organization is None:
        raise ValueError(f"Active organization {organization_id} was not found.")

    creator_member = (
        db.query(OrganizationMember)
        .filter(
            OrganizationMember.organization_id == organization_id,
            OrganizationMember.is_active.is_(True),
        )
        .order_by(OrganizationMember.id.asc())
        .first()
    )

    created_by_id = creator_member.user_id if creator_member else None

    demo_product_ids = [
        product_id
        for (product_id,) in (
            db.query(Product.id)
            .filter(
                Product.organization_id == organization_id,
                Product.description == DEMO_TAG,
            )
            .all()
        )
    ]

    if demo_product_ids:
        (
            db.query(StockMovement)
            .filter(StockMovement.product_id.in_(demo_product_ids))
            .delete(synchronize_session=False)
        )

    (
        db.query(FinancialTransaction)
        .filter(
            FinancialTransaction.organization_id == organization_id,
            FinancialTransaction.description == DEMO_TAG,
        )
        .delete(synchronize_session=False)
    )

    product_categories = {
        name: get_or_create_product_category(db, organization_id, name)
        for name in {
            item["category"]
            for item in PRODUCTS
        }
    }

    suppliers = {
        name: get_or_create_supplier(db, organization_id, name)
        for name in {
            item["supplier"]
            for item in PRODUCTS
        }
    }

    expense_categories = {
        name: get_or_create_expense_category(db, organization_id, name)
        for name in (
            "Demo - Operations",
            "Demo - Utilities",
            "Demo - Logistics",
            "Demo - Marketing",
        )
    }

    demo_products: list[tuple[Product, dict]] = []

    for definition in PRODUCTS:
        product = (
            db.query(Product)
            .filter(
                Product.organization_id == organization_id,
                Product.sku == definition["sku"],
            )
            .one_or_none()
        )

        if product is None:
            product = Product(
                organization_id=organization_id,
                name=definition["name"],
                sku=definition["sku"],
                description=DEMO_TAG,
                category_id=product_categories[definition["category"]].id,
                supplier_id=suppliers[definition["supplier"]].id,
                purchase_price=Decimal(definition["purchase_price"]),
                selling_price=Decimal(definition["selling_price"]),
                current_stock=0,
                low_stock_threshold=definition["low_stock_threshold"],
                version=1,
                is_active=True,
            )
            db.add(product)
            db.flush()
        else:
            product.name = definition["name"]
            product.description = DEMO_TAG
            product.category_id = product_categories[definition["category"]].id
            product.supplier_id = suppliers[definition["supplier"]].id
            product.purchase_price = Decimal(definition["purchase_price"])
            product.selling_price = Decimal(definition["selling_price"])
            product.low_stock_threshold = definition["low_stock_threshold"]
            product.current_stock = 0
            product.version = 1
            product.is_active = True

        demo_products.append((product, definition))

    db.flush()

    first_month = shift_month(date.today().replace(day=1), -(months - 1))
    month_starts = [
        shift_month(first_month, index)
        for index in range(months)
    ]

    for month_index, month in enumerate(month_starts):
        for product, definition in demo_products:
            in_quantity = (
                definition["base_in"]
                + ((month_index + definition["offset"]) % 4) * definition["in_step"]
            )

            out_quantity = (
                definition["base_out"]
                + ((month_index + definition["offset"]) % 3) * definition["out_step"]
            )

            if definition.get("match_out_to_in"):
                out_quantity = in_quantity

            add_movement(
                db=db,
                product=product,
                movement_type="stock_in",
                quantity=in_quantity,
                reason=f"Demo supplier restock - {month.strftime('%b %Y')}",
                occurred_at=event_datetime(month, 5, 9),
                created_by_id=created_by_id,
            )

            add_movement(
                db=db,
                product=product,
                movement_type="stock_out",
                quantity=min(out_quantity, product.current_stock),
                reason=f"Demo customer fulfillment - {month.strftime('%b %Y')}",
                occurred_at=event_datetime(month, 20, 14),
                created_by_id=created_by_id,
            )

            if (
                month_index == months // 2
                and definition["mid_adjustment"] != 0
            ):
                add_movement(
                    db=db,
                    product=product,
                    movement_type="adjustment",
                    quantity=definition["mid_adjustment"],
                    reason="Demo stock-count correction",
                    occurred_at=event_datetime(month, 25, 16),
                    created_by_id=created_by_id,
                )

    final_month = month_starts[-1]

    for product, definition in demo_products:
        final_adjustment = definition["target_stock"] - product.current_stock

        if final_adjustment != 0:
            add_movement(
                db=db,
                product=product,
                movement_type="adjustment",
                quantity=final_adjustment,
                reason="Demo period-end stock reconciliation",
                occurred_at=event_datetime(final_month, 28, 17),
                created_by_id=created_by_id,
            )

    income_variations = (0, 2200, -1500, 3700, 1100, -700, 2800, 1900, -400, 3300, 900, 4200)
    utility_variations = (2700, 3200, 2950, 3500, 3300, 3650, 3100, 3450, 3000, 3700, 3350, 3900)
    logistics_variations = (1400, 1650, 1500, 1850, 1700, 1950, 1750, 2050, 1800, 2150, 1900, 2250)

    for month_index, month in enumerate(month_starts):
        month_name = month.strftime("%b %Y")
        transaction_day = event_date(month, 26)

        income_amount = Decimal(
            48000
            + month_index * 2400
            + income_variations[month_index % len(income_variations)]
        )

        transactions = (
            (
                "income",
                f"Demo sales collection - {month_name}",
                income_amount,
                None,
            ),
            (
                "expense",
                f"Demo operating expense - {month_name}",
                Decimal("12500.00"),
                expense_categories["Demo - Operations"].id,
            ),
            (
                "expense",
                f"Demo utility expense - {month_name}",
                Decimal(utility_variations[month_index % len(utility_variations)]),
                expense_categories["Demo - Utilities"].id,
            ),
            (
                "expense",
                f"Demo logistics expense - {month_name}",
                Decimal(logistics_variations[month_index % len(logistics_variations)]),
                expense_categories["Demo - Logistics"].id,
            ),
        )

        for transaction_type, title, amount, expense_category_id in transactions:
            db.add(
                FinancialTransaction(
                    organization_id=organization_id,
                    transaction_type=transaction_type,
                    title=title,
                    amount=amount,
                    transaction_date=transaction_day,
                    expense_category_id=expense_category_id,
                    description=DEMO_TAG,
                    created_by_id=created_by_id,
                )
            )

        if month_index % 3 == 1:
            db.add(
                FinancialTransaction(
                    organization_id=organization_id,
                    transaction_type="expense",
                    title=f"Demo marketing expense - {month_name}",
                    amount=Decimal("4200.00"),
                    transaction_date=transaction_day,
                    expense_category_id=expense_categories["Demo - Marketing"].id,
                    description=DEMO_TAG,
                    created_by_id=created_by_id,
                )
            )

    db.commit()

    print(f"Seeded dashboard demo data for organization {organization.id}: {organization.name}")
    print(f"  Products: {len(demo_products)}")
    print(f"  Months covered: {months}")
    print("  Includes low-stock, out-of-stock, movements, income, and expenses.")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Seed safe development-only dashboard data."
    )
    parser.add_argument(
        "--list-organizations",
        action="store_true",
        help="List active organizations and exit.",
    )
    parser.add_argument(
        "--organization-id",
        type=int,
        help="Organization receiving demo data.",
    )
    parser.add_argument(
        "--months",
        type=int,
        default=12,
        help="Number of months to seed (3 to 24, default: 12).",
    )
    args = parser.parse_args()

    db_generator = get_db()
    db = next(db_generator)

    try:
        if args.list_organizations:
            list_organizations(db)
            return 0

        if args.organization_id is None:
            parser.error("--organization-id is required unless --list-organizations is used.")

        if args.months < 3 or args.months > 24:
            parser.error("--months must be between 3 and 24.")

        seed_dashboard_data(
            db=db,
            organization_id=args.organization_id,
            months=args.months,
        )
        return 0
    except Exception:
        db.rollback()
        raise
    finally:
        db_generator.close()


if __name__ == "__main__":
    raise SystemExit(main())
