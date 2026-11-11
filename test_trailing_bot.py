import os
import tempfile
import unittest
from decimal import Decimal
from unittest.mock import patch

import trailing_bot
from trailing_bot import (
    TrailingBot, evaluate_tick, compute_stop, is_regular_session,
    ARMED, TRAILING, AWAITING_CONFIRM, TRIGGERED, CANCELLED, HALTED,
)


# ── 순수 로직 ────────────────────────────────────────────────────────────────
class PureLogicTests(unittest.TestCase):
    def test_compute_stop_anlab(self):
        # 137,300 × 0.85 = 116,705 → 호가단위(100) 보정 → 116,700
        self.assertEqual(str(compute_stop(Decimal("137300"))), "116700")

    def test_new_peak_raises_stop_modify(self):
        res = evaluate_tick("150000", "137300", "116700")
        self.assertEqual(res.action, "modify")
        self.assertEqual(res.new_peak, "150000")
        self.assertEqual(res.new_stop, "127500")  # 150000*0.85

    def test_stop_never_decreases(self):
        # 현재가가 peak보다 낮으면 stop 그대로, modify 없음
        res = evaluate_tick("130000", "150000", "127500")
        self.assertEqual(res.action, "none")
        self.assertEqual(res.new_stop, "127500")

    def test_backup_sell_when_below_guard(self):
        # stop 116700, guard 1% → 115533 이하로 뚫리면 백업 매도
        res = evaluate_tick("115000", "137300", "116700")
        self.assertEqual(res.action, "backup_sell")

    def test_no_backup_just_above_guard(self):
        res = evaluate_tick("116600", "137300", "116700")
        self.assertEqual(res.action, "none")

    def test_invalid_price_is_noop(self):
        self.assertEqual(evaluate_tick("0", "137300", "116700").action, "none")
        self.assertEqual(evaluate_tick("abc", "137300", "116700").action, "none")

    def test_regular_session_weekend_false(self):
        from datetime import datetime
        sat = datetime(2026, 11, 7, 11, 0, tzinfo=trailing_bot.KST)   # 토요일
        self.assertFalse(is_regular_session(sat))

    def test_regular_session_weekday_hours(self):
        from datetime import datetime
        inside = datetime(2026, 11, 11, 11, 0, tzinfo=trailing_bot.KST)
        outside = datetime(2026, 11, 11, 16, 0, tzinfo=trailing_bot.KST)
        self.assertTrue(is_regular_session(inside))
        self.assertFalse(is_regular_session(outside))


# ── 엔진(임시 DB + mock I/O) ──────────────────────────────────────────────────
class EngineTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
        self.tmp.close()
        self._orig_db = trailing_bot.DB_PATH
        trailing_bot.DB_PATH = self.tmp.name
        trailing_bot.init_db()
        self.bot = TrailingBot()

    def tearDown(self):
        trailing_bot.DB_PATH = self._orig_db
        os.unlink(self.tmp.name)

    def _register(self, price, peak="137300", dry_run=True, **kw):
        with patch.object(self.bot, "_fetch_peak", return_value=(peak, "2026-11-03")), \
             patch.object(self.bot, "_fetch_price", return_value=price):
            return self.bot.register(1, "053800", "10", name="안랩", dry_run=dry_run, **kw)

    def test_register_armed_when_price_above_stop(self):
        # 현재가 130000 > stop 116700 → ARMED (dry_run)
        row = self._register("130000")
        self.assertEqual(row["state"], ARMED)
        self.assertEqual(row["peak_price"], "137300")
        self.assertEqual(row["stop_price"], "116700")

    def test_register_awaiting_confirm_when_already_below_stop(self):
        # 현재가 115000 ≤ stop 116700 → AWAITING_CONFIRM, 조건주문 미생성
        row = self._register("115000")
        self.assertEqual(row["state"], AWAITING_CONFIRM)
        self.assertIsNone(row["conditional_order_id"])

    def test_register_peak_override(self):
        row = self._register("90000", peak_override="100000")
        self.assertEqual(row["peak_price"], "100000")
        self.assertEqual(row["stop_price"], "85000")  # 100000*0.85

    def test_duplicate_active_registration_rejected(self):
        self._register("130000")
        with self.assertRaises(ValueError):
            self._register("130000")

    def test_live_register_creates_conditional_order_and_trailing(self):
        with patch("trailing_bot.toss_trading.create_stop_conditional_order",
                   return_value={"conditionalOrderId": "C1"}) as create:
            row = self._register("130000", dry_run=False)
        create.assert_called_once()
        self.assertEqual(row["state"], TRAILING)
        self.assertEqual(row["conditional_order_id"], "C1")

    def test_confirm_executes_market_sell(self):
        row = self._register("115000")   # AWAITING_CONFIRM
        with patch("trailing_bot.toss_trading.place_market_sell") as sell:
            out = self.bot.confirm(row["id"])
        sell.assert_called_once()
        self.assertEqual(out["state"], TRIGGERED)

    def test_confirm_requires_awaiting_state(self):
        row = self._register("130000")   # ARMED
        with self.assertRaises(ValueError):
            self.bot.confirm(row["id"])

    def test_reject_cancels(self):
        row = self._register("115000")
        out = self.bot.reject(row["id"])
        self.assertEqual(out["state"], CANCELLED)

    def test_cancel_sets_cancelled(self):
        row = self._register("130000")
        out = self.bot.cancel(row["id"])
        self.assertEqual(out["state"], CANCELLED)

    def test_halt_and_resume(self):
        row = self._register("130000")   # ARMED
        self.bot.halt()
        self.assertEqual(self.bot.get(row["id"])["state"], HALTED)
        self.bot.resume()
        self.assertEqual(self.bot.get(row["id"])["state"], ARMED)

    def test_tick_modifies_stop_on_new_peak(self):
        # TRAILING 상태로 만들기 (live 등록)
        with patch("trailing_bot.toss_trading.create_stop_conditional_order",
                   return_value={"conditionalOrderId": "C1"}):
            row = self._register("130000", dry_run=False)
        self.assertEqual(row["state"], TRAILING)
        # 신고점 150000 → stop 127500 로 modify
        with patch.object(self.bot, "_fetch_price", return_value="150000"), \
             patch("trailing_bot.toss_trading.modify_stop_trigger") as modify:
            self.bot.tick(force=True)
        modify.assert_called_once()
        updated = self.bot.get(row["id"])
        self.assertEqual(updated["peak_price"], "150000")
        self.assertEqual(updated["stop_price"], "127500")

    def test_tick_backup_sell_triggers(self):
        with patch("trailing_bot.toss_trading.create_stop_conditional_order",
                   return_value={"conditionalOrderId": "C1"}):
            row = self._register("130000", dry_run=False)
        with patch.object(self.bot, "_fetch_price", return_value="115000"), \
             patch("trailing_bot.toss_trading.place_market_sell") as sell:
            self.bot.tick(force=True)
        sell.assert_called_once()
        self.assertEqual(self.bot.get(row["id"])["state"], TRIGGERED)

    def test_tick_skipped_outside_session(self):
        with patch("trailing_bot.is_regular_session", return_value=False):
            out = self.bot.tick()
        self.assertIn("skipped", out)

    def test_circuit_breaker_halts_after_failures(self):
        with patch("trailing_bot.toss_trading.create_stop_conditional_order",
                   return_value={"conditionalOrderId": "C1"}):
            row = self._register("130000", dry_run=False)
        # modify가 매번 예외 → fail_count 누적 → MAX_CONSEC_FAILURES 도달 시 HALTED
        with patch.object(self.bot, "_fetch_price", return_value="150000"), \
             patch("trailing_bot.toss_trading.modify_stop_trigger", side_effect=RuntimeError("boom")):
            for _ in range(trailing_bot.MAX_CONSEC_FAILURES):
                self.bot.tick(force=True)
        self.assertEqual(self.bot.get(row["id"])["state"], HALTED)


