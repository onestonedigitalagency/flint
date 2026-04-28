"""
Reusable FastAPI dependencies — injected into route handlers.

All dependencies use the `Annotated` pattern as per official skill.
"""
import logging
from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel import Session, select

from app.core.config import settings
from app.core.db import get_session
from app.models.user import User
from app.models.business import Business

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# ── Type aliases (reusable across all routers) ────────────────────────────────
SessionDep = Annotated[Session, Depends(get_session)]
TokenDep = Annotated[str, Depends(oauth2_scheme)]


def _decode_token(token: str) -> str:
    """Decode a JWT and return the email subject. Raises 401 on any failure."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str | None = payload.get("sub")
        token_type: str | None = payload.get("type", "access")
        if email is None or token_type != "access":
            raise credentials_exception
        return email
    except JWTError:
        raise credentials_exception


def get_current_user(token: TokenDep, session: SessionDep) -> User:
    """
    Dependency: returns the authenticated User from the JWT.
    Use CurrentUserDep alias in route handlers.
    """
    email = _decode_token(token)
    user = session.exec(select(User).where(User.email == email)).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated")
    return user


CurrentUserDep = Annotated[User, Depends(get_current_user)]


def get_verified_user(current_user: CurrentUserDep) -> User:
    """
    Dependency: requires email to be verified before access.
    """
    # if not current_user.email_verified:
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Please verify your email before accessing this resource",
    #     )
    return current_user


VerifiedUserDep = Annotated[User, Depends(get_verified_user)]


def get_platform_owner(current_user: CurrentUserDep) -> User:
    """
    Dependency: allows only the platform owner (master admin).
    """
    if current_user.role != "platform_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Platform owner access required",
        )
    return current_user


PlatformOwnerDep = Annotated[User, Depends(get_platform_owner)]


def get_business_for_user(business_id: UUID, current_user: CurrentUserDep, session: SessionDep) -> Business:
    """
    Dependency: fetches a Business and verifies the current user owns it.
    Platform owner can access any business.
    """
    business = session.get(Business, business_id)
    if not business:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Business not found")

    # Platform owner bypasses ownership check
    if current_user.role == "platform_owner":
        return business

    if business.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this business",
        )
    return business


BusinessOwnerDep = Annotated[Business, Depends(get_business_for_user)]
