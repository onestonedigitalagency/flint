"""
Onboarding router — manages the 9-step business setup state machine.

Steps:
1. Account Created
2. Compatibility Check
3. Upload Resources
4. Structured Forms (A, B, C)
5. Conversation Rules
6. Capabilities (Voice, Vision)
7. API Key Vault
8. Sandbox Testing
9. Live Deployment

Endpoints:
  GET  /api/businesses/{id}/onboarding      — Get current step
  POST /api/businesses/{id}/onboarding/step — Advance to next step
"""
import uuid
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from pydantic import BaseModel
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.dependencies import CurrentUserDep
from app.models.business import Business
from app.services.pdf_service import extract_text_from_pdf
from app.services.ai_service import get_ai_service
from app.services.prompt_builder import build_setup_analyst_prompt

router = APIRouter(prefix="/api/businesses", tags=["Onboarding"])

SessionDep = Annotated[Session, Depends(get_session)]


class OnboardingStepRequest(BaseModel):
    step: int
    data: dict | None = None  # Optional payload for specific steps


class OnboardingStatusResponse(BaseModel):
    current_step: int
    completed: bool
    status: str


def _verify_access(business_id: uuid.UUID, current_user, session: Session) -> Business:
    business = session.get(Business, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    if business.owner_id != current_user.id and current_user.role != "platform_owner":
        raise HTTPException(status_code=403, detail="Access denied")
    return business


@router.get("/{business_id}/onboarding", response_model=OnboardingStatusResponse)
def get_onboarding_status(
    business_id: uuid.UUID,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> OnboardingStatusResponse:
    """Get the current onboarding step and completion status."""
    business = _verify_access(business_id, current_user, session)
    return OnboardingStatusResponse(
        current_step=business.onboarding_step,
        completed=business.onboarding_completed,
        status="live" if business.onboarding_completed else "in_progress",
    )


@router.post("/{business_id}/onboarding/step", response_model=OnboardingStatusResponse)
def advance_onboarding_step(
    business_id: uuid.UUID,
    body: OnboardingStepRequest,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> OnboardingStatusResponse:
    """
    Advance the onboarding state machine.
    Requires sequential progression. Step 9 marks onboarding as complete.
    """
    business = _verify_access(business_id, current_user, session)

    if business.onboarding_completed:
        raise HTTPException(status_code=400, detail="Onboarding is already complete.")

    if body.step != business.onboarding_step + 1 and body.step != business.onboarding_step:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid step. Must progress sequentially from step {business.onboarding_step}.",
        )

    # Process step-specific logic (e.g., saving compatibility data)
    if body.step == 2 and body.data:
        # e.g., Set integration mode based on UI selection
        if "integration_mode" in body.data:
            business.integration_mode = body.data["integration_mode"]

    # Advance the step
    business.onboarding_step = body.step

    # Step 9 is Live Deployment
    if body.step == 9:
        business.onboarding_completed = True
        business.agent_status = "live"

    business.updated_at = datetime.utcnow()
    session.add(business)
    session.commit()
    session.refresh(business)

    return OnboardingStatusResponse(
        current_step=business.onboarding_step,
        completed=business.onboarding_completed,
        status="live" if business.onboarding_completed else "in_progress",
    )


@router.post("/{business_id}/analyze-pdf")
async def analyze_pdf(
    business_id: uuid.UUID,
    current_user: CurrentUserDep,
    session: SessionDep,
    file: UploadFile = File(...),
):
    """
    Upload a PDF, extract text, and get a 10-line summary from the AI Setup Analyst.
    """
    business = _verify_access(business_id, current_user, session)

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # 1. Extract text from PDF
    content = await file.read()
    try:
        text = extract_text_from_pdf(content)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(e)}")

    if not text:
        raise HTTPException(status_code=400, detail="PDF contains no readable text.")

    # 2. Save extracted text to knowledge base
    business.knowledge_base = text
    
    # 3. Get AI Summary (Role 1: Setup Analyst)
    system_prompt = build_setup_analyst_prompt(business.name, text)
    ai_service = get_ai_service()
    
    # Simple message to trigger the 10-line summary
    messages = [{"role": "user", "content": "I've uploaded my business document. Please analyze it and give me the 10-line summary."}]
    
    summary = await ai_service.complete(messages, system_prompt)

    # 4. Save to chat history if needed
    if business.setup_chat_history is None:
        business.setup_chat_history = []
    business.setup_chat_history.append({"role": "assistant", "content": summary})
    
    # 5. Advanced to step 3
    business.onboarding_step = 3

    business.updated_at = datetime.utcnow()
    session.add(business)
    session.commit()
    session.refresh(business)

    return {
        "summary": summary,
        "filename": file.filename,
        "onboarding_step": business.onboarding_step
    }
