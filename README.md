# StockFlow

## Inventory and Business Expense Management System

StockFlow is a full-stack inventory and business expense management web application for small businesses. It helps users manage products, suppliers, product categories, stock movements, income, expenses, dashboard summaries, and reports from one secure web application.

The project is built as a professional portfolio project using Angular, FastAPI, PostgreSQL, SQLAlchemy, Alembic, JWT authentication, and clean Git-based phase-wise development.

---

## Current Status

Status: **MVP completed locally**

Completed major modules:

- Backend API with FastAPI
- PostgreSQL database integration
- JWT authentication
- Angular frontend layout
- Protected frontend routes
- Dashboard API integration
- Product category CRUD
- Supplier CRUD
- Product CRUD
- Stock in, stock out, and stock adjustment
- Stock movement history
- Expense category CRUD
- Income CRUD
- Expense CRUD
- Reports dashboard
- CSV export for products, finance records, and stock movements
- Global UI polish
- Manual build verification

---

## Key Features

### Authentication

- User registration
- User login
- JWT access token handling
- Protected backend routes
- Protected frontend routes
- Persistent login after page refresh
- Dynamic topbar user information
- Logout support

### Dashboard

- Total product count
- Low-stock product count
- Supplier count
- Total income
- Total expense
- Net balance
- Recent stock activity
- Recent financial activity

### Inventory Management

- Add, edit, deactivate, and restore product categories
- Add, edit, deactivate, and restore suppliers
- Add, edit, deactivate, and restore products
- Unique SKU validation
- Product category and supplier assignment
- Low-stock status detection
- Active, low-stock, and inactive product filters
- Search by product name, SKU, category, and supplier

### Stock Management

- Stock in
- Stock out
- Insufficient stock protection
- Manual stock adjustment
- Stock movement history
- Movement type filtering
- Stock search by product ID, quantity, reason, and movement type

### Finance Management

- Add, edit, and delete income records
- Add, edit, and delete expense records
- Expense category assignment
- Expense category CRUD
- Finance transaction filtering
- Financial summary with income, expense, and net balance

### Reports

- Summary report cards
- Low-stock report
- Recent finance records
- Recent stock activity
- Export products CSV
- Export finance CSV
- Export stock movements CSV

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Angular, TypeScript |
| Styling | SCSS |
| Backend | FastAPI |
| Backend Language | Python |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Migration | Alembic |
| Validation | Pydantic |
| Authentication | JWT |
| API Documentation | Swagger UI |
| Version Control | Git |

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

## Local Setup

### Backend Setup

Go to the backend folder:

```powershell
cd backend
```

Create a virtual environment:

```powershell
python -m venv .venv
```

Activate the virtual environment:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install backend dependencies:

```powershell
pip install -r requirements.txt
```

Create a `.env` file from `.env.example` and update the database settings:

```env
APP_NAME=StockFlow API
APP_ENV=development
DEBUG=True
API_V1_PREFIX=/api/v1
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/stockflow
SECRET_KEY=change-this-secret-key-in-production-use-at-least-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Run database migrations:

```powershell
alembic upgrade head
```

Start the backend server:

```powershell
python -m uvicorn app.main:app --reload
```

Backend URL:

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

Build the frontend:

```powershell
npm run build
```

---

## Quick Run Commands

### Backend

From project root:

```powershell
.\backend\.venv\Scripts\Activate.ps1
cd backend
python -m uvicorn app.main:app --reload
```

### Frontend

Open another terminal from project root:

```powershell
cd frontend
npm start
```

---

## API Documentation

FastAPI Swagger UI is available at:

```txt
http://127.0.0.1:8000/docs
```

Implemented API groups:

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

## Testing Status

The project has been manually tested for:

- Register, login, logout
- Protected frontend routes
- Dashboard API loading
- Product category CRUD
- Supplier CRUD
- Product CRUD
- Stock in
- Stock out
- Stock adjustment
- Stock movement history
- Expense category CRUD
- Income CRUD
- Expense CRUD
- Reports dashboard
- CSV exports
- Frontend production build

Build command:

```powershell
cd frontend
npm run build
```

Expected result:

```txt
Application bundle generation complete.
```

---

## Screenshots

Screenshots can be added in the `screenshots/` folder.

Recommended screenshots:

- Login page
- Dashboard
- Products page
- Product form
- Suppliers page
- Stock movements
- Stock in/out forms
- Income page
- Expenses page
- Reports page
- CSV export evidence

---

## Known MVP Limitations

This version is a completed local MVP, but some production-level features are intentionally left for future improvement:

- Data is not yet isolated by company/workspace.
- No role-based permission system yet.
- No dedicated user profile page yet.
- Finance transaction delete is currently hard delete instead of void/cancel.
- Some stock activity views show product ID instead of product name.
- No chart library has been added yet.
- No production deployment has been completed yet.
- No automated test suite has been added yet.

---

## Future Improvements

Recommended next improvements:

- Company/workspace-based data isolation
- Role-based access control
- User profile page
- Finance transaction void/cancel workflow
- Product-name mapping in stock movement views
- Date-range filters in reports
- Dashboard charts
- Dark mode
- Automated tests
- Production deployment with hosted database

---

## Documentation

Additional project documentation is available in the `docs/` folder:

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
├── 08-frontend-architecture.md
├── 09-ui-ux-guidelines.md
├── 10-frontend-phase-plan.md
└── prompts/
```

Backend-specific documentation:

```txt
backend/README.md
backend/API_TEST_CHECKLIST.md
```

---

## Learning Goals

This project demonstrates:

- Full-stack project planning
- Angular frontend development
- FastAPI backend development
- PostgreSQL relational database design
- REST API development
- JWT authentication
- Protected frontend routing
- CRUD workflow implementation
- Stock and finance business logic
- CSV export
- Clean Git workflow
- Professional project documentation

---

## Author

Asif Elahi

This project is part of my professional portfolio development journey.
