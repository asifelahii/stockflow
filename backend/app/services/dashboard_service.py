from decimal import Decimal

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.financial_transaction import FinancialTransaction
from app.models.product import Product
from app.models.stock_movement import StockMovement
from app.models.supplier import Supplier


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

    total_income = Decimal(total_income).quantize(Decimal("0.01"))
    total_expense = Decimal(total_expense).quantize(Decimal("0.01"))
    net_balance = (total_income - total_expense).quantize(Decimal("0.01"))

    return {
        "total_products": total_products,
        "low_stock_products": low_stock_products,
        "total_suppliers": total_suppliers,
        "total_income": total_income,
        "total_expense": total_expense,
        "net_balance": net_balance,
    }


def get_recent_activity(
    db: Session,
    organization_id: int,
    limit: int = 5,
) -> dict:
    recent_stock_movements = (
        db.query(StockMovement)
        .filter(StockMovement.organization_id == organization_id)
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
