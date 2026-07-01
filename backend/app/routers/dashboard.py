from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.organization import CurrentOrganization, get_current_organization
from app.schemas.dashboard import (
    DashboardRecentActivityResponse,
    DashboardSummaryResponse,
)
from app.services import dashboard_service


router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(
    db: Annotated[Session, Depends(get_db)],
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
):
    return dashboard_service.get_dashboard_summary(
        db,
        current_organization.id,
    )


@router.get(
    "/recent-activity",
    response_model=DashboardRecentActivityResponse,
)
def get_recent_activity(
    db: Annotated[Session, Depends(get_db)],
    current_organization: Annotated[
        CurrentOrganization,
        Depends(get_current_organization),
    ],
    limit: int = Query(default=5, ge=1, le=20),
):
    return dashboard_service.get_recent_activity(
        db=db,
        organization_id=current_organization.id,
        limit=limit,
    )
