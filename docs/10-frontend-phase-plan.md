# StockFlow Frontend Phase Plan

## 1. Purpose

This document defines the detailed frontend development plan for StockFlow.

The backend is completed and manually tested. The Angular frontend has been initialized and build verified. The next work is to build the frontend in clear, professional phases.

---

## 2. Current Frontend Status

| Area | Status |
| ---- | ------ |
| Angular project initialized | Completed |
| Routing enabled | Completed |
| SCSS enabled | Completed |
| SSR/SSG disabled | Completed |
| Angular build | Passed |
| Frontend architecture planned | Completed |
| UI/UX direction planned | Completed |
| Layout/auth UI | In progress |
| Feature screens | Pending |
| Backend integration | Pending |
| Final testing | Pending |
| Deployment | Pending |

---

## 3. Frontend Development Strategy

The frontend will be developed in this order:

```txt
Layout and auth UI
↓
Feature screens
↓
Backend API integration
↓
Full testing
↓
Documentation and screenshots
↓
Deployment
```

The first goal is to build the visual structure and navigation before connecting every API.

---

## 4. Frontend Phase Overview

| Phase | Name | Status | Goal |
| ----- | ---- | ------ | ---- |
| Frontend Phase 1 | Layout and Authentication UI | In progress | Build app shell, login/register pages, sidebar, topbar, and route structure |
| Frontend Phase 2 | Dashboard and Feature Screens | Pending | Build main business pages with static/mock structure |
| Frontend Phase 3 | Backend API Integration | Pending | Connect Angular services and forms with FastAPI backend |
| Frontend Phase 4 | Full Frontend Testing | Pending | Test UI, routing, forms, API flows, loading states, and errors |
| Frontend Phase 5 | Frontend Documentation and Screenshots | Pending | Update README/docs and capture portfolio screenshots |
| Frontend Phase 6 | Deployment Preparation | Pending | Configure production API URL and prepare deployable build |

---

## 5. Frontend Phase 1: Layout and Authentication UI

### Status

In progress.

### Goal

Create the base UI structure for the Angular frontend.

### Main Tasks

- Create frontend folder architecture
- Add global SCSS files
- Add theme variables
- Create auth layout
- Create login page
- Create register page
- Create dashboard layout
- Create sidebar
- Create topbar
- Configure app routes
- Add auth service skeleton
- Add auth guard skeleton
- Add placeholder protected pages
- Run Angular build

### Expected Output

- `/auth/login` page exists
- `/auth/register` page exists
- `/app/dashboard` route exists
- Dashboard layout has sidebar and topbar
- Protected route structure exists
- Angular build passes

### Commit Example

```txt
feat: add frontend layout and authentication UI
```

---

## 6. Frontend Phase 2: Dashboard and Feature Screens

### Status

Pending.

### Goal

Build all main business screens visually before API integration.

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

- Add page headers
- Add summary cards
- Add tables
- Add forms
- Add buttons
- Add badges
- Add empty states
- Add loading placeholders
- Keep UI consistent across pages

### Expected Output

All major pages should exist visually with a professional business dashboard design.

### Commit Example

```txt
feat: add frontend business screens
```

---

## 7. Frontend Phase 3: Backend API Integration

### Status

Pending.

### Goal

Connect the Angular frontend to the completed FastAPI backend.

### Main Tasks

- Add API base URL configuration
- Add generic API service
- Connect login API
- Connect register API
- Store JWT token
- Add auth interceptor
- Add logout flow
- Connect dashboard API
- Connect product APIs
- Connect category APIs
- Connect supplier APIs
- Connect stock APIs
- Connect finance APIs
- Add loading states
- Add error states
- Add success messages

### Expected Output

The frontend should communicate with the backend and support real data flows.

### Commit Example

```txt
feat: connect frontend to backend APIs
```

---

## 8. Frontend Phase 4: Full Frontend Testing

### Status

Pending.

### Goal

Test the frontend manually and verify that full user flows work.

### Main Tests

- Angular build
- Browser console
- Login/register flow
- Protected routes
- Sidebar navigation
- Dashboard loading
- Product flow
- Supplier/category flow
- Stock flow
- Finance flow
- Loading states
- Error states
- Empty states
- Basic responsive layout

### Expected Output

The frontend should be stable enough for documentation and deployment preparation.

### Commit Example

```txt
test: verify frontend user flows
```

---

## 9. Frontend Phase 5: Documentation and Screenshots

### Status

Pending.

### Goal

Update documentation and prepare portfolio screenshots.

### Main Tasks

- Update root README
- Update frontend README
- Update testing checklist
- Add frontend screenshots
- Add setup instructions
- Add usage instructions
- Add known limitations
- Add future improvements

### Expected Output

The project should be easy to understand from GitHub and ready for portfolio presentation.

### Commit Example

```txt
docs: update frontend documentation and screenshots
```

---

## 10. Frontend Phase 6: Deployment Preparation

### Status

Pending.

### Goal

Prepare the Angular frontend for production deployment.

### Main Tasks

- Configure production API base URL
- Run production build
- Select frontend hosting platform
- Connect deployed backend URL
- Test deployed frontend
- Verify deployed auth flow
- Verify deployed business flows

### Expected Output

The frontend should be ready to deploy and connect with the live backend.

### Commit Example

```txt
chore: prepare frontend for deployment
```

---

## 11. Frontend Implementation Rules

Frontend implementation should follow these rules:

- Use Angular standalone style.
- Use custom SCSS.
- Do not add Angular Material initially.
- Do not add NgRx initially.
- Keep components simple.
- Keep services separate from components.
- Keep pages business-focused.
- Run `npm run build` before frontend commits.
- Update docs when architecture or workflow changes.

---

## 12. Branch Workflow

Current active branch:

```txt
feature/frontend-layout-auth
```

Recommended frontend branches:

```txt
feature/frontend-layout-auth
feature/frontend-dashboard
feature/frontend-products
feature/frontend-stock
feature/frontend-finance
feature/frontend-api-integration
chore/frontend-docs-polish
```

Rules:

- Do not work directly on `master`.
- Keep each branch focused.
- Commit after a meaningful working milestone.
- Merge only after build/test passes.

---

## 13. Frontend Definition of Done

A frontend phase is complete only when:

- Required pages/components exist.
- Main flow works locally.
- Angular build passes.
- Browser console has no critical errors.
- UI follows the locked design direction.
- Documentation is updated if needed.
- Git diff is reviewed.
- Commit is made with a meaningful message.
