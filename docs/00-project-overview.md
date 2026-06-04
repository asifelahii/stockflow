# StockFlow: Inventory and Business Expense Management System

## 1. Project Summary

StockFlow is a professional full-stack web application for small businesses. The system helps business owners and staff manage products, suppliers, stock movement, income, expenses, low-stock alerts, and dashboard summaries from one secure platform.

The project is designed as a real-world portfolio project using Angular, FastAPI, and PostgreSQL. It follows a phase-wise development workflow with clean folder structure, API testing, documentation, meaningful Git commits, and deployment preparation.

The backend development is currently completed and manually tested. The project is now moving into Angular frontend development.

---

## 2. Current Project Status

Current status:

| Area                          | Status      |
| ----------------------------- | ----------- |
| Backend foundation            | Completed   |
| Authentication with JWT       | Completed   |
| Product management APIs       | Completed   |
| Product category APIs         | Completed   |
| Expense category APIs         | Completed   |
| Supplier APIs                 | Completed   |
| Stock in/out/adjustment APIs  | Completed   |
| Stock movement history        | Completed   |
| Income and expense APIs       | Completed   |
| Financial summary API         | Completed   |
| Dashboard summary API         | Completed   |
| Recent activity API           | Completed   |
| Backend cleanup               | Completed   |
| Backend API testing checklist | Completed   |
| Angular frontend setup        | Completed   |
| Angular frontend build        | Passed      |
| Frontend layout/auth UI       | In progress |
| Frontend-backend integration  | Pending     |
| Final deployment              | Pending     |

---

## 3. Real-World Problem

Many small businesses still manage inventory and expenses using notebooks, Excel sheets, or disconnected tools. This often creates problems such as:

- Stock mismatch
- No clear stock movement history
- Late low-stock detection
- Missing supplier information
- Poor income and expense tracking
- No monthly business summary
- Weak access control for staff
- Lack of proper reports for decision-making

StockFlow aims to solve these problems by providing a simple, secure, and organized inventory and business expense management system.

---

## 4. Target Users

The system is mainly designed for:

- Small shop owners
- Small business managers
- Inventory staff
- Local suppliers/business operators
- Beginner-level business teams that need a simple digital inventory system

---

## 5. Main Goal

The main goal of StockFlow is to build a practical full-stack system that can:

- Manage products and categories
- Manage suppliers
- Track stock in, stock out, and stock adjustment
- Track income and expenses
- Show low-stock alerts
- Provide dashboard summaries
- Show recent business activity
- Protect sensitive actions with authentication
- Prepare the project for real-world business usage and portfolio showcase

---

## 6. Tech Stack

The selected technology stack is:

| Layer            | Technology           |
| ---------------- | -------------------- |
| Frontend         | Angular + TypeScript |
| Frontend Styling | Custom SCSS          |
| Backend          | FastAPI              |
| Database         | PostgreSQL           |
| ORM              | SQLAlchemy           |
| Migration        | Alembic              |
| Validation       | Pydantic             |
| Authentication   | JWT                  |
| API Testing      | Swagger UI / Postman |
| Version Control  | Git + GitHub         |
| Deployment       | To be finalized      |

Optional later additions:

| Area                | Possible Tool                        |
| ------------------- | ------------------------------------ |
| UI Components       | Angular Material, only if needed     |
| Charts              | Chart.js / ng2-charts                |
| Frontend Deployment | Vercel / Netlify                     |
| Backend Deployment  | Render / Railway                     |
| Database Hosting    | Neon / Supabase / Railway PostgreSQL |

The frontend will use custom SCSS first to keep the UI professional, lightweight, and portfolio-friendly. Angular Material may be added later only for selected components such as date picker, dialog, snackbar, or pagination if needed.

---

## 7. Core Modules

StockFlow is divided into the following modules:

1. Authentication
2. Product Management
3. Category Management
4. Supplier Management
5. Stock Management
6. Income and Expense Management
7. Dashboard and Recent Activity
8. Frontend Layout and Authentication UI
9. Frontend Feature Screens
10. Frontend-Backend Integration
11. Testing and Documentation
12. Deployment and Portfolio Update

---

## 8. Completed Backend Scope

The completed backend includes:

- Health check endpoint
- User registration
- User login
- JWT access token generation
- Current logged-in user endpoint
- Protected routes
- Product CRUD
- Product search
- Low-stock product filtering
- Product categories
- Expense categories
- Suppliers
- Stock in
- Stock out
- Stock adjustment
- Stock movement history
- Income records
- Expense records
- Transaction listing and filtering
- Financial summary
- Dashboard summary
- Recent stock movement activity
- Recent financial transaction activity
- Soft delete for important business records
- Backend documentation
- Backend API testing checklist

---

## 9. Frontend Scope

The Angular frontend will include:

