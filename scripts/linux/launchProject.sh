#!/usr/bin/env bash
echo "+++ EXECUTING launchProject.sh +++"
SCRIPT_DIR="$(cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P)"

# Iniciar backend em background
bash "$SCRIPT_DIR/launchBackend.sh" &
BACKEND_PID=$!

# Iniciar frontend (mantém o terminal preso aqui)
bash "$SCRIPT_DIR/launchFrontend.sh"

# Opcional: esperar backend ao sair do frontend
wait "$BACKEND_PID" 2>/dev/null || true

echo "+++ EXECUTED launchProject.sh +++"