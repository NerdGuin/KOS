@echo off

SET PROJECT_DIR=%~dp0src
SET VENV_DIR=%PROJECT_DIR%\venv

cd /d "%PROJECT_DIR%"

CALL "%VENV_DIR%\Scripts\activate.bat"

START "" python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

TIMEOUT /T 3 /NOBREAK > NUL

START "" /D "%LOCALAPPDATA%\Chromium\" chrome.exe --kiosk http://127.0.0.1:8000