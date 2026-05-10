# StockFlow Tech Stack

## 1. Purpose of This Document

This document defines the planned technology stack for StockFlow.

StockFlow is a beginner-friendly but professional-grade full-stack project. The selected stack should be:

- Practical for real-world web development
- Beginner-achievable
- Suitable for clean API-based architecture
- Good for portfolio presentation
- Easy to document and deploy later

---

## 2. Final Selected Stack

| Layer               | Selected Technology   |
| ------------------- | --------------------- |
| Frontend            | Angular + TypeScript  |
| Frontend UI Library | Angular Material      |
| Backend             | FastAPI               |
| Backend Language    | Python                |
| Database            | PostgreSQL            |
| ORM                 | SQLAlchemy            |
| Database Migration  | Alembic               |
| Data Validation     | Pydantic              |
| Authentication      | JWT                   |
| Password Hashing    | bcrypt/passlib        |
| API Testing         | Swagger UI + Postman  |
| Charts              | Chart.js / ng2-charts |
| CSV Export          | Python CSV utilities  |
| Version Control     | Git + GitHub          |
| Deployment          | To be finalized later |

---

## 3. Frontend Stack

### Angular

Angular will be used for the frontend.

Reasons:

- Good for structured frontend development
- Uses TypeScript by default
- Suitable for dashboard-style business applications
- Encourages organized folder structure
- Good for forms, routing, services, guards, and reusable components

Angular will be used for:

- Login and registration pages
- Dashboard
- Product management UI
- Category management UI
- Supplier management UI
- Stock movement pages
- Income and expense pages
- Reports pages

---

### TypeScript

TypeScript will be used because Angular is TypeScript-based.

Reasons:

- Better code safety than plain JavaScript
- Helps catch mistakes early
- Useful for defining interfaces and models
- More professional for frontend development

---

### Angular Material

Angular Material will be used as the first UI library.

Reasons:

- Beginner-friendly
- Provides ready-made components
- Works well with Angular
- Useful for tables, forms, buttons, dialogs, cards, and navigation
- Helps create a clean dashboard faster

Planned Angular Material components:

- Button
- Card
- Table
- Form field
- Input
- Select
- Dialog
- Snackbar
- Toolbar
- Sidenav
- Date picker
- Pagination

---

## 4. Backend Stack

### FastAPI

FastAPI will be used for the backend API.

Reasons:

- Easier to learn for API development compared to larger frameworks
- Clean and readable Python code
- Built-in Swagger/OpenAPI documentation
- Good support for request validation
- Suitable for REST API projects
- Works well with PostgreSQL and SQLAlchemy

FastAPI will be used for:

- Authentication APIs
- Product APIs
- Category APIs
- Supplier APIs
- Stock movement APIs
- Income and expense APIs
- Dashboard summary APIs
- Report/export APIs

---

### Python

Python will be used as the backend programming language.

Reasons:

- Beginner-friendly syntax
- Strong ecosystem
- Works well with FastAPI
- Useful for future backend, automation, data, and AI-related learning

---

### Pydantic

Pydantic will be used for request and response validation.

Examples:

- Validate product creation request
- Validate login request
- Validate stock movement request
- Validate income/expense request
- Control API response structure

---

## 5. Database Stack

### PostgreSQL

PostgreSQL will be used as the main database.

Reasons:

- Strong relational database
- Suitable for business applications
- Good for learning real-world database relationships
- Works well with products, suppliers, categories, users, and transactions
- More professional than only using simple file storage or local arrays

PostgreSQL will store:

- Users
- Roles
- Products
- Categories
- Suppliers
- Stock movements
- Income and expense records
- Activity logs

---

### SQLAlchemy

SQLAlchemy will be used as the ORM.

Reasons:

- Connects Python code with PostgreSQL tables
- Helps define database models
- Avoids writing raw SQL for every operation
- Commonly used with FastAPI projects

---

### Alembic

Alembic will be used for database migrations.

Reasons:

- Tracks database structure changes
- Helps update the database safely
- Useful when adding new tables or columns
- Professional practice for backend projects

---

## 6. Authentication and Security Stack

### JWT Authentication

JWT will be used for login authentication.

Planned flow:

1. User logs in with email and password.
2. Backend verifies credentials.
3. Backend returns JWT access token.
4. Frontend stores the token.
5. Frontend sends token with protected API requests.
6. Backend verifies token before allowing access.

---

### Password Hashing

Passwords will not be stored as plain text.

The backend will use password hashing with bcrypt/passlib.

Reason:

- Protects user passwords
- Follows basic security practice
- Makes the authentication system more professional

---

### Route Protection

Protected routes will be implemented on both sides.

Backend:

- FastAPI dependencies will protect private API routes.

Frontend:

- Angular route guards will protect private pages.

---

### Human Verification

Cloudflare Turnstile or CAPTCHA may be added later for sensitive public forms.

Possible places:

- Registration
- Login after repeated failed attempts
- Forgot password
- Contact/support form

This will be added in the security/polish phase, not in the first MVP.

---

## 7. API Testing Tools

### Swagger UI

FastAPI automatically provides Swagger UI.

It will be used for:

- Testing API endpoints quickly
- Checking request/response formats
- Understanding API behavior during development

---

### Postman

Postman will be used for more organized API testing.

Planned use:

- Auth API collection
- Product API collection
- Stock API collection
- Finance API collection
- Report API collection

The final Postman collection will be exported and added to the `postman/` folder.

---

## 8. Reporting and Charts

### Dashboard Charts

Chart.js or ng2-charts will be used later for dashboard visualizations.

Planned charts:

- Income vs expense
- Expense by category
- Stock in vs stock out
- Top low-stock products

The chart library will be finalized during the dashboard phase.

---

### CSV Export

CSV export will be added for reports.

Planned exports:

- Product report
- Stock movement report
- Income/expense report
- Low-stock report

---

## 9. Deployment Plan

The deployment platform is not locked yet.

Possible options:

| Part     | Possible Platform                    |
| -------- | ------------------------------------ |
| Frontend | Vercel / Netlify                     |
| Backend  | Render / Railway / Fly.io            |
| Database | Neon / Supabase / Railway PostgreSQL |

Final deployment decisions will be made in Phase 10.

---

## 10. Tools for Development

Recommended development tools:

- VS Code
- Git
- GitHub
- Python
- Node.js
- Angular CLI
- PostgreSQL
- pgAdmin or DBeaver
- Postman

---

## 11. Beginner-Friendly Rule

The project will not start with too many advanced tools.

Not included in the first version:

- Docker
- Redis
- Celery
- Background jobs
- Microservices
- Kubernetes
- Online payment
- Barcode scanner

These may be considered later as future improvements.

---

## 12. Locked Stack Decision

The locked baseline stack is:

- Frontend: Angular + TypeScript
- UI: Angular Material
- Backend: FastAPI + Python
- Database: PostgreSQL
- ORM: SQLAlchemy
- Migration: Alembic
- Auth: JWT
- API testing: Swagger + Postman

Minor changes may happen during development, but the main stack should remain fixed.
'@ | Set-Content -Path docs\01-tech-stack.md -Encoding UTF8
