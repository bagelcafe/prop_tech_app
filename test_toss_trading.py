import os
import unittest
from unittest.mock import Mock, patch

from fastapi import HTTPException

import toss_trading


def response(data, status=200, content=b"{}"):
    return Mock(ok=status < 400, status_code=status,
                json=Mock(return_value=data), content=content)


class DryRunTests(unittest.TestCase):
    """BOT_DRY_RUN 기본값에서는 실제 HTTP 호출이 발생하지 않아야 한다."""

    @patch.dict(os.environ, {}, clear=False)
    def test_default_is_dry_run(self):
        os.environ.pop("BOT_DRY_RUN", None)
        self.assertTrue(toss_trading.is_dry_run())

    @patch.dict(os.environ, {"BOT_DRY_RUN": "1"})
    def test_explicit_one_is_dry_run(self):
        self.assertTrue(toss_trading.is_dry_run())

    @patch.dict(os.environ, {"BOT_DRY_RUN": "0"})
    def test_zero_is_live(self):
        self.assertFalse(toss_trading.is_dry_run())

    @patch("toss_trading.requests.post")
    def test_dry_run_does_not_call_http(self, post):
        plan = toss_trading.place_market_sell("053800", "10", 1, "trail-053800-x", dry_run=True)
        post.assert_not_called()
        self.assertTrue(plan["dry_run"])
        self.assertEqual(plan["body"]["symbol"], "053800")
        self.assertEqual(plan["body"]["side"], "SELL")
        self.assertEqual(plan["body"]["orderType"], "MARKET")

    @patch("toss_trading.requests.post")
    def test_conditional_dry_run_body_shape(self, post):
        plan = toss_trading.create_stop_conditional_order(
            "053800", "10", "116700", "2026-12-31", 1, "trail-053800-0001", dry_run=True)
        post.assert_not_called()
        body = plan["body"]
        self.assertEqual(body["type"], "SINGLE")
        self.assertEqual(body["orderType"], "MARKET")
        self.assertNotIn("orderPrice", body["first"])  # MARKET이면 orderPrice 미전달
        self.assertEqual(body["first"], {"orderSide": "SELL", "triggerPrice": "116700"})
        self.assertEqual(body["expireDate"], "2026-12-31")


class IdempotencyTests(unittest.TestCase):
    def test_invalid_client_order_id_rejected(self):
        for bad in ["", "has space", "x" * 37, "한글"]:
            with self.assertRaises(HTTPException) as ctx:
                toss_trading.place_market_sell("053800", "10", 1, bad, dry_run=True)
            self.assertEqual(ctx.exception.status_code, 400)

    def test_valid_client_order_id_accepted(self):
        plan = toss_trading.place_market_sell("053800", "10", 1, "trail-053800_0001", dry_run=True)
        self.assertTrue(plan["dry_run"])


class LiveOrderTests(unittest.TestCase):
    def setUp(self):
        toss_service_patch = patch("toss_trading.toss_service.get_token", return_value="tok")
        self.addCleanup(toss_service_patch.stop)
        toss_service_patch.start()

    @patch("toss_trading.requests.post")
    def test_live_market_sell_sends_body_and_account_header(self, post):
        post.return_value = response({"result": {"orderId": "O1", "clientOrderId": "cid"}})
        result = toss_trading.place_market_sell("053800", "10", 7, "cid", dry_run=False)
        self.assertEqual(result["orderId"], "O1")
        args, kwargs = post.call_args
        self.assertTrue(args[0].endswith("/api/v1/orders"))
        self.assertEqual(kwargs["json"]["clientOrderId"], "cid")
        self.assertEqual(kwargs["headers"]["X-Tossinvest-Account"], "7")

    @patch("toss_trading.requests.post")
    def test_live_conditional_create_returns_id(self, post):
        post.return_value = response({"result": {"conditionalOrderId": "C1", "clientOrderId": "cid"}})
        result = toss_trading.create_stop_conditional_order(
            "053800", "10", "116700", "2026-12-31", 1, "cid", dry_run=False)
        self.assertEqual(result["conditionalOrderId"], "C1")

    @patch("toss_trading.requests.post")
    def test_modify_sends_trigger(self, post):
        post.return_value = response({"result": {"conditionalOrderId": "C1"}})
        toss_trading.modify_stop_trigger("C1", "053800", "10", "127500", "2026-12-31", 1, dry_run=False)
        _, kwargs = post.call_args
        self.assertEqual(kwargs["json"]["first"]["triggerPrice"], "127500")

    @patch("toss_trading.toss_service.get_token")
    @patch("toss_trading.requests.post")
    def test_401_triggers_token_refresh_and_retry(self, post, get_token):
        get_token.side_effect = ["old", "new"]
        post.side_effect = [response({}, status=401), response({"result": {"orderId": "O2"}})]
        result = toss_trading.place_market_sell("053800", "10", 1, "cid", dry_run=False)
        self.assertEqual(result["orderId"], "O2")
        self.assertEqual(post.call_count, 2)
        # 재시도 시 새 토큰 사용
        self.assertEqual(post.call_args[1]["headers"]["Authorization"], "Bearer new")

    @patch("toss_trading.requests.post")
    def test_error_status_maps_to_422(self, post):
        post.return_value = response({}, status=422)
        with self.assertRaises(HTTPException) as ctx:
            toss_trading.place_market_sell("053800", "10", 1, "cid", dry_run=False)
        self.assertEqual(ctx.exception.status_code, 422)

    @patch("toss_trading.requests.delete")
    def test_cancel_conditional_order(self, delete):
        delete.return_value = response({"result": {"ok": True}}, content=b'{"result":{"ok":true}}')
        result = toss_trading.cancel_conditional_order("C1", 1, dry_run=False)
        self.assertTrue(delete.called)
        self.assertEqual(result, {"ok": True})


class SellableQuantityTests(unittest.TestCase):
    @patch("toss_trading.toss_service.get_toss_data")
    def test_sellable_quantity(self, get_data):
        get_data.return_value = {"sellableQuantity": "10"}
        self.assertEqual(toss_trading.get_sellable_quantity("053800", 1), "10")
        get_data.assert_called_once_with("/api/v1/sellable-quantity", params={"symbol": "053800"}, account_seq=1)

    @patch("toss_trading.toss_service.get_toss_data")
    def test_sellable_quantity_malformed_rejected(self, get_data):
        get_data.return_value = {}
        with self.assertRaises(HTTPException) as ctx:
            toss_trading.get_sellable_quantity("053800", 1)
        self.assertEqual(ctx.exception.status_code, 502)


if __name__ == "__main__":
    unittest.main()
