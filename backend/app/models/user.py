from sqlmodel import SQLModel, Field
from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    full_name: Optional[str] = None
    is_active: bool = True

class User(UserBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    hashed_password: str
    otp_code: Optional[str] = None
    otp_expires_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: UUID

class Token(SQLModel):
    access_token: str
    token_type: str

class TokenData(SQLModel):
    email: Optional[str] = None
