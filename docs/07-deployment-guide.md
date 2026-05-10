# StockFlow Deployment Guide

## 1. Purpose

This document defines the planned deployment approach for StockFlow.

The goal is to make the project publicly accessible so it can be shown in a portfolio, GitHub README, CV, and interviews.

This guide is a planning document for now. Exact deployment commands and links will be updated during Phase 10 after the application is fully built.

---

## 2. Deployment Goal

The final deployed project should include:

- Live Angular frontend
- Live FastAPI backend
- Cloud PostgreSQL database
- Working frontend-backend connection
- Environment variables configured securely
- Public GitHub repository
- Updated README with live demo link
- Screenshots and setup instructions

---

## 3. Planned Deployment Architecture

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

Example:

```txt
Frontend: https://stockflow-frontend.example.com
Backend:  https://stockflow-api.example.com
Database: Cloud PostgreSQL service
```

The actual URLs will be added after deployment.

---

## 4. Possible Deployment Platforms

The exact platform will be finalized later.

Possible options:

| Part     | Possible Platform                    |
| -------- | ------------------------------------ |
| Frontend | Vercel / Netlify                     |
| Backend  | Render / Railway / Fly.io            |
| Database | Neon / Supabase / Railway PostgreSQL |

For the first deployment, the preferred beginner-friendly setup is:

```txt
Frontend: Vercel or Netlify
Backend: Render or Railway
Database: Neon or Supabase PostgreSQL
```

---

## 5. Environment Variables

Sensitive values must not be committed to GitHub.

The backend should use environment variables such as:

```env
DATABASE_URL=
SECRET_KEY=
ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
FRONTEND_URL=
```

The frontend may use:

```env
API_BASE_URL=
```

Actual values should be stored only in:

- Local `.env` file
- Deployment platform environment variable settings

The repository should include only:

```txt
.env.example
```

Never commit:

```txt
.env
```

---

## 6. Backend Deployment Plan

The FastAPI backend deployment will include:

- Prepare backend dependencies.
- Confirm `requirements.txt` is updated.
- Configure production database URL.
- Configure secret key and JWT settings.
- Add CORS settings for the deployed frontend URL.
- Run database migrations.
- Start FastAPI using a production server command.
- Test live `/health` endpoint.
- Test Swagger/API docs if enabled.
- Test authentication and protected APIs.

Expected backend checks:

- Backend server starts successfully.
- Database connection works.
- `/health` endpoint works.
- Authentication endpoints work.
- Protected endpoints require JWT token.
- CORS allows frontend requests.

---

## 7. Frontend Deployment Plan

The Angular frontend deployment will include:

- Configure production API base URL.
- Build Angular production version.
- Deploy frontend to selected platform.
- Test all public routes.
- Test login/register flow.
- Test protected routes.
- Test product and stock pages.
- Test dashboard pages.
- Confirm frontend can communicate with backend.

Expected frontend checks:

- Frontend opens publicly.
- No console errors.
- Login works.
- API calls reach deployed backend.
- Protected pages work only after login.
- Dashboard and tables load correctly.

---

## 8. Database Deployment Plan

The PostgreSQL database deployment will include:

- Create cloud PostgreSQL database.
- Copy production database URL.
- Add database URL to backend environment variables.
- Run Alembic migrations.
- Verify tables are created.
- Test data creation from API.
- Confirm database is not publicly exposed unnecessarily.

Expected database checks:

- Backend can connect to database.
- Tables are created.
- User registration saves data.
- Product creation saves data.
- Stock movement updates data correctly.

---

## 9. CORS Plan

The backend must allow requests from the deployed frontend.

Local development:

```txt
http://localhost:4200
```

Production:

```txt
https://deployed-frontend-url.com
```

CORS settings should not allow every origin permanently in production unless necessary.

---

## 10. Deployment Testing Checklist

After deployment, test:

- [ ] Live frontend opens.
- [ ] Live backend `/health` works.
- [ ] Database connection works.
- [ ] User registration works.
- [ ] User login works.
- [ ] JWT token is returned.
- [ ] Protected route works with token.
- [ ] Product CRUD works.
- [ ] Category CRUD works.
- [ ] Supplier CRUD works.
- [ ] Stock in/out works.
- [ ] Low-stock alert works.
- [ ] Dashboard loads.
- [ ] Reports load.
- [ ] CSV export works if available.
- [ ] No secret values are exposed in GitHub.
- [ ] README has live demo link.
- [ ] README has deployment notes.

---

## 11. Common Deployment Issues to Watch

Possible issues:

| Issue                            | Possible Cause                                 |
| -------------------------------- | ---------------------------------------------- |
| Frontend cannot call backend     | Wrong API base URL or CORS issue               |
| Backend cannot connect database  | Wrong `DATABASE_URL`                           |
| Login works locally but not live | Missing production secret/environment variable |
| Database tables missing          | Migrations were not run                        |
| 404 on frontend route refresh    | Frontend routing configuration issue           |
| 500 server error                 | Missing environment variable or database issue |
| CORS error in browser            | Backend CORS origin not configured correctly   |

---

## 12. GitHub README Deployment Updates

After deployment, update root `README.md` with:

- Live frontend link
- Live API link
- Screenshots
- Setup guide
- Environment variable guide
- Deployment notes
- Tech stack
- Project features
- Future improvements

Example:

```markdown
## Live Demo

Frontend: Coming soon  
Backend API: Coming soon
```

Later replace Coming soon with actual links.

---

## 13. Portfolio Update Plan

After deployment, add this project to the portfolio website.

Portfolio project section should include:

- Project title
- Short problem statement
- Key features
- Tech stack
- Screenshots
- GitHub link
- Live demo link
- What was learned

Example project title:

```txt
StockFlow: Inventory and Business Expense Management System
```

Example short description:

```txt
A secure full-stack inventory and expense management system for small businesses, built with Angular, FastAPI, and PostgreSQL.
```

---

## 14. LinkedIn/GitHub Showcase Plan

After final deployment, prepare a short post:

```txt
I built StockFlow, a full-stack inventory and business expense management system for small businesses.

Tech stack:
Angular, FastAPI, PostgreSQL, SQLAlchemy, Alembic, JWT authentication.

Key features:
Product management, supplier management, stock movement tracking, low-stock alerts, income/expense tracking, dashboard summaries, reports, and secure authentication.

GitHub:
Live demo:
```

This will be finalized after the project is complete.

---

## 15. Final Deployment Definition of Done

Deployment is complete when:

- Frontend is live.
- Backend is live.
- Database is live.
- Core features work in production.
- README is updated.
- Screenshots are added.
- Portfolio section is updated.
- GitHub repository is clean.
- No secrets are exposed.
