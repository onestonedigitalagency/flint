"""
API Key Vault model — Step 7 of onboarding.

ALL credentials are stored AES-256 encrypted.
Key values NEVER appear in logs or API responses.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class ApiKeyVault(SQLModel, table=True):
    __tablename__ = "api_key_vault"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    business_id: UUID = Field(index=True)

    key_name: str                  # "Supabase Anon Key", "Razorpay Secret"
    # Key type for UX grouping:
    # "integration" | "payment" | "ai_model" | "communication"
    key_type: str = "integration"
    # AES-256-GCM encrypted value — raw value NEVER stored
    key_value_encrypted: str
    # Description so the owner remembers what this is
    description: Optional[str] = None

    # Connection test result
    # "untested" | "connected" | "failed"
    connection_status: str = "untested"
    last_tested_at: Optional[datetime] = None
    last_test_error: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ApiKeyVaultCreate(SQLModel):
    key_name: str
    key_type: str = "integration"
    key_value: str             # Plaintext — encrypted before save
    description: Optional[str] = None


class ApiKeyVaultRead(SQLModel):
    """Safe read — key_value is NEVER returned."""
    id: UUID
    business_id: UUID
    key_name: str
    key_type: str
    description: Optional[str] = None
    connection_status: str
    last_tested_at: Optional[datetime] = None
    last_test_error: Optional[str] = None
    created_at: datetime


class ApiKeyVaultUpdate(SQLModel):
    key_value: Optional[str] = None    # Plaintext — encrypted before save
    description: Optional[str] = None
