# ZeroFinances - Database Documentation

Este documento detalla la arquitectura de almacenamiento, el esquema relacional en PostgreSQL y la lógica de mitigación de datos ("gastos fantasma" o "incógnitos").

## 🚀 Motor y Filosofía
*   **Motor**: PostgreSQL (Auto-alojado localmente para desarrollo).
*   **Conector Python**: `asyncpg` mediante SQLAlchemy 2.0 (Pool asíncrono configurado a 20 hilos).
*   **Propósito**: El esquema está optimizado para trazabilidad rigurosa sin fricción. Permite convertir gastos vagos o ambiguos reportados a Zero en registros completamente tipificados.

## 🗄️ Esquema Principal (Tablas)

La base de datos utiliza UUIDs para una distribución de IDs robusta (requiere extensión `uuid-ossp`) y llaves foráneas estrictas.

### 1. `cuentas`
Maneja las billeteras del usuario. El backend crea automáticamente una cuenta "Efectivo Principal" si no se ha detectado ninguna otra.
*   **Campos clave**: `id` (UUID), `usuario_id`, `nombre_cuenta` (ej: Nómina, Ahorro), `tipo`, `saldo_actual`.
*   **Comportamiento**: El campo `saldo_actual` debe actualizarse constantemente al ejecutar registros en las transacciones para agilizar las lecturas.

### 2. `transacciones` (Tabla Núcleo)
Almacena todos los egresos, ingresos y ajustes de capital.
*   **Campos clave**: `id` (UUID), `cuenta_id`, `monto` (Decimal), `tipo` (ingreso, egreso), `fecha_transaccion`, `comercio`, `categoria_trans_id`.
*   **Campos IA y UX**:
    *   `es_ajuste_conciliacion` (Bool): Marca si es un "Gasto Fantasma".
    *   `id_referencia_ajuste` (UUID): Para sobreescribir gastos cuando el usuario los recuerda tardíamente.
    *   `es_privado` (Bool): Indicador "Incógnito".
    *   `metadatos_ia` (JSONB): Guarda el razonamiento crudo o confianza provisto por Gemini al registrar el evento.

### 3. `detalles_transaccion` (Mapping de Items)
Permite desglose nivel ticket gracias al OCR de Gemini.
*   **Campos clave**: `id`, `transaccion_id` (On Delete Cascade), `producto`, `precio`, `categoria_prod_id`.
*   **Ejemplo**: Un solo registro de Supermercado en `transacciones` puede tener 10 filas aquí desglosando la despensa.

### 4. Tablas Secundarias / Catálogos
*   `categorias_transaccion`: Grandes rubros (Ingresos, Gastos Fijos, Ajuste).
*   `categorias_productos`: Rubros menores (Bebidas, Lácteos, Coleccionables).
*   `pasivos`: Gestión de deuda. Permite mapear transacciones de Crédito. Controla el `monto_total` y el `saldo_pendiente`.

---

## 🤖 Casos de Uso y Mitigaciones Especiales

Para evitar el abandono típico de las aplicaciones contables tradicionales, el diseño de la DB contempla 3 escenarios asíncronos en los que el usuario interactúa libremente:

### Escenario A: El "Gasto Fantasma" (Conciliación Inmediata)
Si el usuario dice a Zero al final de mes *"Mi saldo real es $400 menos de lo que dice la app"*.
*   **Acción DB**: El backend inserta en `transacciones` un egreso con `es_ajuste_conciliacion = TRUE`.
*   **Impacto**: El balance cuadra de inmediato sin forzar al usuario a hacer memoria.

### Escenario B: Recuperación de Memoria
Si dos semanas después el usuario le dice a Zero: *"¿Recuerdas los $400 fantasma? Fueron de una cena en el Sushi"*.
*   **Acción DB**: Zero asocia el evento. El Backend hace un `UPDATE` de la transacción que tenga el respectivo `id_referencia_ajuste`, convirtiendo el "Ajuste" en un evento real de la categoría "Comida", con el comercio "Sushi".
*   **Impacto**: Mejora las estadísticas retroactivas de consumo sin tener que tocar el `saldo_actual` (porque el dinero ya se había descontado).

### Escenario C: Modo Incógnito o Privado
El usuario indica a Zero *"No preguntes qué compré en la farmacia, anota $200"*.
*   **Acción DB**: El registro inserta `es_privado = TRUE`.
*   **Impacto**: Contablemente perfecto. Estadísticamente invisible. La aplicación y la IA tendrán este flag para ocultar o encriptar el detalle en resúmenes futuros.

## 🔄 Mapping JSON de la IA a la DB

Este es el contrato esperado desde `Gemini` al `Python DB Service`:

```json
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
    {"nombre": "Paquete Familiar", "precio": 450.00, "cat_prod": "Carnes y Embutidos"}
  ]
}
```
*Toda la validación de estos campos antes del `INSERT` es realizada mediante modelos Pydantic en el Backend.*
