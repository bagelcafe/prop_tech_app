#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
REACT_DIST="$SCRIPT_DIR/static/dist"

# ── React 프론트엔드 빌드 ─────────────────────────────────────────────
if [ -d "$FRONTEND_DIR" ]; then
    echo "[1/2] React 빌드 시작..."

    cd "$FRONTEND_DIR"

    # node_modules 없으면 install
    if [ ! -d "node_modules" ]; then
        echo "  npm install 실행 중..."
        npm install --silent
    fi

    npm run build
    echo "  React 빌드 완료 → $REACT_DIST"
    cd "$SCRIPT_DIR"
else
    echo "[1/2] frontend/ 폴더 없음, 빌드 스킵"
fi

# ── FastAPI 서버 시작 ─────────────────────────────────────────────────
echo "[2/2] FastAPI 서버 시작..."

PORT="${PORT:-8000}"
if command -v fuser >/dev/null 2>&1 && fuser -n tcp "$PORT" >/dev/null 2>&1; then
    echo "  기존 ${PORT} 포트 웹 서버 중단 중..."
    fuser -k -TERM -n tcp "$PORT" >/dev/null 2>&1 || true

    for attempt in {1..100}; do
        if ! fuser -n tcp "$PORT" >/dev/null 2>&1; then
            break
        fi
        if [ "$attempt" -eq 50 ]; then
            echo "  종료되지 않은 ${PORT} 포트 프로세스를 강제 종료합니다..."
            fuser -k -KILL -n tcp "$PORT" >/dev/null 2>&1 || true
        fi
    done

    if fuser -n tcp "$PORT" >/dev/null 2>&1; then
        echo "  오류: ${PORT} 포트를 해제하지 못했습니다."
        exit 1
    fi
fi

# 가상 환경이 존재하면 활성화
if [ -d "$SCRIPT_DIR/.venv" ]; then
    source "$SCRIPT_DIR/.venv/bin/activate"
fi

cd "$SCRIPT_DIR"
uvicorn main:app --host 0.0.0.0 --port "$PORT" --reload
