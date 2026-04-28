"""
Capabilities router — Toggleable AI features.

Endpoints:
  GET    /api/businesses/{id}/capabilities       — List all capabilities
  POST   /api/businesses/{id}/capabilities       — Add capability
  PUT    /api/businesses/{id}/capabilities/{cid} — Update capability (enable/disable)
  DELETE /api/businesses/{id}/capabilities/{cid} — Remove capability
"""
import uuid
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.dependencies import CurrentUserDep
from app.models.business import Business
from app.models.capability import Capability, CapabilityCreate, CapabilityRead, CapabilityUpdate

router = APIRouter(prefix="/api/businesses", tags=["Capabilities"])

SessionDep = Annotated[Session, Depends(get_session)]


def _verify_access(business_id: uuid.UUID, current_user, session: Session) -> Business:
    business = session.get(Business, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    if business.owner_id != current_user.id and current_user.role != "platform_owner":
        raise HTTPException(status_code=403, detail="Access denied")
    return business


@router.get("/{business_id}/capabilities", response_model=list[CapabilityRead])
def list_capabilities(
    business_id: uuid.UUID, current_user: CurrentUserDep, session: SessionDep
) -> list[CapabilityRead]:
    _verify_access(business_id, current_user, session)
    capabilities = session.exec(
        select(Capability).where(Capability.business_id == business_id)
    ).all()
    return [CapabilityRead.model_validate(c) for c in capabilities]


@router.post("/{business_id}/capabilities", response_model=CapabilityRead, status_code=201)
def create_capability(
    business_id: uuid.UUID,
    body: CapabilityCreate,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> CapabilityRead:
    _verify_access(business_id, current_user, session)

    # Check for duplicate
    existing = session.exec(
        select(Capability).where(
            Capability.business_id == business_id,
            Capability.capability_name == body.capability_name,
        )
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Capability '{body.capability_name}' already exists")

    capability = Capability(
        business_id=business_id,
        capability_name=body.capability_name,
        is_enabled=body.is_enabled,
        config=body.config,
    )
    session.add(capability)
    session.commit()
    session.refresh(capability)
    return CapabilityRead.model_validate(capability)


@router.put("/{business_id}/capabilities/{capability_id}", response_model=CapabilityRead)
def update_capability(
    business_id: uuid.UUID,
    capability_id: uuid.UUID,
    body: CapabilityUpdate,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> CapabilityRead:
    _verify_access(business_id, current_user, session)
    capability = session.get(Capability, capability_id)
    if not capability or capability.business_id != business_id:
        raise HTTPException(status_code=404, detail="Capability not found")

    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(capability, key, value)
    
    capability.updated_at = datetime.utcnow()
    session.add(capability)
    session.commit()
    session.refresh(capability)
    return CapabilityRead.model_validate(capability)


@router.delete("/{business_id}/capabilities/{capability_id}", status_code=204)
def delete_capability(
    business_id: uuid.UUID,
    capability_id: uuid.UUID,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> None:
    _verify_access(business_id, current_user, session)
    capability = session.get(Capability, capability_id)
    if not capability or capability.business_id != business_id:
        raise HTTPException(status_code=404, detail="Capability not found")
    
    session.delete(capability)
    session.commit()
