# StockFlow Testing Checklist

## 1. Purpose

This document defines the testing checklist for StockFlow.

The goal is to make sure each phase is tested before moving to the next phase. Testing will use Swagger UI, Postman, browser checks, Angular build checks, manual UI testing, and frontend-backend integration testing.

Current project status:

```txt
Backend completed and manually tested.
Angular frontend initialized and build verified.
Frontend layout and authentication UI is currently in progress.
```

---

## 2. Testing Strategy

StockFlow follows a phase-wise testing strategy.

For each phase:

- Build one focused feature or module.
- Run the application locally.
- Test the main success flow.
- Test important error cases.
- Check browser or API console errors.
- Update documentation if needed.
- Review Git diff.
- Commit only after the feature works.

A phase is not complete until its main flow works correctly.

---

## 3. Current Testing Status

| Area                                 | Status    |
| ------------------------------------ | --------- |
| Backend health check                 | Completed |
| Authentication APIs                  | Completed |
| Product APIs                         | Completed |
| Product category APIs                | Completed |
| Expense category APIs                | Completed |
| Supplier APIs                        | Completed |
| Stock management APIs                | Completed |
| Finance APIs                         | Completed |
| Dashboard APIs                       | Completed |
| Recent activity APIs                 | Completed |
| Backend cleanup checks               | Completed |
| Backend API test checklist           | Completed |
| Angular frontend setup               | Completed |
| Angular build check                  | Passed    |
| Frontend layout/auth UI testing      | Pending   |
| Frontend-backend integration testing | Pending   |
| Deployment testing                   | Pending   |

---

## 4. General Testing Rules

Before committing any feature:

- [ ] Application runs without startup errors.
- [ ] No unnecessary files are added.
- [ ] `.env` file is not committed.
- [ ] `.env.example` is updated if needed.
- [ ] Backend APIs are tested if backend is changed.
- [ ] Angular build passes if frontend is changed.
- [ ] Browser console has no critical errors.
- [ ] Documentation is updated if needed.
- [ ] Git diff is reviewed.
- [ ] Commit message is meaningful.

Recommended commands:

```bash
git status
git diff --stat
```

---

## 5. Backend Testing Checklist

Backend testing was completed before frontend development started.

Detailed backend testing is tracked in:

```txt
backend/API_TEST_CHECKLIST.md
```

### Completed Backend Checks

- [x] FastAPI server starts successfully.
- [x] Swagger UI opens.
- [x] `/health` endpoint works.
- [x] PostgreSQL connection works.
- [x] Alembic migration is at head.
- [x] Authentication flow works.
- [x] Protected routes reject unauthenticated requests.
- [x] Product APIs work.
- [x] Category APIs work.
- [x] Supplier APIs work.
- [x] Stock APIs work.
- [x] Finance APIs work.
- [x] Dashboard APIs work.
- [x] Recent activity APIs work.
- [x] Backend cleanup completed.
- [x] Git working tree was clean before frontend work.

### Backend Re-Test Triggers

Re-test backend only if:

- Backend code changes.
- Database models change.
- API response structure changes.
- Authentication behavior changes.
- CORS configuration changes.
- Deployment environment changes.

---

## 6. Angular Setup Testing

### Completed Angular Setup Checks

- [x] Angular project initialized inside `frontend/`.
- [x] Routing enabled.
- [x] SCSS enabled.
- [x] SSR/SSG disabled.
- [x] Angular standalone-style structure confirmed.
- [x] `npm run build` passed.
- [x] Initial Angular setup committed.

### Command

```bash
cd frontend
npm run build
```

Expected result:

```txt
Build completed successfully.
```

---

## 7. Phase 10: Frontend Layout and Authentication UI Testing

This is the current active frontend testing scope.

### Layout Structure

- [ ] App shell loads correctly.
- [ ] Auth layout displays correctly.
- [ ] Dashboard layout displays correctly.
- [ ] Sidebar displays correctly.
- [ ] Topbar displays correctly.
- [ ] Main content area displays correctly.
- [ ] Layout does not break on common desktop screen sizes.
- [ ] Basic responsive behavior works on smaller screens.

### Routing

- [ ] `/` redirects correctly.
- [ ] `/auth/login` loads login page.
- [ ] `/auth/register` loads register page.
- [ ] `/app/dashboard` loads protected dashboard placeholder.
- [ ] Unknown routes are handled safely if added.
- [ ] Navigation links work from sidebar.
- [ ] Active sidebar link style works.

### Login UI

- [ ] Login form displays email field.
- [ ] Login form displays password field.
- [ ] Login form displays submit button.
- [ ] Required validation works.
- [ ] Email format validation works if added.
- [ ] Password field hides typed password.
- [ ] Login page has link to register page.
- [ ] Login page design matches StockFlow business style.

### Register UI

- [ ] Register form displays full name field.
- [ ] Register form displays email field.
- [ ] Register form displays password field.
- [ ] Register form displays submit button.
- [ ] Required validation works.
- [ ] Email format validation works if added.
- [ ] Password field hides typed password.
- [ ] Register page has link to login page.
- [ ] Register page design matches StockFlow business style.

### Auth Guard Structure

- [ ] Auth guard file exists.
- [ ] Protected route structure exists.
- [ ] Unauthenticated access redirects to login after implementation.
- [ ] Auth guard does not break Angular build.

### Auth Service Structure

- [ ] Auth service file exists.
- [ ] Login method placeholder or structure exists.
- [ ] Register method placeholder or structure exists.
- [ ] Logout method placeholder or structure exists.
- [ ] Token helper methods are planned or added.
- [ ] Auth service does not break Angular build.

