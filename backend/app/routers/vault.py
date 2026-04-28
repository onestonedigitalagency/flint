"""
Vault router — Encrypted API key management.

Endpoints:
  GET    /api/businesses/{id}/vault       — List all keys (masked)
  POST   /api/businesses/{id}/vault       — Add a key (encrypted at rest)
  PUT    /api/businesses/{id}/vault/{vid} — Update a key
  DELETE /api/businesses/{id}/vault/{vid} — Remove a key
"""
import uuid
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.dependencies import CurrentUserDep
from app.models.business import Business
from app.models.api_key_vault import ApiKeyVault, ApiKeyVaultCreate, ApiKeyVaultRead, ApiKeyVaultUpdate
from app.services.encryption_service import encrypt

router = APIRouter(prefix="/api/businesses", tags=["Vault"])

SessionDep = Annotated[Session, Depends(get_session)]


def _verify_access(business_id: uuid.UUID, current_user, session: Session) -> Business:
    business = session.get(Business, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    if business.owner_id != current_user.id and current_user.role != "platform_owner":
        raise HTTPException(status_code=403, detail="Access denied")
    return business


@router.get("/{business_id}/vault", response_model=list[ApiKeyVaultRead])
def list_keys(
    business_id: uuid.UUID, current_user: CurrentUserDep, session: SessionDep
) -> list[ApiKeyVaultRead]:
    """List all API keys stored in the vault. Values are never returned."""
    _verify_access(business_id, current_user, session)
    keys = session.exec(
        select(ApiKeyVault).where(ApiKeyVault.business_id == business_id)
    ).all()
    return [ApiKeyVaultRead.model_validate(k) for k in keys]


@router.post("/{business_id}/vault", response_model=ApiKeyVaultRead, status_code=201)
def add_key(
    business_id: uuid.UUID,
    body: ApiKeyVaultCreate,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> ApiKeyVaultRead:
    """Store a new API key. It is immediately AES-256 encrypted."""
    _verify_access(business_id, current_user, session)

    vault_entry = ApiKeyVault(
        business_id=business_id,
        key_name=body.key_name,
        key_type=body.key_type,
        key_value_encrypted=encrypt(body.key_value),
        description=body.description,
    )
    session.add(vault_entry)
    session.commit()
    session.refresh(vault_entry)
    return ApiKeyVaultRead.model_validate(vault_entry)


@router.put("/{business_id}/vault/{key_id}", response_model=ApiKeyVaultRead)
def update_key(
    business_id: uuid.UUID,
    key_id: uuid.UUID,
    body: ApiKeyVaultUpdate,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> ApiKeyVaultRead:
    """Update an API key's value or description."""
    _verify_access(business_id, current_user, session)
    
    vault_entry = session.get(ApiKeyVault, key_id)
    if not vault_entry or vault_entry.business_id != business_id:
        raise HTTPException(status_code=404, detail="Key not found")

    if body.key_value:
        vault_entry.key_value_encrypted = encrypt(body.key_value)
    if body.description is not None:
        vault_entry.description = body.description
    
    vault_entry.updated_at = datetime.utcnow()
    # Reset connection status since key changed
    vault_entry.connection_status = "untested"
    
    session.add(vault_entry)
    session.commit()
    session.refresh(vault_entry)
    return ApiKeyVaultRead.model_validate(vault_entry)


@router.delete("/{business_id}/vault/{key_id}", status_code=204)
def delete_key(
    business_id: uuid.UUID,
    key_id: uuid.UUID,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> None:
    """Remove a key from the vault completely."""
    _verify_access(business_id, current_user, session)
    
    vault_entry = session.get(ApiKeyVault, key_id)
    if not vault_entry or vault_entry.business_id != business_id:
        raise HTTPException(status_code=404, detail="Key not found")
    
    session.delete(vault_entry)
    session.commit()
