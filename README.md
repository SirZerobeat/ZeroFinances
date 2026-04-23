# ZeroFinances

ZeroFinances es una solución integral diseñada para eliminar la fricción en el registro de finanzas personales. Utiliza un enfoque *AI-First* para procesar lenguaje natural (voz/texto) e imágenes (tickets/facturas), automatizando la gestión contable y proyectando la salud financiera del usuario mediante Inteligencia Artificial.

### Resumen Ejecutivo

A diferencia de las aplicaciones financieras tradicionales que requieren una entrada manual tediosa, este proyecto permite capturar información mediante una interfaz de chat multimodal. Los datos son procesados por Gemini 1.5 Flash, categorizados automáticamente y almacenados en una base de datos PostgreSQL auto-alojada.

### Stack Tecnológico
Componente		|Tecnología				|Descripción
Frontend		|React Native(Expo) 	|Interfaz móvil para captura de audio, fotos y texto.
Backend			|Python(FastAPI)		|Orquestador asíncrono de alto rendimiento.
IA				|Gemini 1.5 Flash(API)	|OCR nativo, transcripción y estructuración de JSON.
Base de Datos	|PostgreSQL				|Almacenamiento relacional ligero y robusto.
Contenedores	|Docker & Compose		|Gestión de infraestructura local simplificada.
Red				|Cloudflare Tunnel		|Exposición segura a internet sin apertura de puertos.

### Arquitectura del Sistema 

El flujo de información sigue una estructura de microservicios desacoplados para garantizar la escalabilidad y el mantenimiento:

**1.Captura**: El usuario envía un ticket o nota de voz desde la App. 
**2.Procesamiento**: FastAPI recibe el binario y lo envía a la API de Gemini con un prompt estructurado. 
**3.Validación**: El backend valida el JSON devuelto por la IA mediante esquemas de Pydantic. 
**4.Persistencia**: Los datos se insertan en PostgreSQL y el saldo de la cuenta se actualiza en tiempo real.

### Esquema de Base de Datos (Propuesta Inicial)

'''PostgreSQL

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cuentas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id),
    nombre_cuenta VARCHAR(50), -- Ej: "Nómina", "Ahorro"
    saldo_actual DECIMAL(12, 2) DEFAULT 0.00
);

CREATE TABLE transacciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cuenta_id UUID REFERENCES cuentas(id),
    monto DECIMAL(12, 2) NOT NULL,
    categoria VARCHAR(50),
    tipo VARCHAR(10) CHECK (tipo IN ('ingreso', 'egreso')),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### Análisis de Costos (Estrategia $0 MXN) 

El proyecto está diseñado para operar bajo un esquema de costo cero aprovechando capas gratuitas: 
**API Gemini**: Plan gratuito de Google AI Studio (15 **RPM**). 
**Hosting**: Hardware propio (PC Intel i3, **16GB** **RAM**). 
**Infraestructura**: Cloudflare Tunnel (Gratis) y Docker (Open Source). 
**Desarrollo**: VS Code + Gemini Code Assist (Gratis para individuos).

### Futuro de la Aplicación 
**Análisis Predictivo**: Proyecciones de ahorro a 8 meses basadas en patrones históricos. 
**Gestión de Crédito**: Control de fechas de corte y recordatorios de pago. 
**Privacidad Local**: Implementación de LLMs locales (Llama 3) para procesamiento offline.
**Desarrollado por**: EstebanVersión de Python recomendada: 3.11+ / 3.12+ 