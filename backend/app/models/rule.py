"""
Conversation rules model — Step 5 of onboarding.

Rules are specific instructions for how the AI should behave (e.g. "Never mention competitors",
"Always be polite", etc). They are injected into the system prompt.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class ConversationRule(SQLModel, table=True):
    __tablename__ = "conversation_rules"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    business_id: UUID = Field(index=True)

    rule_text: str               # "Do not offer discounts above 20%"
    rule_type: str = "custom"    # "system" | "custom"
    priority: int = 0            # 0 = normal, 1 = high priority
    is_active: bool = True

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class RuleCreate(SQLModel):
    rule_text: str
    rule_type: str = "custom"
    priority: int = 0
    is_active: bool = True


class RuleRead(SQLModel):
    id: UUID
    business_id: UUID
    rule_text: str
    rule_type: str
    priority: int
    is_active: bool
    created_at: datetime


class RuleUpdate(SQLModel):
    rule_text: Optional[str] = None
    rule_type: Optional[str] = None
    priority: Optional[int] = None
    is_active: Optional[bool] = None
