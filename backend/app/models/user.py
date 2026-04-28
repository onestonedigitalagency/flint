"""
User model — Business owners and Platform owner.

Roles:
  business_owner — the company deploying an AI agent
  platform_owner — the AgentDeploy team (master admin)
"""
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    full_name: Optional[str] = None
    is_active: bool = True
    email_verified: bool = False
    role: str = Field(default="business_owner")  # business_owner | platform_owner


class User(UserBase, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    hashed_password: str

    # OTP for password reset
    otp_code: Optional[str] = None
    otp_expires_at: Optional[datetime] = None

    # Email verification
    email_verify_token: Optional[str] = None
    email_verify_expires_at: Optional[datetime] = None

    # Refresh token (hashed)
    refresh_token_hash: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UserCreate(SQLModel):
    email: str
    full_name: Optional[str] = None
    password: str


class UserRead(SQLModel):
    id: UUID
    email: str
    full_name: Optional[str] = None
    is_active: bool
    email_verified: bool
    role: str
    created_at: datetime


class UserUpdate(SQLModel):
    full_name: Optional[str] = None
    email: Optional[str] = None


class Token(SQLModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(SQLModel):
    email: Optional[str] = None
