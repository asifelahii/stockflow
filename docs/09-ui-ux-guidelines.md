# StockFlow UI/UX Guidelines

## 1. Purpose

This document defines the UI and UX direction for the StockFlow Angular frontend.

The goal is to build a smart, modern, simple, elegant, and user-friendly business dashboard that is suitable for real-world small business use and strong enough for portfolio/resume presentation.

---

## 2. Design Goal

StockFlow should look like a professional business SaaS dashboard.

The design should be:

- Clean
- Modern
- Practical
- Easy to use
- Business-focused
- Not too fancy
- Not boring
- Consistent across pages
- Comfortable for daily use

The UI should help users complete business tasks quickly without confusion.

---

## 3. Target Users

The UI is designed for:

- Small business owners
- Shop managers
- Inventory staff
- Finance/admin staff
- Business operators who need simple daily workflows

The design should not assume that users are technical experts.

---

## 4. UI Style Decision

StockFlow will use custom SCSS for the first frontend version.

Angular Material will not be used initially.

Reason:

- Custom SCSS gives better visual control.
- The app can have a unique portfolio-ready look.
- The UI will not look like a generic template.
- The styling remains lightweight.
- It better shows frontend design skill.

Angular Material may be added later only for selected components such as:

- Date picker
- Dialog/modal
- Snackbar/toast
- Pagination

---

## 5. Visual Theme

The selected theme is:

```txt
Dark sidebar + light content area
```

This gives the app a professional business dashboard feel.

### Color Direction

| Purpose | Color |
| ------- | ----- |
| Primary actions | Blue |
| Success / stock in / income | Green |
| Danger / stock out / expense / delete | Red |
| Warning / low stock | Amber |
| Sidebar | Dark slate |
| Page background | Light slate |
| Cards | White |
| Text | Dark gray/slate |

### Suggested SCSS Variables

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

## 6. Layout Guidelines

The main application should use a dashboard layout.

### Main Layout

```txt
Sidebar
Topbar
Main content area
```

### Sidebar

The sidebar should contain main navigation links.

Recommended sections:

```txt
Dashboard

Inventory
- Products
- Product Categories
- Suppliers

Stock
- Stock Movements
- Stock In
- Stock Out
- Stock Adjustment

Finance
- Income
- Expenses
- Expense Categories

Reports
```

### Topbar

The topbar should show:

- Page context if needed
- User name or user badge later
- Logout button later
- Simple clean spacing

### Main Content

Each page should follow this structure:

```txt
Page title + description
Primary action button
Search/filter area if needed
Table, cards, or form
Loading/error/empty state
```

---

## 7. Page Header Pattern

Every major page should have a clear page header.

Example:

```txt
Products
Manage all inventory products and stock levels.
```

If a page has a main action, place it on the right side.

Example:

```txt
[+ Add Product]
```

---

## 8. Button Guidelines

Use consistent button styles.

### Primary Button

Use for main actions:

- Add Product
- Save
- Submit
- Login
- Register

### Secondary Button

Use for less important actions:

- Cancel
- Back
- Reset

### Danger Button

Use only for destructive actions:

- Delete
- Deactivate
- Remove

Danger buttons should not be visually similar to normal buttons.

---

## 9. Form Guidelines

Forms should be simple and clear.

Rules:

- Use clear labels.
- Show required fields clearly.
- Keep field spacing consistent.
- Use helpful placeholder text only when needed.
- Show validation messages near the field.
- Do not make forms visually crowded.
- Use one clear submit button.
- Use cancel/back button where useful.

Example form flow:

```txt
Label
Input field
Validation message if needed
```

---

## 10. Table Guidelines

Tables are important for this business app.

Tables should be:

- Readable
- Clean
- Properly spaced
- Easy to scan
- Not visually overloaded

Common table columns:

```txt
Name | Category | Supplier | Quantity | Status | Actions
```

Action buttons should be short:

```txt
View | Edit | Delete
```

For the first version, avoid overly complex table features. Add advanced sorting, pagination, and bulk actions later if needed.

---

## 11. Status Badge Guidelines

Use badges to show important statuses.

Examples:

| Status | Badge Style |
| ------ | ----------- |
| Active | Green |
| Inactive | Gray |
| Low Stock | Amber |
| Out of Stock | Red |
| Stock In | Green |
| Stock Out | Red |
| Adjustment | Blue/Info |
| Income | Green |
| Expense | Red |

Badges should be small, readable, and consistent.

---

## 12. Dashboard Guidelines

The dashboard should quickly show business status.

Recommended dashboard sections:

### Summary Cards

- Total Products
- Low Stock Products
- Total Suppliers
- Total Income
- Total Expenses
- Net Balance

### Recent Activity

- Recent stock movements
- Recent financial transactions

### Alerts

- Low-stock products
- Important warnings if needed later

The dashboard should not be overloaded in the first version.

---

## 13. Loading, Error, and Empty States

Every data-driven page should handle these states.

### Loading State

Example:

```txt
Loading products...
```

### Error State

Example:

```txt
Could not load products. Please try again.
```

### Empty State

Example:

```txt
No products found.
Add your first product to start managing inventory.
```

These states make the app feel more complete and user-friendly.

---

## 14. Authentication UI Guidelines

### Login Page

The login page should be clean and focused.

It should include:

- StockFlow branding
- Short project description
- Email field
- Password field
- Login button
- Link to register page

### Register Page

The register page should include:

- Full name field
- Email field
- Password field
- Register button
- Link to login page

The auth pages should look professional but not overdesigned.

---

## 15. UX Rules

Follow these rules across the frontend:

- Keep actions obvious.
- Avoid unnecessary clicks.
- Use clear labels.
- Do not hide important actions.
- Show feedback after user actions.
- Show errors in simple language.
- Keep navigation predictable.
- Keep page layouts consistent.
- Avoid too many colors.
- Avoid unnecessary animation.

---

## 16. Responsive Design

The first version should be desktop-first but responsive enough for smaller screens.

Minimum expectations:

- Layout should not break on laptop screens.
- Sidebar should be manageable on smaller screens.
- Tables should remain readable.
- Forms should stack properly.
- Buttons should not overflow.

Full mobile optimization can be improved later.

---

## 17. Accessibility Basics

Basic accessibility should be considered.

Rules:

- Use readable font sizes.
- Maintain good color contrast.
- Use proper button text.
- Do not rely only on color to show meaning.
- Inputs should have labels.
- Interactive elements should be keyboard-friendly where possible.

---

## 18. Portfolio Presentation Rules

For portfolio and resume value:

- UI should look custom, not like a raw template.
- Dashboard should look business-ready.
- Screens should be consistent.
- Forms and tables should look polished.
- Screenshots should be clean.
- Avoid unfinished placeholder text in final version.

---

## 19. Final UI Direction

The locked UI direction is:

```txt
Professional SaaS-style business dashboard
Dark sidebar
Light content area
Custom SCSS
Clean cards
Readable tables
Simple forms
Consistent buttons
Clear status badges
Minimal but polished design
```

This direction should be followed during frontend implementation.
