#!/bin/bash

BASE_DIR="$HOME/kos"
PROJECT_DIR="$BASE_DIR/src/backend"
FRONTEND_DIR="$BASE_DIR/src/frontend"
VENV_DIR="$PROJECT_DIR/venv"

BACKEND_PORT=8000
FRONTEND_PORT=5000

REMOTE_FRONTEND="http://192.168.1.6:5173"
LOCAL_FRONTEND="http://localhost:$FRONTEND_PORT"

export DISPLAY=:0
export XDG_RUNTIME_DIR=/run/user/$(id -u)

sleep 3

# --------------------------------------
# INTERNET
# --------------------------------------

until ping -c1 8.8.8.8 >/dev/null 2>&1; do sleep 1; done

# --------------------------------------
# CLONE / UPDATE (SEGURO)
# --------------------------------------

if [ ! -d "$BASE_DIR" ]; then
    git clone "$GIT_REPO" "$BASE_DIR"
else
    cd "$BASE_DIR"
    git fetch origin

    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u})

    if [ "$LOCAL" != "$REMOTE" ]; then
        echo "Atualização detectada (aplicar no próximo boot)"
    fi
fi

pkill -x uvicorn 2>/dev/null
pkill -x serve 2>/dev/null
pkill -x chromium 2>/dev/null

# --------------------------------------
# FRONTEND REMOTO
# --------------------------------------

if curl --fail --silent --connect-timeout 2 "$REMOTE_FRONTEND" >/dev/null; then
    FRONTEND_URL="$REMOTE_FRONTEND"
else
    echo "Usando local..."

    # BACKEND
    cd "$PROJECT_DIR"

    if [ ! -d "$VENV_DIR" ]; then
        python3 -m venv "$VENV_DIR"
        "$VENV_DIR/bin/pip" install fastapi uvicorn requests opencv-python
    fi

    "$VENV_DIR/bin/python" -m uvicorn main:app \
        --host 127.0.0.1 \
        --port $BACKEND_PORT &

    # FRONTEND
    cd "$FRONTEND_DIR"

    if [ ! -d "node_modules" ]; then
        npm install
    fi

    if [ ! -d "dist" ]; then
        npm run dev
    fi

    FRONTEND_URL="$LOCAL_FRONTEND"

    # GARANTE PORTA LIVRE
    fuser -k $FRONTEND_PORT/tcp 2>/dev/null

    npx serve -s dist -l $FRONTEND_PORT &
fi

sleep 2

# --------------------------------------
# CHROMIUM
# --------------------------------------

chromium \
--kiosk \
--no-sandbox \
--disable-infobars \
--disable-session-crashed-bubble \
--disable-translate \
--overscroll-history-navigation=0 \
"$FRONTEND_URL" &