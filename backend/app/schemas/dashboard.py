from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel


class DashboardSummaryResponse(BaseModel):
    total_products: int
    low_stock_products: int
    total_suppliers: int
    total_income: Decimal
    total_expense: Decimal
    net_balance: Decimal


class RecentStockMovementResponse(BaseModel):
    id: int
    product_id: int
    movement_type: str
    quantity: int
    previous_stock: int
    new_stock: int
    reason: str | None
    created_at: datetime


class RecentFinancialTransactionResponse(BaseModel):
    id: int
    transaction_type: str
    title: str
    amount: Decimal
    transaction_date: date
    description: str | None


class DashboardRecentActivityResponse(BaseModel):
    recent_stock_movements: list[RecentStockMovementResponse]
    recent_financial_transactions: list[RecentFinancialTransactionResponse]