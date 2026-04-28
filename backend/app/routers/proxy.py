"""
Proxy router — Middleware executor for business APIs.

Endpoints:
  POST /api/proxy/execute — Execute a safe proxy call
"""
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session

from app.core.db import get_session
from app.services.proxy_service import proxy_call
from app.models.business import Business
# Since proxy handles arbitrary payloads and uses internal API key logic,
# we need an auth layer or we restrict it to internal network if used by agents.

router = APIRouter(prefix="/api/proxy", tags=["Middleware Proxy"])

SessionDep = Annotated[Session, Depends(get_session)]

# Warning: Exposing proxy directly to web is dangerous.
# Usually, the AI Agent calls the proxy internally via Python function tools,
# NOT via an external REST endpoint. 
# Providing this endpoint only for admin/sandbox testing.

@router.post("/execute")
async def execute_proxy(
    business_id: uuid.UUID,
    method: str,
    url: str,
    session: SessionDep,
    request: Request,
):
    """
    Test endpoint for proxy service.
    In production, AI calls proxy_call() directly from python, not via REST.
    """
    business = session.get(Business, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
        
    # Read raw body
    body_bytes = await request.body()
    payload = None
    if body_bytes:
        import json
        payload = json.loads(body_bytes.decode('utf-8'))

    # Security: This endpoint should be protected by CurrentUserDep in real use,
    # and verify the user owns the business.
    
    try:
        response_data = await proxy_call(
            business_id=business_id,
            target_url=url,
            method=method,
            payload=payload,
            db_session=session
        )
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
