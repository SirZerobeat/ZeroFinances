# Propuesta Base de datos
### 1. Arquitectura de Datos (PostgreSQL)
El esquema está optimizado para la trazabilidad, permitiendo que un gasto "olvidado" o "fantasma" se convierta en un registro real sin romper la contabilidad.

''' PostgreSQL

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Catálogos
CREATE TABLE cuentas (
    id VARCHAR(50) PRIMARY KEY, -- ej: 'debito_nomina_01'
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) CHECK (tipo IN ('debito', 'credito', 'efectivo', 'ahorro')),
    saldo_actual DECIMAL(15, 2) DEFAULT 0.00
);

CREATE TABLE categorias_transaccion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE, -- 'Ingresos', 'Gastos Fijos', 'Otros Gastos', 'Ajuste'
    es_gasto_fijo BOOLEAN DEFAULT FALSE
);

CREATE TABLE categorias_productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE -- 'Golosinas', 'Bebidas', 'Lácteos', etc.
);

CREATE TABLE pasivos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL, -- 'Crédito Hipotecario', 'Préstamo Steve'
    monto_total DECIMAL(15, 2) NOT NULL,
    saldo_pendiente DECIMAL(15, 2) NOT NULL
);

-- Tabla Núcleo
CREATE TABLE transacciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cuenta_id VARCHAR(50) REFERENCES cuentas(id),
    categoria_trans_id INTEGER REFERENCES categorias_transaccion(id),
    pasivo_id INTEGER REFERENCES pasivos(id) ON DELETE SET NULL,
    tipo VARCHAR(10) CHECK (tipo IN ('ingreso', 'egreso')),
    monto DECIMAL(15, 2) NOT NULL,
    fecha_transaccion DATE NOT NULL, -- Fecha real del gasto
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    comercio VARCHAR(150),
    descripcion TEXT,
    
    -- Flags de Mitigación y UX
    es_ajuste_conciliacion BOOLEAN DEFAULT FALSE, -- Identifica "Gastos Fantasmas"
    id_referencia_ajuste UUID REFERENCES transacciones(id), -- Liga correcciones a fantasmas
    es_privado BOOLEAN DEFAULT FALSE,
    requiere_revision BOOLEAN DEFAULT FALSE,
    metadatos_ia JSONB -- Guarda el razonamiento de la IA
);

-- Detalle de productos (Mapping de items)
CREATE TABLE detalles_transaccion (
    id SERIAL PRIMARY KEY,
    transaccion_id UUID REFERENCES transacciones(id) ON DELETE CASCADE,
    categoria_prod_id INTEGER REFERENCES categorias_productos(id),
    producto VARCHAR(255),
    precio DECIMAL(15, 2)
);


### 2. Mitigación de Escenarios de Usuario
Para evitar que la app sea abandonada por fricción o errores de memoria, se proponen tres estrategias de interacción:

**Escenario A**: El Gasto Olvidado (Conciliación)
Al final del mes, si el saldo real no coincide con el de la app, el sistema genera un Egreso Fantasma.
*Acción*: INSERT en transacciones con es_ajuste_conciliacion = TRUE.
*Propósito*: Cuadra el balance inmediatamente para que el usuario pueda seguir operando el mes siguiente con saldos reales.

**Escenario B**: Recuperación de Memoria (Conversión)
Cuando el usuario recuerda semanas después en qué gastó ese dinero ("Eran los $1,300 del KFC").
*Acción*: La IA identifica el ajuste anterior y el Backend ejecuta un UPDATE transformando el registro fantasma en uno real (cambio de categoría y comercio).
*Beneficio*: Mejora las estadísticas retroactivamente sin alterar el saldo actual (el dinero ya se había "restado" contablemente).

**Escenario C**: Privacidad (Modo Incógnito)
Si el usuario no quiere dar detalles de un gasto.
*Acción*: Registro con flag es_privado = TRUE.
*Impacto*: El monto se resta del presupuesto, pero la IA tiene prohibido desglosar o preguntar sobre los productos de esa transacción en resúmenes futuros.


### 3. Intercambio de Información (JSON a DB Mapping)
Estructura del JSON (IA -> Backend)
Este es el objeto que el servicio de Python recibirá de Gemini Flash:
'''JSON
{
  "transaccion_info": {
    "tipo": "egreso",
    "monto": 1333.00,
    "fecha": "2026-04-18",
    "comercio": "KFC",
    "categoria_padre": "Otros Gastos",
    "es_correccion_ajuste": true,
    "id_ajuste_detectado": "uuid-del-fantasma-si-existe"
  },
  "items": [
    {"nombre": "Paquete Familiar", "precio": 450.00, "cat_prod": "Carnes y Embutidos"},
    {"nombre": "Refrescos", "precio": 120.00, "cat_prod": "Bebidas"}
  ],
  "logistica": {
    "confianza": 0.95,
    "requiere_confirmacion": false
    }
}

## Mapeo al Script SQL
Campo JSON  |Columna Tabla PostgreSQL   |Lógica de Negocio  |
tipo    |transacciones.tipo     |ingreso o egreso.
monto   |transacciones.monto    |Suma total del ticket.
fecha   |transacciones.fecha_transaccion    |Fecha que aparece en el ticket o mencionada.
comercio    |transacciones.comercio    |Nombre de la sucursal o tienda.
id_ajuste_detectado     |transacciones.id (en UPDATE)   |Si es corrección, el backend busca este ID para sobreescribir.
items.nombred   |detalles_transaccion.producto  |Nombre individual del producto.
items.cat_prod  |detalles_transaccion.categoria_prod_id |Se busca el ID en categorias_productos.

### 4. Propuesta de Microservicios (Python/FastAPI)
**Service**: Multimodal ProcessorRecibe el audio/foto.
Convierte audio a texto (Whisper o similar) y extrae texto de imagen (OCR).
Envía el contexto "crudo" al orquestador.

**Service**: AI Orchestrator (Gemini Flash)
Mantiene el contexto de las categorías de tu Excel.
Genera el JSON estructurado.
Inteligencia de Ajuste: Si el usuario dice "corregir", este servicio consulta los últimos registros de Ajuste de Saldo para proponer el reemplazo.

**Service**: DB Connector (SQLAlchemy/Tortoise)
Realiza las operaciones atómicas.
Trigger de Saldo: Actualiza el saldo_actual en la tabla cuentas cada vez que una transacción es confirmada.