export interface FinancialTransaction {
  id: number;
  transaction_type: string;
  title: string;
  amount: string;
  transaction_date: string;
  expense_category_id: number | null;
  description: string | null;
  created_by_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface IncomeCreate {
  title: string;
  amount: number;
  transaction_date?: string | null;
  description?: string | null;
}

export interface ExpenseCreate {
  title: string;
  amount: number;
  transaction_date?: string | null;
  expense_category_id?: number | null;
  description?: string | null;
}

export interface FinancialTransactionUpdate {
  title?: string;
  amount?: number;
  transaction_date?: string | null;
  expense_category_id?: number | null;
  description?: string | null;
}

export interface FinancialSummary {
  total_income: string;
  total_expense: string;
  net_balance: string;
}
