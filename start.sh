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

REMOTE_FRONTEND="http://192.168.1.201:5173"
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

# --------------------------------------
# INTERNET
# --------------------------------------

wait_for_internet

# --------------------------------------
# AUTO UPDATE DO REPO
# --------------------------------------

if [ ! -d "$BASE_DIR" ]; then
    echo "Projeto não encontrado. Clonando repositório..."
    git clone "$GIT_REPO" "$BASE_DIR"
else
    echo "Verificando se há atualizações no repositório..."
    cd "$BASE_DIR"

    git fetch origin

    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u})

    if [ "$LOCAL" != "$REMOTE" ]; then
        echo "Atualizações encontradas. Atualizando..."
        git reset --hard
        git pull
    else
        echo "Nenhuma atualização encontrada."
    fi
fi

# --------------------------------------
# ENCERRAR PROCESSOS ANTIGOS
# --------------------------------------

pkill -f "uvicorn" 2>/dev/null
fuser -k 5000/tcp 2>/dev/null
pkill -f "chromium" 2>/dev/null

# --------------------------------------
# BACKEND
# --------------------------------------

cd "$PROJECT_DIR"

if [ ! -d "$VENV_DIR" ]; then
    echo "[BACKEND] Gerando ambiente virtual..."
    python3 -m venv "$VENV_DIR"
fi

VENV_PY="$VENV_DIR/bin/python"
VENV_PIP="$VENV_DIR/bin/pip"

echo "[BACKEND] Verificando dependências..."
$VENV_PIP install --upgrade pip >/dev/null 2>&1

install_if_missing() {
    PKG=$1
    if ! $VENV_PIP show "$PKG" > /dev/null 2>&1; then
        echo "[BACKEND] Instalando $PKG..."
        $VENV_PIP install "$PKG" >/dev/null 2>&1
    fi
}

install_if_missing fastapi
install_if_missing uvicorn
install_if_missing requests
install_if_missing opencv-python

echo "[BACKEND] Iniciando..."
$VENV_PY -m uvicorn main:app \
--host 0.0.0.0 \
--port $BACKEND_PORT &


# --------------------------------------
# FRONTEND
# --------------------------------------

echo "[FRONTEND] Verificando se modo desenvolvimento está ativo..."

if curl --fail --silent --connect-timeout 3 "$REMOTE_FRONTEND" >/dev/null; then

    FRONTEND_URL="$REMOTE_FRONTEND"
    echo "[FRONTEND] O modo desenvolvimento está ativo. Redirecionando..."

else
    echo "[FRONTEND] O modo desenvolvimento não está ativo. Iniciando todos os sistemas..."

    FRONTEND_URL="$LOCAL_FRONTEND"

    cd "$FRONTEND_DIR"

    if [ ! -d "node_modules" ]; then
        echo "[FRONTEND] Instalando dependências..."
        npm install >/dev/null 2>&1
    fi
    if [ ! -d "node_modules/@types/three" ]; then
        echo "[FRONTEND] Instalando @types/three..."
        npm install --save-dev @types/three >/dev/null 2>&1
    fi
    if ! command -v serve >/dev/null 2>&1; then
        echo "[FRONTEND] Instalando serve global..."
        npm install -g serve >/dev/null 2>&1
    fi
    

    echo "[FRONTEND] Construindo..."
    npm run build >/dev/null 2>&1

    echo "[FRONTEND] Iniciando..."
    serve -s dist -l $FRONTEND_PORT &

    sleep 3
fi

# --------------------------------------
# KIOSK (CHROMIUM)
# --------------------------------------

echo "[KIOSK] Iniciando Chromium..."

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

echo "[KIOSK] Sistema iniciado com sucesso"

wait