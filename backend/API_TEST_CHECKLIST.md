# StockFlow Backend API Test Checklist

This checklist tracks the manually verified backend API features for StockFlow.

## Health

- [x] `GET /health` returns API status.

## Authentication

- [x] `POST /api/v1/auth/register` creates a user.
- [x] Duplicate email registration returns conflict.
- [x] `POST /api/v1/auth/login` returns JWT access token.
- [x] `GET /api/v1/auth/me` returns the logged-in user.
- [x] Protected routes reject unauthenticated requests.

## Products

- [x] Product can be created.
- [x] Duplicate SKU returns conflict.
- [x] Products can be listed.
- [x] Product can be viewed by ID.
- [x] Product can be updated.
- [x] Product can be soft deleted.
- [x] Deleted product is hidden from normal list.
- [x] Product search works.
- [x] Low-stock filter works.

## Product Categories

- [x] Product category can be created.
- [x] Duplicate product category returns conflict.
- [x] Product categories can be listed.
- [x] Product category can be updated.
- [x] Product category can be soft deleted.

## Expense Categories

- [x] Expense category can be created.
- [x] Duplicate expense category returns conflict.
- [x] Expense categories can be listed.
- [x] Expense category can be soft deleted.

## Suppliers

- [x] Supplier can be created.
- [x] Suppliers can be listed.
- [x] Supplier search works.
- [x] Supplier can be updated.
- [x] Supplier can be soft deleted.
- [x] Deleted supplier is hidden from normal list.

## Stock Management

- [x] Stock-in increases product stock.
- [x] Stock-out decreases product stock.
- [x] Stock-out is blocked when requested quantity exceeds current stock.
- [x] Stock adjustment updates product stock.
- [x] Stock movement history is created.
- [x] Stock movement history can be filtered by product ID.
- [x] Stock movement history can be filtered by movement type.

## Finance

- [x] Income transaction can be created.
- [x] Expense transaction can be created.
- [x] Invalid expense category is rejected.
- [x] Transactions can be listed.
- [x] Transactions can be filtered by income or expense.
- [x] Single transaction can be viewed by ID.
- [x] Invalid transaction ID returns not found.
- [x] Transaction can be updated.
- [x] Transaction can be deleted.
- [x] Financial summary calculates total income, total expense, and net balance.

## Dashboard

- [x] Dashboard summary returns product, supplier, stock, and finance metrics.
- [x] Recent activity returns stock movements.
- [x] Recent activity returns financial transactions.
- [x] Recent activity limit parameter works.

## Backend Cleanup

- [x] JWT secret key warning fixed.
- [x] Verbose SQLAlchemy query logs disabled.
- [x] Old commented/debug code removed.
- [x] Compile check passed.
- [x] Alembic database revision is at head.
- [x] Git working tree is clean.
