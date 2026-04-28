"""
Chat router — Endpoint for end users interacting with the AI widget.

Uses Server-Sent Events (SSE) for streaming text.
Relies on PromptBuilder for context grounding (Anti-Hallucination).

Endpoints:
  POST /api/chat/stream — Stream AI response
"""
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlmodel import Session, select

from app.core.db import get_session
from app.models.business import Business
from app.models.session import ChatSession, ChatSessionCreate
from app.services.ai_service import get_ai_service
from app.services.prompt_builder import build_conversation_prompt

router = APIRouter(prefix="/api/chat", tags=["Widget Chat"])

SessionDep = Annotated[Session, Depends(get_session)]


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    agent_id: str
    session_id: uuid.UUID | None = None
    messages: list[ChatMessage]


@router.post("/stream")
async def stream_chat(
    body: ChatRequest,
    session: SessionDep,
) -> StreamingResponse:
    """Stream AI response using SSE."""
    # 1. Look up business by agent_id (from widget embed code)
    business = session.exec(
        select(Business).where(Business.agent_id == body.agent_id)
    ).first()

    if not business:
        raise HTTPException(status_code=404, detail="Agent not found")
    if business.agent_status == "paused":
        raise HTTPException(status_code=403, detail="Agent is currently paused")

    # 2. Track or create ChatSession (Analytics & Funnel tracking)
    chat_session = None
    if body.session_id:
        chat_session = session.get(ChatSession, body.session_id)
    
    if not chat_session:
        chat_session = ChatSession(
            business_id=business.id,
            status="active"
        )
        session.add(chat_session)
        session.commit()
        session.refresh(chat_session)

    # 3. Build Grounded Prompt (Anti-Hallucination layer)
    system_prompt = build_conversation_prompt(business.id, session)

    # 4. Determine which AI model to use based on business config
    ai_config = business.ai_config
    
    # Check if they have a custom key via Vault or platform default
    api_key = None
    if ai_config.get("api_key_source") == "vault":
        from app.models.api_key_vault import ApiKeyVault
        from app.services.encryption_service import decrypt
        # Look for model key
        vault_entry = session.exec(
            select(ApiKeyVault).where(
                ApiKeyVault.business_id == business.id,
                ApiKeyVault.key_type == "ai_model"
            )
        ).first()
        if vault_entry:
            api_key = decrypt(vault_entry.key_value_encrypted)

    # Instantiate the AI provider (Zero code changes to switch models!)
    ai_service = get_ai_service(
        provider=ai_config.get("provider"),
        model=ai_config.get("model"),
        api_key=api_key
    )

    # Convert to dict format
    dict_messages = [{"role": m.role, "content": m.content} for m in body.messages]

    # 5. Generator for SSE Streaming
    async def sse_generator():
        try:
            async for chunk in ai_service.stream_chat(dict_messages, system_prompt):
                # Standard Server-Sent Events format
                yield f"data: {chunk}\n\n"
        except Exception as e:
            # Fallback logic could go here
            yield f"data: [ERROR] {str(e)}\n\n"
        finally:
            yield "data: [DONE]\n\n"

    return StreamingResponse(sse_generator(), media_type="text/event-stream")
