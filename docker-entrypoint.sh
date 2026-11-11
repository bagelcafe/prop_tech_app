#!/bin/sh
# 컨테이너 기동 시 데이터 마이그레이션.
# - 영속 볼륨($APP_DATA_DIR = /app/data)에 기존 파일이 없고 이미지에 포함된 파일이 있으면 1회 복사.
# - 이후에는 볼륨 파일을 보존(멱등). 컨테이너 재생성/재시작에도 데이터 유지.
# - trailing_stops 등 신규 테이블은 앱 기동 시 init_db()의 CREATE TABLE IF NOT EXISTS 로
#   기존 trades.db 에 자동 추가되며 기존 데이터는 보존된다(마이그레이션에서 별도 처리 불필요).
set -eu

: "${APP_DATA_DIR:=/app/data}"

mkdir -p "$APP_DATA_DIR/log"

echo "[entrypoint] APP_DATA_DIR=$APP_DATA_DIR"

for filename in trades.db stats.json; do
    dest="$APP_DATA_DIR/$filename"
    src="/app/$filename"
    if [ -e "$dest" ]; then
        echo "[entrypoint] keep existing $filename (volume)"
    elif [ -e "$src" ]; then
        cp "$src" "$dest"
        echo "[entrypoint] migrated $filename -> $dest"
    else
        echo "[entrypoint] no $filename to migrate (will be created at runtime if needed)"
    fi
done

# trades.db 가 없으면 앱이 init_db()로 새로 생성한다(키움/봇 공용).
echo "[entrypoint] starting: $*"
exec "$@"
