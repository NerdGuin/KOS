#!/bin/bash

# --------------------------------------
# CONFIGURAÇÕES
# --------------------------------------

BASE_DIR="$HOME/kos"
PROJECT_DIR="$BASE_DIR/src/backend"
FRONTEND_DIR="$BASE_DIR/src/frontend"
VENV_DIR="$PROJECT_DIR/venv"

BACKEND_PORT=8000
FRONTEND_PORT=5000
GIT_REPO="https://github.com/NerdGuin/KOS.git"

REMOTE_FRONTEND="http://192.168.1.6:5173"
LOCAL_FRONTEND="http://localhost:$FRONTEND_PORT"

export PATH=/usr/local/bin:/usr/bin:/bin:$PATH
export DISPLAY=:0
export XDG_RUNTIME_DIR=/run/user/$(id -u)

sleep 3

# --------------------------------------
# FUNÇÕES
# --------------------------------------

wait_for_internet() {
    echo "Aguardando internet..."
    until ping -c1 8.8.8.8 >/dev/null 2>&1; do
        sleep 1
    done
}

wait_for_backend() {
    echo "Aguardando backend..."
    until curl -s http://localhost:$BACKEND_PORT >/dev/null; do
        sleep 1
    done
}

# --------------------------------------
# ENCERRAR PROCESSOS (SEGURO)
# --------------------------------------

pkill -x uvicorn 2>/dev/null
pkill -x serve 2>/dev/null
pkill -x chromium 2>/dev/null

# --------------------------------------
# INTERNET
# --------------------------------------

wait_for_internet

# --------------------------------------
# CLONE INICIAL (SEM UPDATE AGRESSIVO)
# --------------------------------------

if [ ! -d "$BASE_DIR" ]; then
    echo "Clonando repositório..."
    git clone "$GIT_REPO" "$BASE_DIR"
fi

# --------------------------------------
# FRONTEND REMOTO
# --------------------------------------

echo "Verificando frontend remoto..."

if curl --fail --silent --connect-timeout 2 "$REMOTE_FRONTEND" >/dev/null; then
    FRONTEND_URL="$REMOTE_FRONTEND"
    echo "Usando remoto: $FRONTEND_URL"

else
    echo "Usando frontend local..."

    # --------------------------------------
    # BACKEND
    # --------------------------------------

    cd "$PROJECT_DIR"

    if [ ! -d "$VENV_DIR" ]; then
        echo "Criando venv (primeira vez)..."
        python3 -m venv "$VENV_DIR"

        "$VENV_DIR/bin/pip" install --upgrade pip
        "$VENV_DIR/bin/pip" install fastapi uvicorn requests opencv-python
    fi

    echo "Iniciando backend..."
    "$VENV_DIR/bin/python" -m uvicorn main:app \
        --host 127.0.0.1 \
        --port $BACKEND_PORT &

    wait_for_backend

    # --------------------------------------
    # FRONTEND LOCAL
    # --------------------------------------

    cd "$FRONTEND_DIR"

    if [ ! -d "node_modules" ]; then
        echo "Instalando dependências (primeira vez)..."
        npm install
    fi

    if [ ! -d "dist" ]; then
        echo "Buildando frontend..."
        npm run build
    fi

    FRONTEND_URL="$LOCAL_FRONTEND"

    echo "Subindo frontend..."
    npx serve -s dist -l $FRONTEND_PORT &
fi

sleep 2

# --------------------------------------
# CHROMIUM KIOSK
# --------------------------------------

echo "Iniciando Chromium..."

chromium \
--kiosk \
--no-sandbox \
--disable-infobars \
--disable-session-crashed-bubble \
--disable-translate \
--overscroll-history-navigation=0 \
"$FRONTEND_URL" &

echo "Sistema iniciado 🚀"