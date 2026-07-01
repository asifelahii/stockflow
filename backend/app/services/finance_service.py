from datetime import date
from decimal import Decimal

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.category import ExpenseCategory
from app.models.financial_transaction import FinancialTransaction
from app.schemas.financial_transaction import (
    ExpenseCreate,
    FinancialTransactionUpdate,
    IncomeCreate,
)


def get_transaction_by_id(
    db: Session,
    organization_id: int,
    transaction_id: int,
) -> FinancialTransaction | None:
    return (
        db.query(FinancialTransaction)
        .filter(
            FinancialTransaction.organization_id == organization_id,
            FinancialTransaction.id == transaction_id,
        )
        .first()
    )


def expense_category_exists(
    db: Session,
    organization_id: int,
    category_id: int,
) -> bool:
    return (
        db.query(ExpenseCategory)
        .filter(
            ExpenseCategory.organization_id == organization_id,
            ExpenseCategory.id == category_id,
            ExpenseCategory.is_active.is_(True),
        )
        .first()
        is not None
    )


def get_transactions(
    db: Session,
    organization_id: int,
    transaction_type: str | None = None,
) -> list[FinancialTransaction]:
    query = db.query(FinancialTransaction).filter(
        FinancialTransaction.organization_id == organization_id,
    )

    if transaction_type is not None:
        query = query.filter(
            FinancialTransaction.transaction_type == transaction_type,
        )

    return query.order_by(FinancialTransaction.id.desc()).all()


def create_income(
    db: Session,
    organization_id: int,
    income_data: IncomeCreate,
    created_by_id: int | None = None,
) -> FinancialTransaction:
    transaction = FinancialTransaction(
        organization_id=organization_id,
        transaction_type="income",
        title=income_data.title,
        amount=income_data.amount,
        transaction_date=income_data.transaction_date or date.today(),
        description=income_data.description,
        created_by_id=created_by_id,
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return transaction


def create_expense(
    db: Session,
    organization_id: int,
    expense_data: ExpenseCreate,
    created_by_id: int | None = None,
) -> FinancialTransaction:
    transaction = FinancialTransaction(
        organization_id=organization_id,
        transaction_type="expense",
        title=expense_data.title,
        amount=expense_data.amount,
        transaction_date=expense_data.transaction_date or date.today(),
        expense_category_id=expense_data.expense_category_id,
        description=expense_data.description,
        created_by_id=created_by_id,
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return transaction


def update_transaction(
    db: Session,
    transaction: FinancialTransaction,
    transaction_data: FinancialTransactionUpdate,
) -> FinancialTransaction:
    update_data = transaction_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(transaction, field, value)

    db.commit()
    db.refresh(transaction)

    return transaction


def delete_transaction(
    db: Session,
    transaction: FinancialTransaction,
) -> None:
    db.delete(transaction)
    db.commit()


def get_financial_summary(
    db: Session,
    organization_id: int,
) -> dict[str, Decimal]:
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
        "total_income": total_income,
        "total_expense": total_expense,
        "net_balance": net_balance,
    }
