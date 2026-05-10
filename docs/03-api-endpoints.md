# StockFlow API Endpoints

## 1. Purpose

This document defines the planned REST API endpoints for StockFlow.

The API will be built using FastAPI. The frontend Angular application will communicate with these endpoints to manage authentication, products, categories, suppliers, stock movements, income/expenses, dashboard data, and reports.

This API design may receive minor changes during development, but the main endpoint structure should remain stable.

---

## 2. API Base URL

Local development base URL:

| Environment        | Base URL                |
| ------------------ | ----------------------- |
| Local backend      | `http://localhost:8000` |
| API version prefix | `/api/v1`               |

Example full endpoint:

```txt
http://localhost:8000/api/v1/products
```

---

## 3. API Design Rules

The API should follow these rules:

- Use REST-style endpoints
- Use plural resource names
- Use clear HTTP methods
- Use JSON request and response body
- Protect private endpoints using JWT
- Use proper HTTP status codes
- Use pagination for large lists later
- Keep route names simple and readable

Common HTTP methods:

| Method | Purpose                     |
| ------ | --------------------------- |
| GET    | Read data                   |
| POST   | Create data                 |
| PUT    | Update full record          |
| PATCH  | Update partial record       |
| DELETE | Delete or deactivate record |

---

## 4. Common Response Style

