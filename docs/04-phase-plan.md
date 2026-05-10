# StockFlow Phase Plan

## 1. Purpose

This document defines the step-by-step development plan for StockFlow.

StockFlow will be built using a beginner-friendly but professional workflow. The project will follow a phase-wise approach so that each module is planned, built, tested, documented, and committed properly.

The main rule is:

> Build one phase at a time. Do not jump to advanced features before the core system works.

---

## 2. Development Strategy

StockFlow will follow a backend-first but module-by-module approach.

For each module:

1. Design the database model.
2. Build the FastAPI backend API.
3. Test the API using Swagger/Postman.
4. Build the Angular frontend page.
5. Connect the frontend with the backend.
6. Test the full flow.
7. Update documentation.
8. Make a meaningful Git commit.

Example:

```txt
Product API
↓
Product API testing
↓
Product Angular page
↓
Frontend-backend connection
↓
Documentation update
↓
Git commit
```

---

## 3. Project Phases Overview

| Phase    | Name                             | Main Goal                                                                          |
| -------- | -------------------------------- | ---------------------------------------------------------------------------------- |
| Phase 1  | Backend Foundation               | Set up FastAPI backend, PostgreSQL, SQLAlchemy, Alembic, and project structure     |
| Phase 2  | Authentication                   | Add registration, login, password hashing, JWT, and protected routes               |
| Phase 3  | Product Management               | Add product CRUD, search, filter, and product frontend                             |
| Phase 4  | Category and Supplier Management | Add product categories, expense categories, suppliers, and relationships           |
| Phase 5  | Stock Management                 | Add stock in, stock out, stock adjustment, history, and low-stock alert            |
| Phase 6  | Income and Expense Management    | Add business income, expenses, categories, date filters, and monthly summary       |
| Phase 7  | Dashboard and Reports            | Add dashboard cards, charts, reports, and CSV export                               |
| Phase 8  | Security and Professional Polish | Add RBAC, CAPTCHA/Turnstile, activity log, soft delete, validation, and pagination |
| Phase 9  | Documentation                    | Prepare complete GitHub, API, database, and setup documentation                    |
| Phase 10 | Deployment and Portfolio Update  | Deploy the app and prepare GitHub/portfolio showcase materials                     |

---

## 4. Phase 1: Backend Foundation

### Goal

Set up the backend foundation using FastAPI, PostgreSQL, SQLAlchemy, Alembic, and environment variables.

### Main Tasks

- Create FastAPI project structure
- Set up Python virtual environment
- Install required packages
- Create `main.py`
- Add health-check route
- Configure environment variables
- Connect PostgreSQL database
- Set up SQLAlchemy base/session
- Set up Alembic migration
- Test backend with Swagger

### Expected Output

- Running FastAPI server
- Working `/health` endpoint
- PostgreSQL connection configured
- Alembic initialized
- Clean backend folder structure

### Commit Example

```txt
chore: set up FastAPI backend foundation
```

---

## 5. Phase 2: Authentication

### Goal

Implement secure user authentication.

### Main Tasks

- Create User model
- Create user schemas
- Add password hashing
- Create register API
- Create login API
- Generate JWT access token
- Create current-user protected route
- Add backend authentication dependency
- Test auth flow using Swagger/Postman

### Expected Output

- User can register
- User can login
- Backend returns JWT token
- Protected route works only with token

### Commit Example

```txt
feat: add user authentication with JWT
```

---

## 6. Phase 3: Product Management

### Goal

Create the main product management module.

### Main Tasks

#### Backend

- Create Product model
- Create Product schemas
- Create product CRUD APIs
- Add product search
- Add product filter
- Add product soft delete if suitable

#### Frontend

- Create Angular product page
- Create product list table
- Create add product form
- Create edit product form
- Add delete confirmation
- Connect frontend with product APIs

### Expected Output

- User can add, view, update, and delete products
- Product list supports search/filter
- Product UI is connected with backend

### Commit Example

```txt
feat: add product management module
```

---

## 7. Phase 4: Category and Supplier Management

### Goal

Add category and supplier modules to support product organization.

### Main Tasks

#### Backend

- Create ProductCategory model
- Create ExpenseCategory model
- Create Supplier model
- Create category CRUD APIs
- Create supplier CRUD APIs
- Connect products with categories and suppliers

#### Frontend

- Create category management page
- Create supplier management page
- Add category dropdown in product form
- Add supplier dropdown in product form

### Expected Output

- User can manage product categories
- User can manage expense categories
- User can manage suppliers
- Products can be assigned to category and supplier

### Commit Example

```txt
feat: add category and supplier management
```

---

## 8. Phase 5: Stock Management

