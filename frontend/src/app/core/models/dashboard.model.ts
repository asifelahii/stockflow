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
