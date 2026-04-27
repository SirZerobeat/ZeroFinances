# 🚀 ZeroFinances Backend - Setup & Development Guide

## Phase 1: Core Backend Setup

**Last Updated:** 2026-04-27  
**Status:** ✅ Complete  
**Focus:** Authentication + Chat with Zero (Gemini AI)

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Backend](#running-the-backend)
5. [Running the Frontend](#running-the-frontend)
6. [Testing the API](#testing-the-api)
7. [Architecture Overview](#architecture-overview)
8. [All Changes Made](#all-changes-made)

---

## Prerequisites

- **Python:** 3.11+ or 3.12+
- **PostgreSQL:** 18.3+ (Already running locally with zerofinances database)
- **Node.js:** 18+ (For frontend)
- **Git:** For version control

Verify installations:
```bash
python --version          # Should show 3.11+
psql --version           # Should show PostgreSQL 18.3+
node --version           # Should show 18+
```

---

## Installation

### Backend Setup

```bash
# 1. Navigate to backend directory
cd c:\Users\esteb\Work\Proyects\ZeroFinances\ZeroFinancesBack

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Verify installation
pip list | grep fastapi
```

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd c:\Users\esteb\Work\Proyects\ZeroFinances\ZeroFinancesFront

# 2. Install dependencies (if not already done)
npm install

# 3. Verify installation
npm list react-native expo
```

---

## Configuration

### Backend Configuration

**Step 1: Create .env file**

```bash
# Navigate to ZeroFinancesBack
cd c:\Users\esteb\Work\Proyects\ZeroFinances\ZeroFinancesBack

# Copy template to .env
copy .env.template .env
```

**Step 2: Edit .env file** - Open `.env` and update:

```
# PostgreSQL - Local connection (already configured)
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/zerofinances

# JWT - Keep default for development
SECRET_KEY=your-super-secret-key-change-this-in-production-make-it-very-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Gemini API - REQUIRED! Get from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key-here

# Server
DEBUG=True
HOST=0.0.0.0
PORT=8000
```

**⚠️ IMPORTANT: Get Gemini API Key**

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API key"
3. Copy the key
4. Paste it in `.env` file as `GEMINI_API_KEY=...`

---

## Running the Backend

### Start Backend Server

```bash
# From ZeroFinancesBack directory with venv activated

# Option 1: Direct Python
python app/main.py

# Option 2: Using Uvicorn (recommended for development)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Output should show:
# ✅ Database connection initialized
# 📊 Gemini API configured: True
# Uvicorn running on http://0.0.0.0:8000
```

### Access API Documentation

Once running, visit in browser:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/api/v1/health

---

## Running the Frontend

### Start Frontend (React Native/Expo)

```bash
# From ZeroFinancesFront directory

# Install dependencies (first time only)
npm install

# Start Expo development server
npm start

# You'll see options:
# Press a - open Android
# Press i - open iOS
# Press w - open web
# Press e - send to phone via QR code

# For web:
npm run web

# For Android:
npm run android

# For iOS:
npm run ios
```

### Frontend will connect to:
```
http://localhost:8000/api/v1
```

---

## Testing the API

### 📝 Test Suite: Login & Chat with Zero

**Everything runs in Swagger UI:** http://localhost:8000/docs

---

### Test 1: Login (Get JWT Token)

**Endpoint:** `POST /api/v1/auth/login`

**In Swagger UI:**
1. Click "POST /api/v1/auth/login" (expand)
2. Click "Try it out"
3. Fill request body:

```json
{
  "email": "admin@test.com",
  "password": "admin123"
}
```

4. Click "Execute"

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": "user_001",
  "nombre": "Admin (Dev)"
}
```

**Save the token** for next tests!

---

### Test 2: Health Check

**Endpoint:** `GET /api/v1/health`

**In Swagger UI:**
1. Click "GET /api/v1/health" (expand)
2. Click "Try it out"
3. Click "Execute"

**Expected Response (200 OK):**
```json
{
  "status": "ok",
  "service": "ZeroFinances Backend"
}
```

---

### Test 3: Chat with Zero (Requires token from Test 1)

**Endpoint:** `POST /api/v1/chat`

**In Swagger UI:**
1. Click "POST /api/v1/chat" (expand)
2. Click "Try it out"
3. In "Authorization" header field at top, paste:
   ```
   bearer YOUR_TOKEN_HERE
   ```
   (Replace YOUR_TOKEN_HERE with token from Test 1)

4. Fill request body with one of these:

#### Test 3a: Greeting
```json
{
  "message": "Hola Zero, ¿cómo estás?"
}
```

#### Test 3b: Request Joke
```json
{
  "message": "Cuéntame un chiste"
}
```

#### Test 3c: Fun Fact
```json
{
  "message": "Dame un dato interesante sobre finanzas"
}
```

#### Test 3d: Finance Discussion
```json
{
  "message": "Gasté $500 en comida del KFC hoy, ¿cómo debo categorizarlo?"
}
```

5. Click "Execute"

**Expected Response (200 OK):**
```json
{
  "id": "msg_1714270800000",
  "sender": "zero",
  "content": "¡Hola! Soy Zero, tu asistente de finanzas personales. 😊 [Gemini's response...]",
  "timestamp": "2026-04-27T12:00:00.000Z",
  "type": "text"
}
```

---

### Test Using cURL (Command Line)

#### Step 1: Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'
```

**Response:** Copy the `token` value

#### Step 2: Chat (Replace TOKEN with actual token)

```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: bearer TOKEN" \
  -d '{"message":"Hola, ¿cómo estás?"}'
```

**Example with actual flow:**

```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Token: $TOKEN"

# Use token to chat
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: bearer $TOKEN" \
  -d '{"message":"Dame un chiste"}'
```

---

### Test Using Python (Advanced)

Create file: `test_api.py`

```python
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

# Step 1: Login
print("🔐 Logging in...")
login_response = requests.post(
    f"{BASE_URL}/auth/login",
    json={"email": "admin@test.com", "password": "admin123"}
)
token = login_response.json()["token"]
print(f"✅ Got token: {token[:20]}...")

# Step 2: Chat with Zero
print("\n💬 Chatting with Zero...")
headers = {"Authorization": f"bearer {token}"}

messages = [
    "Hola Zero",
    "Cuéntame un chiste",
    "Dame un dato interesante",
    "Gasté $1,500 en la tienda"
]

for msg in messages:
    print(f"\n📤 User: {msg}")
    response = requests.post(
        f"{BASE_URL}/chat",
        json={"message": msg},
        headers=headers
    )
    if response.status_code == 200:
        zero_response = response.json()["content"]
        print(f"🤖 Zero: {zero_response}")
    else:
        print(f"❌ Error: {response.status_code} - {response.text}")
```

Run with:
```bash
python test_api.py
```

---

### Test Using REST Client (VS Code)

Install extension: "REST Client"

Create file: `test.http`

```http
### Get JWT Token
POST http://localhost:8000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}

### Health Check
GET http://localhost:8000/api/v1/health

### Chat - Greeting
POST http://localhost:8000/api/v1/chat
Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "message": "Hola Zero, ¿cómo estás?"
}

### Chat - Joke
POST http://localhost:8000/api/v1/chat
Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "message": "Cuéntame un chiste divertido"
}

### Chat - Fun Fact
POST http://localhost:8000/api/v1/chat
Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "message": "Dame un dato interesante sobre finanzas"
}
```

Then click "Send Request" on each test.

---

## Architecture Overview

### Backend Structure

```
ZeroFinancesBack/
├── app/
│   ├── __init__.py
│   ├── main.py                 ← FastAPI app entry point
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py           ← Auth & Chat endpoints
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py           ← Settings from .env
│   │   └── security.py         ← JWT & password hashing
│   ├── db/
│   │   ├── __init__.py
│   │   └── database.py         ← SQLAlchemy async setup
│   ├── models/
│   │   ├── __init__.py
│   │   └── models.py           ← DB models (Cuenta, Transaccion, etc)
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── schemas.py          ← Pydantic validation schemas
│   └── services/
│       ├── __init__.py
│       └── gemini_service.py   ← Gemini API integration
├── requirements.txt             ← Python dependencies
├── .env.template               ← Environment template
└── .env                        ← Local config (create from template)
```

### Data Flow

```
React Native Frontend
        ↓
   [Chat Screen]
        ↓
   axios POST /chat
   + Bearer token
        ↓
FastAPI Backend
        ↓
   [JWT Verification]
        ↓
   [Gemini AI Service]
   (generate_zero_response)
        ↓
   Google Gemini 1.5 Flash API
        ↓
   JSON Response
        ↓
   Return to Frontend
```

---

## All Changes Made

### Phase 1 Implementation (2026-04-27)

#### ✅ New Files Created

**1. `requirements.txt`** - Python dependencies
- FastAPI, Uvicorn
- SQLAlchemy, asyncpg, psycopg2
- Pydantic, python-jose
- google-generativeai

**2. `app/core/config.py`** - Configuration management
- Loads settings from .env
- Database URL, JWT config, Gemini API key
- Server host/port settings

**3. `app/db/database.py`** - Async PostgreSQL connection
- Async SQLAlchemy engine setup
- Session factory for dependency injection
- Connection pooling (20 pool size, 0 max overflow)

**4. `app/models/models.py`** - SQLAlchemy ORM models
- `Cuenta` - Account model
- `CategoriaTransaccion` - Transaction category
- `CategoriaProducto` - Product category
- `Pasivo` - Liability/debt
- `Transaccion` - Main transaction table
- `DetalleTransaccion` - Transaction items

**5. `app/schemas/schemas.py`** - Pydantic validation schemas
- `LoginRequest` / `LoginResponse` - Auth endpoints
- `ChatMessageRequest` / `ChatMessageResponse` - Chat API
- `TransactionCreate` / `TransactionResponse` - Transaction endpoints
- `GeminiResponse` - Gemini JSON schema
- `CuentaResponse`, `CategoriaResponse` - Read models

**6. `app/core/security.py`** - JWT & Authentication
- Password hashing with bcrypt
- JWT token creation/verification
- Mock user credentials (admin@test.com / admin123)
- `authenticate_user()` function

**7. `app/services/gemini_service.py`** - Gemini AI Integration
- `ZERO_SYSTEM_PROMPT` - Personality & instructions for Zero
- `generate_zero_response()` - Handle any user message
- `parse_transaction_from_gemini()` - Detect if message is transaction
- `generate_transaction_json()` - Structure transaction data

**8. `app/api/routes.py`** - API Endpoints
- `POST /auth/login` - Returns JWT token
- `POST /chat` - Chat with Zero (requires token)
- `GET /health` - Health check

**9. `app/main.py`** - FastAPI Application
- Creates FastAPI app with CORS middleware
- Includes API routes
- Startup event for database initialization
- Root endpoint with documentation links

**10. `.env.template`** - Environment template
- Database URL (PostgreSQL)
- JWT settings
- Gemini API key placeholder
- Server config

**11. `DEVELOPMENT.md`** - This file
- Complete setup guide
- Testing procedures
- Architecture overview

#### 📝 New Dependencies Added

```
fastapi==0.104.1                  # Web framework
uvicorn[standard]==0.24.0         # ASGI server
python-dotenv==1.0.0              # Environment variables
sqlalchemy==2.0.23                # ORM
psycopg2-binary==2.9.9            # PostgreSQL adapter
pydantic==2.5.0                   # Data validation
pydantic-settings==2.1.0          # Settings management
python-jose[cryptography]==3.3.0  # JWT tokens
passlib[bcrypt]==1.7.4            # Password hashing
google-generativeai==0.3.0        # Gemini API
httpx==0.25.1                     # HTTP client
asyncpg==0.29.0                   # Async PostgreSQL
```

#### 🔧 Key Features Implemented

1. **Async FastAPI** - Non-blocking, high-performance
2. **JWT Authentication** - Secure token-based auth
3. **PostgreSQL Integration** - Async connection pooling
4. **Gemini AI Service** - Zero personality & response generation
5. **CORS Support** - Frontend-backend communication
6. **Error Handling** - Proper HTTP exception responses
7. **Documentation** - Auto-generated Swagger UI

#### 🔌 Integration Points Created

Frontend can now call:
- ✅ `POST /api/v1/auth/login` - Get JWT token
- ✅ `POST /api/v1/chat` - Chat with Zero AI
- ✅ `GET /api/v1/health` - Server health check

---

## Next Steps (Phase 2)

- Transaction CRUD endpoints
- Gemini transaction parsing
- Account balance management
- Real-time WebSocket support

---

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'google'"

**Solution:**
```bash
pip install google-generativeai
```

### Issue: "Could not connect to PostgreSQL"

**Solution:**
1. Verify PostgreSQL is running: `psql -U postgres -d zerofinances`
2. Check DATABASE_URL in .env matches your setup
3. Ensure asyncpg is installed: `pip install asyncpg`

### Issue: "GEMINI_API_KEY not found"

**Solution:**
1. Get API key from: https://makersuite.google.com/app/apikey
2. Add to .env: `GEMINI_API_KEY=your-key`
3. Restart backend

### Issue: "Authorization header not found"

**Solution:**
1. Include header in requests: `Authorization: bearer TOKEN`
2. Replace TOKEN with actual token from login endpoint
3. Ensure Bearer (capital B) before token

---

## Support

For issues or questions:
1. Check error message in terminal
2. Verify .env configuration
3. Ensure all services running (DB, backend)
4. Check API documentation: http://localhost:8000/docs
