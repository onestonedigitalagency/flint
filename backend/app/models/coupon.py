"""
Coupon model — Form B (Anti-Hallucination source of truth).

CRITICAL: Coupon codes, discount values, and expiry are typed by
the business owner manually. AI reads and applies from this table only.
"""
from datetime import datetime, date
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel, JSON, Column


class Coupon(SQLModel, table=True):
    __tablename__ = "coupons"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    business_id: UUID = Field(index=True)

    # ── All fields typed by business owner — NEVER AI-generated ───
    code: str = Field(index=True)           # "YOGA20" — exact string
    discount_type: str                      # "percentage" | "flat"
    discount_value: float                   # 20.0 (%) or 500.0 (flat ₹)
    expiry_date: Optional[date] = None
    # List of Plan IDs this coupon applies to (empty = all plans)
    applicable_plan_ids: list = Field(default=[], sa_column=Column(JSON))
    max_uses: Optional[int] = None         # None = unlimited
    current_uses: int = 0
    first_time_only: bool = False          # Only for first-time users

    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class CouponCreate(SQLModel):
    code: str
    discount_type: str
    discount_value: float
    expiry_date: Optional[date] = None
    applicable_plan_ids: list[str] = []
    max_uses: Optional[int] = None
    first_time_only: bool = False


class CouponRead(SQLModel):
    id: UUID
    business_id: UUID
    code: str
    discount_type: str
    discount_value: float
    expiry_date: Optional[date] = None
    applicable_plan_ids: list
    max_uses: Optional[int] = None
    current_uses: int
    first_time_only: bool
    is_active: bool
    created_at: datetime


class CouponUpdate(SQLModel):
    discount_type: Optional[str] = None
    discount_value: Optional[float] = None
    expiry_date: Optional[date] = None
    applicable_plan_ids: Optional[list[str]] = None
    max_uses: Optional[int] = None
    first_time_only: Optional[bool] = None
    is_active: Optional[bool] = None
