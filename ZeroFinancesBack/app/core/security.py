from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None


# Mock user credentials for development
TEST_CREDENTIALS = {
    "admin@test.com": {
        "password": "admin123",
        "user_id": "user_001",
        "nombre": "Admin (Dev)"
    },
    "user@test.com": {
        "password": "user123",
        "user_id": "user_002",
        "nombre": "Usuario Test"
    }
}


def authenticate_user(email: str, password: str) -> Optional[dict]:
    """Authenticate user with email and password (mock implementation)"""
    user = TEST_CREDENTIALS.get(email)

    if not user:
        return None

    if not user["password"] == password:  # Simple comparison for dev
        return None

    return {
        "email": email,
        "user_id": user["user_id"],
        "nombre": user["nombre"]
    }