Successful response example:

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {}
}
```

Error response example:

```json
{
  "success": false,
  "message": "Product not found",
  "detail": {}
}
```

During early development, FastAPI's default response format may be used. A standardized response style can be added later during polish.

---

## 5. Health Check Endpoint

| Method | Endpoint  | Auth Required | Purpose                     |
| ------ | --------- | ------------- | --------------------------- |
| GET    | `/health` | No            | Check if backend is running |

Expected response:

```json
{
  "status": "ok",
  "message": "StockFlow API is running"
}
```

---

## 6. Authentication Endpoints

Base route:

```txt
/api/v1/auth
```

| Method | Endpoint                | Auth Required        | Purpose                     |
| ------ | ----------------------- | -------------------- | --------------------------- |
| POST   | `/api/v1/auth/register` | No                   | Register a new user         |
| POST   | `/api/v1/auth/login`    | No                   | Login and receive JWT token |
| GET    | `/api/v1/auth/me`       | Yes                  | Get current logged-in user  |
| POST   | `/api/v1/auth/logout`   | Yes/Frontend handled | Logout user from frontend   |

### Register Request

```json
{
  "full_name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```

### Login Request

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Login Response

```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer"
}
```

### Notes

- Passwords must be hashed before saving.
- JWT token will be sent from Angular in the Authorization header.
- role may default to staff or admin depending on setup.

---

## 7. User Endpoints

Base route:

```txt
/api/v1/users
```

| Method | Endpoint                         | Auth Required | Role  | Purpose                  |
| ------ | -------------------------------- | ------------- | ----- | ------------------------ |
| GET    | `/api/v1/users`                  | Yes           | Admin | Get all users            |
| GET    | `/api/v1/users/{user_id}`        | Yes           | Admin | Get single user          |
| PATCH  | `/api/v1/users/{user_id}/role`   | Yes           | Admin | Update user role         |
| PATCH  | `/api/v1/users/{user_id}/status` | Yes           | Admin | Activate/deactivate user |

This module can be added after basic authentication works.

---

## 8. Product Category Endpoints

Base route:

```txt
/api/v1/product-categories
```

| Method | Endpoint                                   | Auth Required | Purpose                            |
| ------ | ------------------------------------------ | ------------- | ---------------------------------- |
| POST   | `/api/v1/product-categories`               | Yes           | Create product category            |
| GET    | `/api/v1/product-categories`               | Yes           | Get all product categories         |
| GET    | `/api/v1/product-categories/{category_id}` | Yes           | Get single product category        |
| PUT    | `/api/v1/product-categories/{category_id}` | Yes           | Update product category            |
| DELETE | `/api/v1/product-categories/{category_id}` | Yes           | Delete/deactivate product category |

Example create request:

```json
{
  "name": "Electronics",
  "description": "Electronic products and accessories"
}
```

---

## 9. Expense Category Endpoints

Base route:

```txt
/api/v1/expense-categories
```

| Method | Endpoint                                   | Auth Required | Purpose                            |
| ------ | ------------------------------------------ | ------------- | ---------------------------------- |
| POST   | `/api/v1/expense-categories`               | Yes           | Create expense category            |
| GET    | `/api/v1/expense-categories`               | Yes           | Get all expense categories         |
| GET    | `/api/v1/expense-categories/{category_id}` | Yes           | Get single expense category        |
| PUT    | `/api/v1/expense-categories/{category_id}` | Yes           | Update expense category            |
| DELETE | `/api/v1/expense-categories/{category_id}` | Yes           | Delete/deactivate expense category |

Example categories:

- Rent
- Salary
- Utility
- Transport
- Purchase
- Marketing
- Maintenance

---

## 10. Supplier Endpoints

Base route:

```txt
/api/v1/suppliers
```

| Method | Endpoint                          | Auth Required | Purpose                    |
| ------ | --------------------------------- | ------------- | -------------------------- |
| POST   | `/api/v1/suppliers`               | Yes           | Create supplier            |
| GET    | `/api/v1/suppliers`               | Yes           | Get all suppliers          |
| GET    | `/api/v1/suppliers/{supplier_id}` | Yes           | Get single supplier        |
| PUT    | `/api/v1/suppliers/{supplier_id}` | Yes           | Update supplier            |
| DELETE | `/api/v1/suppliers/{supplier_id}` | Yes           | Delete/deactivate supplier |

Example create request:

```json
{
  "name": "ABC Suppliers Ltd.",
  "contact_person": "Mr. Rahim",
  "phone": "01700000000",
  "email": "supplier@example.com",
  "address": "Dhaka, Bangladesh"
}
```

---

## 11. Product Endpoints

Base route:

```txt
/api/v1/products
```

| Method | Endpoint                        | Auth Required | Purpose                   |
| ------ | ------------------------------- | ------------- | ------------------------- |
| POST   | `/api/v1/products`              | Yes           | Create product            |
| GET    | `/api/v1/products`              | Yes           | Get product list          |
| GET    | `/api/v1/products/{product_id}` | Yes           | Get single product        |
| PUT    | `/api/v1/products/{product_id}` | Yes           | Update product            |
| DELETE | `/api/v1/products/{product_id}` | Yes           | Delete/deactivate product |
| GET    | `/api/v1/products/low-stock`    | Yes           | Get low-stock products    |

Product list query parameters:

| Parameter    | Purpose                       |
| ------------ | ----------------------------- |
| search       | Search by product name or SKU |
| category_id  | Filter by category            |
| supplier_id  | Filter by supplier            |
| is_low_stock | Filter low-stock products     |
| page         | Pagination page               |
| limit        | Number of records per page    |

Example:

```txt
GET /api/v1/products?search=mouse&category_id=1&page=1&limit=10
```

Example create request:

```json
{
  "name": "Wireless Mouse",
  "sku": "MOUSE-001",
  "description": "Basic wireless mouse",
  "category_id": 1,
  "supplier_id": 1,
  "purchase_price": 450,
  "selling_price": 650,
  "current_stock": 50,
  "low_stock_threshold": 10
}
```

---

## 12. Stock Management Endpoints

Base route:

```txt
/api/v1/stock
```

| Method | Endpoint                                | Auth Required | Purpose                     |
| ------ | --------------------------------------- | ------------- | --------------------------- |
| POST   | `/api/v1/stock/in`                      | Yes           | Add stock to a product      |
| POST   | `/api/v1/stock/out`                     | Yes           | Remove stock from a product |
| POST   | `/api/v1/stock/adjust`                  | Yes           | Adjust product stock        |
| GET    | `/api/v1/stock/movements`               | Yes           | Get stock movement history  |
| GET    | `/api/v1/stock/movements/{movement_id}` | Yes           | Get single stock movement   |

### Stock In Request

```json
{
  "product_id": 1,
  "quantity": 20,
  "reason": "Purchased from supplier"
}
```

### Stock Out Request

```json
{
  "product_id": 1,
  "quantity": 5,
  "reason": "Sold to customer"
}
```

### Stock Adjustment Request

```json
{
  "product_id": 1,
  "new_stock": 42,
  "reason": "Physical stock count correction"
}
```

Stock movement query parameters:

| Parameter     | Purpose                                   |
| ------------- | ----------------------------------------- |
| product_id    | Filter by product                         |
| movement_type | Filter by stock_in, stock_out, adjustment |
| start_date    | Filter from date                          |
| end_date      | Filter to date                            |
| page          | Pagination page                           |
| limit         | Number of records per page                |

Business rules:

- Stock in increases current stock.
- Stock out decreases current stock.
- Stock adjustment changes stock to a new value.
- Stock cannot be negative.
- Every stock change must create a stock movement record.

---

## 13. Financial Transaction Endpoints

Base route:

```txt
/api/v1/finance
```

| Method | Endpoint                                        | Auth Required | Purpose                             |
| ------ | ----------------------------------------------- | ------------- | ----------------------------------- |
| POST   | `/api/v1/finance/transactions`                  | Yes           | Create income/expense transaction   |
| GET    | `/api/v1/finance/transactions`                  | Yes           | Get income/expense transaction list |
| GET    | `/api/v1/finance/transactions/{transaction_id}` | Yes           | Get single transaction              |
| PUT    | `/api/v1/finance/transactions/{transaction_id}` | Yes           | Update transaction                  |
| DELETE | `/api/v1/finance/transactions/{transaction_id}` | Yes           | Delete/deactivate transaction       |
| GET    | `/api/v1/finance/monthly-summary`               | Yes           | Get monthly income/expense summary  |
| GET    | `/api/v1/finance/expense-by-category`           | Yes           | Get expense breakdown by category   |

Example create request:

```json
{
  "transaction_type": "expense",
  "amount": 5000,
  "category_id": 1,
  "description": "Office rent",
  "transaction_date": "2026-05-11",
  "payment_method": "cash"
}
```

Transaction query parameters:

| Parameter        | Purpose                    |
| ---------------- | -------------------------- |
| transaction_type | income or expense          |
| category_id      | Filter by category         |
| start_date       | Filter from date           |
| end_date         | Filter to date             |
| page             | Pagination page            |
| limit            | Number of records per page |

---

## 14. Dashboard Endpoints

Base route:

```txt
/api/v1/dashboard
```

| Method | Endpoint                                   | Auth Required | Purpose                              |
| ------ | ------------------------------------------ | ------------- | ------------------------------------ |
| GET    | `/api/v1/dashboard/summary`                | Yes           | Get dashboard card summary           |
| GET    | `/api/v1/dashboard/income-expense-chart`   | Yes           | Get income vs expense chart data     |
| GET    | `/api/v1/dashboard/expense-category-chart` | Yes           | Get expense by category chart data   |
| GET    | `/api/v1/dashboard/stock-movement-chart`   | Yes           | Get stock in vs stock out chart data |
| GET    | `/api/v1/dashboard/recent-stock-movements` | Yes           | Get recent stock movement list       |

Dashboard summary response should include:

```json
{
  "total_products": 100,
  "total_suppliers": 12,
  "total_stock_value": 250000,
  "low_stock_products": 8,
  "monthly_income": 120000,
  "monthly_expense": 70000,
  "estimated_profit": 50000
}
```

---

## 15. Report Endpoints

Base route:

```txt
/api/v1/reports
```

| Method | Endpoint                              | Auth Required | Purpose                             |
| ------ | ------------------------------------- | ------------- | ----------------------------------- |
| GET    | `/api/v1/reports/products`            | Yes           | Product report                      |
| GET    | `/api/v1/reports/low-stock`           | Yes           | Low-stock report                    |
| GET    | `/api/v1/reports/stock-movements`     | Yes           | Stock movement report               |
| GET    | `/api/v1/reports/finance`             | Yes           | Income/expense report               |
| GET    | `/api/v1/reports/products/export-csv` | Yes           | Export product report as CSV        |
| GET    | `/api/v1/reports/stock/export-csv`    | Yes           | Export stock movement report as CSV |
| GET    | `/api/v1/reports/finance/export-csv`  | Yes           | Export finance report as CSV        |

Report query parameters:

| Parameter        | Purpose                    |
| ---------------- | -------------------------- |
| start_date       | Filter from date           |
| end_date         | Filter to date             |
| category_id      | Filter by category         |
| supplier_id      | Filter by supplier         |
| movement_type    | Filter stock movement type |
| transaction_type | Filter income/expense      |

---

## 16. Activity Log Endpoints

Base route:

```txt
/api/v1/activity-logs
```

| Method | Endpoint                         | Auth Required | Role          | Purpose                 |
| ------ | -------------------------------- | ------------- | ------------- | ----------------------- |
| GET    | `/api/v1/activity-logs`          | Yes           | Admin/Manager | Get activity logs       |
| GET    | `/api/v1/activity-logs/{log_id}` | Yes           | Admin/Manager | Get single activity log |

Activity logs may be created automatically by backend services when important actions happen.

Examples:

- Product created
- Product updated
- Stock changed
- Supplier updated
- Expense added
- User role changed

---

## 17. Human Verification Endpoint

This may be added in the security phase.

Base route:

```txt
/api/v1/security
```

| Method | Endpoint                            | Auth Required | Purpose                           |
| ------ | ----------------------------------- | ------------- | --------------------------------- |
| POST   | `/api/v1/security/verify-turnstile` | No            | Verify Cloudflare Turnstile token |

Possible use cases:

- Registration form
- Login after repeated failed attempts
- Forgot password form
- Public contact/support form

This feature is not required in the MVP.

---

## 18. MVP Endpoint Priority

For the first working MVP, build endpoints in this order:

1. GET /health
2. POST /api/v1/auth/register
3. POST /api/v1/auth/login
4. GET /api/v1/auth/me
5. Product category CRUD
6. Supplier CRUD
7. Product CRUD
8. Stock in/out/adjustment
9. Stock movement history
10. Low-stock products

After MVP:

1. Expense category CRUD
2. Income/expense transactions
3. Monthly summary
4. Dashboard summary
5. Reports and CSV export
6. Activity logs
7. Role-based access
8. Human verification

---

## 19. Authentication Header

Protected API requests should include this header:

```txt
Authorization: Bearer <access_token>
```

Example:

```txt
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...
```

Angular will later send this token automatically using an HTTP interceptor.

---

## 20. Status Code Plan

Recommended status codes:

| Status Code | Meaning                                  |
| ----------- | ---------------------------------------- |
| 200         | Successful request                       |
| 201         | Created successfully                     |
| 400         | Bad request                              |
| 401         | Unauthorized                             |
| 403         | Forbidden                                |
| 404         | Resource not found                       |
| 409         | Conflict, such as duplicate SKU or email |
| 422         | Validation error                         |
| 500         | Server error                             |

---

## 21. Locked API Baseline

The locked API baseline includes endpoints for:

- Health check
- Authentication
- Users
- Product categories
- Expense categories
- Suppliers
- Products
- Stock management
- Financial transactions
- Dashboard
- Reports
- Activity logs
- Human verification

The first implementation should start with health check, authentication, category, supplier, product, and stock endpoints.
