#!/usr/bin/env bash
echo "+++ EXECUTING launchFrontend.sh +++"
# Ir para a pasta do frontend
SCRIPT_DIR="$(cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P)"
cd "$SCRIPT_DIR/../../frontend" || exit 1

# Iniciar frontend
npm run dev

echo "+++ EXECUTED launchFrontend.sh +++"