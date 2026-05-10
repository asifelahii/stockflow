# StockFlow Testing Checklist

## 1. Purpose

This document defines the testing checklist for StockFlow.

The goal is to make sure each phase is tested before moving to the next phase. Since this is a beginner-friendly project, testing will start with manual testing using Swagger, Postman, browser checks, and basic validation. Automated tests can be added gradually later.

---

## 2. Testing Strategy

StockFlow will use a simple phase-wise testing strategy:

1. Build one module.
2. Test backend APIs using Swagger/Postman.
3. Test database changes.
4. Test frontend UI manually.
5. Test frontend-backend connection.
6. Check edge cases.
7. Update documentation.
8. Commit only after the feature works.

A phase is not complete until its main flow works correctly.

---

## 3. General Testing Rules

Before committing any feature:

- Make sure the backend server runs without errors.
- Make sure the frontend runs without errors.
- Make sure database migrations work.
- Test both success and failure cases.
- Check if protected APIs require authentication.
- Check if forms show useful validation messages.
- Check if wrong input is handled properly.
- Check if Git status is clean after commit.

---

## 4. Backend Testing Checklist

Use Swagger and Postman for backend testing.

### General Backend Checks

- [ ] FastAPI server starts successfully.
- [ ] Swagger UI opens.
- [ ] API endpoint appears in Swagger.
- [ ] Request body format is clear.
- [ ] Response body format is correct.
- [ ] Correct status code is returned.
- [ ] Error cases are handled.
- [ ] Protected routes reject unauthenticated requests.
- [ ] Database data is saved correctly.
- [ ] Database relationships work correctly.

### Common Backend Error Cases

Test these when relevant:

- [ ] Missing required field
- [ ] Invalid data type
- [ ] Duplicate email
- [ ] Duplicate SKU
- [ ] Invalid ID
- [ ] Resource not found
- [ ] Unauthorized request
- [ ] Forbidden request
- [ ] Negative quantity
- [ ] Zero or negative amount

---

## 5. Frontend Testing Checklist

Use browser testing for Angular frontend.

### General Frontend Checks

- [ ] Page loads without console errors.
- [ ] Routing works.
- [ ] Form opens correctly.
- [ ] Form validation works.
- [ ] API request is sent correctly.
- [ ] Success message is shown.
- [ ] Error message is shown.
- [ ] Loading state works where needed.
- [ ] Table/list updates after create, update, or delete.
- [ ] Search/filter works if added.
- [ ] Protected pages are not accessible without login.
- [ ] Layout is responsive enough for basic screen sizes.

---

## 6. Phase 1: Backend Foundation Testing

### Backend Checks

- [ ] Virtual environment works.
- [ ] Required packages are installed.
- [ ] FastAPI server starts.
- [ ] `/health` endpoint works.
- [ ] Swagger UI opens.
- [ ] PostgreSQL connection works.
- [ ] SQLAlchemy database session works.
- [ ] Alembic migration setup works.
- [ ] Environment variables are loaded correctly.

### Expected Output

- Backend runs locally.
- Health check returns success.
- Database connection is ready.

---

## 7. Phase 2: Authentication Testing

### Register API

- [ ] User can register with valid data.
- [ ] Duplicate email is rejected.
- [ ] Missing email is rejected.
- [ ] Missing password is rejected.
- [ ] Password is stored as hashed password.
- [ ] User role is assigned correctly.

### Login API

- [ ] User can login with correct credentials.
- [ ] Wrong password is rejected.
- [ ] Unknown email is rejected.
- [ ] JWT token is returned after successful login.
- [ ] Token type is `bearer`.

### Protected Route

- [ ] `/auth/me` works with valid token.
- [ ] `/auth/me` fails without token.
- [ ] `/auth/me` fails with invalid token.

---

## 8. Phase 3: Product Management Testing

### Product Create

- [ ] Product can be created with valid data.
- [ ] Product name is required.
- [ ] SKU is required.
- [ ] Duplicate SKU is rejected.
- [ ] Purchase price cannot be negative.
- [ ] Selling price cannot be negative.
- [ ] Current stock cannot be negative.
- [ ] Low-stock threshold cannot be negative.

### Product List

- [ ] Product list loads correctly.
- [ ] Search by product name works.
- [ ] Search by SKU works.
- [ ] Filter by category works if available.
- [ ] Filter by supplier works if available.
- [ ] Pagination works if available.

### Product Update/Delete

- [ ] Product can be updated.
- [ ] Invalid product ID returns not found.
- [ ] Product can be deactivated/deleted.
- [ ] Deleted/inactive products are handled properly.

---

## 9. Phase 4: Category and Supplier Testing

### Product Category

- [ ] Product category can be created.
- [ ] Product category list loads.
- [ ] Product category can be updated.
- [ ] Product category can be deleted/deactivated.
- [ ] Category used by products is handled safely.

### Expense Category

- [ ] Expense category can be created.
- [ ] Expense category list loads.
- [ ] Expense category can be updated.
- [ ] Expense category can be deleted/deactivated.

### Supplier

