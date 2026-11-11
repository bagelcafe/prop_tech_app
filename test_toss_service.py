import os
import unittest
from unittest.mock import Mock, patch

from fastapi import FastAPI, Response
from fastapi.testclient import TestClient
import toss_service


def response(data, status=200):
    return Mock(ok=status < 400, status_code=status, json=Mock(return_value=data))


class TossServiceTests(unittest.TestCase):
    def setUp(self):
        toss_service._token = None
        toss_service._token_expires_at = 0

    @patch.dict(os.environ, {"Toss_client_id": "client", "Toss_secret_key": "secret"})
    @patch("toss_service.requests.get")
    @patch("toss_service.requests.post")
    def test_stock_and_price_share_token(self, post, get):
        post.return_value = response({"access_token": "token", "expires_in": 3600})
        get.side_effect = [response({"result": [{"symbol": "005930"}]}), response({"result": [{"lastPrice": "72000"}]})]
        result = toss_service.get_stock("005930")
        self.assertEqual(result["stock"]["symbol"], "005930")
        self.assertEqual(result["price"]["lastPrice"], "72000")
        self.assertEqual(post.call_count, 1)
        self.assertEqual(get.call_count, 2)

    @patch.dict(os.environ, {"Toss_client_id": "client", "Toss_secret_key": "secret"})
    @patch("toss_service.requests.get")
    @patch("toss_service.requests.post")
    def test_revoked_token_is_replaced_once(self, post, get):
        post.side_effect = [response({"access_token": "old", "expires_in": 3600}), response({"access_token": "new", "expires_in": 3600})]
        get.side_effect = [response({}, 401), response({"result": [{"symbol": "AAPL"}]})]
        self.assertEqual(toss_service.get_market_data("/api/v1/stocks", "AAPL")[0]["symbol"], "AAPL")
        self.assertEqual(post.call_count, 2)
        self.assertEqual(get.call_args.kwargs["headers"]["Authorization"], "Bearer new")

    @patch("toss_service.get_toss_data")
    def test_holdings_fetches_each_account_without_exposing_account_numbers(self, get_data):
        get_data.side_effect = [
            [{"accountSeq": 1, "accountNo": "private"}, {"accountSeq": 2}],
            {"items": [{"symbol": "AAPL", "quantity": "0.5", "currency": "USD", "marketValue": {"purchaseAmount": "100.5", "amount": "120.5"}}]},
            {"items": []},
            {"rate": "1400"},
        ]
        result = toss_service.get_holdings(Response())
        self.assertEqual(result["accounts"][0]["items"][0]["quantity"], "0.5")
        self.assertNotIn("accountNo", result["accounts"][0])
        self.assertEqual(get_data.call_args_list[1].kwargs["account_seq"], 1)
        self.assertEqual(get_data.call_args_list[2].kwargs["account_seq"], 2)
        self.assertEqual(result["exchange_rate"], "1400")
        self.assertEqual(result["total_buy_krw"], "140700.0")
        self.assertEqual(result["total_eval_krw"], "168700.0")

    @patch("toss_service.get_toss_data", return_value=[])
    def test_holdings_without_accounts(self, get_data):
        self.assertEqual(toss_service.get_holdings(Response()), {"accounts": [], "exchange_rate": None, "total_buy_krw": "0", "total_eval_krw": "0"})

    @patch("toss_service.get_toss_data")
    def test_krw_holdings_do_not_need_exchange_rate(self, get_data):
        get_data.side_effect = [[{"accountSeq": 1}], {"items": [{"currency": "KRW", "marketValue": {"purchaseAmount": "100", "amount": "120"}}]}]
        result = toss_service.get_holdings(Response())
        self.assertEqual(result["total_buy_krw"], "100")
        self.assertEqual(result["total_eval_krw"], "120")
        self.assertEqual(get_data.call_count, 2)

    @patch("toss_service.get_toss_data")
    def test_invalid_exchange_rate_rejects_summary(self, get_data):
        get_data.side_effect = [[{"accountSeq": 1}], {"items": [{"currency": "USD", "marketValue": {"purchaseAmount": "100", "amount": "120"}}]}, {"rate": "0"}]
        with self.assertRaises(toss_service.HTTPException) as error:
            toss_service.get_holdings(Response())
        self.assertEqual(error.exception.status_code, 502)

    @patch("toss_service.get_toss_data")
    def test_malformed_holding_rejects_summary(self, get_data):
        get_data.side_effect = [[{"accountSeq": 1}], {"items": [None]}]
        with self.assertRaises(toss_service.HTTPException) as error:
            toss_service.get_holdings(Response())
        self.assertEqual(error.exception.status_code, 502)

    @patch("toss_service.get_toss_data", return_value=[])
    def test_holdings_loads_without_access_key(self, get_data):
        app = FastAPI()
        app.include_router(toss_service.router)
        client = TestClient(app)
        response = client.get("/api/toss/holdings")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["accounts"], [])
        self.assertEqual(response.headers["cache-control"], "no-store")
        get_data.assert_called_once_with("/api/v1/accounts")


