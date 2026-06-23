#!/bin/bash

# --------------------------------------
# SETTINGS
# --------------------------------------

BASE_DIR="$HOME/KOS"
SERVER_DIR="$BASE_DIR/src/server"
CLIENT_DIR="$BASE_DIR/src/client"
VENV_DIR="$SERVER_DIR/venv"

SERVER_PORT=8000
CLIENT_PORT=5000
GIT_REPO="https://github.com/NerdGuin/KOS.git"

export XDG_RUNTIME_DIR=/run/user/1000
export WAYLAND_DISPLAY=wayland-0
export DISPLAY=:0
export PULSE_SERVER=unix:/run/user/1001/pulse/native

sleep 1

# --------------------------------------
# VERIFY INTERNET CONNECTION
# --------------------------------------

wait_for_internet() {
    echo "Verificando se há conexão com a internet..."
    until ping -c1 8.8.8.8 >/dev/null 2>&1
    do
        sleep 1
    done
}

wait_for_internet

# --------------------------------------
# CHECK FOR UPDATES
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
# CLOSE OUT OLD CASES
# --------------------------------------

fuser -k 5000/tcp 2>/dev/null
fuser -k 8000/tcp 2>/dev/null
pkill -f "electron" 2>/dev/null

# --------------------------------------
# START THE SERVER
# --------------------------------------

cd "$SERVER_DIR"

npm run dev


# --------------------------------------
# START THE CLIENT
# --------------------------------------

    echo "[CLIENT] Carregando interface..."

    cd "$CLIENT_DIR"

    if [ ! -d "node_modules" ]; then
        echo "[CLIENT] Instalando dependências..."
        npm install >/dev/null 2>&1
    fi
    # if [ ! -d "node_modules/@types/three" ]; then
    #     echo "[CLIENT] Instalando @types/three..."
    #     npm install --save-dev @types/three >/dev/null 2>&1
    # fi
    

    echo "[CLIENT] Interface carregada! Iniciando..."
    npm run dev

wait