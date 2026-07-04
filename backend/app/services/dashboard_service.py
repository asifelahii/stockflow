from collections import defaultdict
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.category import ExpenseCategory
from app.models.financial_transaction import FinancialTransaction
from app.models.product import Product
from app.models.stock_movement import StockMovement
from app.models.supplier import Supplier


MONEY_QUANTUM = Decimal("0.01")


def _money(value: Decimal | int | float | None) -> Decimal:
    if value is None:
        return Decimal("0.00")

    return Decimal(str(value)).quantize(MONEY_QUANTUM)


def _month_start(value: date) -> date:
    return value.replace(day=1)


def _shift_month(reference: date, offset: int) -> date:
    month_index = reference.year * 12 + reference.month - 1 + offset

    return date(
        month_index // 12,
        month_index % 12 + 1,
        1,
    )


def get_dashboard_summary(
    db: Session,
    organization_id: int,
) -> dict:
    total_products = (
        db.query(Product)
        .filter(
            Product.organization_id == organization_id,
            Product.is_active.is_(True),
        )
        .count()
    )

    low_stock_products = (
        db.query(Product)
        .filter(
            Product.organization_id == organization_id,
            Product.is_active.is_(True),
            Product.current_stock <= Product.low_stock_threshold,
        )
        .count()
    )

    total_suppliers = (
        db.query(Supplier)
        .filter(
            Supplier.organization_id == organization_id,
            Supplier.is_active.is_(True),
        )
        .count()
    )

    total_income = (
        db.query(func.coalesce(func.sum(FinancialTransaction.amount), 0))
        .filter(
            FinancialTransaction.organization_id == organization_id,
            FinancialTransaction.transaction_type == "income",
        )
        .scalar()
    )

    total_expense = (
        db.query(func.coalesce(func.sum(FinancialTransaction.amount), 0))
        .filter(
            FinancialTransaction.organization_id == organization_id,
            FinancialTransaction.transaction_type == "expense",
        )
        .scalar()
    )

    total_income = _money(total_income)
    total_expense = _money(total_expense)

    return {
        "total_products": total_products,
        "low_stock_products": low_stock_products,
        "total_suppliers": total_suppliers,
        "total_income": total_income,
        "total_expense": total_expense,
        "net_balance": _money(total_income - total_expense),
    }


def get_recent_activity(
    db: Session,
    organization_id: int,
    limit: int = 5,
) -> dict:
    recent_stock_movements = (
        db.query(StockMovement)
        .join(Product, StockMovement.product_id == Product.id)
        .filter(Product.organization_id == organization_id)
        .order_by(StockMovement.id.desc())
        .limit(limit)
        .all()
    )

    recent_financial_transactions = (
        db.query(FinancialTransaction)
        .filter(FinancialTransaction.organization_id == organization_id)
        .order_by(FinancialTransaction.id.desc())
        .limit(limit)
        .all()
    )

    return {
        "recent_stock_movements": [
            {
                "id": movement.id,
                "product_id": movement.product_id,
                "movement_type": movement.movement_type,
                "quantity": movement.quantity,
                "previous_stock": movement.previous_stock,
                "new_stock": movement.new_stock,
                "reason": movement.reason,
                "created_at": movement.created_at,
            }
            for movement in recent_stock_movements
        ],
        "recent_financial_transactions": [
            {
                "id": transaction.id,
                "transaction_type": transaction.transaction_type,
                "title": transaction.title,
                "amount": transaction.amount,
                "transaction_date": transaction.transaction_date,
                "description": transaction.description,
            }
            for transaction in recent_financial_transactions
        ],
    }


