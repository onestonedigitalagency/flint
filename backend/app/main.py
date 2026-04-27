import asyncio
import json
import os
from datetime import timedelta
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from sqlmodel import Session, select
from uuid import UUID
from jose import JWTError, jwt

from app.services.ai_service import get_ai_service
from app.services.auth_service import verify_password, get_password_hash, create_access_token, ALGORITHM, SECRET_KEY
from app.core.db import init_db, get_session
from app.models.business import Business
from app.models.user import User, UserCreate, UserRead, Token, TokenData

# Load environment variables
load_dotenv()

app = FastAPI(title="AgentDeploy API", version="1.0.0")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# Initialize DB on startup
@app.on_event("startup")
def on_startup():
    init_db()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AUTH DEPENDENCIES ---
async def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = session.exec(select(User).where(User.email == token_data.email)).first()
    if user is None:
        raise credentials_exception
    return user

# --- AUTH ENDPOINTS ---
@app.post("/api/auth/signup", response_model=UserRead)
def signup(user_in: UserCreate, session: Session = Depends(get_session)):
    # Check if user exists
    existing_user = session.exec(select(User).where(User.email == user_in.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password)
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user

@app.post("/api/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=60)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# --- FORGOT PASSWORD ENDPOINTS ---
class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str

@app.post("/api/auth/forgot-password")
def forgot_password(request: ForgotPasswordRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == request.email)).first()
    if not user:
        # We return 200 even if user not found for security (don't reveal registered emails)
        return {"message": "If your email is registered, you will receive an OTP."}
    
    import random
    from datetime import datetime, timedelta
    
    # Generate 6-digit OTP
    otp = f"{random.randint(100000, 999999)}"
    user.otp_code = otp
    user.otp_expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    session.add(user)
    session.commit()
    
    # Mock Email Sending
    print(f"DEBUG: Sending OTP {otp} to {request.email}")
    
    return {"message": "OTP sent successfully."}

@app.post("/api/auth/reset-password")
def reset_password(request: ResetPasswordRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == request.email)).first()
    if not user or user.otp_code != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP or email")
    
    from datetime import datetime
    if user.otp_expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP has expired")
    
    # Update password and clear OTP
    user.hashed_password = get_password_hash(request.new_password)
    user.otp_code = None
    user.otp_expires_at = None
    
    session.add(user)
    session.commit()
    
    return {"message": "Password reset successfully."}

# --- CHAT & BUSINESS ENDPOINTS ---
# (Existing endpoints updated to potentially use auth later)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    business_id: UUID
    model: Optional[str] = None

@app.post("/api/chat")
async def chat(request: ChatRequest, session: Session = Depends(get_session)):
    business = session.get(Business, request.business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    selected_model = request.model or business.ai_config.get("model", "gemini")
    api_key = os.getenv("GEMINI_API_KEY") 
    
    try:
        from app.main import get_business_context # Re-import or move helper
        ai_service = get_ai_service(selected_model, api_key)
        context = get_business_context(business)
        
        async def event_generator():
            yield f"data: {json.dumps({'type': 'status', 'content': f'Consulting {business.name} knowledge base...'})}\n\n"
            async for chunk in ai_service.stream_chat([m.dict() for m in request.messages], context):
                yield f"data: {json.dumps({'type': 'chunk', 'content': chunk})}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(event_generator(), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_business_context(business: Business) -> str:
    context = f"Business Name: {business.name}\nDescription: {business.description}\n"
    if business.plans_data:
        context += "Plans:\n" + "\n".join([f"- {p['name']}: {p['price']} ({', '.join(p.get('features', []))})" for p in business.plans_data])
    if business.faq_data:
        context += "\nFAQs:\n" + "\n".join([f"Q: {f['q']} A: {f['a']}" for f in business.faq_data])
    return context

@app.get("/health")
async def health():
    return {"status": "healthy"}
