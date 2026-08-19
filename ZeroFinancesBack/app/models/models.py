from sqlalchemy import Column, String, Integer, Numeric, Date, DateTime, Boolean, Text, ForeignKey, CheckConstraint, func, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.db.database import Base
import uuid
from datetime import datetime, date


class Cuenta(Base):
    """Account model"""
    __tablename__ = "cuentas"

    id = Column(String(50), primary_key=True)
    nombre = Column(String(100), nullable=False)
    tipo = Column(String(50), nullable=False)  # debito, credito, efectivo, ahorro
    saldo_actual = Column(Numeric(15, 2), default=0.00)

    # Relationships
    transacciones = relationship("Transaccion", back_populates="cuenta")


class CategoriaTransaccion(Base):
    """Transaction category model"""
    __tablename__ = "categorias_transaccion"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False, unique=True)
    es_gasto_fijo = Column(Boolean, default=False)

    # Relationships
    transacciones = relationship("Transaccion", back_populates="categoria_trans")


class CategoriaProducto(Base):
    """Product category model"""
    __tablename__ = "categorias_productos"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False, unique=True)

    # Relationships
    detalles = relationship("DetalleTransaccion", back_populates="categoria_prod")


class Pasivo(Base):
    """Liability/Debt model"""
    __tablename__ = "pasivos"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    monto_total = Column(Numeric(15, 2), nullable=False)
    saldo_pendiente = Column(Numeric(15, 2), nullable=False)

    # Relationships
    transacciones = relationship("Transaccion", back_populates="pasivo")


class Transaccion(Base):
    """Main transaction model"""
    __tablename__ = "transacciones"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cuenta_id = Column(String(50), ForeignKey("cuentas.id"), nullable=True)
    categoria_trans_id = Column(Integer, ForeignKey("categorias_transaccion.id"), nullable=True)
    pasivo_id = Column(Integer, ForeignKey("pasivos.id", ondelete="SET NULL"), nullable=True)
    tipo = Column(String(10), nullable=False)  # ingreso, egreso
    monto = Column(Numeric(15, 2), nullable=False)
    fecha_transaccion = Column(Date, nullable=False)
    fecha_registro = Column(TIMESTAMP(timezone=True), server_default=func.current_timestamp())
    comercio = Column(String(150), nullable=True)
    descripcion = Column(Text, nullable=True)
    es_ajuste_conciliacion = Column(Boolean, default=False)
    id_referencia_ajuste = Column(UUID(as_uuid=True), ForeignKey("transacciones.id"), nullable=True)
    es_privado = Column(Boolean, default=False)
    requiere_revision = Column(Boolean, default=False)
    metadatos_ia = Column(JSONB, nullable=True)

    # Relationships
    cuenta = relationship("Cuenta", back_populates="transacciones")
    categoria_trans = relationship("CategoriaTransaccion", back_populates="transacciones")
    pasivo = relationship("Pasivo", back_populates="transacciones")
    detalles = relationship("DetalleTransaccion", back_populates="transaccion", cascade="all, delete-orphan")


class DetalleTransaccion(Base):
    """Transaction detail/item model"""
    __tablename__ = "detalles_transaccion"

    id = Column(Integer, primary_key=True)
    transaccion_id = Column(UUID(as_uuid=True), ForeignKey("transacciones.id", ondelete="CASCADE"), nullable=True)
    categoria_prod_id = Column(Integer, ForeignKey("categorias_productos.id"), nullable=True)
    producto = Column(String(255), nullable=True)
    precio = Column(Numeric(15, 2), nullable=True)

    # Relationships
    transaccion = relationship("Transaccion", back_populates="detalles")
    categoria_prod = relationship("CategoriaProducto", back_populates="detalles")
