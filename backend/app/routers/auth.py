import json
import urllib.parse
import urllib.request
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.db.database import get_db
from app.dependencies.auth import get_current_user
from app.models.organization import Organization, OrganizationMember
from app.models.user import User
from app.schemas.user import Token, UserCreate, UserLogin, UserResponse


router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


def verify_turnstile_token(token: str | None) -> bool:
    if not settings.turnstile_secret_key:
        return True

    if not token:
        return False

    payload = urllib.parse.urlencode(
        {
            "secret": settings.turnstile_secret_key,
            "response": token,
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        data=payload,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=5) as response:
            result = json.loads(response.read().decode("utf-8"))

        return bool(result.get("success"))
    except Exception:
        return False


def get_default_workspace(
    db: Session,
    user_id: int,
) -> tuple[OrganizationMember, Organization] | None:
    return (
        db.query(OrganizationMember, Organization)
        .join(
            Organization,
            Organization.id == OrganizationMember.organization_id,
        )
        .filter(
            OrganizationMember.user_id == user_id,
            OrganizationMember.is_active.is_(True),
            Organization.is_active.is_(True),
        )
        .order_by(OrganizationMember.id.asc())
        .first()
    )


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    user_data: UserCreate,
    db: Annotated[Session, Depends(get_db)],
):
    if not verify_turnstile_token(user_data.turnstile_token):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bot verification failed. Please try again.",
        )

    existing_user = db.query(User).filter(User.email == user_data.email).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    try:
        user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            hashed_password=get_password_hash(user_data.password),
            role="staff",
            is_active=True,
        )

        organization = Organization(
            name=user_data.organization_name,
            is_active=True,
        )

        db.add_all([user, organization])
        db.flush()

        membership = OrganizationMember(
            organization_id=organization.id,
            user_id=user.id,
            role="owner",
            is_active=True,
        )

        db.add(membership)
        db.commit()
        db.refresh(user)

        return user

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )


@router.post("/login", response_model=Token)
def login_user(
    login_data: UserLogin,
    db: Annotated[Session, Depends(get_db)],
):
    user = db.query(User).filter(User.email == login_data.email).first()

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account",
        )

    workspace = get_default_workspace(db, user.id)

    if workspace is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No active workspace is assigned to this account.",
        )

    membership, organization = workspace

    access_token = create_access_token(
        subject=user.id,
        additional_claims={
            "organization_id": organization.id,
            "organization_role": membership.role,
        },
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "organization": {
            "id": organization.id,
            "name": organization.name,
            "role": membership.role,
        },
    }


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: Annotated[User, Depends(get_current_user)],
):
    return current_user
