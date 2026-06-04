# StockFlow Phase Plan

## 1. Purpose

This document defines the step-by-step development plan for StockFlow.

StockFlow is built using a phase-wise professional workflow. Each phase should be planned, implemented, tested, documented, and committed before moving to the next phase.

The current project status is:

```txt
Backend completed and manually tested.
Angular frontend initialized and build verified.
Frontend layout and authentication UI is the next active phase.
```

---

## 2. Development Strategy

StockFlow follows a backend-first and frontend-after-backend approach.

General strategy:

1. Build the backend API.
2. Test the backend API using Swagger/Postman.
3. Document completed backend behavior.
4. Build the Angular frontend layout and screens.
5. Connect Angular frontend with backend APIs.
6. Test full user flows.
7. Update documentation.
8. Commit using meaningful Git messages.

This approach keeps the project practical and reduces frontend guesswork because the API structure is already known before UI integration starts.

---

## 3. Current Project Status

| Area                          | Status      |
| ----------------------------- | ----------- |
| Backend foundation            | Completed   |
| Authentication APIs           | Completed   |
| Product APIs                  | Completed   |
| Product category APIs         | Completed   |
| Expense category APIs         | Completed   |
| Supplier APIs                 | Completed   |
| Stock management APIs         | Completed   |
| Finance APIs                  | Completed   |
| Dashboard summary API         | Completed   |
| Recent activity API           | Completed   |
| Backend cleanup               | Completed   |
| Backend API testing checklist | Completed   |
| Angular frontend setup        | Completed   |
| Angular build                 | Passed      |
| Frontend layout/auth UI       | In progress |
| Frontend feature screens      | Pending     |
| Frontend-backend integration  | Pending     |
| Final testing and deployment  | Pending     |

---

## 4. Updated Project Phases Overview

| Phase    | Name                                  | Status      | Main Goal                                                                        |
| -------- | ------------------------------------- | ----------- | -------------------------------------------------------------------------------- |
| Phase 1  | Backend Foundation                    | Completed   | Set up FastAPI backend, PostgreSQL, SQLAlchemy, Alembic, and base structure      |
| Phase 2  | Authentication                        | Completed   | Add registration, login, password hashing, JWT, and protected routes             |
| Phase 3  | Product Management APIs               | Completed   | Add product CRUD, search, low-stock logic, and validation                        |
| Phase 4  | Category and Supplier APIs            | Completed   | Add product categories, expense categories, suppliers, and product relationships |
| Phase 5  | Stock Management APIs                 | Completed   | Add stock in, stock out, adjustment, movement history, and stock validation      |
| Phase 6  | Income and Expense APIs               | Completed   | Add income, expenses, transaction filtering, and financial summary               |
| Phase 7  | Dashboard and Recent Activity APIs    | Completed   | Add dashboard summary and recent stock/finance activity APIs                     |
| Phase 8  | Backend Cleanup and Testing           | Completed   | Clean backend code, disable debug noise, update docs, and complete API checklist |
| Phase 9  | Angular Frontend Setup                | Completed   | Initialize Angular frontend, routing, SCSS, and verify build                     |
| Phase 10 | Frontend Layout and Authentication UI | In Progress | Build app shell, auth pages, sidebar, topbar, routing, and guard structure       |
| Phase 11 | Frontend Feature Screens              | Pending     | Build product, supplier, stock, finance, dashboard, and report screens           |
| Phase 12 | Frontend-Backend Integration          | Pending     | Connect Angular services, forms, tables, and dashboard with FastAPI APIs         |
| Phase 13 | Final Testing and Documentation       | Pending     | Test full app flow, update docs, add screenshots, and polish GitHub README       |
| Phase 14 | Deployment and Portfolio Update       | Pending     | Deploy frontend, backend, database, and prepare portfolio showcase               |

---

## 5. Phase 1: Backend Foundation

### Status

Completed.

### Goal

Set up the backend foundation using FastAPI, PostgreSQL, SQLAlchemy, Alembic, and environment variables.

### Completed Work

- Created backend folder structure
- Set up FastAPI app
- Added health check endpoint
- Added environment variable support
- Connected PostgreSQL database
- Added SQLAlchemy base/session setup
- Initialized Alembic migrations
- Added backend README foundation

### Expected Output

Completed backend foundation with working local API server.

### Commit Type

```txt
chore: set up FastAPI backend foundation
```

---

## 6. Phase 2: Authentication

### Status

Completed.

### Goal

Implement secure user authentication.

### Completed Work

