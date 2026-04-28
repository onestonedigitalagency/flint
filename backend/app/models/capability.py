"""
Capability flags model — Step 6 of onboarding.

Each capability is a specific action the AI agent can take.
Must be explicitly ENABLED by the business owner before the agent can use it.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel, JSON, Column


class Capability(SQLModel, table=True):
    __tablename__ = "capabilities"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    business_id: UUID = Field(index=True)

    capability_name: str = Field(index=True)   # e.g. "user_login", "apply_coupon_codes"
    is_enabled: bool = False                    # Owner must explicitly enable
    config: dict = Field(default={}, sa_column=Column(JSON))  # Provider-specific config

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class CapabilityCreate(SQLModel):
    capability_name: str
    is_enabled: bool = False
    config: dict = {}


class CapabilityRead(SQLModel):
    id: UUID
    business_id: UUID
    capability_name: str
    is_enabled: bool
    config: dict
    created_at: datetime


class CapabilityUpdate(SQLModel):
    is_enabled: Optional[bool] = None
    config: Optional[dict] = None
