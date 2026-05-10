# StockFlow Database Design

## 1. Purpose

This document defines the planned database design for StockFlow.

StockFlow uses PostgreSQL as the main relational database. The database is designed to support inventory management, supplier management, stock movement tracking, income/expense tracking, dashboard summaries, and security-related features.

This design may receive small changes during development, but the main structure should remain stable.

---

## 2. Database Design Goals

The database should be:

- Simple enough for a beginner to build
- Professional enough for a portfolio project
- Suitable for relational data
- Easy to extend later
- Compatible with FastAPI, SQLAlchemy, and Alembic
- Clear enough to document in README and API docs

---

## 3. Main Tables

The planned main tables are:

| Table                    | Purpose                                                 |
| ------------------------ | ------------------------------------------------------- |
| `users`                  | Store system users and login information                |
| `product_categories`     | Store product category names                            |
| `expense_categories`     | Store expense category names                            |
| `suppliers`              | Store supplier details                                  |
| `products`               | Store product and inventory information                 |
| `stock_movements`        | Store stock in, stock out, and stock adjustment history |
| `financial_transactions` | Store income and expense records                        |
| `activity_logs`          | Store important user actions for audit trail            |

Optional future tables:

| Table           | Purpose                                     |
| --------------- | ------------------------------------------- |
| `budgets`       | Store monthly budget limits                 |
| `roles`         | Store advanced role and permission settings |
| `notifications` | Store system notifications                  |

For the beginner-friendly version, user roles can be stored directly in the `users` table instead of creating a separate `roles` table.

---

## 4. Users Table

Table name: `users`

Purpose:

Stores user accounts for login, authentication, and basic role-based access.

| Field             | Type           | Notes                           |
| ----------------- | -------------- | ------------------------------- |
| `id`              | Integer / UUID | Primary key                     |
| `full_name`       | String         | User full name                  |
| `email`           | String         | Unique email address            |
| `hashed_password` | String         | Hashed password, not plain text |
| `role`            | String         | `admin`, `manager`, or `staff`  |
| `is_active`       | Boolean        | Account active status           |
| `created_at`      | DateTime       | Record creation time            |
| `updated_at`      | DateTime       | Last update time                |

Planned roles:

| Role      | Purpose                                         |
| --------- | ----------------------------------------------- |
| `admin`   | Full access                                     |
| `manager` | Manage inventory, suppliers, and reports        |
| `staff`   | Basic stock movement and product viewing access |

Notes:

- Passwords must never be stored as plain text.
- JWT authentication will use user information from this table.
- Advanced permissions may be added later if needed.

---

## 5. Product Categories Table

Table name: `product_categories`

Purpose:

Stores product categories such as Electronics, Grocery, Stationery, Medicine, Accessories, etc.

| Field         | Type           | Notes                         |
| ------------- | -------------- | ----------------------------- |
| `id`          | Integer / UUID | Primary key                   |
| `name`        | String         | Category name                 |
| `description` | Text           | Optional category description |
| `is_active`   | Boolean        | Active/inactive status        |
| `created_at`  | DateTime       | Record creation time          |
| `updated_at`  | DateTime       | Last update time              |

Relationship:

- One product category can have many products.

---

## 6. Expense Categories Table

Table name: `expense_categories`

Purpose:

Stores business expense categories such as Rent, Salary, Utility, Transport, Purchase, Marketing, Maintenance, etc.

| Field         | Type           | Notes                         |
| ------------- | -------------- | ----------------------------- |
| `id`          | Integer / UUID | Primary key                   |
| `name`        | String         | Expense category name         |
| `description` | Text           | Optional category description |
| `is_active`   | Boolean        | Active/inactive status        |
| `created_at`  | DateTime       | Record creation time          |
| `updated_at`  | DateTime       | Last update time              |

Relationship:

- One expense category can have many expense transactions.

---

## 7. Suppliers Table

Table name: `suppliers`

Purpose:

Stores supplier information for products.

