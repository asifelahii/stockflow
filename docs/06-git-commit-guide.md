# StockFlow Git Commit Guide

## 1. Purpose

This document defines the Git commit style for the StockFlow project.

The goal is to keep the commit history clean, professional, and easy to understand. A good commit history shows that the project was built step by step in an organized way.

---

## 2. Why Meaningful Commits Matter

Meaningful commits help to:

- Understand what changed
- Track project progress
- Debug problems later
- Show professional development habit
- Make the GitHub repository look cleaner
- Help interviewers/reviewers understand the build process

Bad commit messages make the project look careless. Good commit messages make the project look professional.

---

## 3. Commit Message Format

Use this format:

```txt
type: short description
```

Examples:

```txt
docs: add project overview
chore: initialize project structure
feat: add user authentication
fix: resolve duplicate SKU validation issue
refactor: move stock logic to service layer
```

---

## 4. Common Commit Types

| Type     | Use Case                                   |
| -------- | ------------------------------------------ |
| feat     | New feature                                |
| fix      | Bug fix                                    |
| docs     | Documentation update                       |
| style    | UI/style formatting changes                |
| refactor | Code improvement without changing behavior |
| test     | Add or update tests                        |
| chore    | Setup, config, dependency, maintenance     |
| perf     | Performance improvement                    |
| build    | Build/deployment related changes           |

---

## 5. Commit Type Examples

### feat

Use when adding a new feature.

```txt
feat: add product creation API
feat: add supplier management page
feat: add stock movement history
feat: add dashboard summary cards
```

### fix

Use when fixing a bug.

```txt
fix: prevent negative stock quantity
fix: handle invalid login credentials
fix: resolve duplicate email validation
fix: correct monthly profit calculation
```

### docs

Use when updating documentation.

```txt
docs: add database design documentation
docs: update API endpoint plan
docs: add backend setup guide
docs: add deployment instructions
```

### chore

Use for setup/configuration/maintenance.

```txt
chore: initialize StockFlow project structure
chore: configure FastAPI dependencies
chore: add Angular project setup
chore: update gitignore rules
```

### refactor

Use when improving code structure without changing behavior.

```txt
refactor: move product logic to service layer
refactor: organize authentication dependencies
refactor: simplify stock movement calculation
```

### test

Use when adding or updating tests.

```txt
test: add product API tests
test: add authentication test cases
test: add stock movement validation tests
```

### style

Use for UI or formatting changes.

```txt
style: improve dashboard card layout
style: update product table spacing
style: polish login page design
```

---

## 6. Bad Commit Messages

Avoid these:

```txt
update
done
final
fixed
changes
new
ok
work
test
asdf
```

These messages do not explain what changed.

---

## 7. Good Commit Messages

Use clear and specific messages:

```txt
docs: add StockFlow phase plan
feat: add product category CRUD APIs
feat: connect Angular product form to backend
fix: prevent stock out when quantity is insufficient
refactor: separate finance summary logic into service
chore: add environment variable example file
```

---

## 8. Commit Rules for This Project

Follow these rules:

- Commit small meaningful changes.
- Do not commit broken code.
- Do not commit `.env`.
- Do not commit unnecessary generated files.
- Update documentation when a feature changes.
- Test before committing.
- Keep each commit focused on one topic.
- Use present tense in commit messages.

Good:

```txt
feat: add product list endpoint
```

Avoid:

```txt
feat: added product list endpoint
```

---

## 9. Suggested Commit Flow

Use this flow:

```powershell
git status
git add .
git commit -m "type: short meaningful message"
git status
```

Example:

```powershell
git status
git add docs\06-git-commit-guide.md
git commit -m "docs: add Git commit guide"
git status
```

---

## 10. Phase-Based Commit Examples

### Phase 1: Backend Foundation

```txt
chore: set up FastAPI backend foundation
chore: configure PostgreSQL database connection
chore: initialize Alembic migrations
```

### Phase 2: Authentication

```txt
feat: add user model and schemas
feat: add user registration API
feat: add JWT login authentication
feat: add protected current user route
```

### Phase 3: Product Management

```txt
feat: add product model and schemas
feat: add product CRUD APIs
feat: add product search and filter
feat: add Angular product management page
```

### Phase 4: Category and Supplier Management

```txt
feat: add product category CRUD APIs
feat: add supplier management APIs
feat: connect product form with categories and suppliers
```

### Phase 5: Stock Management

```txt
feat: add stock movement model
feat: add stock in and stock out APIs
feat: add stock adjustment API
feat: add low-stock product endpoint
```

### Phase 6: Income and Expense Management

```txt
feat: add financial transaction model
feat: add income and expense APIs
feat: add monthly finance summary endpoint
```

### Phase 7: Dashboard and Reports

```txt
feat: add dashboard summary endpoint
feat: add report export endpoints
feat: add Angular dashboard charts
```

### Phase 8: Security and Polish

```txt
feat: add role-based access control
feat: add activity log tracking
feat: add CAPTCHA verification for registration
fix: improve API validation messages
```

### Phase 9: Documentation

```txt
docs: complete backend setup guide
docs: add API usage examples
docs: add screenshots and project explanation
```

### Phase 10: Deployment

```txt
chore: prepare backend for deployment
chore: configure production environment variables
docs: add live demo link to README
```

---

## 11. Git Branching Plan

For now, the project can continue on the `master` branch because this is a beginner portfolio project.

Later, when the project becomes larger, use feature branches:

```txt
feature/authentication
feature/product-management
feature/stock-management
feature/dashboard
```

Example flow:

```powershell
git checkout -b feature/authentication
git add .
git commit -m "feat: add JWT authentication"
git checkout master
git merge feature/authentication
```

For now, this is optional.

---

## 12. GitHub Professional Practice

Before pushing to GitHub:

- Make sure README is clear.
- Make sure `.env` is not committed.
- Make sure project runs locally.
- Make sure commit messages are meaningful.
- Make sure screenshots are added later.
- Make sure live demo link is added after deployment.

---

## 13. Final Rule

Every commit should answer this question:

> What useful change did I make?

If the commit message cannot answer that clearly, rewrite it.
