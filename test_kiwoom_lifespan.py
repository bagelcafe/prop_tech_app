"""Offline lifecycle regression tests; never use the live DB or broker APIs."""

import asyncio
import importlib
import os
import sqlite3
import tempfile
import threading
import unittest
from contextlib import ExitStack
from unittest.mock import AsyncMock, patch

import httpx
from fastapi.testclient import TestClient

import kiwoom_fastapi.main as kiwoom


class KiwoomLifespanTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.contexts = ExitStack()
        self.addCleanup(self.contexts.close)
        directory = self.contexts.enter_context(tempfile.TemporaryDirectory())
        self.db_path = os.path.join(directory, "trades.db")
        self.contexts.enter_context(patch.object(kiwoom, "DB_PATH", self.db_path))
        self.contexts.enter_context(patch.object(
            httpx.AsyncClient, "send", side_effect=AssertionError("Unexpected broker HTTP request")
        ))
        self.token = self.contexts.enter_context(
            patch.object(kiwoom, "fetch_access_token", new_callable=AsyncMock)
        )
        self.token.return_value = "test-token"
        self.started = asyncio.Event()
        self.stopped = asyncio.Event()
        self.scheduler = self.contexts.enter_context(
            patch.object(kiwoom, "snapshot_scheduler", new_callable=AsyncMock)
        )
        self.scheduler.side_effect = self.run_scheduler

    async def run_scheduler(self):
        self.started.set()
        try:
            await asyncio.Event().wait()
        finally:
            self.stopped.set()

    async def wait_for_scheduler(self):
        await asyncio.wait_for(self.started.wait(), timeout=2)

    async def test_schema_and_initialization_order_and_shutdown(self):
        async def fetch_token():
            with sqlite3.connect(self.db_path) as connection:
                tables = {row[0] for row in connection.execute(
                    "SELECT name FROM sqlite_master WHERE type='table'"
                )}
            self.assertTrue({"trades", "watchlist", "holdings", "asset_snapshots"} <= tables)
            self.scheduler.assert_not_called()
            return "test-token"

        self.token.side_effect = fetch_token
        async with kiwoom.app.router.lifespan_context(kiwoom.app):
            await self.wait_for_scheduler()
            task = kiwoom.app.state.snapshot_task
            self.assertFalse(task.done())
            self.token.assert_awaited_once()
            self.scheduler.assert_awaited_once()
        self.assertTrue(task.cancelled())
        self.assertTrue(self.stopped.is_set())
        self.assertIsNone(kiwoom.app.state.snapshot_task)
        self.assertFalse(kiwoom.app.state.lifecycle_active)

    async def test_duplicate_entry_is_rejected_and_restart_is_allowed(self):
        async with kiwoom.app.router.lifespan_context(kiwoom.app):
            await self.wait_for_scheduler()
            first_task = kiwoom.app.state.snapshot_task
            with self.assertRaisesRegex(RuntimeError, "already active"):
                async with kiwoom.app.router.lifespan_context(kiwoom.app):
                    self.fail("Duplicate lifespan entered")
            self.assertIs(kiwoom.app.state.snapshot_task, first_task)
            self.scheduler.assert_awaited_once()

        self.started.clear()
        async with kiwoom.app.router.lifespan_context(kiwoom.app):
            await self.wait_for_scheduler()
            self.assertIsNot(kiwoom.app.state.snapshot_task, first_task)
        self.assertEqual(self.scheduler.await_count, 2)

    async def test_token_failures_allow_database_operations(self):
        for error in (None, httpx.ConnectError("offline"), ValueError("invalid JSON")):
            with self.subTest(error=error):
                self.started.clear()
                self.token.side_effect = error
                self.token.return_value = ""
                with self.assertLogs(kiwoom.logger, level="WARNING"):
                    async with kiwoom.app.router.lifespan_context(kiwoom.app):
                        await self.wait_for_scheduler()
                        result = await kiwoom.upsert_holding(kiwoom.HoldingInput(
                            broker="mirae", stock_code="000660", stock_name="SK Hynix",
                            quantity=2, avg_buy_price=100000,
                        ))
                        self.assertEqual(result, {"success": True})
                        self.assertEqual(len((await kiwoom.get_holdings())["items"]), 1)

    async def test_database_failure_aborts_before_token_or_scheduler(self):
        with patch.object(kiwoom, "init_db", side_effect=sqlite3.OperationalError("unavailable")):
            with self.assertLogs(kiwoom.logger, level="ERROR"):
                with self.assertRaisesRegex(sqlite3.OperationalError, "unavailable"):
                    async with kiwoom.app.router.lifespan_context(kiwoom.app):
                        self.fail("Database failure must abort startup")
        self.token.assert_not_awaited()
        self.scheduler.assert_not_called()
        self.assertIsNone(kiwoom.app.state.snapshot_task)
        self.assertFalse(kiwoom.app.state.lifecycle_active)

        async with kiwoom.app.router.lifespan_context(kiwoom.app):
            await self.wait_for_scheduler()

    async def test_unexpected_token_error_and_cancellation_propagate(self):
        for error in (TypeError("unexpected"), asyncio.CancelledError()):
            with self.subTest(error=error):
                self.token.side_effect = error
                with self.assertRaises(type(error)):
                    async with kiwoom.app.router.lifespan_context(kiwoom.app):
                        self.fail("Startup error must propagate")
                self.scheduler.assert_not_called()
                self.assertIsNone(kiwoom.app.state.snapshot_task)
                self.assertFalse(kiwoom.app.state.lifecycle_active)

    async def test_body_failure_preserves_error_and_cleans_up(self):
        with self.assertRaisesRegex(ValueError, "body failed"):
            async with kiwoom.app.router.lifespan_context(kiwoom.app):
                await self.wait_for_scheduler()
                task = kiwoom.app.state.snapshot_task
                raise ValueError("body failed")
        self.assertTrue(task.cancelled())
        self.assertTrue(self.stopped.is_set())
        self.assertFalse(kiwoom.app.state.lifecycle_active)

    async def test_failed_scheduler_is_observed_without_masking_body_error(self):
        async def failed_scheduler():
            self.started.set()
            raise RuntimeError("scheduler failed")

        self.scheduler.side_effect = failed_scheduler
        with self.assertLogs(kiwoom.logger, level="ERROR") as captured:
            with self.assertRaisesRegex(ValueError, "body failed"):
                async with kiwoom.app.router.lifespan_context(kiwoom.app):
                    await self.wait_for_scheduler()
                    task = kiwoom.app.state.snapshot_task
                    self.assertTrue(task.done())
                    raise ValueError("body failed")
        self.assertIn("scheduler failed", "\n".join(captured.output))
        self.assertIsInstance(task.exception(), RuntimeError)
        self.assertIsNone(kiwoom.app.state.snapshot_task)
        self.assertFalse(kiwoom.app.state.lifecycle_active)

    async def test_owner_cancellation_awaits_scheduler_cleanup(self):
        async def run_lifespan():
            async with kiwoom.app.router.lifespan_context(kiwoom.app):
                await asyncio.Event().wait()

        owner = asyncio.create_task(run_lifespan())
        try:
            await self.wait_for_scheduler()
            task = kiwoom.app.state.snapshot_task
        finally:
            owner.cancel()
            with self.assertRaises(asyncio.CancelledError):
                await owner
        self.assertTrue(task.cancelled())
        self.assertTrue(self.stopped.is_set())
        self.assertIsNone(kiwoom.app.state.snapshot_task)
        self.assertFalse(kiwoom.app.state.lifecycle_active)


