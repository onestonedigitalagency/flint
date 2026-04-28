"""
Rules router — Conversation guidelines for the AI.

Endpoints:
  GET    /api/businesses/{id}/rules       — List all rules
  POST   /api/businesses/{id}/rules       — Add rule
  PUT    /api/businesses/{id}/rules/{rid} — Update rule
  DELETE /api/businesses/{id}/rules/{rid} — Remove rule
"""
import uuid
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.dependencies import CurrentUserDep
from app.models.business import Business
from app.models.rule import ConversationRule, RuleCreate, RuleRead, RuleUpdate

router = APIRouter(prefix="/api/businesses", tags=["Rules"])

SessionDep = Annotated[Session, Depends(get_session)]


def _verify_access(business_id: uuid.UUID, current_user, session: Session) -> Business:
    business = session.get(Business, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    if business.owner_id != current_user.id and current_user.role != "platform_owner":
        raise HTTPException(status_code=403, detail="Access denied")
    return business


@router.get("/{business_id}/rules", response_model=list[RuleRead])
def list_rules(
    business_id: uuid.UUID, current_user: CurrentUserDep, session: SessionDep
) -> list[RuleRead]:
    _verify_access(business_id, current_user, session)
    rules = session.exec(
        select(ConversationRule)
        .where(ConversationRule.business_id == business_id)
        .order_by(ConversationRule.priority)
    ).all()
    return [RuleRead.model_validate(r) for r in rules]


@router.post("/{business_id}/rules", response_model=RuleRead, status_code=201)
def create_rule(
    business_id: uuid.UUID,
    body: RuleCreate,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> RuleRead:
    _verify_access(business_id, current_user, session)

    rule = ConversationRule(
        business_id=business_id,
        rule_text=body.rule_text,
        rule_type=body.rule_type,
        priority=body.priority,
        is_active=body.is_active,
    )
    session.add(rule)
    session.commit()
    session.refresh(rule)
    return RuleRead.model_validate(rule)


@router.put("/{business_id}/rules/{rule_id}", response_model=RuleRead)
def update_rule(
    business_id: uuid.UUID,
    rule_id: uuid.UUID,
    body: RuleUpdate,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> RuleRead:
    _verify_access(business_id, current_user, session)
    rule = session.get(ConversationRule, rule_id)
    if not rule or rule.business_id != business_id:
        raise HTTPException(status_code=404, detail="Rule not found")

    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(rule, key, value)
    
    rule.updated_at = datetime.utcnow()
    session.add(rule)
    session.commit()
    session.refresh(rule)
    return RuleRead.model_validate(rule)


@router.delete("/{business_id}/rules/{rule_id}", status_code=204)
def delete_rule(
    business_id: uuid.UUID,
    rule_id: uuid.UUID,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> None:
    _verify_access(business_id, current_user, session)
    rule = session.get(ConversationRule, rule_id)
    if not rule or rule.business_id != business_id:
        raise HTTPException(status_code=404, detail="Rule not found")
    
    # We can hard delete rules since they are just instructions
    session.delete(rule)
    session.commit()
