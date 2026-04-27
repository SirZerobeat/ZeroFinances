#!/usr/bin/env bash
# ============================================================================
# ZEROFINANCES - COMPLETE COMMAND REFERENCE
# All commands to start, test, and debug the system
# Date: 2026-04-27
# ============================================================================

# ============================================================================
# SECTION 1: INITIAL SETUP (RUN ONCE)
# ============================================================================

# 1.1 Get Gemini API Key (CRITICAL!)
# ----
# 1. Open: https://makersuite.google.com/app/apikey
# 2. Click "Create API Key"
# 3. Copy the key
# 4. Save it for .env file

# 1.2 Backend Setup
cd c:\Users\esteb\Work\Proyects\ZeroFinances\ZeroFinancesBack

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.template .env

# EDIT .env and add your Gemini API key
notepad .env
# OR
nano .env

# 1.3 Frontend Setup
cd c:\Users\esteb\Work\Proyects\ZeroFinances\ZeroFinancesFront

npm install

# ============================================================================
# SECTION 2: RUNNING THE SYSTEM
# ============================================================================

# 2.1 Start Backend (Terminal 1)
cd c:\Users\esteb\Work\Proyects\ZeroFinances\ZeroFinancesBack
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Alternative: Run with Python directly
python app/main.py

# 2.2 Start Frontend (Terminal 2)
cd c:\Users\esteb\Work\Proyects\ZeroFinances\ZeroFinancesFront
npm start

# Then press:
# 'w' for web browser
# 'e' for Expo Go on phone
# 'a' for Android emulator
# 'i' for iOS simulator

# ============================================================================
# SECTION 3: QUICK TESTS
# ============================================================================

# 3.1 Health Check
curl http://localhost:8000/api/v1/health

# Expected: {"status":"ok","service":"ZeroFinances Backend"}

# 3.2 Login and Get Token
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'

# Expected: {"token":"eyJ...","token_type":"bearer","user_id":"user_001","nombre":"Admin (Dev)"}

# 3.3 Save token for next command
TOKEN="paste-token-from-above-here"

# 3.4 Chat with Zero
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: bearer $TOKEN" \
  -d '{"message":"Hola Zero, cuéntame un chiste"}'

# Expected: {"id":"...","sender":"zero","content":"[Gemini response]",...}

# ============================================================================
# SECTION 4: BATCH TEST SCRIPT
# ============================================================================

# Save as: test_api.sh

#!/bin/bash

echo "🔐 Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Got token: ${TOKEN:0:20}..."

echo ""
echo "💬 Testing chat..."

MESSAGES=(
  "Hola Zero"
  "Cuéntame un chiste"
  "Dame un dato interesante"
  "Gasté 500 en comida"
)

for msg in "${MESSAGES[@]}"; do
  echo ""
  echo "📤 User: $msg"
  
  RESPONSE=$(curl -s -X POST http://localhost:8000/api/v1/chat \
    -H "Content-Type: application/json" \
    -H "Authorization: bearer $TOKEN" \
    -d "{\"message\":\"$msg\"}")
  
  CONTENT=$(echo $RESPONSE | grep -o '"content":"[^"]*"' | cut -d'"' -f4)
  echo "🤖 Zero: ${CONTENT:0:100}..."
done

# ============================================================================
# SECTION 5: TESTING WITH SWAGGER UI
# ============================================================================

# 5.1 Open Swagger Documentation
# http://localhost:8000/docs

# 5.2 In Swagger:
# 1. Click "POST /api/v1/auth/login"
# 2. Click "Try it out"
# 3. Paste: {"email":"admin@test.com","password":"admin123"}
# 4. Click "Execute"
# 5. Copy the token from response
# 6. Scroll to "POST /api/v1/chat"
# 7. Click "Try it out"
# 8. In "Authorization" field, paste: bearer TOKEN_HERE
# 9. Paste: {"message":"Hola"}
# 10. Click "Execute"

# ============================================================================
# SECTION 6: DEBUGGING
# ============================================================================

# 6.1 Check Backend is Running
curl http://localhost:8000/

# 6.2 Check Frontend is Running
curl http://localhost:19006

# 6.3 Check PostgreSQL Connection
psql -U postgres -d zerofinances -c "SELECT COUNT(*) FROM transacciones;"

# 6.4 Check Python Dependencies
pip list | grep -E "fastapi|sqlalchemy|google-generativeai"

