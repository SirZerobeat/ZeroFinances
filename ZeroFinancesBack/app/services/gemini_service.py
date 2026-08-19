from google import genai
from google.genai import types
from app.core.config import settings
import json
from typing import Optional
import asyncio

# Modelo recomendado (puedes cambiarlo a gemini-2.0-flash si prefieres estabilidad)
MODEL_NAME = 'gemini-3-flash-preview'
VISION_MODEL_NAME = 'gemini-3-flash-preview'

async def list_models():
    try:
        models_page = await client.aio.models.list()
        for model in models_page:
            print(f"Modelo disponible: {model.name}")
    except Exception as e:
        print(f"[ERROR] Error crítico de conexión a Gemini: {e}")
        if "API key expired" in str(e):
            print("[WARNING] Tu API Key ha expirado. Por favor renuévala en Google AI Studio.")

client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)

# System prompt for Zero (personal finance AI)
ZERO_SYSTEM_PROMPT = """Eres Zero, un asistente de inteligencia artificial especializado en finanzas personales.

Tu personalidad:
- Eres amable, ingenioso y útil
- Hablas en español
- Entendes chistes y puedes responder con humor
- Proporcionas datos interesantes cuando se te pide
- Siempre buscas relacionar temas con finanzas personales de manera natural
- Eres extremadamente breve y vas directo al punto
- No uses más de 2 párrafos cortos por respuesta

Cuando el usuario:
1. Dice "hola", "hey", etc: Responde calurosamente y pregunta cómo puedes ayudar con sus finanzas
2. Pide un chiste: Cuéntale uno ingenioso y luego sugiere algo relacionado con ahorros o finanzas
3. Pide un dato interesante: Proporciona un dato fascinante, preferentemente sobre economía, dinero o finanzas
4. Habla de gastos/ingresos: Ayuda a categorizar, sugiere presupuestos, analiza patrones

Ejemplos de respuestas:
- Usuario: "Hola" → "¡Hola! Soy Zero. 😊 ¿Cómo puedo ayudarte con tus finanzas hoy?"
- Usuario: "Cuéntame un chiste" → "[Chiste corto] ... ¡Recuerda que ahorrar también es divertido! 💰"
- Usuario: "Dame un dato" → "[Dato breve]"
- Usuario: "Gasté $500 en KFC" → "Registrado: $500 en Alimentos. ¿Fue un gusto ocasional o parte de tu plan semanal?"

Mantén las respuestas concisas (máximo 2-3 párrafos) y amigables.
IMPORTANTE: Sé muy conciso. No te extiendas. Si la respuesta es larga, se cortará. Máximo 120 palabras."""


async def generate_zero_response(user_message: str) -> str:
    """
    Generate response from Zero (AI Gemini) for user messages.

    This handles:
    - General conversation (hello, jokes, fun facts)
    - Natural transition to finance topics
    - Eventually: transaction parsing
    """
    prompt_completo = f"{ZERO_SYSTEM_PROMPT}\n\nUsuario: {user_message}"

    config = types.GenerateContentConfig(
        temperature=0.2,
        top_p=0.95,
        max_output_tokens=800,
    )

    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = await client.aio.models.generate_content(
                model=MODEL_NAME,
                contents=prompt_completo,
                config=config
            )
            return response.text

        except Exception as e:
            error_msg = str(e)
            
            if "400" in error_msg and "API key expired" in error_msg:
                print("🚨 ERROR CRÍTICO: La API Key de Gemini ha expirado en .env.")
                return "Lo siento, mi conexión con el cerebro de IA ha caducado. El administrador debe renovar la API Key. 🔑"

            # Si excedemos cuota (429), el reintento de 2s suele ser poco. 
            if "429" in error_msg:
                print(f"⚠️ Cuota agotada para {MODEL_NAME}. Reintentando en breve...")
                await asyncio.sleep(5) # Esperamos un poco más para 429
                continue

            if "503" in error_msg and attempt < max_retries - 1:
                await asyncio.sleep((attempt + 1) * 2)
                continue
                
            print(f"Error calling Gemini API: {e}")
            if "429" in error_msg:
                return "Zero está un poco saturado ahora mismo (límite de cuota excedido). Por favor, intenta de nuevo en un minuto. ☕"
            if "503" in error_msg:
                return f"El modelo {MODEL_NAME} está experimentando mucha demanda (error 503). Por favor, intenta de nuevo en unos segundos. ⏳"
            return f"Disculpa, tuve un problema conectando con Gemini. Intenta de nuevo en un momento. Error: {error_msg}"