### Build Check

Angular build passes after layout/auth work.

Command:

```bash
cd frontend
npm run build
```

---

## 8. Phase 11: Frontend Feature Screens Testing

This phase is pending.

### Dashboard Screen

- [ ] Dashboard page loads.
- [ ] Summary card layout displays correctly.
- [ ] Recent stock activity panel displays correctly.
- [ ] Recent finance activity panel displays correctly.
- [ ] Low-stock panel or placeholder displays correctly.

### Product Screens

- [ ] Product list page loads.
- [ ] Product table displays correctly.
- [ ] Add product form displays correctly.
- [ ] Edit product form displays correctly.
- [ ] Empty state displays correctly.
- [ ] Product status badge displays correctly.

### Category and Supplier Screens

- [ ] Product category page loads.
- [ ] Expense category page loads.
- [ ] Supplier page loads.
- [ ] Tables display correctly.
- [ ] Forms display correctly.
- [ ] Empty states display correctly.

### Stock Screens

- [ ] Stock movement page loads.
- [ ] Stock in form displays correctly.
- [ ] Stock out form displays correctly.
- [ ] Stock adjustment form displays correctly.
- [ ] Movement type badge displays correctly.

### Finance Screens

- [ ] Income page loads.
- [ ] Expense page loads.
- [ ] Expense category page loads.
- [ ] Transaction table displays correctly.
- [ ] Income/expense styling is clear.

---

## 9. Phase 12: Frontend-Backend Integration Testing

This phase is pending.

### API Configuration

- [ ] API base URL is configured.
- [ ] Local backend URL works.
- [ ] Environment file is not exposing secrets.

### Authentication Integration

- [ ] Register request reaches backend.
- [ ] Login request reaches backend.
- [ ] JWT token is stored after login.
- [ ] Protected API requests include bearer token.
- [ ] Logout removes token.
- [ ] Invalid login shows readable error.
- [ ] Unauthorized users are redirected to login.

### Dashboard Integration

- [ ] Dashboard summary loads from backend.
- [ ] Recent activity loads from backend.
- [ ] Loading state appears while fetching data.
- [ ] Error state appears if backend is unavailable.

### Product Integration

- [ ] Products load from backend.
- [ ] Product create works.
- [ ] Product update works.
- [ ] Product delete/soft delete works.
- [ ] Low-stock data loads correctly.
- [ ] Duplicate SKU error is shown clearly.

### Category and Supplier Integration

- [ ] Product categories load from backend.
- [ ] Expense categories load from backend.
- [ ] Suppliers load from backend.
- [ ] Create/update/delete flows work.
- [ ] Dropdown data loads in product forms.

### Stock Integration

- [ ] Stock movement history loads.
- [ ] Stock in works.
- [ ] Stock out works.
- [ ] Stock adjustment works.
- [ ] Negative stock prevention error is shown clearly.

### Finance Integration

- [ ] Income records load.
- [ ] Expense records load.
- [ ] Income create works.
- [ ] Expense create works.
- [ ] Transaction update works.
- [ ] Transaction delete works.
- [ ] Financial summary loads correctly.

---

## 10. UI/UX Testing Checklist

Use this checklist for all frontend pages.

- [ ] Page title is clear.
- [ ] Page description is useful.
- [ ] Primary action button is visible.
- [ ] Forms are easy to understand.
- [ ] Tables are readable.
- [ ] Empty state is helpful.
- [ ] Loading state is visible.
- [ ] Error message is understandable.
- [ ] Success message is understandable.
- [ ] Button colors are consistent.
- [ ] Danger actions are clearly marked.
- [ ] Layout spacing is clean.
- [ ] UI looks professional, not too fancy and not boring.
- [ ] Browser console has no critical errors.

---

## 11. Documentation Testing

Before final submission/showcase:

- [ ] Root README is complete.
- [ ] Backend README is complete.
- [ ] Frontend README is complete.
- [ ] Tech stack document is updated.
- [ ] Phase plan is updated.
- [ ] API endpoint documentation is updated.
- [ ] Database design documentation is updated.
- [ ] Testing checklist is updated.
- [ ] Deployment guide is updated.
- [ ] Screenshots are added.
- [ ] Future improvements are listed.

---

## 12. Deployment Testing

This phase is pending.

After deployment:

- [ ] Live frontend opens.
- [ ] Live backend health endpoint works.
- [ ] Live Swagger UI works if enabled.
- [ ] Live database connection works.
- [ ] Registration works.
- [ ] Login works.
- [ ] Protected APIs work with token.
- [ ] Product pages work.
- [ ] Stock pages work.
- [ ] Finance pages work.
- [ ] Dashboard loads.
- [ ] CORS allows frontend requests.
- [ ] Environment variables are set correctly.
- [ ] No secret keys are exposed in GitHub.

---

## 13. Git Checklist Before Commit

Before every commit:

- [ ] Check current branch.
- [ ] Check changed files.
- [ ] Review diff.
- [ ] Confirm build/test command passed.
- [ ] Stage only relevant files.
- [ ] Use a meaningful commit message.

Recommended commands:

```bash
git branch --show-current
git status
git diff --stat
```

Commit example:

```bash
git add docs
git commit -m "docs: update project status before frontend development"
```

---

## 14. Definition of Done

A feature is considered done when:

- It works in the expected flow.
- Important error cases are tested.
- API is tested if backend is involved.
- UI is tested if frontend is involved.
- Angular build passes if frontend is involved.
- Documentation is updated if needed.
- Git diff is reviewed.
- Git commit is made.
- Working tree is clean after commit.
