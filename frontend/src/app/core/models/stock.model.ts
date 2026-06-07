export interface StockMovement {
  id: number;
  product_id: number;
  movement_type: string;
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reason: string | null;
  created_by_id: number | null;
  created_at: string;
}

export interface StockInCreate {
  product_id: number;
  quantity: number;
  reason?: string | null;
}

export interface StockOutCreate {
  product_id: number;
  quantity: number;
  reason?: string | null;
}

export interface StockAdjustmentCreate {
  product_id: number;
  new_stock: number;
  reason?: string | null;
}
