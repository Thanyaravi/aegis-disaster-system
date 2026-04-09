@echo off
setlocal enabledelayedexpansion

REM AEGIS Backend Launcher - Windows

cd /d "%~dp0"

echo.
echo ======================================
echo 🔧 AEGIS Backend Initialization
echo ======================================
echo.

REM Check if venv exists
if not exist "venv\" (
    echo [!] Virtual environment not found. Creating...
    python -m venv venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment
        echo Please ensure Python 3.9+ is installed
        pause
        exit /b 1
    )
    echo ✓ Virtual environment created
)

REM Activate venv
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo [ERROR] Failed to activate virtual environment
    pause
    exit /b 1
)

echo ✓ Virtual environment activated

REM Check if requirements are installed
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo [!] Dependencies not found. Installing...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✓ Dependencies installed
)

echo.
echo ======================================
echo 🚀 Starting FastAPI Server...
echo ======================================
echo.
echo 🔌 Server will start on: http://0.0.0.0:8000
echo 📡 WebSocket endpoint: ws://localhost:8000/ws
echo.

REM Start FastAPI server
uvicorn api.server:app --reload --host 0.0.0.0 --port 8000

if errorlevel 1 (
    echo [ERROR] FastAPI server failed
    pause
    exit /b 1
)