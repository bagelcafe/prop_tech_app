#!/bin/sh
set -eu

mkdir -p "$APP_DATA_DIR/log"

for filename in trades.db stats.json; do
    if [ ! -e "$APP_DATA_DIR/$filename" ] && [ -e "/app/$filename" ]; then
        cp "/app/$filename" "$APP_DATA_DIR/$filename"
    fi
done

exec "$@"