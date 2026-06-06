from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import (
    auth,
    categories,
    dashboard,
    finance,
    health,
    products,
    stock,
    suppliers,
)


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Backend API for StockFlow Inventory and Business Expense Management System",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://127.0.0.1:4200",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(suppliers.router)
app.include_router(stock.router)
app.include_router(finance.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to StockFlow API",
        "docs": "/docs",
        "health": "/health",
    }
