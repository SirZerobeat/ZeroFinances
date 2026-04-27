from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import date, datetime
from decimal import Decimal
from uuid import UUID


# ===== Authentication Schemas =====
class LoginRequest(BaseModel):
    """Login request schema"""
    email: str = Field(..., description="User email")
    password: str = Field(..., description="User password")


class LoginResponse(BaseModel):
    """Login response schema"""
    token: str = Field(..., description="JWT access token")
    token_type: str = "bearer"
    user_id: str = Field(..., description="User ID (mock for now)")
    nombre: str = Field(..., description="User name")


# ===== Chat Schemas =====
class ChatMessageRequest(BaseModel):
    """Chat message from user"""
    message: str = Field(..., description="User message content", min_length=1, max_length=1000)


class ChatMessageResponse(BaseModel):
    """Chat message from Zero (AI)"""
    id: str = Field(..., description="Message ID")
    sender: str = "zero"
    content: str = Field(..., description="Zero's response")
    timestamp: datetime = Field(default_factory=datetime.now)
    type: str = "text"


# ===== Transaction Schemas =====
class TransactionBase(BaseModel):
    """Base transaction data"""
    tipo: str = Field(..., description="'ingreso' or 'egreso'")
    monto: Decimal = Field(..., gt=0, description="Transaction amount")
    fecha_transaccion: date = Field(..., description="Transaction date")
    comercio: Optional[str] = Field(None, description="Store/merchant name")
    descripcion: Optional[str] = Field(None, description="Transaction description")
    cuenta_id: Optional[str] = Field(None, description="Account ID")
    categoria_trans_id: Optional[int] = Field(None, description="Transaction category ID")


class TransactionCreate(TransactionBase):
    """Create transaction request"""
    items: Optional[List[dict]] = Field(None, description="Line items for receipt")


class TransactionResponse(TransactionBase):
    """Transaction response"""
    id: UUID
    fecha_registro: datetime
    es_ajuste_conciliacion: bool = False
    es_privado: bool = False
    requiere_revision: bool = False
    metadatos_ia: Optional[dict] = None

    class Config:
        from_attributes = True


# ===== Gemini Integration Schema =====
class GeminiTransactionInfo(BaseModel):
    """Expected JSON from Gemini API"""
    tipo: str = Field(..., description="'ingreso' or 'egreso'")
    monto: Decimal = Field(..., description="Total amount")
    fecha: str = Field(..., description="Transaction date YYYY-MM-DD")
    comercio: str = Field(..., description="Store/merchant")
    categoria_padre: Optional[str] = Field(None, description="Parent category")
    es_correccion_ajuste: bool = False
    id_ajuste_detectado: Optional[str] = Field(None, description="UUID of adjustment transaction")


class GeminiItem(BaseModel):
    """Item from Gemini response"""
    nombre: str = Field(..., description="Item name")
    precio: Decimal = Field(..., description="Item price")
    cat_prod: Optional[str] = Field(None, description="Product category")


class GeminiLogistica(BaseModel):
    """Logistics/confidence metadata"""
    confianza: float = Field(..., ge=0, le=1, description="Confidence score 0-1")
    requiere_confirmacion: bool = False


class GeminiResponse(BaseModel):
    """Full response from Gemini for transaction"""
    transaccion_info: GeminiTransactionInfo
    items: List[GeminiItem] = []
    logistica: GeminiLogistica


# ===== Account Schemas =====
class CuentaResponse(BaseModel):
    """Account response"""
    id: str
    nombre: str
    tipo: str
    saldo_actual: Decimal

    class Config:
        from_attributes = True


class CategoriaResponse(BaseModel):
    """Category response"""
    id: int
    nombre: str
    es_gasto_fijo: bool = False

    class Config:
        from_attributes = True
