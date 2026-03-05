@echo off
REM Hadith Chatbot - Quick Start Script for Windows
REM This script sets up and runs the Flask application

echo ========================================
echo    Hadith Chatbot - Starting App
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo Virtual environment created!
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/Update dependencies
echo Installing dependencies...
pip install -r requirements.txt --quiet

REM Check if .env file exists
if not exist ".env" (
    echo.
    echo WARNING: .env file not found!
    echo Please create a .env file with your GROQ_API_KEY
    echo Example:
    echo GROQ_API_KEY=your_key_here
    echo.
    pause
)

REM Start the Flask application
echo.
echo ========================================
echo Starting Flask application...
echo.
echo Application will be available at:
echo    http://localhost:5000
echo    http://127.0.0.1:5000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python app.py

pause
