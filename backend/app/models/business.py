"""
Business model — full onboarding state machine.

Tracks a business owner's agent setup progress through 9 steps
and stores all config needed to run the AI agent.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel, JSON, Column
from sqlalchemy import Text


class Business(SQLModel, table=True):
    __tablename__ = "businesses"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    owner_id: UUID = Field(index=True)  # FK → users.id

    # ── Basic Profile ──────────────────────────────────────────────
    name: str
    website_url: Optional[str] = None
    category: Optional[str] = None          # e.g. "yoga studio", "e-commerce"
    description: Optional[str] = Field(default=None, sa_column=Column(Text))

    # ── Agent Identity ─────────────────────────────────────────────
    agent_id: str = Field(unique=True, index=True)   # Used in embed code
    bot_name: str = "Assistant"
    bot_avatar_url: Optional[str] = None
    bot_color: str = "#4f46e5"              # Primary widget color

    # ── Onboarding State Machine ───────────────────────────────────
    # Steps: 1=Account, 2=Compat, 3=Upload, 4=Forms, 5=Rules,
    #        6=Capabilities, 7=Vault, 8=Sandbox, 9=Live
    onboarding_step: int = Field(default=1)
    onboarding_completed: bool = False

    # ── Integration Mode (Chapter 4.3) ────────────────────────────
    # supabase | firebase | rest_api | unset
    integration_mode: Optional[str] = None

    # ── Agent Status ───────────────────────────────────────────────
    # sandbox | live | paused
    agent_status: str = Field(default="sandbox")

    # ── Uploaded Files ────────────────────────────────────────────
    # List of {"filename": str, "storage_url": str, "file_type": str}
    uploaded_files: list = Field(default=[], sa_column=Column(JSON))

    # ── AI Model Config (pluggable — never hardcoded) ─────────────
    # {"provider": "google", "model": "gemini-1.5-flash",
    #  "api_key_source": "platform", "fallback": {...}}
    ai_config: dict = Field(
        default={
            "provider": "google",
            "model": "gemini-1.5-flash",
            "api_key_source": "platform",
        },
        sa_column=Column(JSON),
    )

    # ── Setup Analyst AI conversation history ─────────────────────
    # List of {"role": str, "content": str}
    setup_chat_history: list = Field(default=[], sa_column=Column(JSON))

    # ── Metadata ──────────────────────────────────────────────────
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class BusinessCreate(SQLModel):
    name: str
    website_url: Optional[str] = None
    category: Optional[str] = None
    bot_name: str = "Assistant"
    bot_color: str = "#4f46e5"


class BusinessRead(SQLModel):
    id: UUID
    owner_id: UUID
    name: str
    website_url: Optional[str] = None
    category: Optional[str] = None
    agent_id: str
    bot_name: str
    bot_color: str
    bot_avatar_url: Optional[str] = None
    onboarding_step: int
    onboarding_completed: bool
    integration_mode: Optional[str] = None
    agent_status: str
    ai_config: dict
    created_at: datetime


class BusinessUpdate(SQLModel):
    name: Optional[str] = None
    website_url: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    bot_name: Optional[str] = None
    bot_avatar_url: Optional[str] = None
    bot_color: Optional[str] = None
    ai_config: Optional[dict] = None
    agent_status: Optional[str] = None
