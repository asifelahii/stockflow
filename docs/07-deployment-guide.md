# StockFlow Deployment Guide

## 1. Purpose

This document defines the planned deployment approach for StockFlow.

The goal is to make the project publicly accessible so it can be shown in a portfolio, GitHub README, CV, and interviews.

Current status:

```txt
Backend completed and manually tested locally.
Angular frontend initialized and build verified.
Frontend layout/auth UI and frontend-backend integration are pending before deployment.
```

---

## 2. Deployment Goal

The final deployed project should include:

- Live Angular frontend
- Live FastAPI backend
- Cloud PostgreSQL database
- Working frontend-backend connection
- Secure environment variable configuration
- Proper CORS configuration
- Updated README with live demo links
- Screenshots for GitHub/portfolio
- Public portfolio-ready project presentation

---

## 3. Current Deployment Readiness

| Area                             | Status              |
| -------------------------------- | ------------------- |
| Backend local development        | Completed           |
| Backend API functionality        | Completed           |
| Backend API testing              | Completed           |
| Backend README                   | Completed           |
| Angular frontend setup           | Completed           |
| Angular build check              | Passed              |
| Frontend layout/auth UI          | Pending/In progress |
| Frontend feature screens         | Pending             |
| Frontend-backend integration     | Pending             |
| Production environment variables | Pending             |
| Cloud database                   | Pending             |
| Backend deployment               | Pending             |
| Frontend deployment              | Pending             |
| Final live testing               | Pending             |

---

## 4. Planned Deployment Architecture

The planned deployment structure is:

```txt
User Browser
    ↓
Angular Frontend
    ↓
FastAPI Backend API
    ↓
PostgreSQL Database
```

Example production structure:

```txt
Frontend: https://stockflow-frontend.example.com
Backend:  https://stockflow-api.example.com
Database: Cloud PostgreSQL service
```

Actual production URLs will be added after deployment.

---

## 5. Recommended Deployment Platforms

The exact platform will be finalized during deployment.

Recommended beginner-friendly options:

| Part     | Recommended Options                             |
| -------- | ----------------------------------------------- |
| Frontend | Vercel / Netlify                                |
| Backend  | Render / Railway                                |
| Database | Neon / Supabase PostgreSQL / Railway PostgreSQL |

Preferred first deployment combination:

```txt
Frontend: Vercel or Netlify
Backend: Render or Railway
Database: Neon or Supabase PostgreSQL
```

Selection criteria:

- Easy setup
- Free or low-cost tier
- Good PostgreSQL support
- Environment variable support
- Simple GitHub integration
- Reliable enough for portfolio demo

---

## 6. Environment Variables

Sensitive values must never be committed to GitHub.

### Backend Environment Variables

The backend should use environment variables such as:

```env
DATABASE_URL=
SECRET_KEY=
ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
FRONTEND_URL=
```

### Frontend Environment Variables

The frontend may use:

```env
API_BASE_URL=
```

Actual values should only be stored in:

- Local `.env` file
- Deployment platform environment variable settings

The repository should include only safe example files such as:

```txt
.env.example
```

Never commit:

```txt
.env
```

---

## 7. Backend Deployment Plan

Backend deployment will be done after frontend integration is ready.

### Backend Preparation Checklist

- [ ] Confirm backend runs locally.
- [ ] Confirm `/health` works.
- [ ] Confirm Swagger UI works locally.
- [ ] Confirm backend API test checklist is complete.
- [ ] Confirm `requirements.txt` is updated.
- [ ] Confirm `.env.example` is updated.
- [ ] Confirm production `DATABASE_URL` is ready.
- [ ] Confirm production `SECRET_KEY` is configured.
- [ ] Confirm CORS allows deployed frontend URL.
- [ ] Confirm Alembic migrations can run against production database.

### Backend Deployment Steps

1. Choose backend hosting platform.
2. Connect GitHub repository if supported.
3. Set backend project root.
4. Configure build/start command.
5. Add environment variables.
6. Connect production PostgreSQL database.
7. Run Alembic migrations.
8. Start FastAPI app.
9. Test live `/health`.
10. Test live auth endpoints.
11. Test protected endpoints with JWT.

### Expected Backend Checks

- [ ] Backend server starts successfully.
- [ ] Database connection works.
- [ ] `/health` endpoint works live.
- [ ] Authentication endpoints work live.
- [ ] Protected endpoints require JWT token.
- [ ] CORS allows frontend requests.

---

## 8. Frontend Deployment Plan

Frontend deployment will be done after Angular UI and API integration are complete.

### Frontend Preparation Checklist

- [ ] Angular app builds successfully.
- [ ] Production API base URL is configured.
- [ ] Login/register pages work locally.
- [ ] Protected route structure works locally.
- [ ] Dashboard layout works locally.
- [ ] Feature screens work locally.
- [ ] API requests reach backend locally.
- [ ] Browser console has no critical errors.

### Frontend Deployment Steps

