export interface DashboardSummary {
  total_products: number;
  low_stock_products: number;
  total_suppliers: number;
  total_income: string;
  total_expense: string;
  net_balance: string;
}

export interface RecentStockMovement {
  id: number;
  product_id: number;
  movement_type: string;
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reason: string | null;
  created_at: string;
}

export interface RecentFinancialTransaction {
  id: number;
  transaction_type: string;
  title: string;
  amount: string;
  transaction_date: string;
  description: string | null;
}

export interface DashboardRecentActivity {
  recent_stock_movements: RecentStockMovement[];
  recent_financial_transactions: RecentFinancialTransaction[];
}

export interface DashboardFinanceTrendPoint {
  month: string;
  income: string;
  expense: string;
}

export interface DashboardStockTrendPoint {
  month: string;
  stock_in: number;
  stock_out: number;
  adjustment: number;
}

export interface DashboardExpenseBreakdownItem {
  category_id: number | null;
  category_name: string;
  amount: string;
}

export interface DashboardTopMovedProduct {
  product_id: number;
  name: string;
  sku: string;
  movement_count: number;
  units_moved: number;
  current_stock: number;
  low_stock_threshold: number;
}

export interface DashboardAnalytics {
  months: number;
  period_start: string;
  period_end: string;

  inventory_cost_value: string;
  inventory_selling_value: string;
  total_stock_units: number;
  out_of_stock_products: number;

  period_income: string;
  period_expense: string;
  period_net_balance: string;

  finance_trend: DashboardFinanceTrendPoint[];
  stock_trend: DashboardStockTrendPoint[];
  expense_breakdown: DashboardExpenseBreakdownItem[];
  top_moved_products: DashboardTopMovedProduct[];
}