- Login page
- Register page
- Protected dashboard layout
- Sidebar navigation
- Topbar/header
- Dashboard summary cards
- Recent activity panels
- Product management screen
- Product category screen
- Supplier management screen
- Stock movement screen
- Stock in form
- Stock out form
- Stock adjustment form
- Income management screen
- Expense management screen
- Expense category screen
- Reports or summary screen
- Loading, error, and empty states
- Responsive business dashboard layout

The frontend design direction is:

- Smart
- Modern
- Simple
- Elegant
- Business-focused
- User-friendly
- Not too fancy
- Not boring

---

## 10. Frontend UI Direction

The frontend will use a modern SaaS-style dashboard design.

UI decisions:

- Custom SCSS first
- Dark sidebar with light content area
- Clean dashboard cards
- Clear tables
- Simple forms
- Consistent buttons and badges
- Minimal color usage
- Good spacing and readability
- Professional business dashboard feel
- Desktop-first, responsive layout

Main color direction:

| Purpose                      | Color       |
| ---------------------------- | ----------- |
| Primary                      | Blue        |
| Success / Stock In / Income  | Green       |
| Danger / Stock Out / Expense | Red         |
| Warning / Low Stock          | Amber       |
| Sidebar                      | Dark slate  |
| Page background              | Light slate |
| Cards                        | White       |

---

## 11. Development Phases

The project is now split into backend-completed and frontend-pending phases.

| Phase    | Name                                  | Status      |
| -------- | ------------------------------------- | ----------- |
| Phase 1  | Backend Foundation                    | Completed   |
| Phase 2  | Authentication                        | Completed   |
| Phase 3  | Product Management                    | Completed   |
| Phase 4  | Category and Supplier Management      | Completed   |
| Phase 5  | Stock Management                      | Completed   |
| Phase 6  | Income and Expense Management         | Completed   |
| Phase 7  | Dashboard and Recent Activity         | Completed   |
| Phase 8  | Backend Cleanup and API Testing       | Completed   |
| Phase 9  | Angular Frontend Setup                | Completed   |
| Phase 10 | Frontend Layout and Authentication UI | In Progress |
| Phase 11 | Frontend Feature Screens              | Pending     |
| Phase 12 | Frontend-Backend Integration          | Pending     |
| Phase 13 | Final Testing and Documentation       | Pending     |
| Phase 14 | Deployment and Portfolio Update       | Pending     |

---

## 12. Development Strategy

The project follows a professional phase-wise workflow.

General workflow:

1. Plan the phase.
2. Update documentation.
3. Create or update files.
4. Run the project locally.
5. Test the feature.
6. Fix errors.
7. Review Git changes.
8. Make a meaningful commit.
9. Move to the next phase.

Frontend workflow:

1. Build layout and authentication UI.
2. Create reusable UI components.
3. Build feature screens with static/mock structure.
4. Connect screens to backend APIs.
5. Add loading, error, and empty states.
6. Test full user flows.
7. Update documentation.
8. Prepare deployment.

---

## 13. Professional Practices

The project follows these professional practices:

- Clean folder structure
- Environment variable usage
- Proper API route organization
- Database migration
- Request and response validation
- Error handling
- Manual API testing
- Meaningful commit messages
- Markdown documentation
- API documentation
- Backend README
- Testing checklist
- Branch-based development
- Portfolio-ready presentation

---

## 14. Security Features

Implemented security features:

- Password hashing
- JWT authentication
- Protected backend routes
- Backend authentication dependency
- Duplicate email handling
- Duplicate SKU handling
- Input validation
- Soft delete for important records

Planned frontend security features:

- Protected Angular routes
- Auth guard
- JWT token storage
- Auth interceptor
- Logout flow
- Unauthorized redirect handling

Possible future security improvements:

- Role-based access control
- Activity log / audit trail
- Cloudflare Turnstile or CAPTCHA for sensitive public forms
- Refresh token flow
- More advanced permission system

---

## 15. Out of Scope for First Version

The following features are not required in the first version:

- Online payment integration
- Barcode scanner
- Multi-branch inventory
- Advanced accounting
- Invoice generation
- Mobile app
- Docker
- Redis
- Celery/background jobs
- Microservices
- Kubernetes
- Advanced analytics
- Complex role-permission matrix

These can be added later as future improvements.

---

## 16. Project Positioning

This project should be presented as:

> A secure full-stack inventory and business expense management system for small businesses, built with Angular, FastAPI, and PostgreSQL. It helps users manage products, suppliers, stock movement, income, expenses, low-stock alerts, and business summaries from one dashboard.

---

## 17. Locked Baseline

The current locked baseline is:

- Project name: StockFlow
- Project type: Full-stack business management system
- Frontend: Angular
- Frontend style: Custom SCSS business dashboard
- Backend: FastAPI
- Database: PostgreSQL
- Authentication: JWT
- Development style: Phase-wise and branch-based
- Current status: Backend completed, Angular frontend starting
- Primary focus: Inventory, stock movement, income, expense, dashboard, and reporting support for small businesses

Minor changes may be made during development if needed, but the main direction should remain fixed.
