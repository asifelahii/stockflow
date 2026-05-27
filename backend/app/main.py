from fastapi import FastAPI

from app.core.config import settings
from app.routers import auth, health, products


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Backend API for StockFlow Inventory and Business Expense Management System",
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(products.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to StockFlow API",
        "docs": "/docs",
        "health": "/health",
    }