class WatchStopTests(unittest.TestCase):
    """매도 보호 감시가(120일 고점 -15%, 호가단위 보정) 순수 로직 검증."""

    def test_krx_tick_size_boundaries(self):
        from decimal import Decimal
        cases = {
            "1500": "1", "3000": "5", "15000": "10", "40000": "50",
            "137300": "100", "300000": "500", "700000": "1000",
        }
        for price, tick in cases.items():
            self.assertEqual(str(toss_service.krx_tick_size(Decimal(price))), tick, price)

    def test_round_down_to_tick(self):
        from decimal import Decimal
        # 116705 → 100원 단위 내림 → 116700
        self.assertEqual(str(toss_service.round_down_to_tick(Decimal("116705"))), "116700")

    def test_compute_watch_stop_anlab_example(self):
        # 안랩: 11/3 고점 137,300 → -15% = 116,705 → 호가단위 보정 116,700
        candles = [
            {"date": "2026-08-01", "high": "120000", "close": "119000"},
            {"date": "2026-10-15", "high": "130000", "close": "128000"},
            {"date": "2026-11-03", "high": "137300", "close": "135000"},
            {"date": "2026-11-10", "high": "121000", "close": "118500"},
        ]
        peak, peak_date, stop = toss_service.compute_watch_stop(candles)
        self.assertEqual(peak, "137300")
        self.assertEqual(peak_date, "2026-11-03")
        self.assertEqual(stop, "116700")

    def test_compute_watch_stop_window_limits_to_recent(self):
        # window=2면 최근 2개만 보고 고점 산출 (오래된 큰 고점 제외)
        candles = [
            {"date": "2026-01-01", "high": "200000", "close": "199000"},
            {"date": "2026-11-09", "high": "100000", "close": "99000"},
            {"date": "2026-11-10", "high": "110000", "close": "108000"},
        ]
        peak, _, stop = toss_service.compute_watch_stop(candles, window=2)
        self.assertEqual(peak, "110000")
        self.assertEqual(stop, "93500")  # 110000*0.85=93500

    def test_compute_watch_stop_skips_invalid_highs(self):
        candles = [
            {"date": "2026-11-09", "high": "0", "close": "0"},
            {"date": "2026-11-10", "high": "50000", "close": "49000"},
        ]
        peak, _, stop = toss_service.compute_watch_stop(candles)
        self.assertEqual(peak, "50000")
        self.assertEqual(stop, "42500")  # 50000*0.85=42500, 42500은 50원단위 OK

    def test_compute_watch_stop_empty_returns_none(self):
        self.assertIsNone(toss_service.compute_watch_stop([]))

    @patch("toss_service.get_toss_data")
    def test_watchlist_endpoint_returns_peak_and_stop(self, get_data):
        def side_effect(path, params=None, account_seq=None):
            if path == "/api/v1/prices":
                return [{"symbol": "053800", "lastPrice": "118000", "currency": "KRW"}]
            if path == "/api/v1/candles":
                return {"candles": [
                    {"timestamp": "2026-11-03T00:00:00", "highPrice": "137300", "closePrice": "135000"},
                    {"timestamp": "2026-11-10T00:00:00", "highPrice": "121000", "closePrice": "118500"},
                ]}
            raise AssertionError(path)
        get_data.side_effect = side_effect
        app = FastAPI()
        app.include_router(toss_service.router)
        client = TestClient(app)
        resp = client.get("/api/toss/watchlist")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.headers["cache-control"], "no-store")
        item = resp.json()["items"][0]
        self.assertEqual(item["symbol"], "053800")
        self.assertEqual(item["name"], "안랩")
        self.assertEqual(item["lastPrice"], "118000")
        self.assertEqual(item["peak"], "137300")
        self.assertEqual(item["peakDate"], "2026-11-03")
        self.assertEqual(item["stop"], "116700")


