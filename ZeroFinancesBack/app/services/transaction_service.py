from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from app.models.models import Cuenta, Transaccion, DetalleTransaccion, CategoriaTransaccion
from datetime import datetime
from decimal import Decimal
import uuid

async def ensure_default_account(db: AsyncSession) -> Cuenta:
    """Ensure at least one account exists and return it."""
    result = await db.execute(select(Cuenta).limit(1))
    cuenta = result.scalars().first()
    if not cuenta:
        cuenta = Cuenta(
            id="efectivo_01",
            nombre="Efectivo Principal",
            tipo="efectivo",
            saldo_actual=Decimal("0.00")
        )
        db.add(cuenta)
        await db.commit()
        await db.refresh(cuenta)
    return cuenta

async def process_transaction_json(db: AsyncSession, tx_data: dict) -> Transaccion:
    """Process a transaction JSON from Gemini and save it to the DB."""
    cuenta = await ensure_default_account(db)
    
    info = tx_data.get("transaccion_info", {})
    tipo = info.get("tipo", "egreso")
    
    try:
        monto = Decimal(str(info.get("monto", 0.0)))
    except:
        monto = Decimal("0.0")
        
    # Update balance
    if tipo == "ingreso":
        cuenta.saldo_actual += monto
    else:
        cuenta.saldo_actual -= monto
        
    # Get or create category
    cat_nombre = info.get("categoria_padre") or "Otros"
    cat_result = await db.execute(select(CategoriaTransaccion).where(CategoriaTransaccion.nombre == cat_nombre))
    categoria = cat_result.scalars().first()
    if not categoria:
        categoria = CategoriaTransaccion(nombre=cat_nombre)
        db.add(categoria)
        await db.commit()
        await db.refresh(categoria)
        
    # Create transaction
    try:
        fecha = datetime.strptime(info.get("fecha", ""), "%Y-%m-%d").date()
    except:
        fecha = datetime.now().date()
        
    nueva_transaccion = Transaccion(
        id=uuid.uuid4(),
        cuenta_id=cuenta.id,
        categoria_trans_id=categoria.id,
        tipo=tipo,
        monto=monto,
        fecha_transaccion=fecha,
        comercio=info.get("comercio"),
        descripcion="Registrado por Zero",
        metadatos_ia=tx_data
    )
    
    db.add(nueva_transaccion)
    await db.flush() # To get the transaction ID
    
    # Add items if any
    items = tx_data.get("items", [])
    for item in items:
        try:
            precio = Decimal(str(item.get("precio", 0.0)))
        except:
            precio = Decimal("0.0")
            
        detalle = DetalleTransaccion(
            transaccion_id=nueva_transaccion.id,
            producto=item.get("nombre"),
            precio=precio
        )
        db.add(detalle)
        
    await db.commit()
    await db.refresh(nueva_transaccion)
    return nueva_transaccion

async def get_accounts(db: AsyncSession):
    """Get all accounts."""
    await ensure_default_account(db)
    result = await db.execute(select(Cuenta))
    return result.scalars().all()

async def get_transactions(db: AsyncSession):
    """Get recent transactions."""
    result = await db.execute(
        select(Transaccion).order_by(desc(Transaccion.fecha_registro)).limit(50)
    )
    return result.scalars().all()
