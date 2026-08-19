# ZeroFinances - Backend Documentation

Este documento centraliza la información técnica, configuración, API y orquestación de la inteligencia artificial en el Backend de ZeroFinances.

## 🚀 Stack Tecnológico y Arquitectura

*   **Lenguaje**: Python 3.11 / 3.12+
*   **Framework**: FastAPI (Orquestador asíncrono de alto rendimiento).
*   **Conexión DB**: SQLAlchemy (ORM asíncrono) + `asyncpg`.
*   **Inteligencia Artificial**: API de Gemini 1.5 y 2.0 Flash (OCR nativo, transcripción y análisis multimodal).
*   **Autenticación**: JWT (JSON Web Tokens) con *bcrypt* para contraseñas.
*   **Sincronización**: WebSockets nativos de FastAPI.

## 📁 Estructura del Proyecto (MVC Adaptado)

```
ZeroFinancesBack/
├── app/
│   ├── api/            # Controladores: Definición de las rutas (routes.py)
│   ├── core/           # Configuración (config.py) y Autenticación (security.py)
│   ├── db/             # Conexión asíncrona a PostgreSQL (database.py)
│   ├── models/         # Definición de tablas ORM (models.py)
│   ├── schemas/        # Validaciones de datos de entrada/salida (schemas.py) con Pydantic
│   └── services/       # Lógica de negocio (gemini_service.py, transaction_service.py, websocket_service.py)
├── .env.template       # Plantilla de variables de entorno
├── requirements.txt    # Dependencias de Python
└── main.py             # Punto de entrada principal (app = FastAPI())
```

## 🧠 Personalidad de Zero y Gemini AI

Zero es el asistente inteligente multimodal gestionado a través de `gemini_service.py`. Sus capacidades actuales incluyen:

1.  **Orquestación de Lenguaje Natural**: Mantiene el contexto como asesor financiero usando un System Prompt avanzado. Puede interactuar, contar datos, chistes, y deducir transacciones desde lenguaje coloquial ("Gasté $300 en tacos").
2.  **Extracción de Transacciones (JSON)**: El backend está programado para obligar a Gemini a devolver un objeto JSON estructurado si detecta una transacción, el cual se parsea automáticamente mediante Pydantic.
3.  **OCR Multimodal (Visión)**: Se integró el modelo `gemini-2.0-flash`. El backend recibe archivos con `UploadFile` (Multipart) en `/chat/image`, envía la imagen cruda a Gemini, y devuelve los montos, el comercio y el detalle del ticket estructurados.

## 🔄 WebSockets y Sincronización en Tiempo Real

Para lograr una actualización inmediata en la aplicación móvil, el backend utiliza un `ConnectionManager` de WebSockets en `websocket_service.py`.
*   **Ruta**: `WS /api/v1/ws`
*   **Comportamiento**: Cada vez que el servicio de transacciones guarda un registro (sea por chat o por imagen), se emite un `broadcast` (`{"type": "BALANCE_UPDATE"}`). Esto permite al frontend recargar sin que el usuario actualice la página manualmente.

## 🛠️ Entorno de Desarrollo y Configuración

### 1. Requisitos Previos y `.env`
Necesitarás una API Key de Google Gemini (desde [Google AI Studio](https://makersuite.google.com/app/apikey)).
Duplica el archivo `.env.template` a `.env` e ingresa los valores:
```ini
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/zerofinances
SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key-here
DEBUG=True
```

### 2. Instalación de Dependencias
```bash
cd ZeroFinancesBack

# 1. Crear entorno virtual
python -m venv venv

# 2. Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Mac/Linux:
# source venv/bin/activate

# 3. Instalar librerías
pip install -r requirements.txt
```

### 3. Ejecutar el Servidor
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
*   **Consola Swagger UI**: http://localhost:8000/docs
*   **Consola ReDoc**: http://localhost:8000/redoc
*   **Health Check**: http://localhost:8000/api/v1/health

## 🔑 Credenciales de Prueba por Defecto
El sistema provee dos usuarios por defecto para realizar pruebas:
*   **Admin**: `admin@test.com` / `admin123`
*   **User**: `user@test.com` / `user123`

## 📡 Endpoints Principales (REST)

| Método | Ruta | Propósito | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Obtiene el token JWT. | No |
| GET | `/api/v1/health` | Verifica si el servicio responde. | No |
| POST | `/api/v1/chat` | Chat de texto con Gemini AI. | Bearer |
| POST | `/api/v1/chat/image` | Procesamiento OCR de tickets (multipart). | Bearer |
| WS | `/api/v1/ws` | Socket de tiempo real para actualización de saldos. | No/Bearer |

## 🧪 Comandos Útiles (Troubleshooting)

**Probar Login con cURL (PowerShell/Bash):**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@test.com","password":"admin123"}'
```

**Si ocurre Error: "ModuleNotFoundError: No module named 'google'":**
Asegúrate de estar en el entorno virtual (`venv`) y ejecuta: `pip install google-generativeai`

**Si el puerto 8000 está ocupado:**
Cambia el puerto de arranque: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8001`