# ── 라우터 통합(TestClient) ────────────────────────────────────────────────────
class RouterTests(unittest.TestCase):
    def setUp(self):
        import bot_router
        from fastapi import FastAPI
        from fastapi.testclient import TestClient
        self.tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
        self.tmp.close()
        self._orig_db = trailing_bot.DB_PATH
        trailing_bot.DB_PATH = self.tmp.name
        trailing_bot.init_db()
        # 라우터는 모듈 전역 bot 싱글톤을 사용 → 격리 위해 새 인스턴스로 교체
        self._orig_bot = trailing_bot.bot
        trailing_bot.bot = TrailingBot()
        app = FastAPI()
        app.include_router(bot_router.router)
        self.client = TestClient(app)

    def tearDown(self):
        trailing_bot.bot = self._orig_bot
        trailing_bot.DB_PATH = self._orig_db
        os.unlink(self.tmp.name)

    def _register(self, price, **body):
        with patch.object(trailing_bot.bot, "_fetch_peak", return_value=("137300", "2026-11-03")), \
             patch.object(trailing_bot.bot, "_fetch_price", return_value=price):
            return self.client.post("/api/bot/stops", json={
                "account_seq": 1, "symbol": "053800", "quantity": "10",
                "name": "안랩", "dry_run": True, **body})

    def test_register_and_list(self):
        resp = self._register("130000")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["state"], ARMED)
        lst = self.client.get("/api/bot/stops")
        self.assertEqual(lst.status_code, 200)
        self.assertEqual(len(lst.json()["items"]), 1)
        self.assertEqual(lst.headers["cache-control"], "no-store")

    def test_pending_confirm_flow(self):
        reg = self._register("115000")   # AWAITING_CONFIRM
        sid = reg.json()["id"]
        pend = self.client.get("/api/bot/pending-confirms")
        self.assertEqual(len(pend.json()["items"]), 1)
        with patch("trailing_bot.toss_trading.place_market_sell"):
            conf = self.client.post(f"/api/bot/stops/{sid}/confirm")
        self.assertEqual(conf.status_code, 200)
        self.assertEqual(conf.json()["state"], TRIGGERED)

    def test_reject_flow(self):
        sid = self._register("115000").json()["id"]
        resp = self.client.post(f"/api/bot/stops/{sid}/reject")
        self.assertEqual(resp.json()["state"], CANCELLED)

    def test_cancel_and_halt_resume(self):
        sid = self._register("130000").json()["id"]
        self.client.delete(f"/api/bot/stops/{sid}")
        self.assertEqual(self.client.get("/api/bot/stops").json()["items"][0]["state"], CANCELLED)
        # 새 등록 후 halt/resume
        sid2 = self._register("131000").json()["id"]
        self.client.post("/api/bot/halt")
        self.assertEqual(trailing_bot.bot.get(sid2)["state"], HALTED)
        self.client.post("/api/bot/resume")
        self.assertEqual(trailing_bot.bot.get(sid2)["state"], ARMED)

    def test_invalid_symbol_rejected(self):
        resp = self.client.post("/api/bot/stops", json={
            "account_seq": 1, "symbol": "bad symbol!", "quantity": "10"})
        self.assertEqual(resp.status_code, 422)

    def test_confirm_non_awaiting_returns_400(self):
        sid = self._register("130000").json()["id"]   # ARMED
        resp = self.client.post(f"/api/bot/stops/{sid}/confirm")
        self.assertEqual(resp.status_code, 400)


if __name__ == "__main__":
    unittest.main()
