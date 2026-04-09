@echo off
setlocal enabledelayedexpansion

REM AEGIS System Full Startup - Windows
REM This script starts backend, frontend, and simulation

echo.
echo ======================================
echo 🚀 AEGIS System Startup
echo ======================================
echo.

REM Start Backend
echo [1/3] Starting FastAPI Backend on port 8000...
start "AEGIS Backend" /d "%~dp0backend" run_backend.bat
echo ✓ Backend started

REM Wait for backend to initialize
timeout /t 3

REM Start Frontend
echo [2/3] Starting React Frontend on port 5173...
start "AEGIS Frontend" /d "%~dp0frontend\aegis-ui" run_frontend.bat
echo ✓ Frontend started

REM Start Simulation
echo [3/3] Starting Simulation...
start "AEGIS Simulation" /d "%~dp0backend" python main.py
echo ✓ Simulation started

echo.
echo ======================================
echo ✓ AEGIS System Running!
echo ======================================
echo.
echo 🌐 Frontend:  http://localhost:5173
echo 🔌 Backend:   http://localhost:8000
echo 📡 WebSocket: ws://localhost:8000/ws
echo.
echo Press any key to continue...
pause