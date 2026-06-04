# StockFlow Frontend Architecture

## 1. Purpose

This document defines the planned Angular frontend architecture for StockFlow.

The goal is to build a clean, professional, beginner-friendly, and real-world-ready frontend that works with the completed FastAPI backend.

Current status:

```txt
Backend completed and manually tested.
Angular frontend initialized and build verified.
Frontend layout and authentication UI is in progress.
```

---

## 2. Frontend Architecture Goals

The StockFlow frontend should be:

- Clean and professional
- Easy to understand
- Easy to maintain
- Suitable for a business dashboard
- Beginner-friendly but not toy-level
- Good for portfolio and resume showcase
- Ready for backend API integration
- Built using Angular standalone style

---

## 3. Angular Style Decision

The frontend will use Angular standalone style.

The generated Angular project uses:

```txt
app.ts
app.html
app.scss
app.routes.ts
app.config.ts
```

Therefore, the frontend should continue with the current Angular style instead of using older NgModule-heavy structure.

---

## 4. UI Library Decision

The first frontend version will use custom SCSS.

Angular Material will not be used initially.

Reason:

- Custom SCSS gives more design control.
- The project will look less generic.
- It better shows frontend layout and styling skill.
- It keeps the first version lightweight.
- It is better for portfolio presentation.

Angular Material may be added later only for selected components if needed, such as:

- Date picker
- Dialog/modal
- Snackbar/toast
- Pagination

---

## 5. Planned Frontend Folder Structure

The planned frontend structure is:

```txt
frontend/src/app/
├── app.config.ts
├── app.html
├── app.routes.ts
├── app.scss
├── app.ts
│
├── core/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   ├── models/
│   │   ├── auth.model.ts
│   │   ├── dashboard.model.ts
│   │   ├── finance.model.ts
│   │   ├── product.model.ts
│   │   ├── stock.model.ts
│   │   └── supplier.model.ts
│   └── services/
│       ├── api.service.ts
│       ├── auth.service.ts
│       ├── dashboard.service.ts
│       ├── finance.service.ts
│       ├── product.service.ts
│       ├── stock.service.ts
│       └── supplier.service.ts
│
├── layout/
│   ├── auth-layout/
│   └── dashboard-layout/
│       ├── sidebar/
│       └── topbar/
│
├── shared/
│   ├── components/
│   │   ├── badge/
│   │   ├── button/
│   │   ├── card/
│   │   ├── empty-state/
│   │   ├── input/
│   │   ├── loading-spinner/
│   │   ├── page-header/
│   │   └── table/
│   └── utils/
│
├── features/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── products/
│   ├── product-categories/
│   ├── suppliers/
│   ├── stock/
│   │   ├── stock-adjustment/
│   │   ├── stock-in/
│   │   ├── stock-movements/
│   │   └── stock-out/
│   ├── finance/
│   │   ├── expense-categories/
│   │   ├── expenses/
│   │   └── income/
│   └── reports/
│
└── styles/
    ├── _base.scss
    ├── _forms.scss
    ├── _mixins.scss
    ├── _tables.scss
    ├── _utilities.scss
    └── _variables.scss
```

---

## 6. Folder Responsibilities

### core/

The `core/` folder contains application-wide logic.

Use it for:

- Route guards
- HTTP interceptors
- API services
- Authentication service
- TypeScript interfaces/models

Files inside `core/` should not be page-specific.

---

### layout/

The `layout/` folder contains page layout components.

Use it for:

- Auth layout
- Dashboard layout
- Sidebar
- Topbar

The layout components should define the main structure of the application.

---

### shared/

The `shared/` folder contains reusable UI components.

Examples:

- Button
- Card
- Badge
- Table
- Input
- Empty state
- Loading spinner
- Page header

Shared components should be reusable across multiple pages.

---

### features/

The `features/` folder contains business pages.

Each major business area should have its own folder.

Examples:

- Auth
- Dashboard
- Products
- Suppliers
- Stock
- Finance
- Reports

Feature components should focus on page behavior and user interaction.

---

### styles/

The `styles/` folder contains global SCSS partials.

Use it for:

- Theme variables
- Base styles
- Form styles
- Table styles
- Utility classes
- Mixins

This keeps styling organized and avoids putting everything in one global file.

---

## 7. Routing Architecture

The planned route structure is:

```txt
/
└── redirect based on auth state

/auth
├── /login
└── /register

/app
├── /dashboard
├── /products
├── /product-categories
├── /suppliers
├── /stock/movements
├── /stock/in
├── /stock/out
├── /stock/adjustment
├── /finance/income
├── /finance/expenses
├── /finance/expense-categories
└── /reports
```

