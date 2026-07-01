export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  category_id: number | null;
  supplier_id: number | null;
  purchase_price: string;
  selling_price: string;
  current_stock: number;
  low_stock_threshold: number;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  name: string;
  sku: string;
  description?: string | null;
  category_id?: number | null;
  supplier_id?: number | null;
  purchase_price: number;
  selling_price: number;
  current_stock: number;
  low_stock_threshold: number;
}

export interface ProductUpdate {
  version: number;
  name?: string;
  sku?: string;
  description?: string | null;
  category_id?: number | null;
  supplier_id?: number | null;
  purchase_price?: number;
  selling_price?: number;
  low_stock_threshold?: number;
  is_active?: boolean;
}
