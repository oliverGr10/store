// ── Entidades principales ─────────────────────────────────────────────────

export interface IUser {
  id: string;
  email: string;
}

export interface IProduct {
  id: string;
  user_id: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  min_stock: number;
  category: string;
  unit: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ISaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  cost: number;
}

export interface ISale {
  id: string;
  user_id: string;
  total: number;
  profit: number;
  payment_type: 'cash' | 'credit';
  customer_name?: string;
  notes?: string;
  created_at: string;
  sale_items: ISaleItem[];
}

export interface IDebt {
  id: string;
  user_id: string;
  customer_name: string;
  amount: number;
  paid: boolean;
  paid_at?: string;
  note?: string;
  created_at: string;
}

// ── Requests ──────────────────────────────────────────────────────────────

export interface ICreateProductRequest {
  name: string;
  price: number;
  cost?: number;
  stock?: number;
  min_stock?: number;
  category?: string;
  unit?: string;
}

export interface ICreateSaleRequest {
  items: { product_id: string; quantity: number }[];
  payment_type: 'cash' | 'credit';
  customer_name?: string;
  notes?: string;
}

export interface ICreateDebtRequest {
  customer_name: string;
  amount: number;
  note?: string;
}

export interface IAIRequest {
  type: 'general' | 'top_products' | 'restock' | 'profit' | 'debts' | 'slow_products';
  question?: string;
  days?: number;
}

// ── Respuesta estándar API ────────────────────────────────────────────────

export interface IApiResponse<T> {
  data: T | null;
  error: { code: string; message: string } | null;
}

// ── Carrito ───────────────────────────────────────────────────────────────

export interface ICartItem {
  product: IProduct;
  quantity: number;
}
