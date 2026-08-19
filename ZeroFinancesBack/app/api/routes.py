from fastapi import APIRouter, Depends, HTTPException, Header, File, UploadFile, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.schemas import LoginRequest, LoginResponse, ChatMessageRequest, ChatMessageResponse, CuentaResponse, TransactionResponse
from app.core.security import authenticate_user, create_access_token, verify_token
from app.services.gemini_service import generate_zero_response, parse_transaction_from_gemini, generate_transaction_json, parse_receipt_image
from app.services.transaction_service import process_transaction_json, get_accounts, get_transactions
from app.services.websocket_service import manager
from datetime import timedelta
from typing import Optional, List

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
    token_payload: dict = Depends(verify_token_header),
    db: AsyncSession = Depends(get_db)
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
        # Check if it's a transaction
        tx_check = await parse_transaction_from_gemini(request.message)
        
        if tx_check and tx_check.get("es_transaccion"):
            # Process transaction
            tx_json = await generate_transaction_json(request.message)
            if tx_json:
                await process_transaction_json(db, tx_json)
                await manager.broadcast_balance_update()
                zero_response = f"¡Registrado! He guardado el {tx_check.get('tipo', 'movimiento')} por ${tx_check.get('monto')} en {tx_check.get('comercio', 'tu cuenta')}."
            else:
                zero_response = "Detecté un movimiento, pero tuve problemas para procesar los detalles. ¿Podrías ser más específico?"
        else:
            # Generate normal response from Gemini
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

@router.post("/chat/image", response_model=ChatMessageResponse, tags=["Chat"])
async def chat_image(
    file: UploadFile = File(...),
    token_payload: dict = Depends(verify_token_header),
    db: AsyncSession = Depends(get_db)
):
    """
    Process a receipt image using OCR (Gemini Vision) and register the transaction.
    """
    try:
        contents = await file.read()
        tx_json = await parse_receipt_image(contents, file.content_type)
        if tx_json:
            await process_transaction_json(db, tx_json)
            await manager.broadcast_balance_update()
            info = tx_json.get("transaccion_info", {})
            zero_response = f"¡Ticket procesado! He registrado un {info.get('tipo', 'movimiento')} por ${info.get('monto')} en {info.get('comercio', 'tu cuenta')}."
        else:
            zero_response = "No pude extraer la información del ticket. Asegúrate de que la imagen sea clara."
            
        return ChatMessageResponse(
            id=f"msg_{int(__import__('time').time() * 1000)}",
            content=zero_response,
            type="text"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health", tags=["Health"])
async def health():
    """Health check endpoint"""
    return {"status": "ok", "service": "ZeroFinances Backend"}

@router.get("/cuentas", response_model=List[CuentaResponse], tags=["Accounts"])
async def read_accounts(
    token_payload: dict = Depends(verify_token_header),
    db: AsyncSession = Depends(get_db)
):
    """Get user accounts"""
    return await get_accounts(db)

@router.get("/transacciones", response_model=List[TransactionResponse], tags=["Transactions"])
async def read_transactions(
    token_payload: dict = Depends(verify_token_header),
    db: AsyncSession = Depends(get_db)
):
    """Get transaction history"""
    return await get_transactions(db)

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
