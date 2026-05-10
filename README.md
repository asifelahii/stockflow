# StockFlow

## Inventory and Business Expense Management System

StockFlow is a beginner-friendly but professional-grade full-stack web application for small businesses. The goal of the project is to help business owners and staff manage products, suppliers, stock movement, income, expenses, low-stock alerts, and basic reports from one secure dashboard.

This project is being built as a real-world portfolio project using Angular, FastAPI, and PostgreSQL with proper documentation, clean project structure, meaningful Git commits, and phase-wise development.

---

## Project Status

Current status: **Planning and initial project setup**

The project documentation and development roadmap are being prepared first. Backend and frontend implementation will be added phase by phase.

---

## Real-World Problem

Many small businesses still manage inventory and expenses using notebooks, spreadsheets, or disconnected tools. This can create problems such as:

- Stock mismatch
- Missing stock movement history
- Late low-stock detection
- Poor supplier tracking
- Unclear income and expense records
- No quick monthly business summary
- Weak access control for staff
- Limited reporting for decision-making

StockFlow aims to solve these issues with a simple, organized, and secure inventory and business management system.

---

## Planned Key Features

### Inventory Management

- Product management
- Product category management
- Supplier management
- Stock in
- Stock out
- Stock adjustment
- Stock movement history
- Low-stock alert

### Business Finance

- Income tracking
- Expense tracking
- Expense category management
- Monthly income/expense summary
- Estimated profit calculation

### Dashboard and Reports

- Dashboard summary cards
- Stock value summary
- Low-stock summary
- Income vs expense summary
- Product reports
- Stock movement reports
- Finance reports
- CSV export

### Security and Professional Features

- User registration and login
- JWT authentication
- Role-based access control
- Protected API routes
- Activity log/audit trail
- Soft delete for important records
- Pagination and filtering
- Human verification for sensitive public forms using CAPTCHA/Cloudflare Turnstile

---

## Tech Stack

| Layer            | Technology            |
| ---------------- | --------------------- |
| Frontend         | Angular + TypeScript  |
| UI Library       | Angular Material      |
| Backend          | FastAPI               |
| Backend Language | Python                |
| Database         | PostgreSQL            |
| ORM              | SQLAlchemy            |
| Migration        | Alembic               |
| Validation       | Pydantic              |
| Authentication   | JWT                   |
| API Testing      | Swagger UI + Postman  |
| Charts           | Chart.js / ng2-charts |
| Version Control  | Git + GitHub          |

---

## Planned Project Structure

```txt
stockflow/
├── backend/
├── frontend/
├── docs/
├── postman/
├── screenshots/
├── database/
├── README.md
├── .gitignore
└── LICENSE
```

---

## Development Roadmap

| Phase    | Name                             | Goal                                                                     |
| -------- | -------------------------------- | ------------------------------------------------------------------------ |
| Phase 1  | Backend Foundation               | Set up FastAPI, PostgreSQL, SQLAlchemy, Alembic, and backend structure   |
| Phase 2  | Authentication                   | Add registration, login, password hashing, JWT, and protected routes     |
| Phase 3  | Product Management               | Add product CRUD, search, filter, and low-stock logic                    |
| Phase 4  | Category and Supplier Management | Add product categories, expense categories, suppliers, and relationships |
| Phase 5  | Stock Management                 | Add stock in/out, adjustment, movement history, and low-stock alert      |
| Phase 6  | Income and Expense Management    | Add income, expenses, filters, and monthly summary                       |
| Phase 7  | Dashboard and Reports            | Add dashboard summaries, reports, charts, and CSV export                 |
| Phase 8  | Security and Polish              | Add RBAC, activity logs, pagination, validation, and human verification  |
| Phase 9  | Documentation                    | Complete GitHub, API, setup, and database documentation                  |
| Phase 10 | Deployment                       | Deploy frontend, backend, database, and update portfolio                 |

---

## Documentation

Detailed planning documents are available in the `docs/` folder:

```txt
docs/
├── 00-project-overview.md
├── 01-tech-stack.md
├── 02-database-design.md
├── 03-api-endpoints.md
├── 04-phase-plan.md
├── 05-testing-checklist.md
├── 06-git-commit-guide.md
└── 07-deployment-guide.md
```

---

## Local Setup

Local setup instructions will be added after the backend and frontend foundations are created.

Planned setup sections:

- Backend setup
- Frontend setup
- PostgreSQL setup
- Environment variable setup
- Alembic migration setup
- API testing with Swagger/Postman

---

## API Documentation

API documentation will be available through FastAPI Swagger UI after backend implementation.

Planned local API docs:

```txt
http://localhost:8000/docs
```

---

## Screenshots

Screenshots will be added after the frontend is implemented.

Planned screenshots:

- Login page
- Dashboard
- Product management
- Stock movement
- Income/expense management
- Reports

---

## Deployment

Deployment will be completed in the final phase.

Planned deployment options:

| Part     | Possible Platform          |
| -------- | -------------------------- |
| Frontend | Vercel / Netlify           |
| Backend  | Render / Railway           |
| Database | Neon / Supabase PostgreSQL |

Live demo link will be added after deployment.

---

## Learning Goals

This project is designed to practice:

- Full-stack project planning
- Angular frontend development
- FastAPI backend development
- PostgreSQL relational database design
- API development and testing
- Authentication and authorization
- Clean Git workflow
- Professional documentation
- Deployment-ready project structure

---

## Author

Asif Elahi

This project is part of my professional portfolio development journey.