| Field            | Type           | Notes                    |
| ---------------- | -------------- | ------------------------ |
| `id`             | Integer / UUID | Primary key              |
| `name`           | String         | Supplier or company name |
| `contact_person` | String         | Optional contact person  |
| `phone`          | String         | Supplier phone number    |
| `email`          | String         | Supplier email           |
| `address`        | Text           | Supplier address         |
| `is_active`      | Boolean        | Active/inactive status   |
| `created_at`     | DateTime       | Record creation time     |
| `updated_at`     | DateTime       | Last update time         |

Relationship:

- One supplier can provide many products.

---

## 8. Products Table

Table name: `products`

Purpose:

Stores product information and current stock quantity.

| Field                 | Type           | Notes                               |
| --------------------- | -------------- | ----------------------------------- |
| `id`                  | Integer / UUID | Primary key                         |
| `name`                | String         | Product name                        |
| `sku`                 | String         | Unique product code                 |
| `description`         | Text           | Optional product description        |
| `category_id`         | Integer / UUID | Foreign key to `product_categories` |
| `supplier_id`         | Integer / UUID | Foreign key to `suppliers`          |
| `purchase_price`      | Decimal        | Product buying price                |
| `selling_price`       | Decimal        | Product selling price               |
| `current_stock`       | Integer        | Current available stock             |
| `low_stock_threshold` | Integer        | Minimum stock alert quantity        |
| `is_active`           | Boolean        | Active/inactive status              |
| `created_at`          | DateTime       | Record creation time                |
| `updated_at`          | DateTime       | Last update time                    |

Relationships:

- One product belongs to one product category.
- One product can belong to one supplier.
- One product can have many stock movements.

Business rules:

- `sku` should be unique.
- `current_stock` should not be negative.
- A product is considered low stock when `current_stock <= low_stock_threshold`.
- Product deletion should preferably be handled by soft delete or inactive status.

---

## 9. Stock Movements Table

Table name: `stock_movements`

Purpose:

Stores every stock change for audit and history.

| Field            | Type           | Notes                                    |
| ---------------- | -------------- | ---------------------------------------- |
| `id`             | Integer / UUID | Primary key                              |
| `product_id`     | Integer / UUID | Foreign key to `products`                |
| `movement_type`  | String         | `stock_in`, `stock_out`, or `adjustment` |
| `quantity`       | Integer        | Quantity changed                         |
| `previous_stock` | Integer        | Stock before movement                    |
| `new_stock`      | Integer        | Stock after movement                     |
| `reason`         | Text           | Reason for stock movement                |
| `created_by_id`  | Integer / UUID | Foreign key to `users`                   |
| `created_at`     | DateTime       | Movement time                            |

Movement types:

| Type         | Meaning                             |
| ------------ | ----------------------------------- |
| `stock_in`   | Product quantity increased          |
| `stock_out`  | Product quantity decreased          |
| `adjustment` | Product quantity manually corrected |

Business rules:

- Stock in increases product `current_stock`.
- Stock out decreases product `current_stock`.
- Stock adjustment updates stock with a reason.
- Stock cannot go below zero.
- Every stock change must create a stock movement record.

---

## 10. Financial Transactions Table

Table name: `financial_transactions`

Purpose:

Stores income and expense records for business tracking.

| Field              | Type           | Notes                                                    |
| ------------------ | -------------- | -------------------------------------------------------- |
| `id`               | Integer / UUID | Primary key                                              |
| `transaction_type` | String         | `income` or `expense`                                    |
| `amount`           | Decimal        | Transaction amount                                       |
| `category_id`      | Integer / UUID | Foreign key to `expense_categories`, mainly for expenses |
| `description`      | Text           | Transaction description                                  |
| `transaction_date` | Date           | Date of transaction                                      |
| `payment_method`   | String         | Optional: cash, bank, card, mobile banking, other        |
| `created_by_id`    | Integer / UUID | Foreign key to `users`                                   |
| `created_at`       | DateTime       | Record creation time                                     |
| `updated_at`       | DateTime       | Last update time                                         |

Transaction types:

| Type      | Meaning                                                                  |
| --------- | ------------------------------------------------------------------------ |
| `income`  | Business income, sales income, or other income                           |
| `expense` | Business expense such as rent, salary, purchase, utility, delivery, etc. |

Business rules:

