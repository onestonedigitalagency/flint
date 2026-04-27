from sqlmodel import SQLModel, Field, JSON
from typing import Optional, List, Dict
from uuid import UUID, uuid4

class BusinessBase(SQLModel):
    name: str
    description: str
    website_url: Optional[str] = None
    plans_data: List[Dict] = Field(default=[], sa_type=JSON)
    faq_data: List[Dict] = Field(default=[], sa_type=JSON)
    ai_config: Dict = Field(default={"model": "gemini", "tone": "professional"}, sa_type=JSON)

class Business(BusinessBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    api_key_hash: Optional[str] = None # For authentication

class BusinessCreate(BusinessBase):
    pass

class BusinessRead(BusinessBase):
    id: UUID
