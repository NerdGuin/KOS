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
FRONTEND_PORT=5000
GIT_REPO="https://github.com/NerdGuin/KOS.git"

export PATH=/usr/local/bin:/usr/bin:/bin:$PATH

# Carregar NVM corretamente (IMPORTANTE)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Pequeno delay pra garantir que o sistema subiu
sleep 5

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

# --------------------------------------
# ENCERRAR PROCESSOS ANTIGOS
# --------------------------------------

pkill -f "uvicorn main:app" 2>/dev/null
pkill -f "serve" 2>/dev/null
pkill -f "chromium" 2>/dev/null

# --------------------------------------
# INTERNET
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
# BACKEND
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

echo "Iniciando backend..."
$VENV_DIR/bin/uvicorn main:app \
--host 127.0.0.1 \
--port $BACKEND_PORT &

wait_for_backend

# --------------------------------------
# FRONTEND
# --------------------------------------

REMOTE_FRONTEND="http://192.168.1.6:5173"
LOCAL_FRONTEND="http://localhost:$FRONTEND_PORT"

echo "Verificando frontend remoto em $REMOTE_FRONTEND..."

if curl -s --head --request GET \
   --connect-timeout 3 \
   --max-time 5 \
   "$REMOTE_FRONTEND" | grep "200 OK" >/dev/null; then

    FRONTEND_URL="$REMOTE_FRONTEND"
    echo "Usando frontend remoto: $FRONTEND_URL"

else
    FRONTEND_URL="$LOCAL_FRONTEND"
    echo "Frontend remoto indisponível. Usando local..."

    cd "$FRONTEND_DIR"

    echo "Instalando dependências..."
    npm install >/dev/null 2>&1
    npm install -g serve >/dev/null 2>&1

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

unclutter -idle 0 &

chromium \
--kiosk \
--start-fullscreen \
--no-first-run \
--disable-infobars \
--disable-session-crashed-bubble \
--disable-translate \
--overscroll-history-navigation=0 \
--enable-gpu \
--enable-gpu-rasterization \
--ignore-gpu-blocklist \
--enable-zero-copy \
--use-gl=egl \
"$FRONTEND_URL" &

echo "Sistema iniciado com sucesso"