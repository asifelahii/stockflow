# # from typing import Annotated

# # from fastapi import APIRouter, Depends, Query
# # from sqlalchemy.orm import Session

# # from app.db.database import get_db
# # from app.dependencies.auth import get_current_user
# # from app.models.user import User
# # from app.schemas.dashboard import (
# #     DashboardRecentActivityResponse,
# #     DashboardSummaryResponse,
# #     RecentFinancialTransactionResponse,
# #     RecentStockMovementResponse,
# # )
# # from app.services import dashboard_service


# # router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])


# # @router.get("/summary", response_model=DashboardSummaryResponse)
# # def get_dashboard_summary(
# #     db: Annotated[Session, Depends(get_db)],
# #     current_user: Annotated[User, Depends(get_current_user)],
# # ):
# #     return dashboard_service.get_dashboard_summary(db)


# # @router.get("/recent-activity", response_model=DashboardRecentActivityResponse)
# # def get_recent_activity(
# #     db: Annotated[Session, Depends(get_db)],
# #     current_user: Annotated[User, Depends(get_current_user)],
# #     limit: int = Query(default=5, ge=1, le=20),
# # ):
# #     recent_stock_movements = dashboard_service.get_recent_stock_movements(
# #         db=db,
# #         limit=limit,
# #     )

# #     recent_financial_transactions = (
# #         dashboard_service.get_recent_financial_transactions(
# #             db=db,
# #             limit=limit,
# #         )
# #     )

# #     return {
# #         "recent_stock_movements": [
# #             RecentStockMovementResponse.model_validate(movement)
# #             for movement in recent_stock_movements
# #         ],
# #         "recent_financial_transactions": [
# #             RecentFinancialTransactionResponse(
# #                 id=transaction.id,
# #                 transaction_type=transaction.transaction_type,
# #                 title=transaction.title,
# #                 amount=transaction.amount,
# #                 transaction_date=str(transaction.transaction_date),
# #                 description=transaction.description,
# #             )
# #             for transaction in recent_financial_transactions
# #         ],
# #     }

# from typing import Annotated

# from fastapi import APIRouter, Depends, Query
# from sqlalchemy.orm import Session

# from app.db.database import get_db
# from app.dependencies.auth import get_current_user
# from app.models.user import User
# from app.schemas.dashboard import (
#     DashboardRecentActivityResponse,
#     DashboardSummaryResponse,
# )
# from app.services import dashboard_service


# router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])


# @router.get("/summary", response_model=DashboardSummaryResponse)
# def get_dashboard_summary(
#     db: Annotated[Session, Depends(get_db)],
#     current_user: Annotated[User, Depends(get_current_user)],
# ):
#     return dashboard_service.get_dashboard_summary(db)


# @router.get("/recent-activity", response_model=DashboardRecentActivityResponse)
# def get_recent_activity(
#     db: Annotated[Session, Depends(get_db)],
#     current_user: Annotated[User, Depends(get_current_user)],
#     limit: int = Query(default=5, ge=1, le=20),
# ):
#     return dashboard_service.get_recent_activity(db=db, limit=limit)


from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.dashboard import (
    DashboardRecentActivityResponse,
    DashboardSummaryResponse,
)
from app.services import dashboard_service


router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    return dashboard_service.get_dashboard_summary(db)


@router.get("/recent-activity", response_model=DashboardRecentActivityResponse)
def get_recent_activity(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
    limit: int = Query(default=5, ge=1, le=20),
):
    return dashboard_service.get_recent_activity(db=db, limit=limit)