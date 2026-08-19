# ZeroFinances

ZeroFinances es una solución integral diseñada para eliminar la fricción en el registro de finanzas personales. Utiliza un enfoque *AI-First* para procesar lenguaje natural (voz/texto) e imágenes (tickets/facturas), automatizando la gestión contable y proyectando la salud financiera del usuario mediante Inteligencia Artificial.

A diferencia de las aplicaciones financieras tradicionales que requieren una entrada manual tediosa, este proyecto permite capturar información mediante una interfaz de chat multimodal. Los datos son procesados por Gemini, categorizados automáticamente y almacenados en una base de datos PostgreSQL auto-alojada.

---

## 📚 Documentación Consolidada

Para mantener el proyecto organizado, toda la información técnica, tutoriales y guías se ha consolidado en los siguientes documentos principales. Por favor, consulta el documento respectivo a tu área de trabajo:

1. **[FRONTEND.md](file:///c:/Users/esteb/Work/Proyects/ZeroFinances/FRONTEND.md)**
   Todo lo relacionado con la aplicación móvil interactiva.
   *React Native, Expo, Zustand, Componentes, Sockets UI.*

2. **[BACKEND.md](file:///c:/Users/esteb/Work/Proyects/ZeroFinances/BACKEND.md)**
   Todo lo relacionado con el servidor, la API y la Inteligencia Artificial.
   *Python, FastAPI, Gemini AI, SQLAlchemy, JWT, endpoints.*

3. **[DATABASE.md](file:///c:/Users/esteb/Work/Proyects/ZeroFinances/DATABASE.md)**
   Todo lo relacionado con la estructura y lógica de persistencia de datos.
   *PostgreSQL, tablas relacionales, control de gastos fantasma.*

---

## 🏁 Estado Actual del Proyecto

El desarrollo se ha dividido en fases. Actualmente, el proyecto cuenta con la implementación consolidada de las Fases 1 y 2.

### ✅ Fase 1 Completada (Core & Chat Base)
- Infraestructura Backend inicial con conexión asíncrona a la base de datos y middleware CORS.
- Autenticación segura mediante JSON Web Tokens (JWT).
- Chat interactivo conectado directamente a la API Gemini 1.5 Flash, habilitando la personalidad del asistente financiero "Zero".

### ✅ Fase 2 Completada (Inteligencia Transaccional & OCR)
- Capacidad para crear registros contables a partir de lenguaje natural.
- Integración Multimodal (Gemini 2.0 Flash) para subir tickets y extraer automáticamente el comercio, total e ítems individuales.
- Sincronización en tiempo real vía WebSockets para actualizar el saldo en la pantalla del Frontend de inmediato.

### 🔜 Próximos Pasos (Fase 3: Analítica y Reportes)
- Dashboard interactivo con reportes y gráficas de consumo mensuales.
- Gestión avanzada de Pasivos (tarjetas de crédito y préstamos).
- Consultas RAG (Recuperación y Generación) para que Zero responda cosas como: *"¿Cuánto he gastado en comida este mes comparado al anterior?"*.

---

*Proyecto diseñado bajo una arquitectura de microservicios con un costo operativo meta de $0 MXN apoyándose en capas gratuitas y alojamiento local.*