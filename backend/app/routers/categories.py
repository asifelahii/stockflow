from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    ExpenseCategoryResponse,
    ProductCategoryResponse,
)
from app.services import category_service


router = APIRouter(tags=["Categories"])


@router.post(
    "/api/v1/product-categories",
    response_model=ProductCategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_product_category(
    category_data: CategoryCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    existing_category = category_service.get_product_category_by_name(
        db,
        category_data.name,
    )

    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Product category already exists",
        )

    return category_service.create_product_category(db, category_data)


@router.get(
    "/api/v1/product-categories",
    response_model=list[ProductCategoryResponse],
)
def get_product_categories(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    return category_service.get_product_categories(db)


@router.get(
    "/api/v1/product-categories/{category_id}",
    response_model=ProductCategoryResponse,
)
def get_product_category(
    category_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    category = category_service.get_product_category_by_id(db, category_id)

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product category not found",
        )

    return category


@router.put(
    "/api/v1/product-categories/{category_id}",
    response_model=ProductCategoryResponse,
)
def update_product_category(
    category_id: int,
    category_data: CategoryUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    category = category_service.get_product_category_by_id(db, category_id)

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product category not found",
        )

    if category_data.name and category_data.name != category.name:
        existing_category = category_service.get_product_category_by_name(
            db,
            category_data.name,
        )

        if existing_category:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Product category already exists",
            )

    return category_service.update_product_category(db, category, category_data)


@router.delete(
    "/api/v1/product-categories/{category_id}",
    response_model=ProductCategoryResponse,
)
def delete_product_category(
    category_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    category = category_service.get_product_category_by_id(db, category_id)

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product category not found",
        )

    return category_service.delete_product_category(db, category)


@router.post(
    "/api/v1/expense-categories",
    response_model=ExpenseCategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_expense_category(
    category_data: CategoryCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    existing_category = category_service.get_expense_category_by_name(
        db,
        category_data.name,
    )

    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Expense category already exists",
        )

    return category_service.create_expense_category(db, category_data)


@router.get(
    "/api/v1/expense-categories",
    response_model=list[ExpenseCategoryResponse],
)
def get_expense_categories(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    return category_service.get_expense_categories(db)


@router.get(
    "/api/v1/expense-categories/{category_id}",
    response_model=ExpenseCategoryResponse,
)
def get_expense_category(
    category_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    category = category_service.get_expense_category_by_id(db, category_id)

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense category not found",
        )

    return category


@router.put(
    "/api/v1/expense-categories/{category_id}",
    response_model=ExpenseCategoryResponse,
)
def update_expense_category(
    category_id: int,
    category_data: CategoryUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    category = category_service.get_expense_category_by_id(db, category_id)

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense category not found",
        )

    if category_data.name and category_data.name != category.name:
        existing_category = category_service.get_expense_category_by_name(
            db,
            category_data.name,
        )

        if existing_category:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Expense category already exists",
            )

    return category_service.update_expense_category(db, category, category_data)


@router.delete(
    "/api/v1/expense-categories/{category_id}",
    response_model=ExpenseCategoryResponse,
)
def delete_expense_category(
    category_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    category = category_service.get_expense_category_by_id(db, category_id)

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense category not found",
        )

    return category_service.delete_expense_category(db, category)