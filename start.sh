#!/bin/bash

# --------------------------------------
# CONFIGURAÇÕES
# --------------------------------------
BASE_DIR="$HOME/kos"
PROJECT_DIR="$BASE_DIR/src/backend"
FRONTEND_DIR="$BASE_DIR/src/frontend"
VENV_DIR="$PROJECT_DIR/venv"
NVM_DIR="$HOME/.nvm"
XDG_RUNTIME_DIR=/run/user/1000
GIT_REPO="https://github.com/NerdGuin/KOS.git"
BACKEND_PORT=8000
FRONTEND_PORT=5173

source "$NVM_DIR/nvm.sh"

# --------------------------------------
# 0. ENCERRAR PROCESSOS ANTIGOS
# --------------------------------------
# Backend
pkill -f "uvicorn main:app" 2>/dev/null

# Frontend
pkill -f "npm run dev" 2>/dev/null
pkill -f "vite" 2>/dev/null

# Chromium
pkill -f "chromium" 2>/dev/null

# Aguarda garantir que todos foram finalizados
sleep 2

# --------------------------------------
# 2. ATUALIZAR PROJETO VIA GIT
# --------------------------------------
if [ ! -d "$PROJECT_DIR" ]; then
    echo "Baixando arquivos"
    git clone "$GIT_REPO" "$HOME/kos"
else
    echo "Buscando atualizações"
    cd "$PROJECT_DIR"

    if ! git diff-index --quiet HEAD --; then
        git reset --hard
    fi

    git fetch origin
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u})

    if [ "$LOCAL" != "$REMOTE" ]; then
        echo "Nova versão disponível. Atualizando..."
        git pull
        chmod +x "$BASE_DIR/start.sh" 2>/dev/null
        chmod +x "$BASE_DIR/kos.service" 2>/dev/null
        exit 0
    else
        echo "Última versão já está instalada!"
    fi
fi

# --------------------------------------
# 3. CRIAR E ATIVAR VENV DO BACKEND
# --------------------------------------
cd "$PROJECT_DIR"

if [ ! -d "$VENV_DIR" ]; then
    echo "Criando ambiente virtual..."
    python3 -m venv "$VENV_DIR"
    source "$VENV_DIR/bin/activate"
    pip install uvicorn
    pip install fastapi
    pip install requests
    pip install pip
    pip install -r requirements.txt
else
    source "$VENV_DIR/bin/activate"
    python3 -c "import fastapi" 2>/dev/null || pip install fastapi
    python3 -c "import uvicorn" 2>/dev/null || pip install uvicorn
    python3 -c "import requests" 2>/dev/null || pip install requests
    python3 -c "import pip" 2>/dev/null || pip install pip
fi

# --------------------------------------
# 4. INICIAR SERVIDOR FASTAPI
# --------------------------------------
$VENV_DIR/bin/uvicorn main:app --host 127.0.0.1 --port $BACKEND_PORT --reload &
echo "Backend iniciado em http://127.0.0.1:$BACKEND_PORT"

# --------------------------------------
# 5. INICIAR FRONTEND REACT/VITE
# --------------------------------------
cd "$FRONTEND_DIR"
npm install 2>/dev/null  # garante que pacotes estejam instalados
npm run dev -- --host &
echo "Frontend iniciado em http://127.0.0.1:$FRONTEND_PORT"

# --------------------------------------
# 6. ESPERAR SERVIDORES INICIAR
# --------------------------------------
sleep 5

# --------------------------------------
# 7. ABRIR CHROMIUM EM MODO KIOSK
# --------------------------------------
echo "Aguardando Wayland..."

while [ ! -S "$XDG_RUNTIME_DIR/wayland-0" ]; do
    sleep 1
done

echo "Wayland pronto!"
chromium \
--ozone-platform=wayland \
--enable-features=UseOzonePlatform \
--kiosk \
--start-fullscreen \
--no-first-run \
--disable-infobars \
--disable-session-crashed-bubble \
--disable-translate \
--disable-features=TranslateUI \
--disable-pinch \
--overscroll-history-navigation=0 \
--lang=pt-BR \
--disable-dev-shm-usage \
--no-sandbox \
--app=http://localhost:$FRONTEND_PORT &