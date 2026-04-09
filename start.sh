#!/bin/bash

# AEGIS Disaster Response System - Startup Script
# This script starts both the FastAPI backend and React frontend

echo "======================================"
echo "🚀 AEGIS System Startup"
echo "======================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Start FastAPI backend
echo -e "${BLUE}[1/2] Starting FastAPI Backend...${NC}"
cd backend
python main.py > backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

# Wait for backend to start
sleep 2

# Start React frontend
echo -e "${BLUE}[2/2] Starting React Frontend...${NC}"
cd ../frontend/aegis-ui
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

echo ""
echo "======================================"
echo -e "${GREEN}✓ AEGIS System Running!${NC}"
echo "======================================"
echo -e "${YELLOW}Backend:  http://localhost:8000${NC}"
echo -e "${YELLOW}Frontend: http://localhost:5173${NC}"
echo -e "${YELLOW}WebSocket: ws://localhost:8000/ws${NC}"
echo ""
echo "Press Ctrl+C to stop all services..."
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
