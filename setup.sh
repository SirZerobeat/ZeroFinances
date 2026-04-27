#!/bin/bash
# ZeroFinances Development Quick Start Script
# Run this to set up and start both backend and frontend

set -e

echo "🚀 ZeroFinances - Quick Start"
echo "=============================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo "${BLUE}Checking prerequisites...${NC}"

if ! command -v python &> /dev/null; then
    echo "${RED}❌ Python not found. Please install Python 3.11+${NC}"
    exit 1
fi
echo "✅ Python: $(python --version)"

if ! command -v node &> /dev/null; then
    echo "${RED}❌ Node.js not found. Please install Node 18+${NC}"
    exit 1
fi
echo "✅ Node.js: $(node --version)"

if ! command -v psql &> /dev/null; then
    echo "${RED}❌ PostgreSQL CLI not found. Please install PostgreSQL client${NC}"
    exit 1
fi
echo "✅ PostgreSQL: $(psql --version)"

echo ""

# Backend Setup
echo "${BLUE}Setting up Backend...${NC}"

cd ZeroFinancesBack

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

source venv/Scripts/activate 2>/dev/null || source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt --quiet

# Create .env if doesn't exist
if [ ! -f ".env" ]; then
    echo "${YELLOW}Creating .env file from template...${NC}"
    cp .env.template .env
    echo "${YELLOW}⚠️  IMPORTANT: Edit .env and add your Gemini API key!${NC}"
    echo "${YELLOW}   Get it from: https://makersuite.google.com/app/apikey${NC}"
fi

echo "✅ Backend ready"
echo ""

# Frontend Setup
echo "${BLUE}Setting up Frontend...${NC}"

cd ../ZeroFinancesFront

echo "Installing npm dependencies..."
npm install --quiet

echo "✅ Frontend ready"
echo ""

# Summary
echo "${GREEN}=== Setup Complete ===${NC}"
echo ""
echo "📌 To start the system, open two terminals:"
echo ""
echo "${YELLOW}Terminal 1 - Backend:${NC}"
echo "  cd ZeroFinancesBack"
echo "  source venv/Scripts/activate  # or venv\\Scripts\\activate on Windows"
echo "  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "${YELLOW}Terminal 2 - Frontend:${NC}"
echo "  cd ZeroFinancesFront"
echo "  npm start"
echo "  # Then press 'w' for web or 'e' for Expo Go"
echo ""
echo "${BLUE}URLs:${NC}"
echo "  📱 Frontend:    http://localhost:19006"
echo "  🔧 Backend API: http://localhost:8000"
echo "  📚 Docs:        http://localhost:8000/docs"
echo ""
echo "${GREEN}Happy coding! 🎉${NC}"
