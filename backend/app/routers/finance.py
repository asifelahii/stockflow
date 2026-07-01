from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.organization import CurrentOrganization, get_current_organization
from app.schemas.financial_transaction import (
    ExpenseCreate,
    FinancialSummaryResponse,
    FinancialTransactionResponse,
    FinancialTransactionUpdate,
    IncomeCreate,
)
from app.services import finance_service


router = APIRouter(prefix="/api/v1/finance", tags=["Finance"])


@router.post(
    "/income",
    response_model=FinancialTransactionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_income(
    income_data: IncomeCreate,
    db: Annotated[Session, Depends(get_db)],
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
):
    return finance_service.create_income(
        db=db,
        organization_id=current_organization.id,
        income_data=income_data,
        created_by_id=current_organization.user.id,
    )


@router.post(
    "/expenses",
    response_model=FinancialTransactionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_expense(
    expense_data: ExpenseCreate,
    db: Annotated[Session, Depends(get_db)],
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
):
    if expense_data.expense_category_id is not None:
        category_exists = finance_service.expense_category_exists(
            db,
            current_organization.id,
            expense_data.expense_category_id,
        )

        if not category_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Expense category not found",
            )

    return finance_service.create_expense(
        db=db,
        organization_id=current_organization.id,
        expense_data=expense_data,
        created_by_id=current_organization.user.id,
    )


@router.get(
    "/transactions",
    response_model=list[FinancialTransactionResponse],
)
def get_transactions(
    db: Annotated[Session, Depends(get_db)],
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
    transaction_type: str | None = Query(default=None),
):
    return finance_service.get_transactions(
        db=db,
        organization_id=current_organization.id,
        transaction_type=transaction_type,
    )


@router.get(
    "/transactions/{transaction_id}",
    response_model=FinancialTransactionResponse,
)
def get_transaction(
    transaction_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
):
    transaction = finance_service.get_transaction_by_id(
        db,
        current_organization.id,
        transaction_id,
    )

    if transaction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )

    return transaction


@router.put(
    "/transactions/{transaction_id}",
    response_model=FinancialTransactionResponse,
)
def update_transaction(
    transaction_id: int,
    transaction_data: FinancialTransactionUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
):
    transaction = finance_service.get_transaction_by_id(
        db,
        current_organization.id,
        transaction_id,
    )

    if transaction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )

    if transaction_data.expense_category_id is not None:
        category_exists = finance_service.expense_category_exists(
            db,
            current_organization.id,
            transaction_data.expense_category_id,
        )

        if not category_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Expense category not found",
            )

    return finance_service.update_transaction(
        db=db,
        transaction=transaction,
        transaction_data=transaction_data,
    )


@router.delete(
    "/transactions/{transaction_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_transaction(
    transaction_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
):
    transaction = finance_service.get_transaction_by_id(
        db,
        current_organization.id,
        transaction_id,
    )

    if transaction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )

    finance_service.delete_transaction(db, transaction)


@router.get(
    "/summary",
    response_model=FinancialSummaryResponse,
)
def get_financial_summary(
    db: Annotated[Session, Depends(get_db)],
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
):
    return finance_service.get_financial_summary(
        db,
        current_organization.id,
    )
