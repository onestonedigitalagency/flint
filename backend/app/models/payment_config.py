"""
Payment configuration model — Form C.

CRITICAL: All payment endpoints, API keys, and amounts are typed by
the business owner. Sensitive values are AES-256 encrypted at rest.
AI never reads raw keys — it calls via the middleware proxy only.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class PaymentConfig(SQLModel, table=True):
    __tablename__ = "payment_configs"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    business_id: UUID = Field(unique=True, index=True)  # One per business

    # ── Existing gateway (business owner's own setup) ─────────────
    gateway_name: Optional[str] = None              # "Stripe", "Custom"
    # Encrypted fields — raw values NEVER stored in plaintext
    payment_endpoint_encrypted: Optional[str] = None
    payment_api_key_encrypted: Optional[str] = None

    # ── Razorpay fallback (optional) ──────────────────────────────
    use_razorpay_fallback: bool = False
    razorpay_key_id: Optional[str] = None           # Public key (safe to store)
    razorpay_key_secret_encrypted: Optional[str] = None  # Encrypted

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class PaymentConfigCreate(SQLModel):
    gateway_name: Optional[str] = None
    payment_endpoint: Optional[str] = None    # Will be encrypted before save
    payment_api_key: Optional[str] = None     # Will be encrypted before save
    use_razorpay_fallback: bool = False
    razorpay_key_id: Optional[str] = None
    razorpay_key_secret: Optional[str] = None  # Will be encrypted before save


class PaymentConfigRead(SQLModel):
    """Safe read model — sensitive fields masked."""
    id: UUID
    business_id: UUID
    gateway_name: Optional[str] = None
    payment_endpoint_set: bool = False        # True if endpoint is configured
    payment_api_key_set: bool = False         # True if key is configured
    use_razorpay_fallback: bool
    razorpay_key_id: Optional[str] = None     # Public key OK to return
    razorpay_key_secret_set: bool = False
    created_at: datetime


class PaymentConfigUpdate(SQLModel):
    gateway_name: Optional[str] = None
    payment_endpoint: Optional[str] = None
    payment_api_key: Optional[str] = None
    use_razorpay_fallback: Optional[bool] = None
    razorpay_key_id: Optional[str] = None
    razorpay_key_secret: Optional[str] = None