class ResampleCandleTests(unittest.TestCase):
    """토스 1m/1d 원본을 30분/주/월봉으로 집계하는 순수 로직 검증."""

    RAW_1D = [  # 최신→과거 순 (토스 원본 가정)
        {"timestamp": "2026-11-10T00:00:00", "openPrice": "100", "highPrice": "110", "lowPrice": "95", "closePrice": "108", "volume": "5"},
        {"timestamp": "2026-11-06T00:00:00", "openPrice": "90", "highPrice": "99", "lowPrice": "88", "closePrice": "98", "volume": "3"},
        {"timestamp": "2026-11-05T00:00:00", "openPrice": "85", "highPrice": "92", "lowPrice": "84", "closePrice": "90", "volume": "2"},
    ]

    def test_1d_passthrough_sorted_oldest_first(self):
        out = toss_service.resample_candles(self.RAW_1D, "1d")
        self.assertEqual([c["date"] for c in out], ["2026-11-05", "2026-11-06", "2026-11-10"])

    def test_weekly_buckets_by_monday(self):
        out = toss_service.resample_candles(self.RAW_1D, "1w")
        # 11/5,11/6 → 11/2 주, 11/10 → 11/9 주
        self.assertEqual([c["date"] for c in out], ["2026-11-02", "2026-11-09"])
        first = out[0]
        self.assertEqual(first["open"], "85")   # 가장 과거 open
        self.assertEqual(first["close"], "98")  # 버킷 내 최신 close
        self.assertEqual(first["high"], "99")   # 숫자 비교 max

    def test_monthly_bucket_aggregates_ohlc_numerically(self):
        out = toss_service.resample_candles(self.RAW_1D, "1M")
        self.assertEqual(len(out), 1)
        m = out[0]
        self.assertEqual(m["date"], "2026-11")
        self.assertEqual(m["open"], "85")
        self.assertEqual(m["high"], "110")   # 문자열 비교였다면 99가 나옴 (회귀 방지)
        self.assertEqual(m["low"], "84")
        self.assertEqual(m["close"], "108")
        self.assertEqual(m["volume"], "10")

    def test_30m_buckets_from_1m(self):
        raw_1m = [
            {"timestamp": "2026-11-10T09:45:00", "openPrice": "103", "highPrice": "106", "lowPrice": "102", "closePrice": "105", "volume": "2"},
            {"timestamp": "2026-11-10T09:15:00", "openPrice": "100", "highPrice": "104", "lowPrice": "99", "closePrice": "103", "volume": "3"},
            {"timestamp": "2026-11-10T09:05:00", "openPrice": "99", "highPrice": "101", "lowPrice": "98", "closePrice": "100", "volume": "1"},
        ]
        out = toss_service.resample_candles(raw_1m, "30m")
        self.assertEqual([c["date"] for c in out], ["2026-11-10 09:00", "2026-11-10 09:30"])
        self.assertEqual(out[0]["open"], "99")
        self.assertEqual(out[0]["close"], "103")
        self.assertEqual(out[0]["high"], "104")

    @patch("toss_service.get_toss_data")
    def test_candles_endpoint_interval_maps_source(self, get_data):
        captured = {}

        def side_effect(path, params=None, account_seq=None):
            captured["interval"] = params.get("interval")
            return {"candles": self.RAW_1D}
        get_data.side_effect = side_effect
        app = FastAPI()
        app.include_router(toss_service.router)
        client = TestClient(app)
        # 주봉 요청 → 원본은 1d로 조회
        resp = client.get("/api/toss/stocks/053800/candles?interval=1w")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(captured["interval"], "1d")
        # 30분봉 요청 → 원본은 1m로 조회
        client.get("/api/toss/stocks/053800/candles?interval=30m")
        self.assertEqual(captured["interval"], "1m")

    def test_candles_endpoint_rejects_bad_interval(self):
        app = FastAPI()
        app.include_router(toss_service.router)
        client = TestClient(app)
        resp = client.get("/api/toss/stocks/053800/candles?interval=5y")
        self.assertEqual(resp.status_code, 422)

    @patch("toss_service.get_toss_data")
    def test_30m_returns_recent_5_trading_days(self, get_data):
        from datetime import datetime, timedelta, timezone
        kst = timezone(timedelta(hours=9))
        now = datetime.now(kst)
        # 최근 8거래일치 1분봉 생성(주말 제외), 정규장 09:00~15:30
        days = []
        d = now
        while len(days) < 8:
            if d.weekday() < 5:
                days.append(d.strftime("%Y-%m-%d"))
            d -= timedelta(days=1)
        raw = []
        for dd in days:
            for hh in range(9, 16):
                for mm in (0, 30):
                    if hh == 15 and mm == 30:
                        continue
                    raw.append({"timestamp": f"{dd}T{hh:02d}:{mm:02d}:00",
                                "openPrice": "100", "highPrice": "110", "lowPrice": "90",
                                "closePrice": "105", "volume": "10"})
        raw.sort(key=lambda c: c["timestamp"], reverse=True)  # 최신→과거
        pages = [raw[i:i + 200] for i in range(0, len(raw), 200)]
        state = {"i": 0}

        def side_effect(path, params=None, account_seq=None):
            i = state["i"]
            state["i"] += 1
            page = pages[i] if i < len(pages) else []
            nb = None if i >= len(pages) - 1 else page[-1]["timestamp"]
            return {"candles": page, "nextBefore": nb}
        get_data.side_effect = side_effect

        app = FastAPI()
        app.include_router(toss_service.router)
        client = TestClient(app)
        resp = client.get("/api/toss/stocks/053800/candles?interval=30m")
        self.assertEqual(resp.status_code, 200)
        out = resp.json()
        dates = sorted({c["date"][:10] for c in out})
        self.assertEqual(len(dates), 5)            # 최근 5거래일만
        self.assertEqual(len(out), 65)             # 하루 13개 × 5일
        self.assertTrue(state["i"] >= 1)           # 페이지네이션 호출됨
        # 과거→최근 순 + 30분 라벨 형식
        self.assertLess(out[0]["date"], out[-1]["date"])
        self.assertRegex(out[0]["date"], r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$")


if __name__ == "__main__":
    unittest.main()