def get_dashboard_analytics(
    db: Session,
    organization_id: int,
    months: int = 6,
) -> dict:
    today = date.today()
    period_start = _shift_month(_month_start(today), -(months - 1))
    period_end = today
    month_starts = [_shift_month(period_start, index) for index in range(months)]

    finance_buckets: dict[date, dict[str, Decimal]] = {
        month: {
            "income": Decimal("0.00"),
            "expense": Decimal("0.00"),
        }
        for month in month_starts
    }

    stock_buckets: dict[date, dict[str, int]] = {
        month: {
            "stock_in": 0,
            "stock_out": 0,
            "adjustment": 0,
        }
        for month in month_starts
    }

    category_names = {
        category.id: category.name
        for category in (
            db.query(ExpenseCategory)
            .filter(ExpenseCategory.organization_id == organization_id)
            .all()
        )
    }

    transactions = (
        db.query(FinancialTransaction)
        .filter(
            FinancialTransaction.organization_id == organization_id,
            FinancialTransaction.transaction_date >= period_start,
            FinancialTransaction.transaction_date <= period_end,
        )
        .all()
    )

    expense_totals: dict[int | None, Decimal] = defaultdict(
        lambda: Decimal("0.00")
    )

    for transaction in transactions:
        bucket_month = _month_start(transaction.transaction_date)

        if bucket_month not in finance_buckets:
            continue

        amount = _money(transaction.amount)

        if transaction.transaction_type == "income":
            finance_buckets[bucket_month]["income"] += amount
        elif transaction.transaction_type == "expense":
            finance_buckets[bucket_month]["expense"] += amount
            expense_totals[transaction.expense_category_id] += amount

    period_start_datetime = datetime.combine(period_start, datetime.min.time())
    period_end_datetime = datetime.combine(period_end, datetime.max.time())

    movements = (
        db.query(StockMovement)
        .join(Product, StockMovement.product_id == Product.id)
        .filter(
            Product.organization_id == organization_id,
            StockMovement.created_at >= period_start_datetime,
            StockMovement.created_at <= period_end_datetime,
        )
        .all()
    )

    product_movement_totals: dict[int, dict[str, int]] = defaultdict(
        lambda: {
            "movement_count": 0,
            "units_moved": 0,
        }
    )

    for movement in movements:
        bucket_month = _month_start(movement.created_at.date())

        if bucket_month not in stock_buckets:
            continue

        quantity = abs(int(movement.quantity))

        if movement.movement_type == "stock_in":
            stock_buckets[bucket_month]["stock_in"] += quantity
        elif movement.movement_type == "stock_out":
            stock_buckets[bucket_month]["stock_out"] += quantity
        elif movement.movement_type == "adjustment":
            stock_buckets[bucket_month]["adjustment"] += quantity

        product_movement_totals[movement.product_id]["movement_count"] += 1
        product_movement_totals[movement.product_id]["units_moved"] += quantity

    active_products = (
        db.query(Product)
        .filter(
            Product.organization_id == organization_id,
            Product.is_active.is_(True),
        )
        .all()
    )

    all_products = (
        db.query(Product)
        .filter(Product.organization_id == organization_id)
        .all()
    )

    products_by_id = {
        product.id: product
        for product in all_products
    }

    inventory_cost_value = _money(
        sum(
            (
                _money(product.purchase_price) * product.current_stock
                for product in active_products
            ),
            Decimal("0.00"),
        )
    )

    inventory_selling_value = _money(
        sum(
            (
                _money(product.selling_price) * product.current_stock
                for product in active_products
            ),
            Decimal("0.00"),
        )
    )

    total_stock_units = sum(product.current_stock for product in active_products)
    out_of_stock_products = sum(
        1
        for product in active_products
        if product.current_stock <= 0
    )

    top_moved_products = []

    for product_id, totals in sorted(
        product_movement_totals.items(),
        key=lambda item: (
            item[1]["units_moved"],
            item[1]["movement_count"],
        ),
        reverse=True,
    )[:5]:
        product = products_by_id.get(product_id)

        if product is None:
            continue

        top_moved_products.append(
            {
                "product_id": product.id,
                "name": product.name,
                "sku": product.sku,
                "movement_count": totals["movement_count"],
                "units_moved": totals["units_moved"],
                "current_stock": product.current_stock,
                "low_stock_threshold": product.low_stock_threshold,
            }
        )

    period_income = _money(
        sum(
            (
                item["income"]
                for item in finance_buckets.values()
            ),
            Decimal("0.00"),
        )
    )

    period_expense = _money(
        sum(
            (
                item["expense"]
                for item in finance_buckets.values()
            ),
            Decimal("0.00"),
        )
    )

    return {
        "months": months,
        "period_start": period_start,
        "period_end": period_end,
        "inventory_cost_value": inventory_cost_value,
        "inventory_selling_value": inventory_selling_value,
        "total_stock_units": total_stock_units,
        "out_of_stock_products": out_of_stock_products,
        "period_income": period_income,
        "period_expense": period_expense,
        "period_net_balance": _money(period_income - period_expense),
        "finance_trend": [
            {
                "month": month.strftime("%b"),
                "income": _money(finance_buckets[month]["income"]),
                "expense": _money(finance_buckets[month]["expense"]),
            }
            for month in month_starts
        ],
        "stock_trend": [
            {
                "month": month.strftime("%b"),
                "stock_in": stock_buckets[month]["stock_in"],
                "stock_out": stock_buckets[month]["stock_out"],
                "adjustment": stock_buckets[month]["adjustment"],
            }
            for month in month_starts
        ],
        "expense_breakdown": [
            {
                "category_id": category_id,
                "category_name": category_names.get(
                    category_id,
                    "Uncategorized",
                ),
                "amount": _money(amount),
            }
            for category_id, amount in sorted(
                expense_totals.items(),
                key=lambda item: item[1],
                reverse=True,
            )[:5]
        ],
        "top_moved_products": top_moved_products,
    }