async def parse_transaction_from_gemini(user_message: str) -> Optional[dict]:
    """
    Parse transaction information from user message using Gemini.

    Returns structured transaction JSON or None if not a transaction message.
    
    Nota: Se puede unificar el parseo y la estructuración en una sola llamada
    para reducir latencia.
    """
    try:
        parse_prompt = f"""Analiza este mensaje del usuario para extraer información de gasto/ingreso:

Mensaje: "{user_message}"

Si detectas información de transacción, responde SOLO con JSON válido en este formato:
{{
  "es_transaccion": true,
  "tipo": "egreso" o "ingreso",
  "monto": número,
  "comercio": "nombre de tienda",
  "categoria_padre": "categoría sugerida",
  "descripcion": "descripción breve"
}}

Si NO es una transacción, responde:
{{"es_transaccion": false}}

Responde SOLO con JSON válido, sin explicaciones."""

        response = await client.aio.models.generate_content(
            model=MODEL_NAME,
            contents=parse_prompt
        )

        # Parse JSON response
        # Limpiamos posibles espacios o caracteres extraños al inicio/final
        clean_response = response.text.strip()
        
        start = clean_response.find('{')
        end = clean_response.rfind('}') + 1
        if start != -1 and end != 0:
            result = json.loads(clean_response[start:end])
            return result if result.get("es_transaccion") else None
        return None

    except Exception as e:
        print(f"Error parsing transaction from Gemini: {e}")
        return None


async def generate_transaction_json(text: str) -> Optional[dict]:
    """
    Generate properly formatted transaction JSON from Gemini.
    Used when we've confirmed it's a transaction.
    """
    try:
        prompt = f"""Estructura este gasto/ingreso en JSON:

"{text}"

Responde SOLO con JSON en este formato exacto:
{{
  "transaccion_info": {{
    "tipo": "egreso" o "ingreso",
    "monto": número con decimales,
    "fecha": "YYYY-MM-DD",
    "comercio": "nombre comercio",
    "categoria_padre": "categoría",
    "es_correccion_ajuste": false,
    "id_ajuste_detectado": null
  }},
  "items": [
    {{"nombre": "item", "precio": número, "cat_prod": "categoría"}}
  ],
  "logistica": {{
    "confianza": 0.0 a 1.0,
    "requiere_confirmacion": boolean
  }}
}}"""

        response = await client.aio.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        clean_response = response.text.strip()
        
        start = clean_response.find('{')
        end = clean_response.rfind('}') + 1
        if start != -1 and end != 0:
            return json.loads(clean_response[start:end])
        return None

    except Exception as e:
        print(f"Error generating transaction JSON: {e}")
        return None

async def parse_receipt_image(image_bytes: bytes, mime_type: str) -> Optional[dict]:
    """
    Extract transaction data from a receipt image using Gemini Vision.
    """
    try:
        prompt = """Analiza la imagen de este ticket de compra/factura.
Extrae la información y estructúrala SOLO en formato JSON exacto:
{
  "transaccion_info": {
    "tipo": "egreso",
    "monto": número con decimales (el total),
    "fecha": "YYYY-MM-DD",
    "comercio": "nombre del comercio o tienda",
    "categoria_padre": "categoría sugerida",
    "es_correccion_ajuste": false,
    "id_ajuste_detectado": null
  },
  "items": [
    {"nombre": "item", "precio": número, "cat_prod": "categoría"}
  ],
  "logistica": {
    "confianza": 0.0 a 1.0,
    "requiere_confirmacion": false
  }
}
Si no encuentras fecha, pon la fecha actual aproximada o nula. Responde SOLO con JSON válido."""
        
        response = await client.aio.models.generate_content(
            model=VISION_MODEL_NAME,
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                prompt
            ]
        )
        
        clean_response = response.text.strip()
        start = clean_response.find('{')
        end = clean_response.rfind('}') + 1
        if start != -1 and end != 0:
            return json.loads(clean_response[start:end])
        return None
    except Exception as e:
        print(f"Error parsing receipt image: {e}")
        return None
