# StockFlow Backend

This is the FastAPI backend for StockFlow: Inventory and Business Expense Management System.

## Current Phase

Phase 1: Backend Foundation

## Tech Stack

- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- Pydantic Settings
- Uvicorn

## Local Setup

Create and activate virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Run development server:

```powershell
python -m uvicorn app.main:app --reload
```

Health check:

```txt
http://127.0.0.1:8000/health
```

API docs:

```txt
http://127.0.0.1:8000/docs
```

## Environment Variables

Copy `.env.example` to `.env` and update values when needed.

Do not commit `.env`.
