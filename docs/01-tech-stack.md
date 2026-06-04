# StockFlow Tech Stack

## 1. Purpose of This Document

This document defines the selected technology stack for StockFlow.

StockFlow is a professional full-stack business web application. The selected stack should be:

- Practical for real-world web development
- Suitable for clean API-based architecture
- Beginner-friendly but not toy-level
- Strong for portfolio and resume presentation
- Easy to test, document, and deploy

The backend stack is already implemented and tested. The Angular frontend has been initialized and is now entering layout and authentication UI development.

---

## 2. Final Selected Stack

| Layer                 | Selected Technology      |
| --------------------- | ------------------------ |
| Frontend              | Angular + TypeScript     |
| Frontend Architecture | Angular standalone style |
| Frontend Styling      | Custom SCSS              |
| Backend               | FastAPI                  |
| Backend Language      | Python                   |
| Database              | PostgreSQL               |
| ORM                   | SQLAlchemy               |
| Database Migration    | Alembic                  |
| Data Validation       | Pydantic                 |
| Authentication        | JWT                      |
| Password Hashing      | bcrypt/passlib           |
| API Testing           | Swagger UI + Postman     |
| Version Control       | Git + GitHub             |
| Deployment            | To be finalized later    |

Optional later additions:

| Area                | Possible Tool                        |
| ------------------- | ------------------------------------ |
| UI Components       | Angular Material, only if needed     |
| Charts              | Chart.js / ng2-charts                |
| Frontend Deployment | Vercel / Netlify                     |
| Backend Deployment  | Render / Railway                     |
| Database Hosting    | Neon / Supabase / Railway PostgreSQL |

---

## 3. Current Implementation Status

| Area                     | Status      |
| ------------------------ | ----------- |
| FastAPI backend          | Completed   |
| PostgreSQL integration   | Completed   |
| SQLAlchemy models        | Completed   |
| Alembic migrations       | Completed   |
| JWT authentication       | Completed   |
| Product APIs             | Completed   |
| Category APIs            | Completed   |
| Supplier APIs            | Completed   |
| Stock APIs               | Completed   |
| Finance APIs             | Completed   |
| Dashboard APIs           | Completed   |
| Backend API testing      | Completed   |
| Angular project setup    | Completed   |
| Angular production build | Passed      |
| Frontend layout/auth UI  | In progress |
| Frontend API integration | Pending     |
| Deployment               | Pending     |

---

## 4. Frontend Stack

### Angular

Angular is used for the frontend.

Reasons:

- Suitable for structured business dashboard applications
- Uses TypeScript by default
- Good support for routing, forms, services, guards, and interceptors
- Encourages modular folder organization
- Strong choice for professional frontend development

Angular will be used for:

- Login and registration pages
- Protected dashboard layout
- Sidebar and topbar navigation
- Dashboard summary page
- Product management UI
- Category management UI
- Supplier management UI
- Stock management pages
- Income and expense pages
- Reports or summary pages

---

### Angular Standalone Style

The frontend uses Angular standalone style.

The generated Angular project uses files such as:

```txt
app.ts
app.html
app.scss
app.routes.ts
app.config.ts
```

The frontend should continue using this style instead of older NgModule-heavy structure.

Reasons:

- Matches the generated Angular project structure
- Keeps the project modern
- Reduces boilerplate
- Makes routing and component setup cleaner

### TypeScript

TypeScript is used because Angular is TypeScript-based.

Reasons:

- Better code safety than plain JavaScript
- Helps catch mistakes early
- Useful for defining interfaces and API response models
- Professional standard for Angular applications

### Custom SCSS

Custom SCSS is the selected styling approach for the first version.

Reasons:

- Gives full control over the UI
- Helps create a unique portfolio-friendly design
- Avoids a generic prebuilt look
- Keeps the frontend lightweight
- Shows frontend design and layout skill
- Works well for a business dashboard UI

The UI direction is:

- Smart
- Modern
- Simple
- Elegant
- Business-focused
- User-friendly
- Not too fancy
- Not boring

### Angular Material

Angular Material is not selected for the first frontend version.

It may be added later only if needed for selected components such as:

- Date picker
- Dialog/modal
- Snackbar/toast
- Pagination
- Advanced table behavior

Reason:

The first frontend version should use custom SCSS to make the project look more custom, professional, and portfolio-worthy.

---

## 5. Frontend UI Theme Direction

The frontend will follow a modern SaaS-style dashboard design.

Theme direction:

| Purpose                               | Color Direction |
| ------------------------------------- | --------------- |
| Primary actions                       | Blue            |
| Success / stock in / income           | Green           |
| Danger / stock out / expense / delete | Red             |
| Warning / low stock                   | Amber           |
| Sidebar                               | Dark slate      |
| Page background                       | Light slate     |
| Cards                                 | White           |
| Text                                  | Dark gray/slate |

Suggested SCSS tokens:

```scss
$primary: #2563eb;
$primary-dark: #1e40af;

$success: #16a34a;
$danger: #dc2626;
$warning: #f59e0b;
$info: #0891b2;

$bg-main: #f8fafc;
$bg-sidebar: #0f172a;
$bg-card: #ffffff;

$text-main: #111827;
$text-muted: #6b7280;
$text-light: #f8fafc;

$border: #e5e7eb;
$hover: #f1f5f9;
```

---

## 6. Frontend Architecture Plan

The planned frontend structure is:

```txt
frontend/src/app/
â”œâ”€â”€ core/
â”‚   â”œâ”€â”€ guards/
â”‚   â”œâ”€â”€ interceptors/
â”‚   â”œâ”€â”€ models/
â”‚   â””â”€â”€ services/
â”œâ”€â”€ layout/
â”‚   â”œâ”€â”€ auth-layout/
â”‚   â””â”€â”€ dashboard-layout/
â”œâ”€â”€ shared/
â”‚   â”œâ”€â”€ components/
â”‚   â””â”€â”€ utils/
â”œâ”€â”€ features/
â”‚   â”œâ”€â”€ auth/
â”‚   â”œâ”€â”€ dashboard/
â”‚   â”œâ”€â”€ products/
â”‚   â”œâ”€â”€ product-categories/
â”‚   â”œâ”€â”€ suppliers/
â”‚   â”œâ”€â”€ stock/
â”‚   â”œâ”€â”€ finance/
â”‚   â””â”€â”€ reports/
â””â”€â”€ styles/
```

The frontend should follow this communication pattern:

```txt
Component
â†“
Feature Service
â†“
Api Service / HttpClient
â†“
FastAPI Backend
```

---

## 7. Backend Stack

### FastAPI

FastAPI is used for the backend API.

Reasons:

- Clean and readable Python API development
- Built-in Swagger/OpenAPI documentation
- Strong request validation support
- Works well with PostgreSQL and SQLAlchemy
- Suitable for REST API projects

FastAPI is used for:

- Authentication APIs
- Product APIs
- Category APIs
- Supplier APIs
- Stock movement APIs
- Income and expense APIs
- Dashboard summary APIs
- Recent activity APIs

### Python

Python is used as the backend programming language.

Reasons:

- Clean syntax
- Strong backend ecosystem
- Works well with FastAPI
- Good for future automation, data, and AI-related extensions

### Pydantic

Pydantic is used for request and response validation.

Examples:

- Validate product creation request
- Validate login request
- Validate stock movement request
- Validate income/expense request
- Control API response structure

---

## 8. Database Stack

### PostgreSQL

PostgreSQL is used as the main database.

Reasons:

- Strong relational database
- Suitable for business applications
- Good for real-world relationships
- Works well with products, suppliers, categories, users, and transactions
- More professional than simple file storage or local arrays

PostgreSQL stores:

- Users
- Products
- Product categories
- Expense categories
- Suppliers
- Stock movements
- Financial transactions

### SQLAlchemy

SQLAlchemy is used as the ORM.

Reasons:

- Connects Python code with PostgreSQL tables
- Helps define database models
- Reduces repetitive raw SQL
- Commonly used with FastAPI projects

### Alembic

Alembic is used for database migrations.

Reasons:

- Tracks database structure changes
- Helps update the database safely
- Useful when adding new tables or columns
- Professional practice for backend projects

---

## 9. Authentication and Security Stack

### JWT Authentication

JWT is used for login authentication.

Flow:

1. User logs in with email and password.
2. Backend verifies credentials.
3. Backend returns JWT access token.
4. Frontend stores the token.
5. Frontend sends token with protected API requests.
6. Backend verifies token before allowing access.

### Password Hashing

Passwords are not stored as plain text.

The backend uses bcrypt/passlib for password hashing.

Reasons:

- Protects user passwords
- Follows basic security practice
- Makes the authentication system more professional

### Route Protection

Protected routes are planned on both sides.

Backend:

- FastAPI dependencies protect private API routes.

Frontend:

- Angular route guards will protect private pages.
- Unauthorized users will be redirected to the login page.

### Human Verification

Cloudflare Turnstile or CAPTCHA may be added later for sensitive public forms.

Possible places:

- Registration
- Login after repeated failed attempts
- Forgot password
- Contact/support form

This is a future improvement, not part of the first frontend version.

---

## 10. API Testing Tools

### Swagger UI

FastAPI provides Swagger UI automatically.

It is used for:

- Testing API endpoints quickly
- Checking request and response formats
- Understanding API behavior during development

### Postman

Postman is used for organized API testing.

Current usage:

- Authentication API testing
- Product API testing
- Category API testing
- Supplier API testing
- Stock API testing
- Finance API testing
- Dashboard API testing

The backend API testing checklist has been completed.

---

## 11. Reporting and Charts

Charts are optional for the first frontend version.

Possible future dashboard charts:

- Income vs expense
- Expense by category
- Stock in vs stock out
- Top low-stock products

Chart.js or ng2-charts may be added later if charts become part of the frontend dashboard.

---

## 12. CSV Export

CSV export is planned for future report features.

Possible exports:

- Product report
- Stock movement report
- Income/expense report
- Low-stock report

The first Angular frontend version should focus on core layout, forms, tables, and API integration before advanced export UI.

---

## 13. Deployment Plan

The deployment platform is not locked yet.

Possible options:

| Part     | Possible Platform                    |
| -------- | ------------------------------------ |
| Frontend | Vercel / Netlify                     |
| Backend  | Render / Railway / Fly.io            |
| Database | Neon / Supabase / Railway PostgreSQL |

Final deployment decisions will be made after the frontend is completed and tested.

---

## 14. Tools for Development

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
- Browser DevTools

---

## 15. Beginner-Friendly Rule

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
- Advanced analytics
- Complex role-permission system

These may be considered later as future improvements.

---

## 16. Locked Stack Decision

The locked baseline stack is:

- Frontend: Angular + TypeScript
- Frontend style: Custom SCSS
- Frontend architecture: Angular standalone style
- Backend: FastAPI + Python
- Database: PostgreSQL
- ORM: SQLAlchemy
- Migration: Alembic
- Auth: JWT
- API testing: Swagger UI + Postman
- Version control: Git + GitHub

Angular Material is not part of the initial frontend implementation. It is optional later only if selected components are needed.

Minor changes may happen during development, but the main stack should remain fixed.
