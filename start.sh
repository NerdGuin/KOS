#!/bin/bash

BASE_DIR="$HOME/kos"
PROJECT_DIR="$BASE_DIR/src/backend"
FRONTEND_DIR="$BASE_DIR/src/frontend"
VENV_DIR="$PROJECT_DIR/venv"

BACKEND_PORT=8000
FRONTEND_PORT=5000

REMOTE_FRONTEND="http://192.168.1.6:5173"
LOCAL_FRONTEND="http://localhost:$FRONTEND_PORT"

RUNTIME_DIR="/tmp/kos"
mkdir -p "$RUNTIME_DIR"

export DISPLAY=:0
export XDG_RUNTIME_DIR=/run/user/$(id -u)

sleep 3

# --------------------------------------
# ENCERRAR PROCESSOS ANTIGOS (SEGURO)
# --------------------------------------

for service in backend frontend chromium; do
    PID_FILE="$RUNTIME_DIR/$service.pid"

    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")

        if ps -p $PID > /dev/null 2>&1; then
            echo "Encerrando $service (PID $PID)..."
            kill $PID
            sleep 1
        fi

        rm "$PID_FILE"
    fi
done

# Garantir portas livres
fuser -k $BACKEND_PORT/tcp 2>/dev/null
fuser -k $FRONTEND_PORT/tcp 2>/dev/null

# --------------------------------------
# INTERNET
# --------------------------------------

until ping -c1 8.8.8.8 >/dev/null 2>&1; do sleep 1; done

# --------------------------------------
# CLONE (SEM UPDATE AGRESSIVO)
# --------------------------------------

if [ ! -d "$BASE_DIR" ]; then
    git clone "$GIT_REPO" "$BASE_DIR"
fi

# --------------------------------------
# TESTAR FRONTEND REMOTO
# --------------------------------------

if curl --fail --silent --connect-timeout 2 "$REMOTE_FRONTEND" >/dev/null; then
    FRONTEND_URL="$REMOTE_FRONTEND"

else
    echo "Usando frontend local..."

    # --------------------------------------
    # BACKEND
    # --------------------------------------

    cd "$PROJECT_DIR"

    if [ ! -d "$VENV_DIR" ]; then
        echo "Criando venv..."
        python3 -m venv "$VENV_DIR"
        "$VENV_DIR/bin/pip" install fastapi uvicorn requests opencv-python
    fi

    echo "Iniciando backend..."
    "$VENV_DIR/bin/python" -m uvicorn main:app \
        --host 127.0.0.1 \
        --port $BACKEND_PORT &

    echo $! > "$RUNTIME_DIR/backend.pid"

    # Esperar backend subir
    until curl -s http://localhost:$BACKEND_PORT >/dev/null; do sleep 1; done

    # --------------------------------------
    # FRONTEND
    # --------------------------------------

    cd "$FRONTEND_DIR"

    if [ ! -d "node_modules" ]; then
        npm install
    fi

    if [ ! -d "dist" ]; then
        npm run dev
    fi

    FRONTEND_URL="$LOCAL_FRONTEND"

    echo "Iniciando frontend..."
    npx serve -s dist -l $FRONTEND_PORT &

    echo $! > "$RUNTIME_DIR/frontend.pid"
fi

sleep 2

# --------------------------------------
# CHROMIUM
# --------------------------------------

echo "Abrindo Chromium..."

chromium \
--kiosk \
--no-sandbox \
--disable-infobars \
--disable-session-crashed-bubble \
--disable-translate \
--overscroll-history-navigation=0 \
"$FRONTEND_URL" &

echo $! > "$RUNTIME_DIR/chromium.pid"

echo "Sistema iniciado 🚀"