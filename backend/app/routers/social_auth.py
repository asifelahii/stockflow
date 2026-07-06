import logging
import urllib.parse
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.social_auth import (
    OAuthProvidersResponse,
    OAuthTicketExchangeRequest,
)
from app.schemas.user import Token
from app.services.social_oauth_service import (
    OAuthFlowError,
    OAuthProvider,
    SUPPORTED_PROVIDERS,
    complete_provider_callback,
    create_authorization_url,
    exchange_login_ticket,
    frontend_error_redirect,
    frontend_success_redirect,
    provider_is_configured,
)


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/auth/oauth", tags=["Social authentication"])


@router.get("/providers", response_model=OAuthProvidersResponse)
def get_oauth_providers():
    return {
        provider: provider_is_configured(provider)
        for provider in SUPPORTED_PROVIDERS
    }


@router.get("/{provider}/start")
def start_oauth_login(
    provider: OAuthProvider,
    db: Annotated[Session, Depends(get_db)],
):
    try:
        return RedirectResponse(
            url=create_authorization_url(db, provider),
            status_code=status.HTTP_302_FOUND,
        )
    except OAuthFlowError as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(error),
        ) from error


@router.get("/{provider}/callback")
def complete_oauth_login(
    provider: OAuthProvider,
    db: Annotated[Session, Depends(get_db)],
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
):
    if error:
        return RedirectResponse(
            url=frontend_error_redirect("oauth_cancelled"),
            status_code=status.HTTP_302_FOUND,
        )

    try:
        ticket = complete_provider_callback(
            db=db,
            provider=provider,
            code=code,
            state=state,
        )

        return RedirectResponse(
            url=frontend_success_redirect(ticket),
            status_code=status.HTTP_302_FOUND,
        )
    except OAuthFlowError as error:
        logger.warning(
            "OAuth callback failed: provider=%s reason=%s",
            provider,
            error,
        )
        return RedirectResponse(
            url=frontend_error_redirect("oauth_failed"),
            status_code=status.HTTP_302_FOUND,
        )


@router.post("/apple/callback")
async def complete_apple_oauth_login(
    request: Request,
    db: Annotated[Session, Depends(get_db)],
):
    raw_body = (await request.body()).decode("utf-8")
    payload = urllib.parse.parse_qs(raw_body)

    code = payload.get("code", [None])[0]
    state = payload.get("state", [None])[0]
    error = payload.get("error", [None])[0]
    raw_user = payload.get("user", [None])[0]

    if error:
        return RedirectResponse(
            url=frontend_error_redirect("oauth_cancelled"),
            status_code=status.HTTP_302_FOUND,
        )

    try:
        ticket = complete_provider_callback(
            db=db,
            provider="apple",
            code=code,
            state=state,
            raw_apple_user=raw_user,
        )

        return RedirectResponse(
            url=frontend_success_redirect(ticket),
            status_code=status.HTTP_302_FOUND,
        )
    except OAuthFlowError as error:
        logger.warning(
            "OAuth callback failed: provider=apple reason=%s",
            error,
        )
        return RedirectResponse(
            url=frontend_error_redirect("oauth_failed"),
            status_code=status.HTTP_302_FOUND,
        )


@router.post("/exchange", response_model=Token)
def exchange_oauth_ticket(
    request_data: OAuthTicketExchangeRequest,
    db: Annotated[Session, Depends(get_db)],
):
    try:
        return exchange_login_ticket(db, request_data.ticket)
    except OAuthFlowError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(error),
        ) from error
