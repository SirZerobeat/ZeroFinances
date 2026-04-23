# Backend ZeroFinances
Este documento define la infraestructura, el servidor y la lógica de procesamiento de datos para la aplicación.

### Capas de Tecnología y Arquitectura
**Lenguaje**: Python 3.12+ (Elegido por su equilibrio entre rendimiento y compatibilidad).
**Framework**: FastAPI (Para un manejo asíncrono eficiente de peticiones de IA).
**ORM**: SQLAlchemy o SQLModel (Para la gestión de PostgreSQL).
**IA**: Gemini 1.5 Flash SDK (Multimodal: texto, audio e imágenes).
**Infraestructura**: Docker & Docker Compose (Para contenedores aislados).

### Configuración del Entorno (VS Code)
**Extensiones Recomendadas**: Python (Microsoft), Pylance, Docker, Thunder Client (para pruebas de API).
**Asistente de Código**: Gemini Code Assist (Extensión oficial para agilizar el desarrollo).

### Estructura de Carpetas (MVC Adaptado)
ZeroFinancesBack/
├── app/
│   ├── api/            # Endpoints y rutas (Controladores)
│   ├── core/           # Configuración y variables de entorno (.env)
│   ├── models/         # Definición de tablas SQL (Modelos)
│   ├── schemas/        # Validaciones de datos (Pydantic)
│   ├── services/       # Integración con Gemini API y lógica de IA
│   └── db/             # Conexión a PostgreSQL
├── Dockerfile          # Configuración del contenedor
├── docker-compose.yml  # Orquestador del servicio y la DB
└── requirements.txt    # Dependencias de Python

### Comandos Iniciales
**Instalar dependencias**
pip install fastapi uvicorn sqlalchemy psycopg2-binary google-generativeai python-dotenv