- Created User model
- Created user schemas
- Added password hashing
- Added user registration API
- Added login API
- Added JWT access token generation
- Added current user endpoint
- Added protected route dependency
- Tested authentication using Swagger/Postman

### Expected Output

Users can register, login, receive JWT token, and access protected routes.

### Commit Type

```txt
feat: add user authentication with JWT
```

---

## 7. Phase 3: Product Management APIs

### Status

Completed.

### Goal

Create the main product management backend module.

### Completed Work

- Created Product model
- Created product schemas
- Added product CRUD APIs
- Added product search by name/SKU
- Added low-stock endpoint
- Added validation for SKU, price, stock, and threshold
- Added soft delete behavior
- Tested product APIs

### Expected Output

Products can be created, listed, searched, updated, soft deleted, and filtered for low-stock status.

### Commit Type

```txt
feat: add product management APIs
```

---

## 8. Phase 4: Category and Supplier APIs

### Status

Completed.

### Goal

Add category and supplier modules to support product organization.

### Completed Work

- Created product category model and APIs
- Created expense category model and APIs
- Created supplier model and APIs
- Added product relationship with category and supplier
- Added validation for duplicate categories
- Added supplier search
- Added soft delete behavior
- Tested category and supplier APIs

### Expected Output

Users can manage product categories, expense categories, and suppliers. Products can optionally reference categories and suppliers.

### Commit Type

```txt
feat: add category and supplier APIs
```

---

## 9. Phase 5: Stock Management APIs

### Status

Completed.

### Goal

Build the core inventory stock movement system.

### Completed Work

- Created StockMovement model
- Added stock-in API
- Added stock-out API
- Added stock-adjustment API
- Added stock movement history API
- Updated product stock automatically
- Prevented negative stock
- Stored previous stock and new stock
- Added movement type filtering
- Tested stock APIs

### Business Rules

- Stock in increases product stock.
- Stock out decreases product stock.
- Stock adjustment sets corrected product stock.
- Stock cannot go below zero.
- Every stock operation creates movement history.

### Expected Output

Users can manage stock changes with full movement history.

### Commit Type

```txt
feat: add stock movement management
```

---

## 10. Phase 6: Income and Expense APIs

### Status

Completed.

### Goal

Add business finance tracking features.

### Completed Work

- Created financial transaction model
- Added income creation API
- Added expense creation API
- Added transaction list API
- Added transaction details API
- Added transaction update API
- Added transaction delete API
- Added transaction type filtering
- Added financial summary API
- Tested finance APIs

### Expected Output

Users can record income, record expenses, manage transactions, and view financial summary.

### Commit Type

```txt
feat: add income and expense tracking
```

---

## 11. Phase 7: Dashboard and Recent Activity APIs

### Status

Completed.

### Goal

Add dashboard summary and recent activity APIs.

### Completed Work

- Added dashboard summary endpoint
- Added total product count
- Added low-stock product count
- Added active supplier count
- Added total income
- Added total expense
- Added net balance
- Added recent stock movement activity
- Added recent financial transaction activity
- Added limit query parameter for recent activity
- Tested dashboard APIs

### Expected Output

The frontend can display business summary cards and recent activity panels.

### Commit Type

```txt
feat: add dashboard summary and recent activity
```

---

## 12. Phase 8: Backend Cleanup and API Testing

### Status

Completed.

### Goal

Clean and verify the backend before starting frontend development.

### Completed Work

- Updated backend README
- Added backend API test checklist
- Removed old debug/commented code
- Disabled verbose SQLAlchemy query logging
- Strengthened JWT secret key example
- Verified Alembic revision status
- Verified backend API checklist
- Confirmed Git working tree clean before frontend work

### Expected Output

Backend is stable, documented, manually tested, and ready for frontend integration.

### Commit Type

```txt
docs: add backend API test checklist
chore: clean backend debug and commented code
```

---

## 13. Phase 9: Angular Frontend Setup

### Status

Completed.

### Goal

Initialize the Angular frontend project.

### Completed Work

- Created Angular frontend inside `frontend/`
- Enabled routing
- Enabled SCSS
- Disabled SSR/SSG
- Confirmed generated standalone-style structure
- Verified `npm run build`
- Committed Angular setup

### Expected Output

Angular frontend project exists and builds successfully.

### Commit Type

```txt
chore: initialize Angular frontend
```

---

## 14. Phase 10: Frontend Layout and Authentication UI

### Status

In progress.

### Goal

Create the base Angular frontend layout and authentication UI.

