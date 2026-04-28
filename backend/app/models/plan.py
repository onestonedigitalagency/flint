"""
Plan model — Form A (Anti-Hallucination source of truth).

CRITICAL: Every field here is typed by the business owner manually.
AI reads from this table. AI NEVER writes to it.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel, JSON, Column


class Plan(SQLModel, table=True):
    __tablename__ = "plans"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    business_id: UUID = Field(index=True)

    # ── All fields typed by business owner — NEVER AI-generated ───
    name: str                               # "Beginner Plan"
    price: float                            # 2999.0
    currency: str = "INR"                  # "INR" | "USD" | "EUR"
    billing_cycle: str = "monthly"         # "monthly" | "yearly" | "one-time"
    features: list = Field(default=[], sa_column=Column(JSON))   # ["Zoom sessions", ...]
    session_details: Optional[str] = None  # "2 Zoom sessions per month"
    description: Optional[str] = None      # Long description

    is_active: bool = True
    display_order: int = 0                 # UI ordering

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class PlanCreate(SQLModel):
    name: str
    price: float
    currency: str = "INR"
    billing_cycle: str = "monthly"
    features: list[str] = []
    session_details: Optional[str] = None
    description: Optional[str] = None
    display_order: int = 0


class PlanRead(SQLModel):
    id: UUID
    business_id: UUID
    name: str
    price: float
    currency: str
    billing_cycle: str
    features: list
    session_details: Optional[str] = None
    description: Optional[str] = None
    is_active: bool
    display_order: int
    created_at: datetime


class PlanUpdate(SQLModel):
    name: Optional[str] = None
    price: Optional[float] = None
    currency: Optional[str] = None
    billing_cycle: Optional[str] = None
    features: Optional[list[str]] = None
    session_details: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None
