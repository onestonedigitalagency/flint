"""
Plans router — Form A CRUD (Anti-Hallucination layer).

Every plan value is typed by the business owner manually.
AI reads from this table. AI never writes to it.

Endpoints:
  GET    /api/businesses/{id}/plans       — List all plans
  POST   /api/businesses/{id}/plans       — Add a plan
  GET    /api/businesses/{id}/plans/{pid} — Get single plan
  PUT    /api/businesses/{id}/plans/{pid} — Update a plan
  DELETE /api/businesses/{id}/plans/{pid} — Delete (soft) a plan
"""
import uuid
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.dependencies import CurrentUserDep
from app.models.business import Business
from app.models.plan import Plan, PlanCreate, PlanRead, PlanUpdate

router = APIRouter(prefix="/api/businesses", tags=["Plans (Form A)"])

SessionDep = Annotated[Session, Depends(get_session)]


def _verify_business_access(business_id: uuid.UUID, current_user, session: Session) -> Business:
    business = session.get(Business, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    if business.owner_id != current_user.id and current_user.role != "platform_owner":
        raise HTTPException(status_code=403, detail="Access denied")
    return business


@router.get("/{business_id}/plans", response_model=list[PlanRead])
def list_plans(
    business_id: uuid.UUID,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> list[PlanRead]:
    _verify_business_access(business_id, current_user, session)
    plans = session.exec(
        select(Plan)
        .where(Plan.business_id == business_id)
        .order_by(Plan.display_order)
    ).all()
    return [PlanRead.model_validate(p) for p in plans]


@router.post("/{business_id}/plans", response_model=PlanRead, status_code=201)
def create_plan(
    business_id: uuid.UUID,
    body: PlanCreate,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> PlanRead:
    _verify_business_access(business_id, current_user, session)

    plan = Plan(
        business_id=business_id,
        name=body.name,
        price=body.price,
        currency=body.currency,
        billing_cycle=body.billing_cycle,
        features=body.features,
        session_details=body.session_details,
        description=body.description,
        display_order=body.display_order,
    )
    session.add(plan)
    session.commit()
    session.refresh(plan)
    return PlanRead.model_validate(plan)


@router.get("/{business_id}/plans/{plan_id}", response_model=PlanRead)
def get_plan(
    business_id: uuid.UUID,
    plan_id: uuid.UUID,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> PlanRead:
    _verify_business_access(business_id, current_user, session)
    plan = session.get(Plan, plan_id)
    if not plan or plan.business_id != business_id:
        raise HTTPException(status_code=404, detail="Plan not found")
    return PlanRead.model_validate(plan)


@router.put("/{business_id}/plans/{plan_id}", response_model=PlanRead)
def update_plan(
    business_id: uuid.UUID,
    plan_id: uuid.UUID,
    body: PlanUpdate,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> PlanRead:
    _verify_business_access(business_id, current_user, session)
    plan = session.get(Plan, plan_id)
    if not plan or plan.business_id != business_id:
        raise HTTPException(status_code=404, detail="Plan not found")

    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(plan, key, value)
    plan.updated_at = datetime.utcnow()
    session.add(plan)
    session.commit()
    session.refresh(plan)
    return PlanRead.model_validate(plan)


@router.delete("/{business_id}/plans/{plan_id}", status_code=204)
def delete_plan(
    business_id: uuid.UUID,
    plan_id: uuid.UUID,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> None:
    _verify_business_access(business_id, current_user, session)
    plan = session.get(Plan, plan_id)
    if not plan or plan.business_id != business_id:
        raise HTTPException(status_code=404, detail="Plan not found")
    # Soft delete — mark inactive
    plan.is_active = False
    plan.updated_at = datetime.utcnow()
    session.add(plan)
    session.commit()