### Goal

Build the core inventory stock movement system.

### Main Tasks

#### Backend

- Create StockMovement model
- Add stock movement types:
  - Stock In
  - Stock Out
  - Adjustment
- Create stock-in API
- Create stock-out API
- Create stock-adjustment API
- Update product current stock automatically
- Prevent negative stock
- Create stock movement history API
- Create low-stock product API

#### Frontend

- Create stock movement form
- Create stock history page
- Show low-stock products
- Add low-stock card on dashboard

### Business Rules

- Stock In increases product stock.
- Stock Out decreases product stock.
- Adjustment changes stock with a reason.
- Stock cannot go below zero.
- Every stock change must be saved in history.

### Expected Output

- User can increase/decrease stock
- User can adjust stock with reason
- System stores stock movement history
- System shows low-stock products

### Commit Example

```txt
feat: add stock movement management
```

---

## 9. Phase 6: Income and Expense Management

### Goal

Add business finance tracking features.

### Main Tasks

#### Backend

- Create FinancialTransaction model
- Add transaction types:
  - Income
  - Expense
- Create income/expense CRUD APIs
- Add date filter
- Add category filter
- Add monthly summary API
- Add expense-by-category API

#### Frontend

- Create income/expense form
- Create transaction list page
- Add date filter
- Add category filter
- Show income, expense, and estimated profit

### Expected Output

- User can record income
- User can record expenses
- User can filter transactions
- System can show monthly financial summary

### Commit Example

```txt
feat: add income and expense tracking
```

---

## 10. Phase 7: Dashboard and Reports

### Goal

Make the system visually useful and portfolio-presentable.

### Main Tasks

#### Dashboard

- Total products card
- Total suppliers card
- Total stock value card
- Low-stock products card
- Monthly income card
- Monthly expense card
- Estimated profit card

#### Charts

- Income vs expense
- Expense by category
- Stock in vs stock out
- Top low-stock products

#### Reports

- Product report
- Stock movement report
- Income/expense report
- CSV export

### Expected Output

- User can view business summary from dashboard
- User can understand stock and finance trends
- User can export basic reports

### Commit Example

```txt
feat: add dashboard and report summaries
```

---

## 11. Phase 8: Security and Professional Polish

### Goal

Add real-world security and professional features.

### Main Tasks

- Add role-based access control
- Add roles:
  - Admin
  - Manager
  - Staff
- Add Cloudflare Turnstile or CAPTCHA for sensitive public forms
- Add activity log/audit trail
- Add soft delete for important records
- Add pagination
- Improve backend validation
- Improve error handling
- Add Angular route guards
- Add Angular HTTP interceptor

### Expected Output

- Different roles have different permissions
- Sensitive forms have bot protection
- Important user actions are logged
- Large lists support pagination
- App feels more professional and secure

### Commit Example

```txt
feat: add role-based access and security polish
```

---

## 12. Phase 9: Documentation

### Goal

Prepare complete project documentation for GitHub and portfolio.

### Main Tasks

- Update root README
- Add backend setup guide
- Add frontend setup guide
- Add environment variable guide
- Add API documentation
- Add database design documentation
- Add screenshots
- Add Postman collection
- Add testing checklist
- Add future improvements
- Add project explanation for portfolio

### Expected Output

- Project is understandable from GitHub
- Another developer can run the project locally
- Recruiter/interviewer can understand the project value

### Commit Example

```txt
docs: complete project documentation
```

---

## 13. Phase 10: Deployment and Portfolio Update

### Goal

Deploy the project and prepare it for public showcase.

### Main Tasks

- Deploy PostgreSQL database
- Deploy FastAPI backend
- Deploy Angular frontend
- Configure environment variables
- Test live API
- Test live frontend
- Add live demo link to README
- Add GitHub repository link
- Add portfolio project section
- Prepare LinkedIn/GitHub post text

### Expected Output

- Live deployed project
- Updated GitHub README
- Portfolio-ready project description
- Public showcase material

### Commit Example

```txt
chore: prepare project for deployment
```

---

## 14. Definition of Done

A phase is considered complete only when:

- The feature works
- The code is tested manually
- API endpoints are tested if backend is involved
- Frontend is tested if UI is involved
- Documentation is updated if needed
- Git status is clean
- A meaningful commit is made

---

## 15. Current Locked Development Order

The locked order is:

1. Backend Foundation
2. Authentication
3. Product Management
4. Category and Supplier Management
5. Stock Management
6. Income and Expense Management
7. Dashboard and Reports
8. Security and Professional Polish
9. Documentation
10. Deployment and Portfolio Update

Minor changes can happen during development, but the project should follow this sequence as much as possible.
