"""
Log entry model — Chapter 12 structured logging.

ALL 13 required fields from CONTEXT.md are present.
Sensitive data is sanitized BEFORE writing (no keys, no PII).
"""
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel, JSON, Column


# Log type constants
class LogType:
    ERROR = "ERROR"
    WARNING = "WARNING"
    INFO = "INFO"


# Error code constants (Chapter 12)
class ErrorCode:
    API_FAILURE = "API_FAILURE"
    AI_ERROR = "AI_ERROR"
    PAYMENT_ERROR = "PAYMENT_ERROR"
    AUTH_FAILURE = "AUTH_FAILURE"
    AGENT_CRASH = "AGENT_CRASH"
    FEATURE_ERROR = "FEATURE_ERROR"


# Resolution status constants
class ResolutionStatus:
    UNRESOLVED = "UNRESOLVED"
    RESOLVED = "RESOLVED"
    PLATFORM_FIX_APPLIED = "PLATFORM_FIX_APPLIED"


class LogEntry(SQLModel, table=True):
    __tablename__ = "log_entries"

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Required fields (Chapter 12)
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)
    business_id: Optional[UUID] = Field(default=None, index=True)  # None = platform-level
    session_id: Optional[UUID] = None
    log_type: str = Field(index=True)           # ERROR | WARNING | INFO
    error_code: Optional[str] = Field(default=None, index=True)  # see ErrorCode above
    description: str                            # Human-readable

    endpoint: Optional[str] = None             # Which API endpoint was called
    # Sanitized request (no keys, no PII)
    request_summary: Optional[str] = None
    response_status: Optional[int] = None      # HTTP status code
    # Sanitized response body
    response_summary: Optional[str] = None

    resolution_status: str = Field(
        default=ResolutionStatus.UNRESOLVED, index=True
    )
    platform_fix_id: Optional[str] = None     # If fix was pushed platform-wide

    # Additional context (stack traces etc. — sanitized)
    extra: dict = Field(default={}, sa_column=Column(JSON))


class LogEntryRead(SQLModel):
    id: UUID
    timestamp: datetime
    business_id: Optional[UUID] = None
    session_id: Optional[UUID] = None
    log_type: str
    error_code: Optional[str] = None
    description: str
    endpoint: Optional[str] = None
    response_status: Optional[int] = None
    resolution_status: str
    platform_fix_id: Optional[str] = None


class LogEntryDetail(LogEntryRead):
    """Full detail including sanitized request/response."""
    request_summary: Optional[str] = None
    response_summary: Optional[str] = None
    extra: dict
