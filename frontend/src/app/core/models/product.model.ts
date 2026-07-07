export type DiscountType = 'none' | 'percentage' | 'fixed';

export interface ProductFieldEntry {
  name: string;
  value: string;
}

export interface ProductMediaUpload {
  url: string;
  public_id: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  image_public_id: string | null;
  image_urls: string[];
  image_public_ids: Array<string | null>;
  category_id: number | null;
  supplier_id: number | null;
  release_year: number | null;
  is_featured: boolean;
  purchase_price: string;
  selling_price: string;
  discount_type: DiscountType;
  discount_value: string;
  offer_starts_on: string | null;
  offer_ends_on: string | null;
  tax_rate: string;
  shipping_fee: string;
  additional_cost: string;
  attributes: ProductFieldEntry[];
  specifications: ProductFieldEntry[];
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
  short_description?: string | null;
  description?: string | null;
  image_url?: string | null;
  image_public_id?: string | null;
  image_urls?: string[];
  image_public_ids?: Array<string | null>;
  category_id?: number | null;
  supplier_id?: number | null;
  release_year?: number | null;
  is_featured?: boolean;
  purchase_price: number;
  selling_price: number;
  discount_type?: DiscountType;
  discount_value?: number;
  offer_starts_on?: string | null;
  offer_ends_on?: string | null;
  tax_rate?: number;
  shipping_fee?: number;
  additional_cost?: number;
  attributes?: ProductFieldEntry[];
  specifications?: ProductFieldEntry[];
  current_stock: number;
  low_stock_threshold: number;
}

export interface ProductUpdate {
  version: number;
  name?: string;
  sku?: string;
  short_description?: string | null;
  description?: string | null;
  image_url?: string | null;
  image_public_id?: string | null;
  image_urls?: string[];
  image_public_ids?: Array<string | null>;
  category_id?: number | null;
  supplier_id?: number | null;
  release_year?: number | null;
  is_featured?: boolean;
  purchase_price?: number;
  selling_price?: number;
  discount_type?: DiscountType;
  discount_value?: number;
  offer_starts_on?: string | null;
  offer_ends_on?: string | null;
  tax_rate?: number;
  shipping_fee?: number;
  additional_cost?: number;
  attributes?: ProductFieldEntry[];
  specifications?: ProductFieldEntry[];
  low_stock_threshold?: number;
  is_active?: boolean;
}