### Main Tasks

- Create frontend folder architecture
- Add global SCSS structure
- Add custom theme variables
- Create auth layout
- Create login page
- Create register page
- Create dashboard layout
- Create sidebar
- Create topbar
- Configure app routes
- Add auth service structure
- Add auth guard structure
- Add placeholder protected pages
- Verify Angular build

### Expected Output

The frontend should have a professional layout foundation with working auth pages and protected route structure.

### Commit Example

```txt
feat: add frontend layout and authentication UI
```

---

## 15. Phase 11: Frontend Feature Screens

### Status

Pending.

### Goal

Build the main business screens using static or mock UI first.

### Main Screens

- Dashboard
- Products
- Product Categories
- Suppliers
- Stock Movements
- Stock In
- Stock Out
- Stock Adjustment
- Income
- Expenses
- Expense Categories
- Reports or Summary

### Main Tasks

- Build page headers
- Build tables
- Build forms
- Build dashboard cards
- Build empty states
- Build loading placeholders
- Build consistent button and badge styles
- Keep UI clean and business-focused

### Expected Output

All main screens exist visually before deep API integration.

### Commit Example

```txt
feat: add frontend feature screens
```

---

## 16. Phase 12: Frontend-Backend Integration

### Status

Pending.

### Goal

Connect Angular frontend with the completed FastAPI backend.

### Main Tasks

- Add frontend environment API base URL
- Connect login API
- Connect register API
- Store JWT token
- Add auth interceptor
- Add logout flow
- Connect dashboard APIs
- Connect product APIs
- Connect category APIs
- Connect supplier APIs
- Connect stock APIs
- Connect finance APIs
- Add loading states
- Add error states
- Add success messages
- Test full frontend-backend flows

### Expected Output

The Angular frontend should fully communicate with the FastAPI backend.

### Commit Example

```txt
feat: connect frontend to backend APIs
```

---

## 17. Phase 13: Final Testing and Documentation

### Status

Pending.

### Goal

Test the complete project and update documentation.

### Main Tasks

- Test backend still works
- Test Angular build
- Test login/register flow
- Test protected routes
- Test dashboard loading
- Test product CRUD from frontend
- Test supplier/category pages
- Test stock flows
- Test finance flows
- Test loading/error/empty states
- Capture screenshots
- Update root README
- Update frontend README
- Update docs
- Update testing checklist

### Expected Output

The app should be stable, documented, and ready for deployment preparation.

### Commit Example

```txt
docs: update frontend testing and project documentation
```

---

## 18. Phase 14: Deployment and Portfolio Update

### Status

Pending.

### Goal

Deploy the project and prepare it for public showcase.

### Main Tasks

- Select deployment platforms
- Deploy PostgreSQL database
- Deploy FastAPI backend
- Deploy Angular frontend
- Configure environment variables
- Configure backend CORS
- Run production database migrations
- Test live API
- Test live frontend
- Add live demo link to README
- Add screenshots
- Prepare portfolio description
- Prepare GitHub pinned repo description
- Prepare LinkedIn/GitHub post text

### Expected Output

StockFlow should be publicly accessible and portfolio-ready.

### Commit Example

```txt
chore: prepare project for deployment
```

---

## 19. Frontend Branch Workflow

Frontend work should be done branch-wise.

Recommended branches:

```txt
feature/frontend-layout-auth
feature/frontend-dashboard
feature/frontend-products
feature/frontend-stock
feature/frontend-finance
feature/frontend-api-integration
chore/frontend-docs-polish
```

Current active branch:

```txt
feature/frontend-layout-auth
```

Rules:

- Do not work directly on `master`.
- Keep each branch focused.
- Commit after a meaningful working milestone.
- Merge only after build/test passes.
- Keep Git history clean.

---

## 20. Definition of Done

A phase is complete only when:

- The feature works locally
- Backend APIs are tested if backend is involved
- Frontend UI is tested if frontend is involved
- Angular build passes if frontend is involved
- Documentation is updated if needed
- Git diff is reviewed
- A meaningful commit is made
- Git status is clean after commit

---

## 21. Current Locked Development Order

The locked order from this point is:

1. Update project documentation for frontend start
2. Build frontend layout and authentication UI
3. Build frontend feature screens
4. Connect frontend to backend APIs
5. Run full frontend-backend testing
6. Update README, screenshots, and documentation
7. Deploy the application
8. Prepare portfolio showcase material

Minor adjustments can happen during development, but the project should continue phase-wise and branch-wise.
