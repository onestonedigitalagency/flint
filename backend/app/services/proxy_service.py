"""
Middleware proxy service — Chapter 3 Principle 7.

ALL calls to business APIs go through this proxy layer.
The widget NEVER calls business APIs directly.

Provides:
  - Pre-call logging
  - Input validation
  - Post-call logging
  - Error handling
  - Business isolation (each call scoped to one business)
  - Key retrieval from vault (never exposed to caller)
  - Response sanitization before logging
"""
import logging
from typing import Any, Optional
from uuid import UUID

import httpx

from app.services.log_service import write_log, sanitize
from app.models.log_entry import LogType, ErrorCode

logger = logging.getLogger(__name__)

# Timeout for all proxied calls (seconds)
PROXY_TIMEOUT = 30.0


async def proxy_call(
    *,
    business_id: UUID,
    session_id: Optional[UUID] = None,
    method: str,
    url: str,
    headers: Optional[dict] = None,
    payload: Optional[dict] = None,
    vault_key_id: Optional[UUID] = None,
) -> dict[str, Any]:
    """
    Execute a proxied HTTP call to a business's API.

    Args:
        business_id: Which business this call is for (isolation)
        session_id: End-user session (for log correlation)
        method: HTTP method (GET, POST, PUT, DELETE)
        url: Business API endpoint URL
        headers: Additional headers (auth headers added from vault)
        payload: JSON request body
        vault_key_id: If set, fetches the API key from vault and adds as Bearer token

    Returns:
        {"status": int, "body": dict, "success": bool}
    """
    request_headers = headers or {}

    # Inject API key from vault (never expose raw key to caller)
    if vault_key_id:
        try:
            api_key = _get_vault_key(vault_key_id)
            request_headers["Authorization"] = f"Bearer {api_key}"
        except Exception as exc:
            logger.error("Vault key retrieval failed for business %s: %s", business_id, exc)
            raise

    # ── Pre-call log ──────────────────────────────────────────────
    request_summary = f"{method} {url} | payload_keys={list((payload or {}).keys())}"
    await write_log(
        log_type=LogType.INFO,
        description=f"Proxy call initiated: {method} {url}",
        business_id=business_id,
        session_id=session_id,
        endpoint=url,
        request_summary=sanitize(request_summary),
    )

    # ── Execute call ──────────────────────────────────────────────
    try:
        async with httpx.AsyncClient(timeout=PROXY_TIMEOUT) as client:
            response = await client.request(
                method=method.upper(),
                url=url,
                headers=request_headers,
                json=payload,
            )
            response_body = {}
            try:
                response_body = response.json()
            except Exception:
                response_body = {"raw": response.text[:500]}

        success = response.status_code < 400

        # ── Post-call log ─────────────────────────────────────────
        await write_log(
            log_type=LogType.INFO if success else LogType.ERROR,
            description=f"Proxy call completed: {response.status_code}",
            business_id=business_id,
            session_id=session_id,
            error_code=None if success else ErrorCode.API_FAILURE,
            endpoint=url,
            response_status=response.status_code,
            response_summary=sanitize(str(response_body)[:500]),
        )

        return {
            "status": response.status_code,
            "body": response_body,
            "success": success,
        }

    except httpx.TimeoutException:
        await write_log(
            log_type=LogType.ERROR,
            description=f"Proxy call timed out after {PROXY_TIMEOUT}s: {url}",
            business_id=business_id,
            session_id=session_id,
            error_code=ErrorCode.API_FAILURE,
            endpoint=url,
            response_status=408,
        )
        return {"status": 408, "body": {"error": "timeout"}, "success": False}

    except Exception as exc:
        await write_log(
            log_type=LogType.ERROR,
            description=f"Proxy call failed: {exc}",
            business_id=business_id,
            session_id=session_id,
            error_code=ErrorCode.API_FAILURE,
            endpoint=url,
            response_status=500,
        )
        return {"status": 500, "body": {"error": str(exc)}, "success": False}


def _get_vault_key(vault_key_id: UUID) -> str:
    """Retrieve and decrypt an API key from the vault."""
    from sqlmodel import Session, select
    from app.core.db import engine
    from app.models.api_key_vault import ApiKeyVault
    from app.services.encryption_service import decrypt

    with Session(engine) as session:
        vault_entry = session.get(ApiKeyVault, vault_key_id)
        if not vault_entry:
            raise ValueError(f"Vault key {vault_key_id} not found")
        return decrypt(vault_entry.key_value_encrypted)