1. Choose frontend hosting platform.
2. Connect GitHub repository if supported.
3. Set frontend project root as `frontend`.
4. Configure Angular build command.
5. Configure production output directory.
6. Add frontend environment/API base URL if needed.
7. Deploy frontend.
8. Test live frontend URL.
9. Test frontend-backend connection.
10. Test login/register flow.
11. Test protected pages.

### Expected Frontend Checks

- [ ] Frontend opens publicly.
- [ ] No critical console errors.
- [ ] Login page loads.
- [ ] Register page loads.
- [ ] Dashboard route works after login.
- [ ] API calls reach deployed backend.
- [ ] Protected pages work only after login.

---

## 9. Database Deployment Plan

The production database will use cloud PostgreSQL.

### Database Preparation Checklist

- [ ] Cloud PostgreSQL database is created.
- [ ] Production database URL is copied securely.
- [ ] Database URL is added to backend deployment environment variables.
- [ ] Alembic migrations are run.
- [ ] Database tables are created correctly.
- [ ] Backend can connect to production database.

### Possible Database Providers

| Provider           | Notes                                        |
| ------------------ | -------------------------------------------- |
| Neon               | Good free PostgreSQL option                  |
| Supabase           | PostgreSQL with dashboard and extra services |
| Railway PostgreSQL | Easy if backend also uses Railway            |

---

## 10. CORS Configuration

The backend must allow requests from the deployed Angular frontend.

Local frontend example:

```txt
http://localhost:4200
```

Production frontend example:

```txt
https://stockflow-frontend.example.com
```

CORS should allow:

- Local frontend during development
- Production frontend after deployment

Do not allow unrestricted origins in final production unless temporarily needed for debugging.

---

## 11. Production Migration Plan

Alembic should be used to apply database changes in production.

Expected command pattern:

```powershell
alembic upgrade head
```

Before running migrations:

- Confirm production database URL is correct.
- Confirm local `.env` is not accidentally used.
- Confirm migration files are committed.
- Confirm backup/export if needed.

---

## 12. Deployment Testing Checklist

After deployment, test these flows:

### Backend

- [ ] Live `/health` works.
- [ ] Live Swagger UI works if enabled.
- [ ] User registration works.
- [ ] User login works.
- [ ] JWT token is returned.
- [ ] Protected endpoint rejects missing token.
- [ ] Protected endpoint works with valid token.

### Frontend

- [ ] Live frontend opens.
- [ ] Login page loads.
- [ ] Register page loads.
- [ ] User can log in.
- [ ] User can access dashboard after login.
- [ ] User cannot access protected pages without login.
- [ ] Logout works.

### Business Flows

- [ ] Product list loads.
- [ ] Product create/update/delete works.
- [ ] Categories load.
- [ ] Suppliers load.
- [ ] Stock in works.
- [ ] Stock out works.
- [ ] Stock adjustment works.
- [ ] Finance records load.
- [ ] Dashboard summary loads.
- [ ] Recent activity loads.

---

## 13. Common Deployment Errors and Fixes

### Backend does not start

Possible causes:

- Missing environment variable
- Wrong start command
- Dependency missing from `requirements.txt`
- Wrong Python version
- Database URL issue

### Database connection fails

Possible causes:

- Wrong `DATABASE_URL`
- Database service is paused
- SSL requirement issue
- Migration not run
- Network access restriction

### Frontend cannot call backend

Possible causes:

- Wrong API base URL
- CORS not configured
- Backend not deployed
- Mixed HTTP/HTTPS issue
- Missing authorization header

### Login works locally but not live

Possible causes:

- Wrong backend URL
- CORS issue
- JWT secret missing
- Token not stored correctly
- Frontend environment not configured

---

## 14. README and Portfolio Update After Deployment

After deployment, update:

```txt
README.md
frontend/README.md
backend/README.md
docs/07-deployment-guide.md
```

Add:

- Live frontend link
- Live backend link
- Swagger/API docs link if public
- Screenshots
- Setup instructions
- Deployment notes
- Known limitations
- Future improvements

---

## 15. Portfolio Positioning

StockFlow should be presented as:

> A secure full-stack inventory and business expense management system for small businesses, built with Angular, FastAPI, and PostgreSQL. It includes JWT authentication, product and supplier management, stock movement tracking, income/expense tracking, dashboard summaries, and a modern business dashboard frontend.

---

## 16. Deployment Timing

Deployment should happen only after:

- Frontend layout/auth UI is completed.
- Main feature screens are completed.
- Frontend-backend integration is completed.
- Angular build passes.
- Full local testing is completed.
- Documentation is updated.
- GitHub repository is clean.

Do not deploy before frontend-backend integration is stable.

---

## 17. Final Deployment Definition of Done

Deployment is complete when:

- Live frontend works.
- Live backend works.
- Live database works.
- Frontend can communicate with backend.
- Auth flow works live.
- Core business flows work live.
- README contains live links.
- Screenshots are added.
- No secrets are exposed.
- GitHub repository is portfolio-ready.
