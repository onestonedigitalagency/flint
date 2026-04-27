import os
import hashlib
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-for-development")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """
    Hashes the password using Bcrypt. 
    We pre-hash with SHA256 to avoid Bcrypt's 72-character limit.
    """
    pw_bytes = password.encode('utf-8')
    pw_hash = hashlib.sha256(pw_bytes).hexdigest()
    return pwd_context.hash(pw_hash)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies the password by pre-hashing and comparing with the stored hash.
    """
    pw_bytes = plain_password.encode('utf-8')
    pw_hash = hashlib.sha256(pw_bytes).hexdigest()
    return pwd_context.verify(pw_hash, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
