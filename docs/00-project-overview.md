# StockFlow: Inventory and Business Expense Management System

## 1. Project Summary

StockFlow is a beginner-friendly but professional-grade full-stack web application for small businesses. The system helps business owners and staff manage products, suppliers, stock movement, income, expenses, low-stock alerts, and basic reports from one secure dashboard.

The project is designed as a real-world portfolio project using Angular, FastAPI, and PostgreSQL. It will be built step by step with clean code structure, documentation, meaningful Git commits, API testing, and deployment.

---

## 2. Real-World Problem

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

## 3. Target Users

The system is mainly designed for:

- Small shop owners
- Small business managers
- Inventory staff
- Local suppliers/business operators
- Beginner-level business teams that need a simple digital inventory system

---

## 4. Main Goal

The main goal of StockFlow is to build a practical full-stack system that can:

- Manage products and categories
- Manage suppliers
- Track stock in, stock out, and stock adjustment
- Track income and expenses
- Show low-stock alerts
- Provide dashboard summaries
- Export basic reports
- Protect sensitive actions with authentication and role-based access

---

## 5. Tech Stack

The planned technology stack is:

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Frontend       | Angular + TypeScript                            |
| Backend        | FastAPI                                         |
| Database       | PostgreSQL                                      |
| ORM            | SQLAlchemy                                      |
| Migration      | Alembic                                         |
| Authentication | JWT                                             |
| API Testing    | Swagger / Postman                               |
| Frontend UI    | Angular Material or Tailwind CSS                |
| Charts         | Chart.js / ngx-charts                           |
| Deployment     | Vercel/Netlify + Render/Railway + Neon/Supabase |

The exact UI library and deployment platform may be finalized later during development.

---

## 6. Core Modules

StockFlow will be divided into the following modules:

1. Authentication
2. Product Management
3. Category Management
4. Supplier Management
5. Stock Management
6. Income and Expense Management
7. Dashboard and Reports
8. Security and Professional Features
9. Documentation
10. Deployment and Portfolio Update

---

## 7. MVP Scope

The first working version of the project will include:

- User registration and login
- JWT-based authentication
- Product CRUD
- Product category CRUD
- Supplier CRUD
- Stock in
- Stock out
- Stock adjustment
- Low-stock alert
- Basic dashboard
- Basic documentation

This MVP should be completed before adding advanced features.

---

## 8. Final Scope

The final portfolio-ready version should include:

- Authentication
- Role-based access control
- Product management
- Category management
- Supplier management
- Stock movement history
- Low-stock alerts
- Income tracking
- Expense tracking
- Monthly income/expense summary
- Dashboard cards
- Charts
- CSV export
- Activity log
- Soft delete for important records
- Pagination
- Search and filtering
- Cloudflare Turnstile or CAPTCHA for sensitive public forms
- Professional README
- API documentation
- Database schema documentation
- Postman collection
- Deployment
- Portfolio project description

---

## 9. Development Phases

The project will be built in 10 phases:

| Phase    | Name                             | Goal                                                                               |
| -------- | -------------------------------- | ---------------------------------------------------------------------------------- |
| Phase 1  | Backend Foundation               | Set up FastAPI backend, PostgreSQL, SQLAlchemy, Alembic, and basic structure       |
| Phase 2  | Authentication                   | Add registration, login, password hashing, JWT, and protected routes               |
| Phase 3  | Product Management               | Build product CRUD APIs and product frontend pages                                 |
| Phase 4  | Category and Supplier Management | Add categories, suppliers, and relationships                                       |
| Phase 5  | Stock Management                 | Add stock in, stock out, adjustment, movement history, and low-stock alerts        |
| Phase 6  | Income and Expense Management    | Add business income, expense, category, date filter, and monthly summary           |
| Phase 7  | Dashboard and Reports            | Add dashboard cards, charts, reports, and CSV export                               |
| Phase 8  | Security and Professional Polish | Add RBAC, CAPTCHA/Turnstile, activity log, soft delete, validation, and pagination |
| Phase 9  | Documentation                    | Prepare professional README, API docs, setup guide, screenshots, and project notes |
| Phase 10 | Deployment and Portfolio Update  | Deploy the project and prepare portfolio/GitHub showcase materials                 |

---

## 10. Beginner-Friendly Rule

This project will follow a learn-and-build approach.

Rules:

- One phase at a time
- One module at a time
- Backend API first, then frontend integration
- No advanced features before the basic version works
- Every major feature should be tested
- Every phase should have meaningful Git commits
- Documentation should be updated gradually

---

## 11. Backend-First Development Strategy

The project will follow a backend-first but module-by-module approach.

Example:

1. Build product API
2. Test product API using Swagger/Postman
3. Build Angular product UI
4. Connect Angular UI with product API
5. Move to the next module

This avoids building a frontend without knowing the real data structure.

---

## 12. Professional Practices

The project will follow these professional practices:

- Clean folder structure
- Environment variable usage
- Proper API route organization
- Database migration
- Request/response validation
- Error handling
- Meaningful commit messages
- README documentation
- API documentation
- Screenshots
- Postman collection
- Deployment
- Portfolio-ready presentation

---

## 13. Security Features

Planned security-related features:

- Password hashing
- JWT authentication
- Protected backend routes
- Protected Angular routes
- Role-based access control
- Cloudflare Turnstile or CAPTCHA on sensitive public forms
- Input validation
- Soft delete
- Activity log / audit trail

Security features will be added gradually after the core system works.

---

## 14. Out of Scope for First Version

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

These can be added later as future improvements.

---

## 15. Project Positioning

This project should be presented as:

> A secure full-stack inventory and business expense management system for small businesses, built with Angular, FastAPI, and PostgreSQL. It helps users manage products, suppliers, stock movement, income, expenses, low-stock alerts, and reports from one dashboard.

---

## 16. Locked Baseline

The current locked baseline is:

- Project name: StockFlow
- Project type: Full-stack portfolio project
- Frontend: Angular
- Backend: FastAPI
- Database: PostgreSQL
- Development style: Phase-wise, beginner-friendly, professional-grade
- Primary focus: Inventory + stock movement + expense/reporting system for small businesses

Minor changes may be made during development if needed, but the main direction should remain fixed.
