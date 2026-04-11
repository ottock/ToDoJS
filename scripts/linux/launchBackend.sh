#!/usr/bin/env bash
echo "+++ EXECUTING launchBackend.sh +++"
# Ir para a raiz do projeto
SCRIPT_DIR="$(cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P)"
cd "$SCRIPT_DIR/../.." || exit 1

# Iniciar backend
node backend/src/main.js

echo "+++ EXECUTED launchBackend.sh +++"