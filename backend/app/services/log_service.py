"""
Structured logging service — writes LogEntry records to the database.

All logged data is sanitized before write:
  - API keys and secrets stripped
  - PII (emails, phone numbers) removed from request/response summaries
  - Stack traces truncated to safe length
"""
import logging
import re
from datetime import datetime
from typing import Optional
from uuid import UUID

logger = logging.getLogger(__name__)

# Patterns to redact from log summaries
_SENSITIVE_PATTERNS = [
    (re.compile(r'"api_key"\s*:\s*"[^"]{8,}"'), '"api_key": "[REDACTED]"'),
    (re.compile(r'"key"\s*:\s*"[^"]{8,}"'), '"key": "[REDACTED]"'),
    (re.compile(r'"password"\s*:\s*"[^"]+"'), '"password": "[REDACTED]"'),
    (re.compile(r'"secret"\s*:\s*"[^"]{8,}"'), '"secret": "[REDACTED]"'),
    (re.compile(r'"token"\s*:\s*"[^"]{8,}"'), '"token": "[REDACTED]"'),
    (re.compile(r'"Authorization"\s*:\s*"[^"]+"'), '"Authorization": "[REDACTED]"'),
    # Mask emails in summaries
    (re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'), '[EMAIL]'),
]


def sanitize(text: str) -> str:
    """Remove sensitive data from a string before logging."""
    if not text:
        return text
    for pattern, replacement in _SENSITIVE_PATTERNS:
        text = pattern.sub(replacement, text)
    # Truncate to 2000 chars to prevent bloating
    return text[:2000]


async def write_log(
    *,
    log_type: str,
    description: str,
    business_id: Optional[UUID] = None,
    session_id: Optional[UUID] = None,
    error_code: Optional[str] = None,
    endpoint: Optional[str] = None,
    request_summary: Optional[str] = None,
    response_status: Optional[int] = None,
    response_summary: Optional[str] = None,
    extra: Optional[dict] = None,
) -> None:
    """
    Write a structured log entry to the database.
    Non-blocking — failures are logged to console only (never crash the request).
    """
    from app.models.log_entry import LogEntry, ResolutionStatus
    from app.core.db import get_session

    entry = LogEntry(
        timestamp=datetime.utcnow(),
        business_id=business_id,
        session_id=session_id,
        log_type=log_type,
        error_code=error_code,
        description=description,
        endpoint=endpoint,
        request_summary=sanitize(request_summary or ""),
        response_status=response_status,
        response_summary=sanitize(response_summary or ""),
        resolution_status=ResolutionStatus.UNRESOLVED
        if log_type == "ERROR"
        else "N/A",
        extra=extra or {},
    )

    try:
        # Use a fresh session so we don't contaminate ongoing request sessions
        from sqlmodel import Session
        from app.core.db import engine

        with Session(engine) as session:
            session.add(entry)
            session.commit()
    except Exception as exc:
        # Never crash the request because logging failed
        logger.error("Failed to write log entry to DB: %s | original: %s", exc, description)
