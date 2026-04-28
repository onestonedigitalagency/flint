"""
Updated auth service — bcrypt hashing, JWT with refresh tokens,
email verification token generation.
"""
import hashlib
import os
import secrets
from datetime import datetime, timedelta
from typing import Optional

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = settings.ALGORITHM
SECRET_KEY = settings.SECRET_KEY


def get_password_hash(password: str) -> str:
    """Hash password with bcrypt (pre-hashed via SHA-256 to bypass bcrypt 72-char limit)."""
    pw_bytes = password.encode("utf-8")
    pw_hash = hashlib.sha256(pw_bytes).hexdigest()
    return pwd_context.hash(pw_hash)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its bcrypt hash."""
    pw_bytes = plain_password.encode("utf-8")
    pw_hash = hashlib.sha256(pw_bytes).hexdigest()
    return pwd_context.verify(pw_hash, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a short-lived access JWT."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict) -> str:
    """Create a long-lived refresh JWT."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def hash_token(token: str) -> str:
    """SHA-256 hash a token for safe DB storage."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def generate_otp() -> str:
    """Generate a cryptographically secure 6-digit OTP."""
    return f"{secrets.randbelow(900000) + 100000}"


def generate_verification_token() -> str:
    """Generate a URL-safe random token for email verification."""
    return secrets.token_urlsafe(32)
