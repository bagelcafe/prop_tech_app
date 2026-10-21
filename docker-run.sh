#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
IMAGE_NAME=${IMAGE_NAME:-prop-tech-app:local}
CONTAINER_NAME=${CONTAINER_NAME:-prop-tech-app}
PORT=${PORT:-8000}

mkdir -p "$SCRIPT_DIR/data"

docker build -t "$IMAGE_NAME" "$SCRIPT_DIR"
docker rm -f "$CONTAINER_NAME" 2>/dev/null || true
docker run -d \
    --name "$CONTAINER_NAME" \
    --restart unless-stopped \
    --env-file "$SCRIPT_DIR/.env" \
    -e APP_DATA_DIR=/app/data \
    -p "$PORT:8000" \
    -v "$SCRIPT_DIR/data:/app/data" \
    "$IMAGE_NAME"