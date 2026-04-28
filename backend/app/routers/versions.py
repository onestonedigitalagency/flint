"""
Versions router — Snapshot-based rollback system.

Allows businesses to snapshot their AI configuration (Form A + Form B + Rules + Capabilities)
and roll back within 60 seconds of a bad change.

Endpoints:
  POST /api/businesses/{id}/versions          — Create a new snapshot
  GET  /api/businesses/{id}/versions          — List snapshots
  POST /api/businesses/{id}/versions/{vid}/rollback — Rollback to snapshot
"""
import uuid
import json
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.dependencies import CurrentUserDep
from app.models.business import Business
from app.models.agent_version import AgentVersion, AgentVersionRead
from app.models.plan import Plan
from app.models.coupon import Coupon
from app.models.rule import ConversationRule
from app.models.capability import Capability

router = APIRouter(prefix="/api/businesses", tags=["Version History"])

SessionDep = Annotated[Session, Depends(get_session)]


class CreateVersionRequest(BaseModel):
    version_name: str
    description: str | None = None


def _verify_access(business_id: uuid.UUID, current_user, session: Session) -> Business:
    business = session.get(Business, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    if business.owner_id != current_user.id and current_user.role != "platform_owner":
        raise HTTPException(status_code=403, detail="Access denied")
    return business


@router.post("/{business_id}/versions", response_model=AgentVersionRead, status_code=201)
def create_snapshot(
    business_id: uuid.UUID,
    body: CreateVersionRequest,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> AgentVersionRead:
    """Take a full snapshot of the business AI configuration."""
    _verify_access(business_id, current_user, session)

    # Gather data
    plans = session.exec(select(Plan).where(Plan.business_id == business_id)).all()
    coupons = session.exec(select(Coupon).where(Coupon.business_id == business_id)).all()
    rules = session.exec(select(ConversationRule).where(ConversationRule.business_id == business_id)).all()
    capabilities = session.exec(select(Capability).where(Capability.business_id == business_id)).all()

    config_snapshot = {
        "plans": [p.model_dump(mode="json") for p in plans],
        "coupons": [c.model_dump(mode="json") for c in coupons],
        "rules": [r.model_dump(mode="json") for r in rules],
        "capabilities": [c.model_dump(mode="json") for c in capabilities],
    }

    # Generate version string (e.g. v1, v2)
    latest = session.exec(
        select(AgentVersion)
        .where(AgentVersion.business_id == business_id)
        .order_by(AgentVersion.created_at.desc())
    ).first()
    
    next_v = 1
    if latest and latest.version_string.startswith("v"):
        try:
            next_v = int(latest.version_string[1:]) + 1
        except:
            pass
            
    version_string = f"v{next_v}"

    snapshot = AgentVersion(
        business_id=business_id,
        version_string=version_string,
        version_name=body.version_name,
        description=body.description,
        config_snapshot=config_snapshot,
    )
    session.add(snapshot)
    session.commit()
    session.refresh(snapshot)
    return AgentVersionRead.model_validate(snapshot)


@router.get("/{business_id}/versions", response_model=list[AgentVersionRead])
def list_versions(
    business_id: uuid.UUID,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> list[AgentVersionRead]:
    """List all snapshots for a business."""
    _verify_access(business_id, current_user, session)
    versions = session.exec(
        select(AgentVersion)
        .where(AgentVersion.business_id == business_id)
        .order_by(AgentVersion.created_at.desc())
    ).all()
    return [AgentVersionRead.model_validate(v) for v in versions]


@router.post("/{business_id}/versions/{version_id}/rollback")
def rollback_snapshot(
    business_id: uuid.UUID,
    version_id: uuid.UUID,
    current_user: CurrentUserDep,
    session: SessionDep,
):
    """
    Rollback to a previous snapshot.
    Restores Plans, Coupons, Rules, and Capabilities to the exact state in the snapshot.
    """
    _verify_access(business_id, current_user, session)
    
    snapshot = session.get(AgentVersion, version_id)
    if not snapshot or snapshot.business_id != business_id:
        raise HTTPException(status_code=404, detail="Snapshot not found")
        
    config = snapshot.config_snapshot
    if not config:
        raise HTTPException(status_code=400, detail="Snapshot contains no configuration data")

    # 1. Clear current config (hard delete)
    session.exec(select(Plan).where(Plan.business_id == business_id)).all()
    for p in session.exec(select(Plan).where(Plan.business_id == business_id)): session.delete(p)
    for c in session.exec(select(Coupon).where(Coupon.business_id == business_id)): session.delete(c)
    for r in session.exec(select(ConversationRule).where(ConversationRule.business_id == business_id)): session.delete(r)
    for c in session.exec(select(Capability).where(Capability.business_id == business_id)): session.delete(c)
    session.flush()

    # 2. Restore from snapshot
    for p_data in config.get("plans", []):
        p_data.pop("id", None) # let new UUID be generated or keep old? Usually generate new to avoid conflicts
        session.add(Plan(business_id=business_id, **p_data))
        
    for c_data in config.get("coupons", []):
        c_data.pop("id", None)
        session.add(Coupon(business_id=business_id, **c_data))
        
    for r_data in config.get("rules", []):
        r_data.pop("id", None)
        session.add(ConversationRule(business_id=business_id, **r_data))
        
    for cap_data in config.get("capabilities", []):
        cap_data.pop("id", None)
        session.add(Capability(business_id=business_id, **cap_data))

    session.commit()
    
    return {"message": f"Successfully rolled back to {snapshot.version_string}"}
