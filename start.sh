#!/bin/bash

# --------------------------------------
# CONFIGURAÇÕES
# --------------------------------------
PROJECT_DIR="$HOME/kos"
GIT_REPO="https://github.com/NerdGuin/KOS.git"
PORT=8000

# --------------------------------------
# 0. ENCERRAR PROCESSOS ANTIGOS
# --------------------------------------
pkill -f "uvicorn main:app" 2>/dev/null
pkill -f "chromium" 2>/dev/null

# --------------------------------------
# 1. INICIAR WESTON
# --------------------------------------
if ! pgrep -x weston >/dev/null; then
    echo "Iniciando Weston"
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
    git clone "$GIT_REPO" "$PROJECT_DIR"
else
    echo "Buscando atualizações"
    cd "$PROJECT_DIR"
    git fetch origin
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u})

    if [ "$LOCAL" != "$REMOTE" ]; then
        echo "Nova versão disponível. Atualizando..."
        git pull
    else
        echo "Última versão já está instalada!"
    fi
fi

# --------------------------------------
# 3. INICIAR SERVIDOR WEB
# --------------------------------------
echo "Iniciando servidor"
cd "$PROJECT_DIR"
# source venv/bin/activate # ATIVA AMBIENTE VIRTUAL

uvicorn main:app --host 0.0.0.0 --port $PORT --reload &

sleep 3

# --------------------------------------
# 4. ABRIR CHROMIUM EM MODO KIOSK
# --------------------------------------
echo "Abrindo interface"
chromium --ozone-platform=wayland --kiosk http://localhost:$PORT