import asyncio
import json
import logging
import random

import websockets
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

import toss_service

logger = logging.getLogger("toss_realtime")
router = APIRouter(prefix="/api/toss", tags=["toss-realtime"])

WS_URL = "wss://openapi-ws.tossinvest.com/ws/v1"
PING_INTERVAL = 60
MAX_TOPICS = 100


class TradeHub:
    """토스 웹소켓 연결 1개를 모든 브라우저 클라이언트가 공유한다 (계정당 동시 연결 2개 제한 대응)."""

    def __init__(self):
        self.clients = {}
        self.task = None
        self.changed = asyncio.Event()
        self.upstream = None
        self.last_trade = {}

    def topics(self):
        return {topic for topic in self.clients.values()}

    async def subscribe(self, ws: WebSocket, topic: str):
        self.clients[ws] = topic
        cached = self.last_trade.get(topic)
        if cached:
            await self._send(ws, {"type": "trade", **cached})
        self.changed.set()
        if self.task is None or self.task.done():
            self.task = asyncio.create_task(self._run())

    def unsubscribe(self, ws: WebSocket):
        self.clients.pop(ws, None)
        self.changed.set()

    async def _send(self, ws: WebSocket, payload: dict):
        try:
            await ws.send_json(payload)
        except Exception:
            self.clients.pop(ws, None)

    async def _broadcast(self, payload: dict, topic=None):
        for ws, t in list(self.clients.items()):
            if topic is None or t == topic:
                await self._send(ws, payload)

    async def _declare(self, upstream):
        market_codes = {}
        for topic in sorted(self.topics())[:MAX_TOPICS]:
            _, market, symbol = topic.split(":", 2)
            market_codes.setdefault(market, []).append(symbol)
        await upstream.send(json.dumps([{"type": f"trade:{m}", "codes": c} for m, c in market_codes.items()]))

    async def _pinger(self, upstream):
        while True:
            await asyncio.sleep(PING_INTERVAL)
            await upstream.send("PING")

    async def _watch_changes(self, upstream):
        while True:
            await self.changed.wait()
            self.changed.clear()
            if not self.clients:
                await upstream.close()
                return
            await self._declare(upstream)
            await asyncio.sleep(0.3)

    async def _run(self):
        attempt = 0
        while self.clients:
            try:
                token = await asyncio.to_thread(toss_service.get_token)
                await self._broadcast({"type": "status", "status": "connecting"})
                async with websockets.connect(WS_URL, additional_headers={"Authorization": f"Bearer {token}"}) as upstream:
                    attempt = 0
                    self.changed.clear()
                    await self._declare(upstream)
                    helpers = [asyncio.create_task(self._pinger(upstream)), asyncio.create_task(self._watch_changes(upstream))]
                    try:
                        async for raw in upstream:
                            await self._handle(raw)
                            if not self.clients:
                                break
                    finally:
                        for helper in helpers:
                            helper.cancel()
            except asyncio.CancelledError:
                raise
            except Exception as e:
                logger.warning("토스 웹소켓 연결 오류: %s", type(e).__name__)
                await self._broadcast({"type": "status", "status": "error", "detail": "실시간 연결이 끊어졌습니다. 재연결 중..."})
            if not self.clients:
                break
            attempt += 1
            await asyncio.sleep(min(30, 2 ** min(attempt, 5)) + random.random())

    async def _handle(self, raw):
        if not isinstance(raw, str):
            return
        try:
            frame = json.loads(raw)
        except ValueError:
            return
        kind = frame.get("type")
        if kind == "subscriptions":
            rejected = frame.get("rejected") or []
            await self._broadcast({"type": "status", "status": "live", "rejected": len(rejected)})
            for item in rejected:
                logger.info("토스 구독 거부: %s", item)
        elif kind == "message" and isinstance(frame.get("data"), dict):
            topic = frame.get("topic", "")
            data = frame["data"]
            trade = {"symbol": topic.rsplit(":", 1)[-1], "price": data.get("price"), "volume": data.get("volume"),
                     "timestamp": data.get("timestamp"), "currency": data.get("currency")}
            self.last_trade[topic] = trade
            await self._broadcast({"type": "trade", **trade}, topic)
        elif kind == "error":
            code = (frame.get("error") or {}).get("code", "unknown")
            logger.warning("토스 웹소켓 에러 프레임: %s", code)
            await self._broadcast({"type": "status", "status": "error", "detail": f"실시간 오류: {code}"})


hub = TradeHub()


@router.websocket("/ws/trades/{market}/{symbol}")
async def trade_stream(ws: WebSocket, market: str, symbol: str):
    if market not in ("kr", "us") or not symbol or len(symbol) > 30 or not symbol.replace(".", "").replace("-", "").isalnum():
        await ws.close(code=1008)
        return
    await ws.accept()
    await hub.subscribe(ws, f"trade:{market}:{symbol.upper()}")
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        hub.unsubscribe(ws)
