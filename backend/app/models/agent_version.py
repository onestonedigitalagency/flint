"""
Agent version history model — enables configuration snapshots and rollback.

Every time a business takes a snapshot, the full AI config (Plans, Coupons,
Rules, Capabilities) is serialised into config_snapshot. Rollback restores
all of those records to the exact state in the snapshot.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel, JSON, Column


class AgentVersion(SQLModel, table=True):
    __tablename__ = "agent_versions"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    business_id: UUID = Field(index=True)

    version_string: str                       # e.g. "v1", "v2", "v3"
    version_name: str                         # Human-readable, e.g. "Before Pricing Change"
    description: Optional[str] = None

    # Full serialised snapshot: {plans, coupons, rules, capabilities}
    config_snapshot: dict = Field(default={}, sa_column=Column(JSON))

    created_at: datetime = Field(default_factory=datetime.utcnow)


class AgentVersionRead(SQLModel):
    id: UUID
    business_id: UUID
    version_string: str
    version_name: str
    description: Optional[str] = None
    created_at: datetime
    # config_snapshot excluded from list — only included in detail/rollback view
