# StockFlow Backend

This is the FastAPI backend for StockFlow: Inventory and Business Expense Management System.

## Completed Backend Phases

- Phase 1: Backend Foundation
- Phase 2: Authentication
- Phase 3: Product Management
- Phase 4: Category and Supplier Management
- Phase 5: Stock Management
- Phase 6: Income and Expense Management

## Tech Stack

- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- Pydantic Settings
- JWT Authentication
- Uvicorn

## Local Setup

Create and activate virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Run development server:

```powershell
python -m uvicorn app.main:app --reload
```

Health check:

```txt
http://127.0.0.1:8000/health
```

API docs:

```txt
http://127.0.0.1:8000/docs
```

## Environment Variables

Copy `.env.example` to `.env` and update values when needed.

Do not commit `.env`.

## Implemented API Endpoints

### Health

```txt
GET /health
```

### Authentication

```txt
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

### Products

```txt
POST   /api/v1/products
GET    /api/v1/products
GET    /api/v1/products/low-stock
GET    /api/v1/products/{product_id}
PUT    /api/v1/products/{product_id}
DELETE /api/v1/products/{product_id}
```

### Product Categories

```txt
POST   /api/v1/product-categories
GET    /api/v1/product-categories
GET    /api/v1/product-categories/{category_id}
PUT    /api/v1/product-categories/{category_id}
DELETE /api/v1/product-categories/{category_id}
```

### Expense Categories

```txt
POST   /api/v1/expense-categories
GET    /api/v1/expense-categories
GET    /api/v1/expense-categories/{category_id}
PUT    /api/v1/expense-categories/{category_id}
DELETE /api/v1/expense-categories/{category_id}
```

### Suppliers

```txt
POST   /api/v1/suppliers
GET    /api/v1/suppliers
GET    /api/v1/suppliers/{supplier_id}
PUT    /api/v1/suppliers/{supplier_id}
DELETE /api/v1/suppliers/{supplier_id}
```

### Stock Management

```txt
POST /api/v1/stock/in
POST /api/v1/stock/out
POST /api/v1/stock/adjust
GET  /api/v1/stock/movements
```

### Finance

```txt
POST   /api/v1/finance/income
POST   /api/v1/finance/expenses
GET    /api/v1/finance/transactions
GET    /api/v1/finance/transactions/{transaction_id}
PUT    /api/v1/finance/transactions/{transaction_id}
DELETE /api/v1/finance/transactions/{transaction_id}
GET    /api/v1/finance/summary
```

## Authentication Flow

1. A user registers with full name, email, and password.
2. The backend hashes the password before saving it.
3. The user logs in with email and password.
4. The backend returns a JWT access token.
5. Protected routes require the JWT token using Bearer authentication.
6. The `/api/v1/auth/me` endpoint returns the currently logged-in user.

## Product Management Flow

1. A logged-in user can create a product.
2. Product SKU must be unique.
3. Product price and stock values cannot be negative.
4. Products can be searched by name or SKU.
5. Low-stock products are detected when `current_stock <= low_stock_threshold`.
6. Delete uses soft delete by setting `is_active = false`.
7. Inactive products are hidden from normal product list and product details API.

## Category and Supplier Management Flow

1. A logged-in user can create product categories.
2. Product category names must be unique.
3. A logged-in user can create expense categories.
4. Expense category names must be unique.
5. A logged-in user can create suppliers.
6. Suppliers can be searched by name.
7. Categories and suppliers use soft delete by setting `is_active = false`.
8. Inactive categories and suppliers are hidden from normal list APIs.
9. Products can optionally reference a valid product category and supplier.

## Stock Management Flow

1. A logged-in user can add stock to an active product.
2. A logged-in user can reduce stock from an active product.
3. Stock-out is blocked if requested quantity is greater than current stock.
4. A logged-in user can manually adjust product stock after physical stock count.
5. Every stock operation creates a stock movement history record.
6. Stock movement history can be filtered by product ID and movement type.

## Income and Expense Management Flow

1. A logged-in user can create income records.
2. A logged-in user can create expense records.
3. Expense records can optionally reference an active expense category.
4. Invalid expense category IDs are rejected.
5. Transactions can be listed and filtered by transaction type.
6. A single transaction can be viewed by ID.
7. Transactions can be updated or deleted.
8. The financial summary calculates total income, total expense, and net balance.
9. Summary values are returned with two-decimal money formatting.
