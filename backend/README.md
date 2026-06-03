# StockFlow Backend

This is the FastAPI backend for StockFlow: Inventory and Business Expense Management System.

## Current Phase

- Phase 1: Backend Foundation
- Phase 2: Authentication
- Phase 3: Product Management
- Phase 4: Category and Supplier Management

## Tech Stack

- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- Pydantic Settings
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
