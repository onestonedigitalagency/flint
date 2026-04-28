"""
Voice router — WebSocket endpoint for voice streaming.

Endpoints:
  WebSocket /api/voice/stream/{agent_id}
"""
import uuid
import json
import logging
from typing import Annotated

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlmodel import Session, select

from app.core.db import get_session
from app.models.business import Business
from app.services.voice_service import get_stt_service, get_tts_service
from app.services.ai_service import get_ai_service
from app.services.prompt_builder import build_conversation_prompt

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/voice", tags=["Voice"])


@router.websocket("/stream/{agent_id}")
async def voice_websocket_endpoint(
    websocket: WebSocket,
    agent_id: str,
    # Cannot easily use Depends(get_session) directly in websocket params in all FastAPI versions,
    # but we can resolve it manually or inject it.
):
    await websocket.accept()
    
    # We resolve the DB session manually for WebSocket
    from app.core.db import engine
    
    with Session(engine) as session:
        business = session.exec(
            select(Business).where(Business.agent_id == agent_id)
        ).first()

        if not business:
            await websocket.send_json({"error": "Agent not found"})
            await websocket.close()
            return
        
        if business.agent_status == "paused":
            await websocket.send_json({"error": "Agent is currently paused"})
            await websocket.close()
            return

        # Prepare STT, AI, and TTS services
        stt_service = get_stt_service()
        tts_service = get_tts_service()
        
        system_prompt = build_conversation_prompt(business.id, session)
        
        ai_config = business.ai_config
        
        api_key = None
        if ai_config.get("api_key_source") == "vault":
            from app.models.api_key_vault import ApiKeyVault
            from app.services.encryption_service import decrypt
            vault_entry = session.exec(
                select(ApiKeyVault).where(
                    ApiKeyVault.business_id == business.id,
                    ApiKeyVault.key_type == "ai_model"
                )
            ).first()
            if vault_entry:
                api_key = decrypt(vault_entry.key_value_encrypted)

        ai_service = get_ai_service(
            provider=ai_config.get("provider"),
            model=ai_config.get("model"),
            api_key=api_key
        )

    # Note: State kept in memory for the duration of the websocket connection
    chat_history = []

    try:
        while True:
            # Expecting binary audio frames from the client
            audio_bytes = await websocket.receive_bytes()
            
            # 1. Transcribe the audio
            transcript = await stt_service.transcribe(audio_bytes)
            if not transcript or "[stub transcription]" in transcript:
                # If using stub, just echo or handle mock
                transcript = "User said something (stub STT)."
                
            await websocket.send_json({"transcript": transcript})
            
            chat_history.append({"role": "user", "content": transcript})

            # 2. Get AI Response
            response_text = await ai_service.complete(chat_history, system_prompt)
            chat_history.append({"role": "assistant", "content": response_text})
            
            await websocket.send_json({"ai_response": response_text})

            # 3. Synthesize the TTS and send back audio
            out_audio_bytes = await tts_service.synthesize(response_text)
            if out_audio_bytes:
                await websocket.send_bytes(out_audio_bytes)
            else:
                # Stub empty audio fallback
                pass

    except WebSocketDisconnect:
        logger.info(f"Voice client disconnected for agent {agent_id}")
    except Exception as e:
        logger.error(f"Voice WebSocket error: {e}")
        try:
            await websocket.send_json({"error": str(e)})
            await websocket.close()
        except:
            pass
