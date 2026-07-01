from dataclasses import dataclass
from typing import Annotated

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.auth import get_current_user, get_token_payload
from app.models.organization import Organization, OrganizationMember
from app.models.user import User
from app.schemas.user import TokenPayload


@dataclass(frozen=True)
class CurrentOrganization:
    id: int
    name: str
    role: str
    user: User


def get_current_organization(
    token_payload: Annotated[TokenPayload, Depends(get_token_payload)],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> CurrentOrganization:
    if token_payload.organization_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Your session does not include an active workspace.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    workspace = (
        db.query(OrganizationMember, Organization)
        .join(
            Organization,
            Organization.id == OrganizationMember.organization_id,
        )
        .filter(
            OrganizationMember.organization_id == token_payload.organization_id,
            OrganizationMember.user_id == current_user.id,
            OrganizationMember.is_active.is_(True),
            Organization.is_active.is_(True),
        )
        .first()
    )

    if workspace is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this workspace.",
        )

    membership, organization = workspace

    return CurrentOrganization(
        id=organization.id,
        name=organization.name,
        role=membership.role,
        user=current_user,
    )
