import base64
import hashlib
import hmac
import json
import logging
import re
import secrets
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Literal

import jwt
from jwt import PyJWKClient
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash
from app.models.organization import Organization, OrganizationMember
from app.models.social_auth import (
    OAuthAuthorizationRequest,
    OAuthIdentity,
    OAuthLoginTicket,
)
from app.models.user import User

logger = logging.getLogger(__name__)


OAuthProvider = Literal["google", "facebook", "apple"]
SUPPORTED_PROVIDERS: tuple[OAuthProvider, ...] = ("google", "facebook", "apple")


class OAuthFlowError(Exception):
    """Safe error shown to the browser after an OAuth failure."""


@dataclass
class SocialProfile:
    provider: OAuthProvider
    subject: str
    email: str | None
    email_verified: bool
    display_name: str | None


def _now() -> datetime:
    return datetime.utcnow()


def _hash(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def _urlsafe(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).decode("utf-8").rstrip("=")


def _derived_value(label: str, state: str) -> str:
    digest = hmac.new(
        settings.secret_key.encode("utf-8"),
        f"{label}:{state}".encode("utf-8"),
        hashlib.sha256,
    ).digest()
    return _urlsafe(digest)


def _nonce(state: str) -> str:
    return _derived_value("oauth-nonce", state)


def _code_verifier(state: str) -> str:
    return _derived_value("oauth-pkce", state)


def _code_challenge(verifier: str) -> str:
    return _urlsafe(hashlib.sha256(verifier.encode("utf-8")).digest())


def _base_url(value: str) -> str:
    url = value.strip().rstrip("/")

    if not url.startswith(("http://", "https://")):
        raise OAuthFlowError("OAuth URL configuration is invalid.")

    return url


def get_callback_url(provider: OAuthProvider) -> str:
    return f"{_base_url(settings.public_api_base_url)}/api/v1/auth/oauth/{provider}/callback"


def _frontend_redirect(path: str, **params: str) -> str:
    query = urllib.parse.urlencode(params)
    return f"{_base_url(settings.frontend_url)}/{path.lstrip('/')}?{query}"


def frontend_success_redirect(ticket: str) -> str:
    return _frontend_redirect("auth/oauth/callback", ticket=ticket)


def frontend_error_redirect(error: str) -> str:
    return _frontend_redirect("auth/oauth/callback", error=error)


def provider_is_configured(provider: OAuthProvider) -> bool:
    if provider == "google":
        return bool(
            settings.google_oauth_client_id
            and settings.google_oauth_client_secret
        )

    if provider == "facebook":
        return bool(
            settings.facebook_oauth_client_id
            and settings.facebook_oauth_client_secret
        )

    return bool(
        settings.apple_oauth_client_id
        and settings.apple_oauth_team_id
        and settings.apple_oauth_key_id
        and settings.apple_oauth_private_key
    )


def _facebook_version() -> str:
    version = settings.facebook_graph_api_version.strip()

    if not re.fullmatch(r"v\d+\.\d+", version):
        raise OAuthFlowError("Facebook Graph API version configuration is invalid.")

    return version


def _http_json(
    url: str,
    *,
    method: str = "GET",
    form_data: dict[str, str] | None = None,
) -> dict:
    data = None
    headers = {"Accept": "application/json"}

    if form_data is not None:
        data = urllib.parse.urlencode(form_data).encode("utf-8")
        headers["Content-Type"] = "application/x-www-form-urlencoded"

    request = urllib.request.Request(
        url,
        data=data,
        headers=headers,
        method=method,
    )

    try:
        with urllib.request.urlopen(request, timeout=12) as response:
            payload = response.read().decode("utf-8")
            return json.loads(payload)
    except urllib.error.HTTPError as error:
        logger.warning(
            "OAuth provider request rejected: status=%s",
            error.code,
        )
        raise OAuthFlowError(
            "The identity provider rejected this sign-in request."
        ) from error
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as error:
        raise OAuthFlowError(
            "The identity provider could not be reached. Please try again."
        ) from error


def _google_profile(code: str, state: str) -> SocialProfile:
    token_payload = _http_json(
        "https://oauth2.googleapis.com/token",
        method="POST",
        form_data={
            "code": code,
            "client_id": settings.google_oauth_client_id,
            "client_secret": settings.google_oauth_client_secret,
            "redirect_uri": get_callback_url("google"),
            "grant_type": "authorization_code",
            "code_verifier": _code_verifier(state),
        },
    )

    id_token = str(token_payload.get("id_token", ""))

    if not id_token:
        raise OAuthFlowError("Google did not return an identity token.")

    try:
        signing_key = PyJWKClient(
            "https://www.googleapis.com/oauth2/v3/certs"
        ).get_signing_key_from_jwt(id_token)

        claims = jwt.decode(
            id_token,
            signing_key.key,
            algorithms=["RS256"],
            audience=settings.google_oauth_client_id,
            issuer=["https://accounts.google.com", "accounts.google.com"],
            leeway=60,
        )
    except Exception as error:
        logger.warning(
            "Google ID-token verification failed: type=%s reason=%s",
            type(error).__name__,
            error,
        )
        raise OAuthFlowError("Google identity verification failed.") from error

    if not secrets.compare_digest(str(claims.get("nonce", "")), _nonce(state)):
        raise OAuthFlowError("Google sign-in verification failed.")

    subject = str(claims.get("sub", "")).strip()

    if not subject:
        raise OAuthFlowError("Google did not provide an account identifier.")

    email = str(claims.get("email", "")).strip().lower() or None
    email_verified = bool(claims.get("email_verified", False))
    display_name = str(claims.get("name", "")).strip() or None

    return SocialProfile(
        provider="google",
        subject=subject,
        email=email,
        email_verified=email_verified,
        display_name=display_name,
    )


def _facebook_profile(code: str) -> SocialProfile:
    version = _facebook_version()

    token_payload = _http_json(
        f"https://graph.facebook.com/{version}/oauth/access_token",
        method="POST",
        form_data={
            "client_id": settings.facebook_oauth_client_id,
            "client_secret": settings.facebook_oauth_client_secret,
            "redirect_uri": get_callback_url("facebook"),
            "code": code,
        },
    )

    access_token = str(token_payload.get("access_token", "")).strip()

    if not access_token:
        raise OAuthFlowError("Facebook did not return an access token.")

    appsecret_proof = hmac.new(
        settings.facebook_oauth_client_secret.encode("utf-8"),
        access_token.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

    url = (
        f"https://graph.facebook.com/{version}/me?"
        + urllib.parse.urlencode(
            {
                "fields": "id,name,email",
                "access_token": access_token,
                "appsecret_proof": appsecret_proof,
            }
        )
    )

    profile_payload = _http_json(url)

    subject = str(profile_payload.get("id", "")).strip()

    if not subject:
        raise OAuthFlowError("Facebook did not provide an account identifier.")

    email = str(profile_payload.get("email", "")).strip().lower() or None
    display_name = str(profile_payload.get("name", "")).strip() or None

    return SocialProfile(
        provider="facebook",
        subject=subject,
        email=email,
        email_verified=False,
        display_name=display_name,
    )


def _apple_client_secret() -> str:
    now = datetime.now(timezone.utc)
    private_key = settings.apple_oauth_private_key.replace("\\n", "\n")

    try:
        return jwt.encode(
            {
                "iss": settings.apple_oauth_team_id,
                "iat": int(now.timestamp()),
                "exp": int((now + timedelta(days=180)).timestamp()),
                "aud": "https://appleid.apple.com",
                "sub": settings.apple_oauth_client_id,
            },
            private_key,
            algorithm="ES256",
            headers={"kid": settings.apple_oauth_key_id},
        )
    except Exception as error:
        raise OAuthFlowError("Apple private-key configuration is invalid.") from error


def _apple_display_name(raw_user: str | None) -> str | None:
    if not raw_user:
        return None

    try:
        payload = json.loads(raw_user)
        name = payload.get("name", {})
        value = " ".join(
            part.strip()
            for part in [
                str(name.get("firstName", "")),
                str(name.get("lastName", "")),
            ]
            if part and str(part).strip()
        )
        return value or None
    except (json.JSONDecodeError, AttributeError):
        return None


def _apple_profile(
    code: str,
    state: str,
    raw_user: str | None,
) -> SocialProfile:
    token_payload = _http_json(
        "https://appleid.apple.com/auth/token",
        method="POST",
        form_data={
            "client_id": settings.apple_oauth_client_id,
            "client_secret": _apple_client_secret(),
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": get_callback_url("apple"),
        },
    )

    id_token = str(token_payload.get("id_token", "")).strip()

    if not id_token:
        raise OAuthFlowError("Apple did not return an identity token.")

    try:
        signing_key = PyJWKClient(
            "https://appleid.apple.com/auth/keys"
        ).get_signing_key_from_jwt(id_token)

        claims = jwt.decode(
            id_token,
            signing_key.key,
            algorithms=["RS256"],
            audience=settings.apple_oauth_client_id,
            issuer="https://appleid.apple.com",
            leeway=60,
        )
    except Exception as error:
        raise OAuthFlowError("Apple identity verification failed.") from error

    if not secrets.compare_digest(str(claims.get("nonce", "")), _nonce(state)):
        raise OAuthFlowError("Apple sign-in verification failed.")

    subject = str(claims.get("sub", "")).strip()

    if not subject:
        raise OAuthFlowError("Apple did not provide an account identifier.")

    email = str(claims.get("email", "")).strip().lower() or None
    email_verified = str(claims.get("email_verified", "")).lower() == "true"

    return SocialProfile(
        provider="apple",
        subject=subject,
        email=email,
        email_verified=email_verified,
        display_name=_apple_display_name(raw_user),
    )


def create_authorization_url(
    db: Session,
    provider: OAuthProvider,
) -> str:
    if not provider_is_configured(provider):
        raise OAuthFlowError(f"{provider.title()} sign-in is not configured.")

    state = secrets.token_urlsafe(32)

    authorization_request = OAuthAuthorizationRequest(
        provider=provider,
        state_hash=_hash(state),
        nonce_hash=_hash(_nonce(state)),
        expires_at=_now() + timedelta(minutes=settings.oauth_state_ttl_minutes),
    )

    db.add(authorization_request)
    db.commit()

    callback_url = get_callback_url(provider)

    if provider == "google":
        params = {
            "client_id": settings.google_oauth_client_id,
            "redirect_uri": callback_url,
            "response_type": "code",
            "scope": "openid email profile",
            "state": state,
            "nonce": _nonce(state),
            "code_challenge": _code_challenge(_code_verifier(state)),
            "code_challenge_method": "S256",
            "prompt": "select_account",
        }

        return (
            "https://accounts.google.com/o/oauth2/v2/auth?"
            + urllib.parse.urlencode(params)
        )

    if provider == "facebook":
        params = {
            "client_id": settings.facebook_oauth_client_id,
            "redirect_uri": callback_url,
            "response_type": "code",
            "scope": "email,public_profile",
            "state": state,
        }

        return (
            f"https://www.facebook.com/{_facebook_version()}/dialog/oauth?"
            + urllib.parse.urlencode(params)
        )

    params = {
        "client_id": settings.apple_oauth_client_id,
        "redirect_uri": callback_url,
        "response_type": "code id_token",
        "response_mode": "form_post",
        "scope": "name email",
        "state": state,
        "nonce": _nonce(state),
    }

    return (
        "https://appleid.apple.com/auth/authorize?"
        + urllib.parse.urlencode(params)
    )


def _consume_authorization_request(
    db: Session,
    provider: OAuthProvider,
    state: str | None,
) -> str:
    if not state:
        raise OAuthFlowError("The sign-in state is missing.")

    request = (
        db.query(OAuthAuthorizationRequest)
        .filter(
            OAuthAuthorizationRequest.provider == provider,
            OAuthAuthorizationRequest.state_hash == _hash(state),
        )
        .with_for_update()
        .one_or_none()
    )

    if (
        request is None
        or request.consumed_at is not None
        or request.expires_at <= _now()
    ):
        raise OAuthFlowError("This sign-in request has expired. Please try again.")

    request.consumed_at = _now()
    db.commit()

    return state


def _get_default_workspace(
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


def _fallback_email(profile: SocialProfile) -> str:
    fingerprint = _hash(f"{profile.provider}:{profile.subject}")[:24]
    return f"oauth-{profile.provider}-{fingerprint}@stockflow.invalid"


def _display_name(profile: SocialProfile) -> str:
    value = (profile.display_name or "").strip()

    if not value and profile.email:
        value = profile.email.split("@", 1)[0]

    return (value or "StockFlow User")[:100]


def _workspace_name(display_name: str) -> str:
    suffix = "'s Workspace"
    base = display_name[: 150 - len(suffix)].strip()
    return f"{base or 'StockFlow'}{suffix}"


def _issue_login_ticket(
    db: Session,
    user: User,
    membership: OrganizationMember,
    organization: Organization,
) -> str:
    ticket = secrets.token_urlsafe(48)

    db.add(
        OAuthLoginTicket(
            ticket_hash=_hash(ticket),
            user_id=user.id,
            organization_id=organization.id,
            organization_role=membership.role,
            expires_at=_now() + timedelta(minutes=settings.oauth_ticket_ttl_minutes),
        )
    )
    db.commit()

    return ticket


def complete_provider_callback(
    db: Session,
    provider: OAuthProvider,
    code: str | None,
    state: str | None,
    raw_apple_user: str | None = None,
) -> str:
    if not code:
        raise OAuthFlowError("The identity provider did not return an authorization code.")

    verified_state = _consume_authorization_request(db, provider, state)

    if provider == "google":
        profile = _google_profile(code, verified_state)
    elif provider == "facebook":
        profile = _facebook_profile(code)
    else:
        profile = _apple_profile(code, verified_state, raw_apple_user)

    identity = (
        db.query(OAuthIdentity)
        .filter(
            OAuthIdentity.provider == profile.provider,
            OAuthIdentity.provider_subject == profile.subject,
        )
        .one_or_none()
    )

    if identity is not None:
        user = db.get(User, identity.user_id)

        if user is None or not user.is_active:
            raise OAuthFlowError("This StockFlow account is unavailable.")

        workspace = _get_default_workspace(db, user.id)

        if workspace is None:
            raise OAuthFlowError("No active workspace is assigned to this account.")

        membership, organization = workspace
        identity.email = profile.email or identity.email
        identity.display_name = profile.display_name or identity.display_name
        identity.last_login_at = _now()
        db.commit()

        return _issue_login_ticket(db, user, membership, organization)

    user = None

    if profile.email and profile.email_verified:
        user = db.query(User).filter(User.email == profile.email).one_or_none()

    if user is None:
        existing_email_user = None

        if profile.email:
            existing_email_user = (
                db.query(User)
                .filter(User.email == profile.email)
                .one_or_none()
            )

        if existing_email_user is not None:
            raise OAuthFlowError(
                "An account already uses this email. Sign in with email and password first."
            )

        display_name = _display_name(profile)

        user = User(
            full_name=display_name,
            email=profile.email or _fallback_email(profile),
            hashed_password=get_password_hash(secrets.token_urlsafe(48)),
            role="staff",
            is_active=True,
        )

        organization = Organization(
            name=_workspace_name(display_name),
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
        db.flush()
    else:
        workspace = _get_default_workspace(db, user.id)

        if workspace is None:
            raise OAuthFlowError("No active workspace is assigned to this account.")

        membership, organization = workspace

    db.add(
        OAuthIdentity(
            user_id=user.id,
            provider=profile.provider,
            provider_subject=profile.subject,
            email=profile.email,
            display_name=profile.display_name,
            last_login_at=_now(),
        )
    )
    db.commit()

    return _issue_login_ticket(db, user, membership, organization)


def exchange_login_ticket(
    db: Session,
    ticket: str,
) -> dict:
    ticket_record = (
        db.query(OAuthLoginTicket)
        .filter(OAuthLoginTicket.ticket_hash == _hash(ticket))
        .with_for_update()
        .one_or_none()
    )

    if (
        ticket_record is None
        or ticket_record.consumed_at is not None
        or ticket_record.expires_at <= _now()
    ):
        raise OAuthFlowError("This sign-in ticket is invalid or expired.")

    user = db.get(User, ticket_record.user_id)
    organization = db.get(Organization, ticket_record.organization_id)

    membership = (
        db.query(OrganizationMember)
        .filter(
            OrganizationMember.organization_id == ticket_record.organization_id,
            OrganizationMember.user_id == ticket_record.user_id,
            OrganizationMember.is_active.is_(True),
        )
        .one_or_none()
    )

    if (
        user is None
        or organization is None
        or membership is None
        or not user.is_active
        or not organization.is_active
    ):
        raise OAuthFlowError("This StockFlow account is unavailable.")

    ticket_record.consumed_at = _now()
    db.commit()

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
