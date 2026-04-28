"""
Business router — CRUD for business profiles.

Endpoints:
  POST /api/businesses        — Create a business (ties to current user)
  GET  /api/businesses/mine   — Get current user's business
  GET  /api/businesses/{id}   — Get business by ID
  PUT  /api/businesses/{id}   — Update business profile
  GET  /api/businesses/{id}/embed-code — Get widget embed snippet
"""
import uuid
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.dependencies import CurrentUserDep, VerifiedUserDep
from app.models.business import Business, BusinessCreate, BusinessRead, BusinessUpdate

router = APIRouter(prefix="/api/businesses", tags=["Business"])

SessionDep = Annotated[Session, Depends(get_session)]


def _generate_agent_id(business_name: str) -> str:
    """Generate a unique agent_id for the embed code."""
    slug = business_name.lower().replace(" ", "_")[:20]
    uid = uuid.uuid4().hex[:8]
    return f"biz_{slug}_{uid}"


@router.post("", response_model=BusinessRead, status_code=201)
def create_business(
    body: BusinessCreate,
    current_user: VerifiedUserDep,
    session: SessionDep,
) -> BusinessRead:
    """Create a business for the current authenticated user."""
    # One business per user in V1
    existing = session.exec(
        select(Business).where(Business.owner_id == current_user.id)
    ).first()
    if existing:
        raise HTTPException(
            status_code=400, detail="You already have a business. Update it instead."
        )

    business = Business(
        owner_id=current_user.id,
        name=body.name,
        website_url=body.website_url,
        category=body.category,
        bot_name=body.bot_name,
        bot_color=body.bot_color,
        agent_id=_generate_agent_id(body.name),
    )
    session.add(business)
    session.commit()
    session.refresh(business)
    return BusinessRead.model_validate(business)


@router.get("/mine", response_model=BusinessRead)
def get_my_business(current_user: CurrentUserDep, session: SessionDep) -> BusinessRead:
    """Get the business owned by the current user."""
    business = session.exec(
        select(Business).where(Business.owner_id == current_user.id)
    ).first()
    if not business:
        raise HTTPException(status_code=404, detail="No business found. Create one first.")
    return BusinessRead.model_validate(business)


@router.get("/{business_id}", response_model=BusinessRead)
def get_business(
    business_id: uuid.UUID,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> BusinessRead:
    """Get a business by ID (must be owned by current user or platform owner)."""
    business = session.get(Business, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    if current_user.role != "platform_owner" and business.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return BusinessRead.model_validate(business)


@router.put("/{business_id}", response_model=BusinessRead)
def update_business(
    business_id: uuid.UUID,
    body: BusinessUpdate,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> BusinessRead:
    """Update a business profile."""
    business = session.get(Business, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    if business.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(business, key, value)
    business.updated_at = datetime.utcnow()

    session.add(business)
    session.commit()
    session.refresh(business)
    return BusinessRead.model_validate(business)


@router.get("/{business_id}/embed-code")
def get_embed_code(
    business_id: uuid.UUID,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> dict:
    """Generate the widget embed script tag for the business."""
    business = session.get(Business, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    if business.owner_id != current_user.id and current_user.role != "platform_owner":
        raise HTTPException(status_code=403, detail="Access denied")

    embed_code = (
        f'<script src="https://agentdeploy.io/widget.js" '
        f'data-agent-id="{business.agent_id}"></script>'
    )
    return {
        "agent_id": business.agent_id,
        "embed_code": embed_code,
        "instructions": "Add this script before the closing </body> tag on your website.",
    }
