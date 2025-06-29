@echo off
chcp 65001 >nul
title Python Personal Website Server
color 0E

echo.
echo ===============================================
echo        Python Personal Website Server
echo ===============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found
    echo Please install Python: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [OK] Python environment detected

REM Check if server.py exists
if not exist server.py (
    echo [ERROR] server.py file not found
    echo Please make sure you are in the correct project directory
    pause
    exit /b 1
)

echo [OK] Project files detected

REM Check and kill processes using port 3000
echo [INFO] Checking port 3000 usage...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    set PID=%%a
    echo [INFO] Found process %%a using port 3000, killing it...
    taskkill /PID %%a /F >nul 2>&1
    if !errorlevel! == 0 (
        echo [OK] Process %%a killed successfully
    ) else (
        echo [WARNING] Failed to kill process %%a
    )
)

REM Install dependencies
echo [INFO] Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    echo Try: pip install Flask Flask-CORS
    pause
    exit /b 1
)

echo [OK] Dependencies installed

echo.
echo [INFO] Starting Python server...
echo [INFO] Check console for network access addresses
echo [INFO] Press Ctrl+C to stop the server
echo.

REM Wait a moment for port to be released
timeout /t 2 /nobreak >nul

REM Start Python server
python server.py

pause 