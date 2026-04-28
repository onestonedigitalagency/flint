"""
Logs router — View structured logs with automatic PII redaction.

Endpoints:
  GET /api/businesses/{id}/logs — Fetch paginated, filterable logs
"""
import uuid
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.dependencies import CurrentUserDep
from app.models.business import Business
from app.models.log_entry import LogEntry

router = APIRouter(prefix="/api/businesses", tags=["Logs"])

SessionDep = Annotated[Session, Depends(get_session)]


def _verify_access(business_id: uuid.UUID, current_user, session: Session) -> Business:
    business = session.get(Business, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    if business.owner_id != current_user.id and current_user.role != "platform_owner":
        raise HTTPException(status_code=403, detail="Access denied")
    return business


@router.get("/{business_id}/logs")
def get_logs(
    business_id: uuid.UUID,
    current_user: CurrentUserDep,
    session: SessionDep,
    level: Optional[str] = None,
    component: Optional[str] = None,
    limit: int = Query(default=50, le=1000),
    offset: int = 0,
):
    """
    Fetch structured logs for a specific business.
    Logs are already sanitized by the log_service at insertion time.
    """
    _verify_access(business_id, current_user, session)

    query = select(LogEntry).where(LogEntry.business_id == business_id)

    if level:
        query = query.where(LogEntry.level == level)
    if component:
        query = query.where(LogEntry.component == component)

    query = query.order_by(LogEntry.timestamp.desc()).offset(offset).limit(limit)

    logs = session.exec(query).all()
    
    # Return count for pagination
    total_query = select(LogEntry.id).where(LogEntry.business_id == business_id)
    if level:
        total_query = total_query.where(LogEntry.level == level)
    if component:
        total_query = total_query.where(LogEntry.component == component)
        
    total_count = len(session.exec(total_query).all())

    return {
        "data": logs,
        "meta": {
            "total": total_count,
            "limit": limit,
            "offset": offset
        }
    }
