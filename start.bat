@echo off

SET PROJECT_DIR=%~dp0src\backend
SET FRONTEND_DIR=%~dp0src\frontend
SET VENV_DIR=%PROJECT_DIR%\venv

cd /d "%PROJECT_DIR%"

CALL "%VENV_DIR%\Scripts\activate.bat"

REM inicia FastAPI
START "" python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload

REM inicia React/Vite
START "" cmd /k "cd /d %FRONTEND_DIR% && npm run dev -- --host"

TIMEOUT /T 3 /NOBREAK > NUL

START "" /D "%LOCALAPPDATA%\Chromium\" chrome.exe --kiosk http://localhost:5173