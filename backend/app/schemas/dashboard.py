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


class DashboardFinanceTrendPoint(BaseModel):
    month: str
    income: Decimal
    expense: Decimal


class DashboardStockTrendPoint(BaseModel):
    month: str
    stock_in: int
    stock_out: int
    adjustment: int


class DashboardExpenseBreakdownItem(BaseModel):
    category_id: int | None
    category_name: str
    amount: Decimal


class DashboardTopMovedProduct(BaseModel):
    product_id: int
    name: str
    sku: str
    movement_count: int
    units_moved: int
    current_stock: int
    low_stock_threshold: int


class DashboardAnalyticsResponse(BaseModel):
    months: int
    period_start: date
    period_end: date

    inventory_cost_value: Decimal
    inventory_selling_value: Decimal
    total_stock_units: int
    out_of_stock_products: int

    period_income: Decimal
    period_expense: Decimal
    period_net_balance: Decimal

    finance_trend: list[DashboardFinanceTrendPoint]
    stock_trend: list[DashboardStockTrendPoint]
    expense_breakdown: list[DashboardExpenseBreakdownItem]
    top_moved_products: list[DashboardTopMovedProduct]