# 6.5 View Backend Logs
# Look in terminal where backend is running
# Search for errors or "ERROR" in output

# 6.6 Check Gemini API Key
grep "GEMINI_API_KEY" ZeroFinancesBack/.env

# Should show your actual key, not empty

# ============================================================================
# SECTION 7: COMMON ISSUES & FIXES
# ============================================================================

# Issue: "Could not connect to database"
# Fix:
psql -U postgres -d zerofinances
# Or verify DATABASE_URL in .env is correct

# Issue: "GEMINI_API_KEY not found"
# Fix:
# 1. Get key from https://makersuite.google.com/app/apikey
# 2. Add to .env: GEMINI_API_KEY=your-key
# 3. Restart backend

# Issue: "Authorization header not found"
# Fix:
# Include in requests: Authorization: bearer TOKEN_HERE
# (Note: capital 'B' in Bearer)

# Issue: "ModuleNotFoundError: No module named 'google'"
# Fix:
pip install google-generativeai

# Issue: Port 8000 already in use
# Fix:
lsof -i :8000
kill -9 <PID>
# Or use different port:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001

# ============================================================================
# SECTION 8: USEFUL COMMANDS
# ============================================================================

# Check Python version
python --version

# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# List all databases
psql -U postgres -l

# Connect to zerofinances database
psql -U postgres -d zerofinances

# View all tables
psql -U postgres -d zerofinances -c "\dt"

# View transacciones table
psql -U postgres -d zerofinances -c "SELECT * FROM transacciones LIMIT 5;"

# Kill all Python processes (if stuck)
pkill -f python
# Windows: taskkill /F /IM python.exe

# Clear pip cache
pip cache purge

# View all requests in browser DevTools
# Press F12 in browser, go to Network tab

# ============================================================================
# SECTION 9: DOCUMENTATION FILES
# ============================================================================

# QUICK_START.md          - Quick reference (read first!)
# DEVELOPMENT.md          - Complete setup guide
# CHANGES_PHASE1.md       - Detailed implementation
# IMPLEMENTATION_SUMMARY.md - High-level overview
# FILES_CREATED.txt       - File listing

# ============================================================================
# SECTION 10: URLS REFERENCE
# ============================================================================

Backend:
  - API Base:     http://localhost:8000/api/v1
  - Docs:         http://localhost:8000/docs
  - ReDoc:        http://localhost:8000/redoc
  - Health:       http://localhost:8000/api/v1/health

Frontend:
  - Web:          http://localhost:19006
  - Expo:         exp://localhost:19000

Database:
  - Connection:   postgresql://postgres:password@localhost:5432/zerofinances

External:
  - Gemini API:   https://makersuite.google.com/app/apikey

# ============================================================================
# SECTION 11: TEST CREDENTIALS
# ============================================================================

# User 1
Email:    admin@test.com
Password: admin123
Role:     Admin

# User 2
Email:    user@test.com
Password: user123
Role:     Regular User

# ============================================================================
# SECTION 12: QUICK COPY-PASTE COMMANDS
# ============================================================================

# Setup (first time)
cd ZeroFinancesBack && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && copy .env.template .env && cd ../ZeroFinancesFront && npm install

# Run backend
cd ZeroFinancesBack && venv\Scripts\activate && uvicorn app.main:app --reload

# Run frontend
cd ZeroFinancesFront && npm start

# Test login
curl -X POST http://localhost:8000/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"admin@test.com","password":"admin123"}'

# Test chat (replace TOKEN)
curl -X POST http://localhost:8000/api/v1/chat -H "Content-Type: application/json" -H "Authorization: bearer TOKEN" -d '{"message":"Hola"}'

# ============================================================================
# SECTION 13: MAINTENANCE
# ============================================================================

# Update dependencies
pip install --upgrade -r requirements.txt

# Update frontend packages
npm update

# Clear cache
npm cache clean --force

# Reinstall node_modules
rm -rf node_modules
npm install

# Database backup (PostgreSQL)
pg_dump -U postgres zerofinances > backup.sql

# Database restore
psql -U postgres zerofinances < backup.sql

# ============================================================================
# That's everything! Start with:
# 1. Get Gemini API key
# 2. Run Section 1 (setup)
# 3. Run Section 2 (start services)
# 4. Run Section 3 (test)
# 5. Access http://localhost:8000/docs
# ============================================================================
