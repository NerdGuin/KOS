#!/bin/bash

# --------------------------------------
# CONFIGURAÇÕES
# --------------------------------------

BASE_DIR="$HOME/kos"
PROJECT_DIR="$BASE_DIR/src/backend"
FRONTEND_DIR="$BASE_DIR/src/frontend"
VENV_DIR="$PROJECT_DIR/venv"
NVM_DIR="$HOME/.nvm"

BACKEND_PORT=8000
FRONTEND_PORT=5173
GIT_REPO="https://github.com/NerdGuin/KOS.git"

export XDG_RUNTIME_DIR=/run/user/$(id -u)
export WAYLAND_DISPLAY=wayland-0
export PATH=/usr/local/bin:/usr/bin:/bin:$PATH

source "$NVM_DIR/nvm.sh"

# --------------------------------------
# FUNÇÕES
# --------------------------------------

wait_for_internet() {
    echo "Aguardando internet..."
    until ping -c1 8.8.8.8 >/dev/null 2>&1
    do
        sleep 1
    done
}

wait_for_backend() {
    echo "Aguardando backend..."
    until curl -s http://localhost:$BACKEND_PORT >/dev/null
    do
        sleep 1
    done
}

wait_for_frontend() {
    echo "Aguardando frontend..."
    until curl -s http://localhost:$FRONTEND_PORT >/dev/null
    do
        sleep 1
    done
}

wait_for_wayland() {
    echo "Aguardando Wayland..."
    while [ ! -S "$XDG_RUNTIME_DIR/$WAYLAND_DISPLAY" ]
    do
        sleep 1
    done
}

# --------------------------------------
# ENCERRAR PROCESSOS ANTIGOS
# --------------------------------------

pkill -f "uvicorn main:app" 2>/dev/null
pkill -f "vite" 2>/dev/null
pkill -f "npm run dev" 2>/dev/null
pkill -f "chromium" 2>/dev/null

# --------------------------------------
# ESPERAR INTERNET
# --------------------------------------

wait_for_internet

# --------------------------------------
# ATUALIZAR PROJETO
# --------------------------------------

if [ ! -d "$PROJECT_DIR" ]; then

    echo "Clonando repositório..."
    git clone "$GIT_REPO" "$BASE_DIR"

else

    echo "Buscando atualizações..."

    cd "$BASE_DIR"

    git fetch origin

    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u})

    if [ "$LOCAL" != "$REMOTE" ]; then
        echo "Atualizando projeto..."
        git reset --hard
        git pull
    else
        echo "Projeto atualizado"
    fi

fi

# --------------------------------------
# PREPARAR BACKEND
# --------------------------------------

cd "$PROJECT_DIR"

if [ ! -d "$VENV_DIR" ]; then
    echo "Criando venv..."
    python3 -m venv "$VENV_DIR"
fi

source "$VENV_DIR/bin/activate"

python3 -c "import fastapi" 2>/dev/null || pip install fastapi
python3 -c "import uvicorn" 2>/dev/null || pip install uvicorn
python3 -c "import requests" 2>/dev/null || pip install requests

# --------------------------------------
# INICIAR BACKEND
# --------------------------------------

echo "Iniciando backend..."

$VENV_DIR/bin/uvicorn main:app \
--host 127.0.0.1 \
--port $BACKEND_PORT \
--reload &

# --------------------------------------
# INICIAR FRONTEND
# --------------------------------------

cd "$FRONTEND_DIR"

echo "Iniciando frontend..."

npm install >/dev/null 2>&1
npm run dev -- --host --port $FRONTEND_PORT --strictPort &

# --------------------------------------
# AGUARDAR SERVIÇOS
# --------------------------------------

wait_for_backend
wait_for_frontend
wait_for_wayland

# --------------------------------------
# INICIAR CHROMIUM KIOSK
# --------------------------------------

echo "Abrindo Chromium..."

chromium \
--ozone-platform=wayland \
--enable-features=UseOzonePlatform \
--kiosk \
--start-fullscreen \
--start-maximized \
--no-first-run \
--disable-infobars \
--disable-session-crashed-bubble \
--disable-translate \
--disable-features=TranslateUI \
--overscroll-history-navigation=0 \
--enable-gpu \
--enable-zero-copy \
--ignore-gpu-blocklist \
--enable-gpu-rasterization \
http://localhost:$FRONTEND_PORT &

echo "Sistema iniciado com sucesso"