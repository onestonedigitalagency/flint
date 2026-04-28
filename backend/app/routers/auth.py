"""
Auth router — full authentication flow.

Endpoints:
  POST /api/auth/signup         — Register new business owner
  POST /api/auth/login          — Issue access + refresh tokens
  POST /api/auth/refresh        — Refresh access token
  POST /api/auth/logout         — Invalidate refresh token
  GET  /api/auth/me             — Get current user profile
  POST /api/auth/verify-email   — Verify email via token
  POST /api/auth/forgot-password — Generate OTP, send email
  POST /api/auth/reset-password  — Verify OTP, update password
"""
import secrets
from datetime import datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.dependencies import CurrentUserDep
from app.models.user import User, UserCreate, UserRead, Token
from app.services.auth_service import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    hash_token,
    generate_otp,
    generate_verification_token,
)
from app.services.email_service import (
    send_otp_email,
    send_verification_email,
    send_welcome_email,
)
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

SessionDep = Annotated[Session, Depends(get_session)]


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str


class VerifyEmailRequest(BaseModel):
    token: str


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserCreate, session: SessionDep) -> UserRead:
    """Register a new business owner account."""
    existing = session.exec(select(User).where(User.email == user_in.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    verify_token = generate_verification_token()
    verify_expires = datetime.utcnow() + timedelta(hours=24)

    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        email_verify_token=verify_token,
        email_verify_expires_at=verify_expires,
        role="business_owner",
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    # Send verification email (non-blocking — don't fail signup if email fails)
    await send_verification_email(user.email, verify_token, user.full_name)
    await send_welcome_email(user.email, user.full_name)

    return UserRead.model_validate(user)


@router.post("/login", response_model=Token)
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: SessionDep,
) -> Token:
    """Login and receive access + refresh tokens."""
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})

    # Store hashed refresh token
    user.refresh_token_hash = hash_token(refresh_token)
    user.updated_at = datetime.utcnow()
    session.add(user)
    session.commit()

    return Token(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=Token)
def refresh_token(body: RefreshRequest, session: SessionDep) -> Token:
    """Exchange a refresh token for a new access token."""
    from jose import JWTError, jwt
    from app.core.config import settings

    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
    )
    try:
        payload = jwt.decode(
            body.refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        if payload.get("type") != "refresh":
            raise credentials_exc
        email: str = payload.get("sub")
    except JWTError:
        raise credentials_exc

    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise credentials_exc

    # Verify stored hash matches
    if user.refresh_token_hash != hash_token(body.refresh_token):
        raise credentials_exc

    new_access = create_access_token(data={"sub": user.email})
    new_refresh = create_refresh_token(data={"sub": user.email})

    user.refresh_token_hash = hash_token(new_refresh)
    user.updated_at = datetime.utcnow()
    session.add(user)
    session.commit()

    return Token(access_token=new_access, refresh_token=new_refresh)


@router.post("/logout")
def logout(current_user: CurrentUserDep, session: SessionDep) -> dict:
    """Invalidate the current refresh token."""
    current_user.refresh_token_hash = None
    current_user.updated_at = datetime.utcnow()
    session.add(current_user)
    session.commit()
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserRead)
def get_me(current_user: CurrentUserDep) -> UserRead:
    """Return the current authenticated user's profile."""
    return UserRead.model_validate(current_user)


@router.post("/verify-email")
def verify_email(body: VerifyEmailRequest, session: SessionDep) -> dict:
    """Verify email address using the token sent to the user's email."""
    user = session.exec(
        select(User).where(User.email_verify_token == body.token)
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    if user.email_verify_expires_at and user.email_verify_expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Verification token has expired")

    user.email_verified = True
    user.email_verify_token = None
    user.email_verify_expires_at = None
    user.updated_at = datetime.utcnow()
    session.add(user)
    session.commit()

    return {"message": "Email verified successfully"}


@router.post("/forgot-password")
async def forgot_password(body: ForgotPasswordRequest, session: SessionDep) -> dict:
    """
    Generate a 6-digit OTP and send it to the user's email.
    Always returns 200 to prevent email enumeration attacks.
    """
    user = session.exec(select(User).where(User.email == body.email)).first()
    if not user:
        # Security: don't reveal whether email is registered
        return {"message": "If your email is registered, you will receive an OTP."}

    otp = generate_otp()
    user.otp_code = otp
    user.otp_expires_at = datetime.utcnow() + timedelta(minutes=10)
    user.updated_at = datetime.utcnow()
    session.add(user)
    session.commit()

    await send_otp_email(user.email, otp, user.full_name)

    return {"message": "If your email is registered, you will receive an OTP."}


@router.post("/reset-password")
def reset_password(body: ResetPasswordRequest, session: SessionDep) -> dict:
    """Verify OTP and update password."""
    user = session.exec(select(User).where(User.email == body.email)).first()

    if not user or user.otp_code != body.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP or email")

    if not user.otp_expires_at or user.otp_expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP has expired")

    user.hashed_password = get_password_hash(body.new_password)
    user.otp_code = None
    user.otp_expires_at = None
    user.refresh_token_hash = None   # Invalidate all sessions
    user.updated_at = datetime.utcnow()
    session.add(user)
    session.commit()

    return {"message": "Password reset successfully"}
