from fastapi import APIRouter, Depends, HTTPException, Header
from app.schemas.schemas import LoginRequest, LoginResponse, ChatMessageRequest, ChatMessageResponse
from app.core.security import authenticate_user, create_access_token, verify_token
from app.services.gemini_service import generate_zero_response
from datetime import timedelta
from typing import Optional

router = APIRouter()


def verify_token_header(authorization: Optional[str] = Header(None)) -> dict:
    """Verify JWT token from Authorization header"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return payload


@router.post("/auth/login", response_model=LoginResponse, tags=["Auth"])
async def login(request: LoginRequest):
    """
    Login endpoint - returns JWT token

    **Test credentials:**
    - Email: admin@test.com, Password: admin123
    - Email: user@test.com, Password: user123
    """
    user = authenticate_user(request.email, request.password)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Create access token
    access_token_expires = timedelta(minutes=30)
    token = create_access_token(
        data={"sub": user["email"], "user_id": user["user_id"]},
        expires_delta=access_token_expires
    )

    return LoginResponse(
        token=token,
        user_id=user["user_id"],
        nombre=user["nombre"]
    )


@router.post("/chat", response_model=ChatMessageResponse, tags=["Chat"])
async def chat(
    request: ChatMessageRequest,
    token_payload: dict = Depends(verify_token_header)
):
    """
    Chat with Zero (AI) endpoint.

    Zero can handle:
    - General conversation (hello, jokes, fun facts)
    - Finance discussions
    - Eventually: transaction parsing

    **Requires:** Bearer token from /auth/login

    Example messages:
    - "Hola" → Friendly greeting
    - "Cuéntame un chiste" → Tells a joke
    - "Dame un dato interesante" → Fun fact (finance-related)
    - "Gasté $500 en comida" → Helps categorize expense
    """
    try:
        # Generate response from Gemini
        zero_response = await generate_zero_response(request.message)

        return ChatMessageResponse(
            id=f"msg_{int(__import__('time').time() * 1000)}",
            content=zero_response,
            type="text"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating response: {str(e)}"
        )


@router.get("/health", tags=["Health"])
async def health():
    """Health check endpoint"""
    return {"status": "ok", "service": "ZeroFinances Backend"}
