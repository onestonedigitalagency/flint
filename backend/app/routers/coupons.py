"""
Coupons router — Form B CRUD.
Coupon codes are business-owner-typed. AI reads only.

Endpoints:
  GET    /api/businesses/{id}/coupons       — List all coupons
  POST   /api/businesses/{id}/coupons       — Add coupon
  GET    /api/businesses/{id}/coupons/{cid} — Get single coupon
  PUT    /api/businesses/{id}/coupons/{cid} — Update coupon
  DELETE /api/businesses/{id}/coupons/{cid} — Deactivate coupon
"""
import uuid
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.dependencies import CurrentUserDep
from app.models.business import Business
from app.models.coupon import Coupon, CouponCreate, CouponRead, CouponUpdate

router = APIRouter(prefix="/api/businesses", tags=["Coupons (Form B)"])

SessionDep = Annotated[Session, Depends(get_session)]


def _verify_access(business_id: uuid.UUID, current_user, session: Session) -> Business:
    business = session.get(Business, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    if business.owner_id != current_user.id and current_user.role != "platform_owner":
        raise HTTPException(status_code=403, detail="Access denied")
    return business


@router.get("/{business_id}/coupons", response_model=list[CouponRead])
def list_coupons(
    business_id: uuid.UUID, current_user: CurrentUserDep, session: SessionDep
) -> list[CouponRead]:
    _verify_access(business_id, current_user, session)
    coupons = session.exec(
        select(Coupon).where(Coupon.business_id == business_id)
    ).all()
    return [CouponRead.model_validate(c) for c in coupons]


@router.post("/{business_id}/coupons", response_model=CouponRead, status_code=201)
def create_coupon(
    business_id: uuid.UUID,
    body: CouponCreate,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> CouponRead:
    _verify_access(business_id, current_user, session)

    # Check for duplicate code within this business
    existing = session.exec(
        select(Coupon).where(
            Coupon.business_id == business_id,
            Coupon.code == body.code.upper(),
            Coupon.is_active == True,
        )
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Coupon code '{body.code}' already exists")

    coupon = Coupon(
        business_id=business_id,
        code=body.code.upper(),   # Always uppercase for consistency
        discount_type=body.discount_type,
        discount_value=body.discount_value,
        expiry_date=body.expiry_date,
        applicable_plan_ids=body.applicable_plan_ids,
        max_uses=body.max_uses,
        first_time_only=body.first_time_only,
    )
    session.add(coupon)
    session.commit()
    session.refresh(coupon)
    return CouponRead.model_validate(coupon)


@router.get("/{business_id}/coupons/{coupon_id}", response_model=CouponRead)
def get_coupon(
    business_id: uuid.UUID,
    coupon_id: uuid.UUID,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> CouponRead:
    _verify_access(business_id, current_user, session)
    coupon = session.get(Coupon, coupon_id)
    if not coupon or coupon.business_id != business_id:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return CouponRead.model_validate(coupon)


@router.put("/{business_id}/coupons/{coupon_id}", response_model=CouponRead)
def update_coupon(
    business_id: uuid.UUID,
    coupon_id: uuid.UUID,
    body: CouponUpdate,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> CouponRead:
    _verify_access(business_id, current_user, session)
    coupon = session.get(Coupon, coupon_id)
    if not coupon or coupon.business_id != business_id:
        raise HTTPException(status_code=404, detail="Coupon not found")

    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(coupon, key, value)
    coupon.updated_at = datetime.utcnow()
    session.add(coupon)
    session.commit()
    session.refresh(coupon)
    return CouponRead.model_validate(coupon)


@router.delete("/{business_id}/coupons/{coupon_id}", status_code=204)
def delete_coupon(
    business_id: uuid.UUID,
    coupon_id: uuid.UUID,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> None:
    _verify_access(business_id, current_user, session)
    coupon = session.get(Coupon, coupon_id)
    if not coupon or coupon.business_id != business_id:
        raise HTTPException(status_code=404, detail="Coupon not found")
    coupon.is_active = False
    coupon.updated_at = datetime.utcnow()
    session.add(coupon)
    session.commit()