- [ ] Supplier can be created.
- [ ] Supplier list loads.
- [ ] Supplier can be updated.
- [ ] Supplier can be deleted/deactivated.
- [ ] Supplier can be selected in product form.

---

## 10. Phase 5: Stock Management Testing

### Stock In

- [ ] Stock in increases product current stock.
- [ ] Stock movement history is created.
- [ ] Quantity must be greater than zero.
- [ ] Invalid product ID is rejected.

### Stock Out

- [ ] Stock out decreases product current stock.
- [ ] Stock movement history is created.
- [ ] Quantity must be greater than zero.
- [ ] Stock cannot go below zero.
- [ ] Invalid product ID is rejected.

### Stock Adjustment

- [ ] Stock can be adjusted with reason.
- [ ] Previous stock and new stock are stored.
- [ ] Adjustment creates stock movement history.
- [ ] New stock cannot be negative.

### Low-Stock Alert

- [ ] Low-stock products are shown when current stock is less than or equal to threshold.
- [ ] Products above threshold are not shown as low stock.
- [ ] Low-stock count appears correctly on dashboard.

---

## 11. Phase 6: Income and Expense Testing

### Income

- [ ] Income transaction can be created.
- [ ] Amount must be greater than zero.
- [ ] Income list loads correctly.
- [ ] Income can be filtered by date.

### Expense

- [ ] Expense transaction can be created.
- [ ] Amount must be greater than zero.
- [ ] Expense category is required.
- [ ] Expense list loads correctly.
- [ ] Expense can be filtered by category.
- [ ] Expense can be filtered by date.

### Monthly Summary

- [ ] Monthly income is calculated correctly.
- [ ] Monthly expense is calculated correctly.
- [ ] Estimated profit is calculated correctly.
- [ ] Date range filter works correctly.

---

## 12. Phase 7: Dashboard and Reports Testing

### Dashboard Cards

- [ ] Total products count is correct.
- [ ] Total suppliers count is correct.
- [ ] Total stock value is correct.
- [ ] Low-stock product count is correct.
- [ ] Monthly income is correct.
- [ ] Monthly expense is correct.
- [ ] Estimated profit is correct.

### Charts

- [ ] Income vs expense chart loads.
- [ ] Expense by category chart loads.
- [ ] Stock movement chart loads.
- [ ] Chart data matches backend response.

### Reports

- [ ] Product report loads.
- [ ] Low-stock report loads.
- [ ] Stock movement report loads.
- [ ] Finance report loads.
- [ ] CSV export downloads correctly.
- [ ] Exported CSV contains correct columns.

---

## 13. Phase 8: Security and Professional Polish Testing

### Role-Based Access

- [ ] Admin can access all allowed pages.
- [ ] Manager has limited access.
- [ ] Staff has limited access.
- [ ] Unauthorized role is blocked from restricted API.
- [ ] Unauthorized role is blocked from restricted frontend route.

### Human Verification

- [ ] Turnstile/CAPTCHA appears on selected public form.
- [ ] Valid verification allows request.
- [ ] Invalid verification blocks request.
- [ ] Backend verifies token before accepting protected public form submission.

### Activity Log

- [ ] Product creation creates activity log.
- [ ] Stock movement creates activity log.
- [ ] Finance transaction creates activity log.
- [ ] User role update creates activity log.

### Pagination and Validation

- [ ] Large lists support pagination.
- [ ] Invalid page/limit values are handled.
- [ ] Backend validation errors are readable.
- [ ] Frontend validation messages are useful.

---

## 14. Documentation Testing

Before final submission/showcase:

- [ ] Root README is complete.
- [ ] Backend setup guide is complete.
- [ ] Frontend setup guide is complete.
- [ ] Environment variable guide is complete.
- [ ] API endpoint documentation is complete.
- [ ] Database design documentation is complete.
- [ ] Screenshots are added.
- [ ] Postman collection is added.
- [ ] Deployment guide is added.
- [ ] Future improvements are listed.

---

## 15. Deployment Testing

After deployment:

- [ ] Live frontend opens.
- [ ] Live backend health endpoint works.
- [ ] Live Swagger UI works if enabled.
- [ ] Live database connection works.
- [ ] Registration works.
- [ ] Login works.
- [ ] Protected APIs work with token.
- [ ] Product CRUD works.
- [ ] Stock movement works.
- [ ] Dashboard loads.
- [ ] Environment variables are set correctly.
- [ ] No secret keys are exposed in GitHub.

---

## 16. Git Checklist Before Commit

Before every commit:

- [ ] Feature is tested.
- [ ] No unnecessary files are added.
- [ ] `.env` file is not committed.
- [ ] `.env.example` is updated if needed.
- [ ] README/docs are updated if needed.
- [ ] Commit message is meaningful.
- [ ] `git status` is checked.

Recommended commands:

```powershell
git status
git add .
git commit -m "type: short meaningful message"
```

---

## 17. Definition of Done

A feature is considered done when:

- It works in the expected flow.
- Important error cases are tested.
- API is tested if backend is involved.
- UI is tested if frontend is involved.
- Documentation is updated if needed.
- Git commit is made.
- Working tree is clean.