- `amount` must be greater than zero.
- Monthly profit can be estimated as total income minus total expense.
- Expense category is required for expense transactions.
- Date filters should be supported for reports.

---

## 11. Activity Logs Table

Table name: `activity_logs`

Purpose:

Stores important user actions for audit trail.

| Field         | Type           | Notes                                      |
| ------------- | -------------- | ------------------------------------------ |
| `id`          | Integer / UUID | Primary key                                |
| `user_id`     | Integer / UUID | Foreign key to `users`                     |
| `action`      | String         | Action name                                |
| `entity_type` | String         | Example: product, supplier, stock, finance |
| `entity_id`   | Integer / UUID | Related record ID                          |
| `description` | Text           | Human-readable action description          |
| `created_at`  | DateTime       | Action time                                |

Example logs:

| Action             | Description                      |
| ------------------ | -------------------------------- |
| `product_created`  | Admin created product HP Mouse   |
| `stock_updated`    | Staff added 20 units to Keyboard |
| `expense_created`  | Manager added rent expense       |
| `supplier_updated` | Admin updated supplier contact   |

Notes:

- Activity log is part of the professional polish phase.
- It may be added after the core modules are working.

---

## 12. Planned Relationships

Main relationships:

| Relationship                               | Type        |
| ------------------------------------------ | ----------- |
| User to Stock Movements                    | One-to-many |
| User to Financial Transactions             | One-to-many |
| User to Activity Logs                      | One-to-many |
| Product Category to Products               | One-to-many |
| Supplier to Products                       | One-to-many |
| Product to Stock Movements                 | One-to-many |
| Expense Category to Financial Transactions | One-to-many |

Simple relationship summary:

- A user can create many stock movements.
- A user can create many income/expense records.
- A product category can contain many products.
- A supplier can provide many products.
- A product can have many stock movement records.
- An expense category can be used in many expense records.

---

## 13. Dashboard Data Sources

Dashboard cards will use data from these tables:

| Dashboard Item         | Source Table             |
| ---------------------- | ------------------------ |
| Total products         | `products`               |
| Total suppliers        | `suppliers`              |
| Total stock value      | `products`               |
| Low-stock products     | `products`               |
| Monthly income         | `financial_transactions` |
| Monthly expense        | `financial_transactions` |
| Estimated profit       | `financial_transactions` |
| Recent stock movements | `stock_movements`        |

---

## 14. Report Data Sources

Reports will use data from these tables:

| Report                | Source Table                                            |
| --------------------- | ------------------------------------------------------- |
| Product report        | `products`, `product_categories`, `suppliers`           |
| Stock movement report | `stock_movements`, `products`, `users`                  |
| Low-stock report      | `products`, `product_categories`, `suppliers`           |
| Income/expense report | `financial_transactions`, `expense_categories`, `users` |

---

## 15. Soft Delete Strategy

For beginner-friendly development, the first version may use `is_active` to hide inactive records.

Later, soft delete can be improved using:

| Field           | Purpose                       |
| --------------- | ----------------------------- |
| `is_deleted`    | Marks a record as deleted     |
| `deleted_at`    | Stores deletion time          |
| `deleted_by_id` | Stores who deleted the record |

Important records such as products, suppliers, and financial transactions should not be permanently deleted in a real system without careful handling.

---

## 16. Initial MVP Tables

For the first working MVP, the required tables are:

1. `users`
2. `product_categories`
3. `suppliers`
4. `products`
5. `stock_movements`

After the inventory MVP works, add:

6. `expense_categories`
7. `financial_transactions`

After the core system works, add:

8. `activity_logs`

This keeps the development beginner-friendly and phase-wise.

---

## 17. Future Database Improvements

Possible future improvements:

- Separate `roles` and `permissions` tables
- Budget tracking table
- Notifications table
- Product images table
- Customer table
- Sales order table
- Purchase order table
- Invoice table
- Barcode field for products
- Multi-branch inventory support

These are intentionally not included in the first version.

---

## 18. Locked Database Baseline

The locked baseline database design includes:

- Users
- Product categories
- Expense categories
- Suppliers
- Products
- Stock movements
- Financial transactions
- Activity logs

The first implementation should start with the MVP tables and add more tables phase by phase.
