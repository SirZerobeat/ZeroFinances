from google import genai
from google.genai import types
from app.core.config import settings
import json
from typing import Optional
import asyncio

async def list_models():
    try:
        # El método list() es una corrutina, primero debemos esperarla (await)
        models_page = await client.aio.models.list()
        for model in models_page:
            print(f"Modelo disponible: {model.name}")
    except Exception as e:
        print(f"Error listando modelos: {e}")

# Llama a esto en el startup

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

Cuando el usuario:
1. Dice "hola", "hey", etc: Responde calurosamente y pregunta cómo puedes ayudar con sus finanzas
2. Pide un chiste: Cuéntale uno ingenioso y luego sugiere algo relacionado con ahorros o finanzas
3. Pide un dato interesante: Proporciona un dato fascinante, preferentemente sobre economía, dinero o finanzas
4. Habla de gastos/ingresos: Ayuda a categorizar, sugiere presupuestos, analiza patrones

Ejemplos de respuestas:
- Usuario: "Hola" → "¡Hola! Soy Zero, tu asistente de finanzas personales. 😊 ¿Cómo puedo ayudarte a gestionar mejor tu dinero hoy?"
- Usuario: "Cuéntame un chiste" → "[Cuéntale un chiste divertido] ... Por cierto, ¿sabías que los pequeños ahorros diarios generan una diferencia importante? 💰"
- Usuario: "Dame un dato" → "[Dato interesante sobre finanzas]"
- Usuario: "Gasté $500 en KFC" → "Entendido. Registraré $500 de egreso en la categoría Alimentos/Comida rápida. ¿Es un gasto frecuente o fue ocasional?"

Mantén las respuestas concisas (máximo 2-3 párrafos) y amigables."""


async def generate_zero_response(user_message: str) -> str:
    """
    Generate response from Zero (AI Gemini) for user messages.

    This handles:
    - General conversation (hello, jokes, fun facts)
    - Natural transition to finance topics
    - Eventually: transaction parsing
    """
    try:
        # Enviamos la instrucción dentro del contenido para máxima compatibilidad
        prompt_completo = f"{ZERO_SYSTEM_PROMPT}\n\nUsuario: {user_message}"

        config = types.GenerateContentConfig(
            temperature=0.7,
            top_p=0.95,
            max_output_tokens=512,
        )

        response = await client.aio.models.generate_content(
            model='gemini-3-flash-preview',
            contents=prompt_completo,
            config=config
        )

        return response.text

    except Exception as e:
        # Fallback response if API fails
        print(f"Error calling Gemini API: {e}")
        if "429" in str(e):
            return "Zero está un poco saturado ahora mismo (límite de cuota excedido). Por favor, intenta de nuevo en un minuto. ☕"
            
        return f"Disculpa, tuve un problema conectando con Gemini. Intenta de nuevo en un momento. Error: {str(e)}"


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
            model='gemini-3-flash-preview',
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
            model='gemini-3-flash-preview',
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
