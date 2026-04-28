"""
Chat session model — tracks end-user conversations.

Used for analytics and logging.
Session data is stored in AgentDeploy only.
User/transaction data is ALWAYS written to the business's own system.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel, JSON, Column


class ChatSession(SQLModel, table=True):
    __tablename__ = "chat_sessions"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    business_id: UUID = Field(index=True)

    # ── Session metadata ──────────────────────────────────────────
    language: str = "en"        # "en" | "hi"
    mode: str = "text"          # "text" | "voice"
    started_at: datetime = Field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None

    # ── Funnel tracking (for analytics) ───────────────────────────
    viewed_plans: bool = False
    signup_attempted: bool = False
    signup_completed: bool = False
    payment_initiated: bool = False
    payment_completed: bool = False
    converted: bool = False
    converted_plan_id: Optional[UUID] = None
    coupon_applied: Optional[str] = None

    # ── Message history ───────────────────────────────────────────
    # [{"role": "user"|"assistant", "content": str, "timestamp": str}]
    messages: list = Field(default=[], sa_column=Column(JSON))
    message_count: int = 0

    # ── Error tracking ────────────────────────────────────────────
    had_error: bool = False
    voice_failed: bool = False   # Switched to text mid-session


class ChatSessionCreate(SQLModel):
    business_id: UUID
    language: str = "en"
    mode: str = "text"


class ChatSessionRead(SQLModel):
    id: UUID
    business_id: UUID
    language: str
    mode: str
    started_at: datetime
    ended_at: Optional[datetime] = None
    viewed_plans: bool
    converted: bool
    message_count: int
