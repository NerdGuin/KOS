#!/bin/bash

# --------------------------------------
# CONFIGURAÇÕES
# --------------------------------------
BASE_DIR="$HOME/kos"
PROJECT_DIR="$BASE_DIR/src/backend"
FRONTEND_DIR="$BASE_DIR/src/frontend"
VENV_DIR="$PROJECT_DIR/venv"
GIT_REPO="https://github.com/NerdGuin/KOS.git"
BACKEND_PORT=8000
FRONTEND_PORT=5173

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
# 1. INICIAR WESTON
# --------------------------------------
if ! pgrep -x weston >/dev/null; then
    weston-launch &
    sleep 2
else
    echo "Weston já está rodando."
fi

# --------------------------------------
# 2. ATUALIZAR PROJETO VIA GIT
# --------------------------------------
if [ ! -d "$PROJECT_DIR" ]; then
    echo "Baixando arquivos"
    git clone "$GIT_REPO" "$HOME/kos"
else
    echo "Buscando atualizações"
    cd "$PROJECT_DIR"
    chmod +x "$BASE_DIR/start.sh" 2>/dev/null

    if ! git diff-index --quiet HEAD --; then
        git reset --hard
    fi

    git fetch origin
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u})

    if [ "$LOCAL" != "$REMOTE" ]; then
        echo "Nova versão disponível. Atualizando..."
        git pull
        nohup "$BASE_DIR/start.sh" >/dev/null 2>&1 &
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
    pip install uvicorn
    pip install fastapi
    pip install requests
    pip install pip
fi

# --------------------------------------
# 4. INICIAR SERVIDOR FASTAPI
# --------------------------------------
uvicorn main:app --host 127.0.0.1 --port $BACKEND_PORT --reload &
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
chromium --ozone-platform=wayland --kiosk http://localhost:$FRONTEND_PORT &