class AssetLifecycleIntegrationTests(unittest.TestCase):
    def setUp(self):
        self.contexts = ExitStack()
        self.addCleanup(self.contexts.close)
        directory = self.contexts.enter_context(tempfile.TemporaryDirectory())
        self.db_path = os.path.join(directory, "trades.db")
        self.contexts.enter_context(patch.object(kiwoom, "DB_PATH", self.db_path))
        with patch.dict(os.environ, {"APP_DATA_DIR": directory}):
            self.root = importlib.import_module("main")
        self.contexts.enter_context(patch.object(self.root, "get_today_logger"))
        self.contexts.enter_context(patch.object(self.root.stats_service, "record_request"))
        self.contexts.enter_context(patch.object(
            httpx.AsyncClient, "send", side_effect=AssertionError("Unexpected broker HTTP request")
        ))
        self.token = self.contexts.enter_context(patch.object(
            kiwoom, "fetch_access_token", new_callable=AsyncMock, return_value="test-token"
        ))
        self.price = self.contexts.enter_context(patch.object(
            kiwoom, "_fetch_current_price", new_callable=AsyncMock, return_value=200000
        ))
        self.started = threading.Event()
        self.stopped = threading.Event()
        self.scheduler = self.contexts.enter_context(patch.object(
            kiwoom, "snapshot_scheduler", new_callable=AsyncMock, side_effect=self.run_scheduler
        ))

    async def run_scheduler(self):
        self.started.set()
        try:
            await asyncio.Event().wait()
        finally:
            self.stopped.set()

    def test_root_initializes_database_and_asset_endpoints(self):
        payload = {
            "broker": "mirae", "stock_code": "000660", "stock_name": "SK Hynix",
            "quantity": 2, "avg_buy_price": 100000,
        }
        with TestClient(self.root.app) as client:
            self.assertTrue(self.started.wait(timeout=2))
            task = kiwoom.app.state.snapshot_task
            self.token.assert_awaited_once()
            self.scheduler.assert_awaited_once()
            self.assertEqual(client.post("/kiwoom/api/holdings", json=payload).status_code, 200)
            payload.update(quantity=3, avg_buy_price=150000)
            self.assertEqual(client.post("/kiwoom/api/holdings", json=payload).status_code, 200)
            response = client.get("/kiwoom/api/holdings")
            self.assertEqual(response.status_code, 200)
            items = response.json()["items"]
            self.assertEqual(len(items), 1)
            self.assertEqual(items[0]["quantity"], 3)
            self.assertEqual(items[0]["avg_buy_price"], 150000)
            response = client.get("/kiwoom/api/assets/summary")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json()["brokers"]["mirae"]["total_eval_amount"], 600000)
            response = client.get("/kiwoom/api/assets/trend")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json()["series"], [])
        self.assertTrue(task.cancelled())
        self.assertTrue(self.stopped.is_set())
        self.assertIsNone(kiwoom.app.state.snapshot_task)

    def test_child_standalone_initializes_database(self):
        with TestClient(kiwoom.app) as client:
            self.assertTrue(self.started.wait(timeout=2))
            task = kiwoom.app.state.snapshot_task
            self.assertEqual(client.get("/api/holdings").status_code, 200)
            self.token.assert_awaited_once()
            self.scheduler.assert_awaited_once()
        self.assertTrue(task.cancelled())

    def test_existing_rows_survive_initialization_and_restart(self):
        kiwoom.init_db()
        with sqlite3.connect(self.db_path) as connection:
            connection.execute("DROP TABLE holdings")
            connection.execute("DROP TABLE asset_snapshots")
            connection.execute(
                "INSERT INTO watchlist (stock_code, stock_name, added_at) VALUES (?, ?, ?)",
                ("000660", "SK Hynix", "2026-10-01"),
            )
            connection.execute(
                """INSERT INTO trades
                   (stock_code, stock_name, trade_type, quantity, price, amount, trade_date, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                ("000660", "SK Hynix", "buy", 2, 100000, 200000, "20261001", "2026-10-01"),
            )
        for _ in range(2):
            with TestClient(self.root.app) as client:
                self.assertEqual(client.get("/kiwoom/api/holdings").status_code, 200)
                with sqlite3.connect(self.db_path) as connection:
                    self.assertEqual(connection.execute("SELECT COUNT(*) FROM trades").fetchone()[0], 1)
                    self.assertEqual(connection.execute("SELECT COUNT(*) FROM watchlist").fetchone()[0], 1)
                    self.assertEqual(connection.execute("SELECT COUNT(*) FROM asset_snapshots").fetchone()[0], 0)


if __name__ == "__main__":
    unittest.main()