export interface Warehouse {
  id: number;
  organization_id: number;
  name: string;
  code: string;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WarehouseCreate {
  name: string;
  code: string;
  address?: string | null;
  is_active?: boolean;
}

export interface WarehouseUpdate {
  name?: string;
  code?: string;
  address?: string | null;
  is_active?: boolean;
}

export interface WarehouseInventory {
  id: number;
  organization_id: number;
  warehouse_id: number;
  product_id: number;
  quantity_on_hand: number;
  low_stock_threshold: number;
  updated_at: string;
}
