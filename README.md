# StockFlow

## Inventory and Business Expense Management System

StockFlow is a beginner-friendly but professional-grade full-stack web application for small businesses. The goal of the project is to help business owners and staff manage products, suppliers, stock movements, income, expenses, low-stock alerts, and dashboard summaries from one secure web application.

This project is being built as a real-world portfolio project using Angular, FastAPI, and PostgreSQL with clean project structure, phase-wise development, meaningful Git commits, API documentation, and manual testing evidence.

---

## Project Status

Current status: **Backend completed and Angular frontend initialized**

Completed backend modules:

- Backend foundation
- Authentication with JWT
- Product management
- Product category management
- Expense category management
- Supplier management
- Stock in, stock out, and stock adjustment
- Stock movement history
- Income and expense management
- Financial summary
- Dashboard summary and recent activity APIs
- Backend cleanup, validation, and API test checklist

Current frontend status:

- Angular project initialized
- Routing enabled
- SCSS enabled
- Production build verified

Next development focus:

- Frontend layout and routing
- Login page
- Dashboard UI
- Product, supplier, stock, and finance screens
- Frontend-backend API integration

---

## Real-World Problem

Many small businesses still manage inventory and expenses using notebooks, spreadsheets, or disconnected tools. This can create problems such as:

- Stock mismatch
- Missing stock movement history
- Late low-stock detection
- Poor supplier tracking
- Unclear income and expense records
- No quick business summary
- Weak access control for staff
- Limited reporting for decision-making

StockFlow aims to solve these issues with a simple, organized, and secure inventory and business management system.

---

## Implemented Backend Features

### Authentication

- User registration
- Duplicate email protection
- User login
- JWT access token generation
- Protected API routes
- Current logged-in user endpoint

### Product Management

- Create, list, view, update, and soft-delete products
- Unique SKU validation
- Product search by name or SKU
- Low-stock product filtering
- Product relation with category and supplier

### Category and Supplier Management

- Product category CRUD
- Expense category CRUD
- Supplier CRUD
- Duplicate category protection
- Supplier search
- Soft delete for categories and suppliers

### Stock Management

- Stock-in operation
- Stock-out operation
- Insufficient stock protection
- Manual stock adjustment
- Stock movement history
- Stock movement filtering by product and movement type

### Finance Management

- Income transaction creation
- Expense transaction creation
- Expense category validation
- Transaction listing
- Transaction filtering by income or expense
- Transaction view, update, and delete
- Financial summary with total income, total expense, and net balance

### Dashboard and Reports

- Dashboard summary metrics
- Total active products
- Low-stock product count
- Active supplier count
- Total income
- Total expense
- Net balance
- Recent stock movements
- Recent financial transactions

### Backend Cleanup and Quality

- Alembic migration history maintained
- API test checklist added
- JWT secret key warning fixed
- SQLAlchemy verbose query logs disabled
- Old commented/debug code removed
- Compile checks passed
- Git working tree kept clean after each phase

---

## Planned Frontend Features

### Core UI

- Login screen
- Main dashboard layout
- Sidebar navigation
- Protected frontend routes
- Reusable form and table components

### Inventory Screens

- Product list
- Product create/edit form
- Low-stock product view
- Product category management
- Supplier management

### Stock Screens

- Stock-in form
- Stock-out form
- Stock adjustment form
- Stock movement history table

### Finance Screens

- Income entry form
- Expense entry form
- Transaction list
- Financial summary cards

### Dashboard Screens

- Product and stock summary cards
- Finance summary cards
- Recent stock movement panel
- Recent financial transaction panel

---

## Tech Stack

| Layer            | Technology           |
| ---------------- | -------------------- |
| Frontend         | Angular + TypeScript |
| Styling          | SCSS                 |
| Backend          | FastAPI              |
| Backend Language | Python               |
| Database         | PostgreSQL           |
| ORM              | SQLAlchemy           |
| Migration        | Alembic              |
| Validation       | Pydantic             |
| Authentication   | JWT                  |
| API Testing      | Swagger UI           |
| Version Control  | Git                  |

Planned or optional additions:

