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
export DISPLAY=$(who | grep '(:' | awk '{print $NF}' | tr -d '()')
export XDG_RUNTIME_DIR=/run/user/$(id -u)

sleep 5

# --------------------------------------
# FUNÇÕES
# --------------------------------------

wait_for_internet() {
    echo "Verificando se há conexão com a internet..."
    until ping -c1 8.8.8.8 >/dev/null 2>&1
    do
        sleep 1
    done
}

wait_for_backend() {
    echo "Verificando se modo desenvolvimento está ativo..."
    until curl -s http://localhost:$BACKEND_PORT >/dev/null
    do
        sleep 1
    done
}

# --------------------------------------
# INTERNET
# --------------------------------------

wait_for_internet

# --------------------------------------
# AUTO UPDATE DO REPO
# --------------------------------------

if [ ! -d "$BASE_DIR" ]; then
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
# ENCERRAR PROCESSOS ANTIGOS
# --------------------------------------

pkill -f "uvicorn" 2>/dev/null
# pkill -f "serve" 2>/dev/null
fuser -k 5000/tcp 2>/dev/null
pkill -f "chromium" 2>/dev/null

# --------------------------------------
# FRONTEND (TESTE REMOTO PRIMEIRO)
# --------------------------------------

echo "Verificando frontend remoto em $REMOTE_FRONTEND..."

if curl --fail --silent --connect-timeout 3 "$REMOTE_FRONTEND" >/dev/null; then

    FRONTEND_URL="$REMOTE_FRONTEND"
    echo "Usando frontend remoto: $FRONTEND_URL"

else
    echo "Frontend remoto indisponível. Subindo backend + frontend local..."

    # --------------------------------------
    # BACKEND
    # --------------------------------------

    cd "$PROJECT_DIR"

    if [ ! -d "$VENV_DIR" ]; then
        echo "Criando venv..."
        python3 -m venv "$VENV_DIR"
    fi

    # NÃO usar activate (evita erro de ambiente)
    VENV_PY="$VENV_DIR/bin/python"
    VENV_PIP="$VENV_DIR/bin/pip"

    echo "Instalando dependências..."
    $VENV_PIP install --upgrade pip >/dev/null 2>&1
    $VENV_PIP install fastapi uvicorn requests opencv-python >/dev/null 2>&1

    echo "Iniciando backend..."
    $VENV_PY -m uvicorn main:app \
    --host 0.0.0.0 \
    --port $BACKEND_PORT &

    wait_for_backend

    # --------------------------------------
    # FRONTEND LOCAL
    # --------------------------------------

    FRONTEND_URL="$LOCAL_FRONTEND"

    cd "$FRONTEND_DIR"

    if [ ! -d "node_modules" ]; then
        echo "Instalando dependências (primeira vez)..."
        npm install >/dev/null 2>&1
    fi
    if [ ! -d "node_modules/@types/three" ]; then
        echo "Instalando @types/three..."
        npm install --save-dev @types/three >/dev/null 2>&1
    fi
    if ! command -v serve >/dev/null 2>&1; then
        echo "Instalando serve global..."
        npm install -g serve >/dev/null 2>&1
    fi
    

    echo "Buildando frontend..."
    npm run build >/dev/null 2>&1

    echo "Servindo frontend..."
    serve -s dist -l $FRONTEND_PORT &

    sleep 3
fi

# --------------------------------------
# KIOSK (CHROMIUM)
# --------------------------------------

echo "Iniciando Chromium..."

chromium \
--kiosk \
--start-fullscreen \
--no-first-run \
--disable-infobars \
--disable-session-crashed-bubble \
--disable-translate \
--overscroll-history-navigation=0 \
--enable-zero-copy \
"$FRONTEND_URL" &

echo "Sistema iniciado com sucesso"

wait