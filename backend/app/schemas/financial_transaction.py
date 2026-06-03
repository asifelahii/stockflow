from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class FinancialTransactionBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    amount: Decimal = Field(..., gt=0)
    transaction_date: date | None = None
    description: str | None = None


class IncomeCreate(FinancialTransactionBase):
    pass


class ExpenseCreate(FinancialTransactionBase):
    expense_category_id: int | None = None


class FinancialTransactionUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=150)
    amount: Decimal | None = Field(default=None, gt=0)
    transaction_date: date | None = None
    expense_category_id: int | None = None
    description: str | None = None


class FinancialTransactionResponse(BaseModel):
    id: int
    transaction_type: str
    title: str
    amount: Decimal
    transaction_date: date
    expense_category_id: int | None
    description: str | None
    created_by_id: int | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FinancialSummaryResponse(BaseModel):
    total_income: Decimal
    total_expense: Decimal
    net_balance: Decimal