| Area                   | Possible Technology                        |
| ---------------------- | ------------------------------------------ |
| UI Components          | Angular Material                           |
| Charts                 | Chart.js / ng2-charts                      |
| API Testing Collection | Postman                                    |
| Deployment             | Vercel / Netlify / Render / Railway / Neon |

---

## Project Structure

```txt
stockflow/
├── backend/
│   ├── app/
│   ├── alembic/
│   ├── API_TEST_CHECKLIST.md
│   ├── README.md
│   ├── requirements.txt
│   └── alembic.ini
├── frontend/
│   ├── src/
│   ├── public/
│   ├── angular.json
│   ├── package.json
│   └── README.md
├── database/
├── docs/
├── postman/
├── screenshots/
├── README.md
├── .gitignore
└── LICENSE
```

---

## Development Roadmap

| Phase    | Name                                    | Status    |
| -------- | --------------------------------------- | --------- |
| Phase 1  | Backend Foundation                      | Completed |
| Phase 2  | Authentication                          | Completed |
| Phase 3  | Product Management                      | Completed |
| Phase 4  | Category and Supplier Management        | Completed |
| Phase 5  | Stock Management                        | Completed |
| Phase 6  | Income and Expense Management           | Completed |
| Phase 7  | Dashboard and Reports API               | Completed |
| Phase 8  | Backend Polish, Validation, and Cleanup | Completed |
| Phase 9  | Angular Frontend Setup                  | Completed |
| Phase 10 | Frontend Layout and Authentication UI   | Next      |
| Phase 11 | Frontend Feature Screens                | Planned   |
| Phase 12 | Frontend-Backend Integration            | Planned   |
| Phase 13 | Final Testing and Documentation         | Planned   |
| Phase 14 | Deployment                              | Planned   |

---

## Documentation

Detailed planning and development documents are available in the `docs/` folder:

```txt
docs/
├── 00-project-overview.md
├── 01-tech-stack.md
├── 02-database-design.md
├── 03-api-endpoints.md
├── 04-phase-plan.md
├── 05-testing-checklist.md
├── 06-git-commit-guide.md
├── 07-deployment-guide.md
└── prompts/
```

Backend-specific documentation is available in:

```txt
backend/README.md
backend/API_TEST_CHECKLIST.md
```

---

## Local Setup

### Backend Setup

Go to the backend folder:

```powershell
cd backend
```

Create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install backend dependencies:

```powershell
pip install -r requirements.txt
```

Create a local `.env` file from `.env.example` and update the database URL and secret key.

Run database migrations:

```powershell
alembic upgrade head
```

Start the backend server:

```powershell
python -m uvicorn app.main:app --reload
```

Backend API:

```txt
http://127.0.0.1:8000
```

Swagger API documentation:

```txt
http://127.0.0.1:8000/docs
```

Health check:

```txt
http://127.0.0.1:8000/health
```

---

### Frontend Setup

Go to the frontend folder:

```powershell
cd frontend
```

Install frontend dependencies:

```powershell
npm install
```

Start the Angular development server:

```powershell
npm start
```

Frontend URL:

```txt
http://localhost:4200
```

Build frontend:

```powershell
npm run build
```

---

## API Documentation

FastAPI Swagger UI is available locally at:

```txt
http://127.0.0.1:8000/docs
```

Implemented API groups include:

- Health
- Authentication
- Products
- Product Categories
- Expense Categories
- Suppliers
- Stock
- Finance
- Dashboard

---

## Testing

Manual backend testing has been tracked in:

```txt
backend/API_TEST_CHECKLIST.md
```

The backend has been manually verified for:

- Authentication
- Protected routes
- Product CRUD
- Category and supplier CRUD
- Stock movement operations
- Finance operations
- Dashboard summary
- Recent activity APIs
- Cleanup and migration status

---

## Screenshots

Screenshots will be added after the frontend screens are implemented.

Planned screenshots:

- Login page
- Dashboard
- Product management
- Supplier management
- Stock movement
- Income and expense management
- Reports

---

## Deployment

Deployment will be completed after frontend-backend integration and final testing.

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
- Authentication and protected routes
- Clean Git workflow
- Professional documentation
- Deployment-ready project structure

---

## Author

Asif Elahi

This project is part of my professional portfolio development journey.
