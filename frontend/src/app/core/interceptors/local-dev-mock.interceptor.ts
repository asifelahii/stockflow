import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { LocalMockAccount } from '../../../environments/environment.types';
import { API_BASE_URL } from '../config/api.config';

const LOCAL_PREVIEW_TOKEN = 'stockflow-local-ui-preview-token';
const MOCK_DATE = '2026-07-03T09:00:00.000Z';

const productCategories = [
  {
    id: 1,
    name: 'Electronics',
    description: 'Devices and electronic accessories',
    is_active: true,
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE
  },
  {
    id: 2,
    name: 'Office Supplies',
    description: 'Products for everyday office work',
    is_active: true,
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE
  },
  {
    id: 3,
    name: 'Accessories',
    description: 'Computer and mobile accessories',
    is_active: true,
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE
  }
];

const suppliers = [
  {
    id: 1,
    name: 'TechNova Distribution',
    contact_person: 'Tanvir Hasan',
    phone: '+880 1700 000001',
    email: 'sales@technova.example',
    address: 'Dhaka',
    is_active: true,
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE
  },
  {
    id: 2,
    name: 'OfficeMart Bangladesh',
    contact_person: 'Sadia Islam',
    phone: '+880 1700 000002',
    email: 'orders@officemart.example',
    address: 'Dhaka',
    is_active: true,
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE
  },
  {
    id: 3,
    name: 'Pixel Accessories',
    contact_person: 'Nafis Rahman',
    phone: '+880 1700 000003',
    email: 'hello@pixel.example',
    address: 'Chattogram',
    is_active: true,
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE
  }
];

const products = [
  {
    id: 1,
    name: 'Wireless Mechanical Keyboard',
    sku: 'KB-WL-001',
    description: 'Compact wireless keyboard for workstations',
    category_id: 1,
    supplier_id: 1,
    purchase_price: '5200',
    selling_price: '6500',
    current_stock: 18,
    low_stock_threshold: 5,
    version: 1,
    is_active: true,
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE
  },
  {
    id: 2,
    name: 'USB-C Hub 7-in-1',
    sku: 'HUB-7IN1-002',
    description: 'USB-C hub with HDMI and card reader',
    category_id: 3,
    supplier_id: 3,
    purchase_price: '1850',
    selling_price: '2450',
    current_stock: 4,
    low_stock_threshold: 6,
    version: 1,
    is_active: true,
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE
  },
  {
    id: 3,
    name: 'Ergonomic Office Chair',
    sku: 'CHR-ERG-003',
    description: 'Adjustable mesh chair for desk work',
    category_id: 2,
    supplier_id: 2,
    purchase_price: '9400',
    selling_price: '11800',
    current_stock: 7,
    low_stock_threshold: 3,
    version: 1,
    is_active: true,
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE
  },
  {
    id: 4,
    name: 'A4 Premium Paper',
    sku: 'PPR-A4-004',
    description: '80 GSM office printing paper',
    category_id: 2,
    supplier_id: 2,
    purchase_price: '540',
    selling_price: '650',
    current_stock: 2,
    low_stock_threshold: 10,
    version: 1,
    is_active: true,
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE
  },
  {
    id: 5,
    name: 'Wireless Mouse',
    sku: 'MSE-WL-005',
    description: 'Bluetooth mouse with silent click',
    category_id: 3,
    supplier_id: 1,
    purchase_price: '850',
    selling_price: '1200',
    current_stock: 0,
    low_stock_threshold: 4,
    version: 1,
    is_active: false,
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE
  }
];

const recentStockMovements = [
  {
    id: 1,
    product_id: 1,
    movement_type: 'stock_in',
    quantity: 12,
    previous_stock: 6,
    new_stock: 18,
    reason: 'Supplier delivery',
    created_at: '2026-07-03T08:10:00.000Z'
  },
  {
    id: 2,
    product_id: 2,
    movement_type: 'stock_out',
    quantity: -2,
    previous_stock: 6,
    new_stock: 4,
    reason: 'Customer order',
    created_at: '2026-07-02T16:30:00.000Z'
  }
];

const recentFinancialTransactions = [
  {
    id: 1,
    transaction_type: 'income',
    title: 'Product sales settlement',
    amount: '18500',
    transaction_date: '2026-07-03',
    description: 'Daily sales settlement'
  },
  {
    id: 2,
    transaction_type: 'expense',
    title: 'Supplier delivery cost',
    amount: '2200',
    transaction_date: '2026-07-02',
    description: 'Courier and delivery'
  }
];

export const localDevMockInterceptor: HttpInterceptorFn = (request, next) => {
  const account = environment.localMock.account;

  if (
    !environment.localMock.enabled ||
    !account ||
    !request.url.startsWith(API_BASE_URL)
  ) {
    return next(request);
  }

  const path = request.url.split('?')[0];

  if (request.method === 'POST' && path.endsWith('/auth/login')) {
    const payload = request.body as { email?: string; password?: string } | null;

    if (payload?.email !== account.email || payload?.password !== account.password) {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            statusText: 'Unauthorized',
            url: request.url,
            error: {
              detail: 'Local preview login failed. Check the local development credentials.'
            }
          })
      );
    }

    return success({
      access_token: LOCAL_PREVIEW_TOKEN,
      token_type: 'bearer',
      organization: account.organization
    });
  }

  if (request.method === 'GET') {
    return success(getReadOnlyMockBody(path, account));
  }

  return throwError(
    () =>
      new HttpErrorResponse({
        status: 405,
        statusText: 'Read-only local preview',
        url: request.url,
        error: {
          detail: 'Local preview data is read-only. Start the backend to save changes.'
        }
      })
  );
};

function success(body: unknown) {
  return of(
    new HttpResponse({
      status: 200,
      body
    })
  );
}

function getReadOnlyMockBody(path: string, account: LocalMockAccount): unknown {
  if (path.endsWith('/auth/me')) {
    return {
      id: account.userId,
      full_name: account.fullName,
      email: account.email,
      role: account.role,
      is_active: true,
      created_at: MOCK_DATE,
      updated_at: MOCK_DATE
    };
  }

  if (path.endsWith('/dashboard/summary')) {
    return {
      total_products: products.filter((product) => product.is_active).length,
      low_stock_products: products.filter(
        (product) => product.is_active && product.current_stock <= product.low_stock_threshold
      ).length,
      total_suppliers: suppliers.filter((supplier) => supplier.is_active).length,
      total_income: '18500',
      total_expense: '2200',
      net_balance: '16300'
    };
  }

  if (path.endsWith('/dashboard/recent-activity')) {
    return {
      recent_stock_movements: recentStockMovements,
      recent_financial_transactions: recentFinancialTransactions
    };
  }

  if (path.endsWith('/products/low-stock')) {
    return products.filter(
      (product) => product.is_active && product.current_stock <= product.low_stock_threshold
    );
  }

  if (path.endsWith('/products')) {
    return products;
  }

  if (path.endsWith('/product-categories')) {
    return productCategories;
  }

  if (path.endsWith('/expense-categories')) {
    return [];
  }

  if (path.endsWith('/suppliers')) {
    return suppliers;
  }

  if (path.endsWith('/stock/movements')) {
    return recentStockMovements;
  }

  if (path.endsWith('/finance/transactions')) {
    return recentFinancialTransactions;
  }

  if (path.endsWith('/finance/summary')) {
    return {
      total_income: '18500',
      total_expense: '2200',
      net_balance: '16300'
    };
  }

  return [];
}
