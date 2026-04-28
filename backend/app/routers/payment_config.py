"""
Payment Config router — Form C CRUD.

Handles AES-256-GCM encrypted storage of sensitive payment configurations
(Stripe keys, bank details, PayPal tokens). AI cannot read these raw keys.

Endpoints:
  GET    /api/businesses/{id}/payment-config  — Get config (masked)
  PUT    /api/businesses/{id}/payment-config  — Upsert encrypted config
"""
import uuid
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.dependencies import CurrentUserDep
from app.models.business import Business
from app.models.payment_config import PaymentConfig
from app.services.encryption_service import encrypt, decrypt

router = APIRouter(prefix="/api/businesses", tags=["Payment Config (Form C)"])

SessionDep = Annotated[Session, Depends(get_session)]


class PaymentConfigPayload(BaseModel):
    provider: str
    public_key: str | None = None
    secret_key: str | None = None
    webhook_secret: str | None = None


class PaymentConfigResponse(BaseModel):
    id: uuid.UUID
    business_id: uuid.UUID
    provider: str
    has_public_key: bool
    has_secret_key: bool
    has_webhook_secret: bool
    updated_at: datetime


def _verify_access(business_id: uuid.UUID, current_user, session: Session) -> Business:
    business = session.get(Business, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    if business.owner_id != current_user.id and current_user.role != "platform_owner":
        raise HTTPException(status_code=403, detail="Access denied")
    return business


@router.get("/{business_id}/payment-config", response_model=PaymentConfigResponse)
def get_payment_config(
    business_id: uuid.UUID,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> PaymentConfigResponse:
    """Get the payment config. Keys are never returned in plaintext."""
    _verify_access(business_id, current_user, session)
    config = session.exec(
        select(PaymentConfig).where(PaymentConfig.business_id == business_id)
    ).first()

    if not config:
        raise HTTPException(status_code=404, detail="No payment configuration found")

    return PaymentConfigResponse(
        id=config.id,
        business_id=config.business_id,
        provider=config.provider,
        has_public_key=bool(config.encrypted_public_key),
        has_secret_key=bool(config.encrypted_secret_key),
        has_webhook_secret=bool(config.encrypted_webhook_secret),
        updated_at=config.updated_at,
    )


@router.put("/{business_id}/payment-config", response_model=PaymentConfigResponse)
def upsert_payment_config(
    business_id: uuid.UUID,
    body: PaymentConfigPayload,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> PaymentConfigResponse:
    """Upsert payment configuration. Keys are immediately encrypted at rest."""
    _verify_access(business_id, current_user, session)
    
    config = session.exec(
        select(PaymentConfig).where(PaymentConfig.business_id == business_id)
    ).first()

    if not config:
        config = PaymentConfig(business_id=business_id, provider=body.provider)

    config.provider = body.provider
    
    if body.public_key:
        config.encrypted_public_key = encrypt(body.public_key)
    if body.secret_key:
        config.encrypted_secret_key = encrypt(body.secret_key)
    if body.webhook_secret:
        config.encrypted_webhook_secret = encrypt(body.webhook_secret)

    config.updated_at = datetime.utcnow()
    session.add(config)
    session.commit()
    session.refresh(config)

    return PaymentConfigResponse(
        id=config.id,
        business_id=config.business_id,
        provider=config.provider,
        has_public_key=bool(config.encrypted_public_key),
        has_secret_key=bool(config.encrypted_secret_key),
        has_webhook_secret=bool(config.encrypted_webhook_secret),
        updated_at=config.updated_at,
    )