Route groups:

| Route Group | Layout |
| ----------- | ------ |
| `/auth/*` | Auth layout |
| `/app/*` | Dashboard layout |

Protected routes:

- All `/app/*` routes should require authentication.
- Unauthenticated users should be redirected to `/auth/login`.

---

## 8. Authentication Architecture

The frontend authentication flow will be:

```txt
User enters login credentials
↓
AuthService sends login request to backend
↓
Backend returns JWT token
↓
Frontend stores token
↓
User is redirected to dashboard
↓
Auth interceptor sends token with protected requests
```

Main frontend auth pieces:

| File | Purpose |
| ---- | ------- |
| `auth.service.ts` | Login, register, logout, token handling |
| `auth.guard.ts` | Protect private routes |
| `auth.interceptor.ts` | Add JWT token to API requests |
| `auth.model.ts` | Auth request/response interfaces |

---

## 9. API Service Architecture

The frontend should not call backend APIs directly from components.

Use this pattern:

```txt
Component
↓
Feature Service
↓
Api Service / HttpClient
↓
FastAPI Backend
```

Example:

```txt
ProductsPageComponent
↓
ProductService
↓
ApiService
↓
GET /api/v1/products
```

This keeps components clean and makes API logic reusable.

---

## 10. Service Responsibilities

### api.service.ts

Generic API wrapper.

Possible methods:

- `get`
- `post`
- `put`
- `delete`

---

### auth.service.ts

Authentication-related logic.

Responsibilities:

- Login
- Register
- Logout
- Store token
- Read token
- Remove token
- Check authentication status

---

### dashboard.service.ts

Dashboard-related API calls.

Responsibilities:

- Load dashboard summary
- Load recent activity

---

### product.service.ts

Product-related API calls.

Responsibilities:

- List products
- Get product by ID
- Create product
- Update product
- Delete product
- Load low-stock products

---

### supplier.service.ts

Supplier-related API calls.

Responsibilities:

- List suppliers
- Create supplier
- Update supplier
- Delete supplier

---

### stock.service.ts

Stock-related API calls.

Responsibilities:

- Load stock movement history
- Create stock in
- Create stock out
- Create stock adjustment

---

### finance.service.ts

Finance-related API calls.

Responsibilities:

- Load income records
- Load expense records
- Create income
- Create expense
- Update transactions
- Delete transactions
- Load financial summary

---

## 11. Component Strategy

The first version should avoid over-engineering.

Build simple reusable components only when they clearly reduce repetition.

Initial reusable components:

- Page header
- Card
- Button
- Badge
- Empty state
- Loading spinner

Add more reusable components later only if needed.

Avoid building overly generic table/form systems too early.

---

## 12. State Management Decision

Do not use NgRx in the first version.

Reason:

- The app does not need complex global state yet.
- Services are enough for the current scope.
- Avoiding NgRx keeps the project beginner-friendly and easier to maintain.

Use simple Angular services for:

- Auth state
- API calls
- Shared helper logic

NgRx can be considered later only if the application becomes much larger.

---

## 13. Styling Architecture

The frontend will use custom SCSS.

Global SCSS should include:

```txt
_variables.scss
_base.scss
_forms.scss
_tables.scss
_utilities.scss
_mixins.scss
```

Style goals:

- Consistent spacing
- Clear typography
- Clean tables
- Professional forms
- Simple cards
- Clear action buttons
- Dark sidebar
- Light content area

---

## 14. Build and Quality Rules

After frontend changes, always run:

```powershell
cd frontend
npm run build
```

Before commit, always run:

```powershell
git status
git diff --stat
```

A frontend phase should not be committed if:

- Angular build fails
- App has critical browser console errors
- Layout is broken
- Protected route structure is broken
- Unnecessary generated files are included

---

## 15. First Frontend Implementation Scope

The first implementation branch is:

```txt
feature/frontend-layout-auth
```

This branch should include:

- Global SCSS setup
- Auth layout
- Login page
- Register page
- Dashboard layout
- Sidebar
- Topbar
- Route structure
- Auth service skeleton
- Auth guard skeleton
- Placeholder protected pages
- Successful Angular build

It should not include full backend API integration yet.

---

## 16. Definition of Done

Frontend architecture setup is done when:

- Folder structure is created.
- Routes are organized.
- Auth and dashboard layouts exist.
- Login/register pages exist.
- Protected route structure exists.
- Sidebar and topbar exist.
- Placeholder dashboard route works.
- Angular build passes.
- Documentation is updated.
- Git commit is made.
