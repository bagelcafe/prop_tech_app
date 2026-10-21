# 키움 REST API 문서

> 이 문서는 `키움 REST API 문서.xlsx` 엑셀 파일에서 자동 생성되었습니다.

---

## 📋 목차

- [API 전체 리스트](#api-전체-리스트)
- [OAuth 인증](#OAuth-인증)
  - [접근토큰발급](#접근토큰발급)
  - [접근토큰폐기](#접근토큰폐기)
- [국내주식](#국내주식)
  - [계좌](#계좌)
  - [종목정보](#종목정보)
  - [시세](#시세)
  - [기관/외국인](#기관외국인)
  - [업종](#업종)
  - [공매도](#공매도)
  - [순위정보](#순위정보)
  - [ELW](#ELW)
  - [차트](#차트)
  - [대차거래](#대차거래)
  - [조건검색](#조건검색)
  - [ETF](#ETF)
  - [테마](#테마)
  - [주문](#주문)
  - [신용주문](#신용주문)
  - [실시간시세](#실시간시세)
- [](#)
  - [](#)
- [오류코드](#오류코드)
- [API 상세 명세](#api-상세-명세)

---

## API 전체 리스트

총 **208개** API

| No. | API ID | API 명 | 대분류 | 중분류 | URL |
|-----|--------|--------|--------|--------|-----|
| 1 | `au10001` | 접근토큰 발급 | OAuth 인증 | 접근토큰발급 | `/oauth2/token` |
| 2 | `au10002` | 접근토큰폐기 | OAuth 인증 | 접근토큰폐기 | `/oauth2/revoke` |
| 3 | `ka00001` | 계좌번호조회 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 4 | `ka00198` | 실시간종목조회순위 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 5 | `ka01690` | 일별잔고수익률 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 6 | `ka10001` | 주식기본정보요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 7 | `ka10002` | 주식거래원요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 8 | `ka10003` | 체결정보요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 9 | `ka10004` | 주식호가요청 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 10 | `ka10005` | 주식일주월시분요청 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 11 | `ka10006` | 주식시분요청 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 12 | `ka10007` | 시세표성정보요청 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 13 | `ka10008` | 주식외국인종목별매매동향 | 국내주식 | 기관/외국인 | `/api/dostk/frgnistt` |
| 14 | `ka10009` | 주식기관요청 | 국내주식 | 기관/외국인 | `/api/dostk/frgnistt` |
| 15 | `ka10010` | 업종프로그램요청 | 국내주식 | 업종 | `/api/dostk/sect` |
| 16 | `ka10011` | 신주인수권전체시세요청 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 17 | `ka10013` | 신용매매동향요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 18 | `ka10014` | 공매도추이요청 | 국내주식 | 공매도 | `/api/dostk/shsa` |
| 19 | `ka10015` | 일별거래상세요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 20 | `ka10016` | 신고저가요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 21 | `ka10017` | 상하한가요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 22 | `ka10018` | 고저가근접요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 23 | `ka10019` | 가격급등락요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 24 | `ka10020` | 호가잔량상위요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 25 | `ka10021` | 호가잔량급증요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 26 | `ka10022` | 잔량율급증요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 27 | `ka10023` | 거래량급증요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 28 | `ka10024` | 거래량갱신요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 29 | `ka10025` | 매물대집중요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 30 | `ka10026` | 고저PER요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 31 | `ka10027` | 전일대비등락률상위요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 32 | `ka10028` | 시가대비등락률요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 33 | `ka10029` | 예상체결등락률상위요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 34 | `ka10030` | 당일거래량상위요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 35 | `ka10031` | 전일거래량상위요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 36 | `ka10032` | 거래대금상위요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 37 | `ka10033` | 신용비율상위요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 38 | `ka10034` | 외인기간별매매상위요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 39 | `ka10035` | 외인연속순매매상위요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 40 | `ka10036` | 외인한도소진율증가상위 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 41 | `ka10037` | 외국계창구매매상위요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 42 | `ka10038` | 종목별증권사순위요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 43 | `ka10039` | 증권사별매매상위요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 44 | `ka10040` | 당일주요거래원요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 45 | `ka10042` | 순매수거래원순위요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 46 | `ka10043` | 거래원매물대분석요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 47 | `ka10044` | 일별기관매매종목요청 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 48 | `ka10045` | 종목별기관매매추이요청 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 49 | `ka10046` | 체결강도추이시간별요청 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 50 | `ka10047` | 체결강도추이일별요청 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 51 | `ka10048` | ELW일별민감도지표요청 | 국내주식 | ELW | `/api/dostk/elw` |
| 52 | `ka10050` | ELW민감도지표요청 | 국내주식 | ELW | `/api/dostk/elw` |
| 53 | `ka10051` | 업종별투자자순매수요청 | 국내주식 | 업종 | `/api/dostk/sect` |
| 54 | `ka10052` | 거래원순간거래량요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 55 | `ka10053` | 당일상위이탈원요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 56 | `ka10054` | 변동성완화장치발동종목요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 57 | `ka10055` | 당일전일체결량요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 58 | `ka10058` | 투자자별일별매매종목요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 59 | `ka10059` | 종목별투자자기관별요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 60 | `ka10060` | 종목별투자자기관별차트요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 61 | `ka10061` | 종목별투자자기관별합계요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 62 | `ka10062` | 동일순매매순위요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 63 | `ka10063` | 장중투자자별매매요청 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 64 | `ka10064` | 장중투자자별매매차트요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 65 | `ka10065` | 장중투자자별매매상위요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 66 | `ka10066` | 장마감후투자자별매매요청 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 67 | `ka10068` | 대차거래추이요청 | 국내주식 | 대차거래 | `/api/dostk/slb` |
| 68 | `ka10069` | 대차거래상위10종목요청 | 국내주식 | 대차거래 | `/api/dostk/slb` |
| 69 | `ka10072` | 일자별종목별실현손익요청_일자 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 70 | `ka10073` | 일자별종목별실현손익요청_기간 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 71 | `ka10074` | 일자별실현손익요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 72 | `ka10075` | 미체결요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 73 | `ka10076` | 체결요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 74 | `ka10077` | 당일실현손익상세요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 75 | `ka10078` | 증권사별종목매매동향요청 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 76 | `ka10079` | 주식틱차트조회요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 77 | `ka10080` | 주식분봉차트조회요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 78 | `ka10081` | 주식일봉차트조회요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 79 | `ka10082` | 주식주봉차트조회요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 80 | `ka10083` | 주식월봉차트조회요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 81 | `ka10084` | 당일전일체결요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 82 | `ka10085` | 계좌수익률요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 83 | `ka10086` | 일별주가요청 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 84 | `ka10087` | 시간외단일가요청 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 85 | `ka10088` | 미체결 분할주문 상세 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 86 | `ka10094` | 주식년봉차트조회요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 87 | `ka10095` | 관심종목정보요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 88 | `ka10098` | 시간외단일가등락율순위요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 89 | `ka10099` | 종목정보 리스트 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 90 | `ka10100` | 종목정보 조회 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 91 | `ka10101` | 업종코드 리스트 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 92 | `ka10102` | 회원사 리스트 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 93 | `ka10131` | 기관외국인연속매매현황요청 | 국내주식 | 기관/외국인 | `/api/dostk/frgnistt` |
| 94 | `ka10170` | 당일매매일지요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 95 | `ka10171` | 조건검색 목록조회 | 국내주식 | 조건검색 | `/api/dostk/websocket` |
| 96 | `ka10172` | 조건검색 요청 일반 | 국내주식 | 조건검색 | `/api/dostk/websocket` |
| 97 | `ka10173` | 조건검색 요청 실시간 | 국내주식 | 조건검색 | `/api/dostk/websocket` |
| 98 | `ka10174` | 조건검색 실시간 해제 | 국내주식 | 조건검색 | `/api/dostk/websocket` |
| 99 | `ka20001` | 업종현재가요청 | 국내주식 | 업종 | `/api/dostk/sect` |
| 100 | `ka20002` | 업종별주가요청 | 국내주식 | 업종 | `/api/dostk/sect` |
| 101 | `ka20003` | 전업종지수요청 | 국내주식 | 업종 | `/api/dostk/sect` |
| 102 | `ka20004` | 업종틱차트조회요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 103 | `ka20005` | 업종분봉조회요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 104 | `ka20006` | 업종일봉조회요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 105 | `ka20007` | 업종주봉조회요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 106 | `ka20008` | 업종월봉조회요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 107 | `ka20009` | 업종현재가일별요청 | 국내주식 | 업종 | `/api/dostk/sect` |
| 108 | `ka20019` | 업종년봉조회요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 109 | `ka20068` | 대차거래추이요청(종목별) | 국내주식 | 대차거래 | `/api/dostk/slb` |
| 110 | `ka30001` | ELW가격급등락요청 | 국내주식 | ELW | `/api/dostk/elw` |
| 111 | `ka30002` | 거래원별ELW순매매상위요청 | 국내주식 | ELW | `/api/dostk/elw` |
| 112 | `ka30003` | ELWLP보유일별추이요청 | 국내주식 | ELW | `/api/dostk/elw` |
| 113 | `ka30004` | ELW괴리율요청 | 국내주식 | ELW | `/api/dostk/elw` |
| 114 | `ka30005` | ELW조건검색요청 | 국내주식 | ELW | `/api/dostk/elw` |
| 115 | `ka30009` | ELW등락율순위요청 | 국내주식 | ELW | `/api/dostk/elw` |
| 116 | `ka30010` | ELW잔량순위요청 | 국내주식 | ELW | `/api/dostk/elw` |
| 117 | `ka30011` | ELW근접율요청 | 국내주식 | ELW | `/api/dostk/elw` |
| 118 | `ka30012` | ELW종목상세정보요청 | 국내주식 | ELW | `/api/dostk/elw` |
| 119 | `ka40001` | ETF수익율요청 | 국내주식 | ETF | `/api/dostk/etf` |
| 120 | `ka40002` | ETF종목정보요청 | 국내주식 | ETF | `/api/dostk/etf` |
| 121 | `ka40003` | ETF일별추이요청 | 국내주식 | ETF | `/api/dostk/etf` |
| 122 | `ka40004` | ETF전체시세요청 | 국내주식 | ETF | `/api/dostk/etf` |
| 123 | `ka40006` | ETF시간대별추이요청 | 국내주식 | ETF | `/api/dostk/etf` |
| 124 | `ka40007` | ETF시간대별체결요청 | 국내주식 | ETF | `/api/dostk/etf` |
| 125 | `ka40008` | ETF일자별체결요청 | 국내주식 | ETF | `/api/dostk/etf` |
| 126 | `ka40009` | ETF시간대별체결요청 | 국내주식 | ETF | `/api/dostk/etf` |
| 127 | `ka40010` | ETF시간대별추이요청 | 국내주식 | ETF | `/api/dostk/etf` |
| 128 | `ka50010` | 금현물체결추이 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 129 | `ka50012` | 금현물일별추이 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 130 | `ka50079` | 금현물틱차트조회요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 131 | `ka50080` | 금현물분봉차트조회요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 132 | `ka50081` | 금현물일봉차트조회요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 133 | `ka50082` | 금현물주봉차트조회요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 134 | `ka50083` | 금현물월봉차트조회요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 135 | `ka50087` | 금현물예상체결 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 136 | `ka50091` | 금현물당일틱차트조회요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 137 | `ka50092` | 금현물당일분봉차트조회요청 | 국내주식 | 차트 | `/api/dostk/chart` |
| 138 | `ka50100` | 금현물 시세정보 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 139 | `ka50101` | 금현물 호가 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 140 | `ka52301` | 금현물투자자현황 | 국내주식 | 기관/외국인 | `/api/dostk/frgnistt` |
| 141 | `ka90001` | 테마그룹별요청 | 국내주식 | 테마 | `/api/dostk/thme` |
| 142 | `ka90002` | 테마구성종목요청 | 국내주식 | 테마 | `/api/dostk/thme` |
| 143 | `ka90003` | 프로그램순매수상위50요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 144 | `ka90004` | 종목별프로그램매매현황요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 145 | `ka90005` | 프로그램매매추이요청 시간대별 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 146 | `ka90006` | 프로그램매매차익잔고추이요청 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 147 | `ka90007` | 프로그램매매누적추이요청 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 148 | `ka90008` | 종목시간별프로그램매매추이요청 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 149 | `ka90009` | 외국인기관매매상위요청 | 국내주식 | 순위정보 | `/api/dostk/rkinfo` |
| 150 | `ka90010` | 프로그램매매추이요청 일자별 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 151 | `ka90012` | 대차거래내역요청 | 국내주식 | 대차거래 | `/api/dostk/slb` |
| 152 | `ka90013` | 종목일별프로그램매매추이요청 | 국내주식 | 시세 | `/api/dostk/mrkcond` |
| 153 | `kt00001` | 예수금상세현황요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 154 | `kt00002` | 일별추정예탁자산현황요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 155 | `kt00003` | 추정자산조회요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 156 | `kt00004` | 계좌평가현황요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 157 | `kt00005` | 체결잔고요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 158 | `kt00007` | 계좌별주문체결내역상세요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 159 | `kt00008` | 계좌별익일결제예정내역요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 160 | `kt00009` | 계좌별주문체결현황요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 161 | `kt00010` | 주문인출가능금액요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 162 | `kt00011` | 증거금율별주문가능수량조회요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 163 | `kt00012` | 신용보증금율별주문가능수량조회요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 164 | `kt00013` | 증거금세부내역조회요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 165 | `kt00015` | 위탁종합거래내역요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 166 | `kt00016` | 일별계좌수익률상세현황요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 167 | `kt00017` | 계좌별당일현황요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 168 | `kt00018` | 계좌평가잔고내역요청 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 169 | `kt10000` | 주식 매수주문 | 국내주식 | 주문 | `/api/dostk/ordr` |
| 170 | `kt10001` | 주식 매도주문 | 국내주식 | 주문 | `/api/dostk/ordr` |
| 171 | `kt10002` | 주식 정정주문 | 국내주식 | 주문 | `/api/dostk/ordr` |
| 172 | `kt10003` | 주식 취소주문 | 국내주식 | 주문 | `/api/dostk/ordr` |
| 173 | `kt10006` | 신용 매수주문 | 국내주식 | 신용주문 | `/api/dostk/crdordr` |
| 174 | `kt10007` | 신용 매도주문 | 국내주식 | 신용주문 | `/api/dostk/crdordr` |
| 175 | `kt10008` | 신용 정정주문 | 국내주식 | 신용주문 | `/api/dostk/crdordr` |
| 176 | `kt10009` | 신용 취소주문 | 국내주식 | 신용주문 | `/api/dostk/crdordr` |
| 177 | `kt20016` | 신용융자 가능종목요청 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 178 | `kt20017` | 신용융자 가능문의 | 국내주식 | 종목정보 | `/api/dostk/stkinfo` |
| 179 | `kt50000` | 금현물 매수주문 | 국내주식 | 주문 | `/api/dostk/ordr` |
| 180 | `kt50001` | 금현물 매도주문 | 국내주식 | 주문 | `/api/dostk/ordr` |
| 181 | `kt50002` | 금현물 정정주문 | 국내주식 | 주문 | `/api/dostk/ordr` |
| 182 | `kt50003` | 금현물 취소주문 | 국내주식 | 주문 | `/api/dostk/ordr` |
| 183 | `kt50020` | 금현물 잔고확인 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 184 | `kt50021` | 금현물 예수금 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 185 | `kt50030` | 금현물 주문체결전체조회 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 186 | `kt50031` | 금현물 주문체결조회 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 187 | `kt50032` | 금현물 거래내역조회 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 188 | `kt50075` | 금현물 미체결조회 | 국내주식 | 계좌 | `/api/dostk/acnt` |
| 189 | `00` | 주문체결 | 국내주식 | 실시간시세 | `/api/dostk/websocket` |
| 190 | `04` | 잔고 | 국내주식 | 실시간시세 | `/api/dostk/websocket` |
| 191 | `0A` | 주식기세 | 국내주식 | 실시간시세 | `/api/dostk/websocket` |
| 192 | `0B` | 주식체결 | 국내주식 | 실시간시세 | `/api/dostk/websocket` |
| 193 | `0C` | 주식우선호가 | 국내주식 | 실시간시세 | `/api/dostk/websocket` |
| 194 | `0D` | 주식호가잔량 | 국내주식 | 실시간시세 | `/api/dostk/websocket` |
| 195 | `0E` | 주식시간외호가 | 국내주식 | 실시간시세 | `/api/dostk/websocket` |
| 196 | `0F` | 주식당일거래원 | 국내주식 | 실시간시세 | `/api/dostk/websocket` |
| 197 | `0G` | ETF NAV | 국내주식 | 실시간시세 | `/api/dostk/websocket` |
| 198 | `0H` | 주식예상체결 | 국내주식 | 실시간시세 | `/api/dostk/websocket` |
| 199 | `0I` | 국제금환산가격 | 국내주식 | 실시간시세 | `/api/dostk/websocket` |
| 200 | `0J` | 업종지수 | 국내주식 | 실시간시세 | `/api/dostk/websocket` |
| 201 | `0U` | 업종등락 | 국내주식 | 실시간시세 | `/api/dostk/websocket` |
| 202 | `0g` | 주식종목정보 | 국내주식 | 실시간시세 | `/api/dostk/websocket` |
| 203 | `0m` | ELW 이론가 | 국내주식 | 실시간시세 | `/api/dostk/websocket` |
| 204 | `0s` | 장시작시간 | 국내주식 | 실시간시세 | `/api/dostk/websocket` |
| 205 | `0u` | ELW 지표 | 국내주식 | 실시간시세 | `/api/dostk/websocket` |
| 206 | `0w` | 종목프로그램매매 | 국내주식 | 실시간시세 | `/api/dostk/websocket` |
| 207 | `1h` | VI발동/해제 | 국내주식 | 실시간시세 | `/api/dostk/websocket` |
| 208 | `공통` | 오류코드 |  |  | `` |

---

## API 상세 명세

### 접근토큰 발급 (`au10001`)

- **메뉴 위치**: OAuth 인증 > 접근토큰발급 > 접근토큰 발급(au10001)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/oauth2/token`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `grant_type` | grant_type | String | Y |  | client_credentials 입력 |
| Body | `appkey` | 앱키 | String | Y |  |  |
| Body | `secretkey` | 시크릿키 | String | Y |  |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `expires_dt` | 만료일 | String | Y |  |  |
| Body | `token_type` | 토큰타입 | String | Y |  |  |
| Body | `token` | 접근토큰 | String | Y |  |  |

---

### 접근토큰폐기 (`au10002`)

- **메뉴 위치**: OAuth 인증 > 접근토큰폐기 > 접근토큰폐기(au10002)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/oauth2/revoke`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `appkey` | 앱키 | String | Y |  |  |
| Body | `secretkey` | 시크릿키 | String | Y |  |  |
| Body | `token` | 접근토큰 | String | Y |  |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

---

### 계좌번호조회 (`ka00001`)

- **메뉴 위치**: 국내주식 > 계좌 > 계좌번호조회(ka00001)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `acctNo` | 계좌번호 | String | N | 20 |  |

---

### 실시간종목조회순위 (`ka00198`)

- **메뉴 위치**: 국내주식 > 종목정보 > 실시간종목조회순위(ka00198)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `qry_tp` | 구분 | String | Y | 1 | 1:1분, 2:10분, 3:1시간, 4:당일 누적, 5:30초 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `item_inq_rank` | 실시간종목조회순위 | LIST | N |  |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- bigd_rank` | 빅데이터 순위 | String | N | 20 |  |
| Body | `- rank_chg` | 순위 등락 | String | N | 20 |  |
| Body | `- rank_chg_sign` | 순위 등락 부호 | String | N | 20 |  |
| Body | `- past_curr_prc` | 과거 현재가 | String | N | 20 |  |
| Body | `- base_comp_sign` | 기준가 대비 부호 | String | N | 20 |  |
| Body | `- base_comp_chgr` | 기준가 대비 등락율 | String | N | 20 |  |
| Body | `- prev_base_sign` | 직전 기준 대비 부호 | String | N | 20 |  |
| Body | `- prev_base_chgr` | 직전 기준 대비 등락율 | String | N | 20 |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- tm` | 시간 | String | N | 20 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |

---

### 일별잔고수익률 (`ka01690`)

- **메뉴 위치**: 국내주식 > 계좌 > 일별잔고수익률(ka01690)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `qry_dt` | 조회일자 | String | Y | 8 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dt` | 일자 | String | N | 20 |  |
| Body | `tot_buy_amt` | 총 매입가 | String | N | 20 |  |
| Body | `tot_evlt_amt` | 총 평가금액 | String | N | 20 |  |
| Body | `tot_evltv_prft` | 총 평가손익 | String | N | 20 |  |
| Body | `tot_prft_rt` | 수익률 | String | N | 20 |  |
| Body | `dbst_bal` | 예수금 | String | N | 20 |  |
| Body | `day_stk_asst` | 추정자산 | String | N | 20 |  |
| Body | `buy_wght` | 현금비중 | String | N | 20 |  |
| Body | `day_bal_rt` | 일별잔고수익률 | LIST | N |  |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 20 |  |
| Body | `- rmnd_qty` | 보유 수량 | String | N | 20 |  |
| Body | `- buy_uv` | 매입 단가 | String | N | 20 |  |
| Body | `- buy_wght` | 매수비중 | String | N | 20 |  |
| Body | `- evltv_prft` | 평가손익 | String | N | 20 |  |
| Body | `- prft_rt` | 수익률 | String | N | 20 |  |
| Body | `- evlt_amt` | 평가금액 | String | N | 20 |  |
| Body | `- evlt_wght` | 평가비중 | String | N | 20 |  |

---

### 주식기본정보요청 (`ka10001`)

- **메뉴 위치**: 국내주식 > 종목정보 > 주식기본정보요청(ka10001)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `stk_nm` | 종목명 | String | N | 40 |  |
| Body | `setl_mm` | 결산월 | String | N | 20 |  |
| Body | `fav` | 액면가 | String | N | 20 |  |
| Body | `cap` | 자본금 | String | N | 20 |  |
| Body | `flo_stk` | 상장주식 | String | N | 20 |  |
| Body | `crd_rt` | 신용비율 | String | N | 20 |  |
| Body | `oyr_hgst` | 연중최고 | String | N | 20 |  |
| Body | `oyr_lwst` | 연중최저 | String | N | 20 |  |
| Body | `mac` | 시가총액 | String | N | 20 |  |
| Body | `mac_wght` | 시가총액비중 | String | N | 20 |  |
| Body | `for_exh_rt` | 외인소진률 | String | N | 20 |  |
| Body | `repl_pric` | 대용가 | String | N | 20 |  |
| Body | `per` | PER | String | N | 20 | [ 주의 ] PER, ROE 값들은 외부벤더사에서 제공되는 데이터이며 일주일에 한번 또는 실적발표 시즌에 업데이트 됨 |
| Body | `eps` | EPS | String | N | 20 |  |
| Body | `roe` | ROE | String | N | 20 | [ 주의 ]  PER, ROE 값들은 외부벤더사에서 제공되는 데이터이며 일주일에 한번 또는 실적발표 시즌에 업데이트 됨 |
| Body | `pbr` | PBR | String | N | 20 |  |
| Body | `ev` | EV | String | N | 20 |  |
| Body | `bps` | BPS | String | N | 20 |  |
| Body | `sale_amt` | 매출액 | String | N | 20 |  |
| Body | `bus_pro` | 영업이익 | String | N | 20 |  |
| Body | `cup_nga` | 당기순이익 | String | N | 20 |  |
| Body | `250hgst` | 250최고 | String | N | 20 |  |
| Body | `250lwst` | 250최저 | String | N | 20 |  |
| Body | `open_pric` | 시가 | String | N | 20 |  |
| Body | `high_pric` | 고가 | String | N | 20 |  |
| Body | `low_pric` | 저가 | String | N | 20 |  |
| Body | `upl_pric` | 상한가 | String | N | 20 |  |
| Body | `lst_pric` | 하한가 | String | N | 20 |  |
| Body | `base_pric` | 기준가 | String | N | 20 |  |
| Body | `exp_cntr_pric` | 예상체결가 | String | N | 20 |  |
| Body | `exp_cntr_qty` | 예상체결수량 | String | N | 20 |  |
| Body | `250hgst_pric_dt` | 250최고가일 | String | N | 20 |  |
| Body | `250hgst_pric_pre_rt` | 250최고가대비율 | String | N | 20 |  |
| Body | `250lwst_pric_dt` | 250최저가일 | String | N | 20 |  |
| Body | `250lwst_pric_pre_rt` | 250최저가대비율 | String | N | 20 |  |
| Body | `cur_prc` | 현재가 | String | N | 20 |  |
| Body | `pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `flu_rt` | 등락율 | String | N | 20 |  |
| Body | `trde_qty` | 거래량 | String | N | 20 |  |
| Body | `trde_pre` | 거래대비 | String | N | 20 |  |
| Body | `fav_unit` | 액면가단위 | String | N | 20 |  |
| Body | `dstr_stk` | 유통주식 | String | N | 20 |  |
| Body | `dstr_rt` | 유통비율 | String | N | 20 |  |

---

### 주식거래원요청 (`ka10002`)

- **메뉴 위치**: 국내주식 > 종목정보 > 주식거래원요청(ka10002)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `stk_nm` | 종목명 | String | N | 40 |  |
| Body | `cur_prc` | 현재가 | String | N | 20 |  |
| Body | `flu_smbol` | 등락부호 | String | N | 20 |  |
| Body | `base_pric` | 기준가 | String | N | 20 |  |
| Body | `pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `flu_rt` | 등락율 | String | N | 20 |  |
| Body | `sel_trde_ori_nm_1` | 매도거래원명1 | String | N | 20 |  |
| Body | `sel_trde_ori_1` | 매도거래원1 | String | N | 20 |  |
| Body | `sel_trde_qty_1` | 매도거래량1 | String | N | 20 |  |
| Body | `buy_trde_ori_nm_1` | 매수거래원명1 | String | N | 20 |  |
| Body | `buy_trde_ori_1` | 매수거래원1 | String | N | 20 |  |
| Body | `buy_trde_qty_1` | 매수거래량1 | String | N | 20 |  |
| Body | `sel_trde_ori_nm_2` | 매도거래원명2 | String | N | 20 |  |
| Body | `sel_trde_ori_2` | 매도거래원2 | String | N | 20 |  |
| Body | `sel_trde_qty_2` | 매도거래량2 | String | N | 20 |  |
| Body | `buy_trde_ori_nm_2` | 매수거래원명2 | String | N | 20 |  |
| Body | `buy_trde_ori_2` | 매수거래원2 | String | N | 20 |  |
| Body | `buy_trde_qty_2` | 매수거래량2 | String | N | 20 |  |
| Body | `sel_trde_ori_nm_3` | 매도거래원명3 | String | N | 20 |  |
| Body | `sel_trde_ori_3` | 매도거래원3 | String | N | 20 |  |
| Body | `sel_trde_qty_3` | 매도거래량3 | String | N | 20 |  |
| Body | `buy_trde_ori_nm_3` | 매수거래원명3 | String | N | 20 |  |
| Body | `buy_trde_ori_3` | 매수거래원3 | String | N | 20 |  |
| Body | `buy_trde_qty_3` | 매수거래량3 | String | N | 20 |  |
| Body | `sel_trde_ori_nm_4` | 매도거래원명4 | String | N | 20 |  |
| Body | `sel_trde_ori_4` | 매도거래원4 | String | N | 20 |  |
| Body | `sel_trde_qty_4` | 매도거래량4 | String | N | 20 |  |
| Body | `buy_trde_ori_nm_4` | 매수거래원명4 | String | N | 20 |  |
| Body | `buy_trde_ori_4` | 매수거래원4 | String | N | 20 |  |
| Body | `buy_trde_qty_4` | 매수거래량4 | String | N | 20 |  |
| Body | `sel_trde_ori_nm_5` | 매도거래원명5 | String | N | 20 |  |
| Body | `sel_trde_ori_5` | 매도거래원5 | String | N | 20 |  |
| Body | `sel_trde_qty_5` | 매도거래량5 | String | N | 20 |  |
| Body | `buy_trde_ori_nm_5` | 매수거래원명5 | String | N | 20 |  |
| Body | `buy_trde_ori_5` | 매수거래원5 | String | N | 20 |  |
| Body | `buy_trde_qty_5` | 매수거래량5 | String | N | 20 |  |

---

### 체결정보요청 (`ka10003`)

- **메뉴 위치**: 국내주식 > 종목정보 > 체결정보요청(ka10003)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `cntr_infr` | 체결정보 | LIST | N |  |  |
| Body | `- tm` | 시간 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- pre_rt` | 대비율 | String | N | 20 |  |
| Body | `- pri_sel_bid_unit` | 우선매도호가단위 | String | N | 20 |  |
| Body | `- pri_buy_bid_unit` | 우선매수호가단위 | String | N | 20 |  |
| Body | `- cntr_trde_qty` | 체결거래량 | String | N | 20 |  |
| Body | `- sign` | sign | String | N | 20 |  |
| Body | `- acc_trde_qty` | 누적거래량 | String | N | 20 |  |
| Body | `- acc_trde_prica` | 누적거래대금 | String | N | 20 |  |
| Body | `- cntr_str` | 체결강도 | String | N | 20 |  |
| Body | `- stex_tp` | 거래소구분 | String | N | 20 | KRX , NXT , 통합 |

---

### 주식호가요청 (`ka10004`)

- **메뉴 위치**: 국내주식 > 시세 > 주식호가요청(ka10004)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `bid_req_base_tm` | 호가잔량기준시간 | String | N | 20 | 호가시간 |
| Body | `sel_10th_pre_req_pre` | 매도10차선잔량대비 | String | N | 20 | 매도호가직전대비10 |
| Body | `sel_10th_pre_req` | 매도10차선잔량 | String | N | 20 | 매도호가수량10 |
| Body | `sel_10th_pre_bid` | 매도10차선호가 | String | N | 20 | 매도호가10 |
| Body | `sel_9th_pre_req_pre` | 매도9차선잔량대비 | String | N | 20 | 매도호가직전대비9 |
| Body | `sel_9th_pre_req` | 매도9차선잔량 | String | N | 20 | 매도호가수량9 |
| Body | `sel_9th_pre_bid` | 매도9차선호가 | String | N | 20 | 매도호가9 |
| Body | `sel_8th_pre_req_pre` | 매도8차선잔량대비 | String | N | 20 | 매도호가직전대비8 |
| Body | `sel_8th_pre_req` | 매도8차선잔량 | String | N | 20 | 매도호가수량8 |
| Body | `sel_8th_pre_bid` | 매도8차선호가 | String | N | 20 | 매도호가8 |
| Body | `sel_7th_pre_req_pre` | 매도7차선잔량대비 | String | N | 20 | 매도호가직전대비7 |
| Body | `sel_7th_pre_req` | 매도7차선잔량 | String | N | 20 | 매도호가수량7 |
| Body | `sel_7th_pre_bid` | 매도7차선호가 | String | N | 20 | 매도호가7 |
| Body | `sel_6th_pre_req_pre` | 매도6차선잔량대비 | String | N | 20 | 매도호가직전대비6 |
| Body | `sel_6th_pre_req` | 매도6차선잔량 | String | N | 20 | 매도호가수량6 |
| Body | `sel_6th_pre_bid` | 매도6차선호가 | String | N | 20 | 매도호가6 |
| Body | `sel_5th_pre_req_pre` | 매도5차선잔량대비 | String | N | 20 | 매도호가직전대비5 |
| Body | `sel_5th_pre_req` | 매도5차선잔량 | String | N | 20 | 매도호가수량5 |
| Body | `sel_5th_pre_bid` | 매도5차선호가 | String | N | 20 | 매도호가5 |
| Body | `sel_4th_pre_req_pre` | 매도4차선잔량대비 | String | N | 20 | 매도호가직전대비4 |
| Body | `sel_4th_pre_req` | 매도4차선잔량 | String | N | 20 | 매도호가수량4 |
| Body | `sel_4th_pre_bid` | 매도4차선호가 | String | N | 20 | 매도호가4 |
| Body | `sel_3th_pre_req_pre` | 매도3차선잔량대비 | String | N | 20 | 매도호가직전대비3 |
| Body | `sel_3th_pre_req` | 매도3차선잔량 | String | N | 20 | 매도호가수량3 |
| Body | `sel_3th_pre_bid` | 매도3차선호가 | String | N | 20 | 매도호가3 |
| Body | `sel_2th_pre_req_pre` | 매도2차선잔량대비 | String | N | 20 | 매도호가직전대비2 |
| Body | `sel_2th_pre_req` | 매도2차선잔량 | String | N | 20 | 매도호가수량2 |
| Body | `sel_2th_pre_bid` | 매도2차선호가 | String | N | 20 | 매도호가2 |
| Body | `sel_1th_pre_req_pre` | 매도1차선잔량대비 | String | N | 20 | 매도호가직전대비1 |
| Body | `sel_fpr_req` | 매도최우선잔량 | String | N | 20 | 매도호가수량1 |
| Body | `sel_fpr_bid` | 매도최우선호가 | String | N | 20 | 매도호가1 |
| Body | `buy_fpr_bid` | 매수최우선호가 | String | N | 20 | 매수호가1 |
| Body | `buy_fpr_req` | 매수최우선잔량 | String | N | 20 | 매수호가수량1 |
| Body | `buy_1th_pre_req_pre` | 매수1차선잔량대비 | String | N | 20 | 매수호가직전대비1 |
| Body | `buy_2th_pre_bid` | 매수2차선호가 | String | N | 20 | 매수호가2 |
| Body | `buy_2th_pre_req` | 매수2차선잔량 | String | N | 20 | 매수호가수량2 |
| Body | `buy_2th_pre_req_pre` | 매수2차선잔량대비 | String | N | 20 | 매수호가직전대비2 |
| Body | `buy_3th_pre_bid` | 매수3차선호가 | String | N | 20 | 매수호가3 |
| Body | `buy_3th_pre_req` | 매수3차선잔량 | String | N | 20 | 매수호가수량3 |
| Body | `buy_3th_pre_req_pre` | 매수3차선잔량대비 | String | N | 20 | 매수호가직전대비3 |
| Body | `buy_4th_pre_bid` | 매수4차선호가 | String | N | 20 | 매수호가4 |
| Body | `buy_4th_pre_req` | 매수4차선잔량 | String | N | 20 | 매수호가수량4 |
| Body | `buy_4th_pre_req_pre` | 매수4차선잔량대비 | String | N | 20 | 매수호가직전대비4 |
| Body | `buy_5th_pre_bid` | 매수5차선호가 | String | N | 20 | 매수호가5 |
| Body | `buy_5th_pre_req` | 매수5차선잔량 | String | N | 20 | 매수호가수량5 |
| Body | `buy_5th_pre_req_pre` | 매수5차선잔량대비 | String | N | 20 | 매수호가직전대비5 |
| Body | `buy_6th_pre_bid` | 매수6차선호가 | String | N | 20 | 매수호가6 |
| Body | `buy_6th_pre_req` | 매수6차선잔량 | String | N | 20 | 매수호가수량6 |
| Body | `buy_6th_pre_req_pre` | 매수6차선잔량대비 | String | N | 20 | 매수호가직전대비6 |
| Body | `buy_7th_pre_bid` | 매수7차선호가 | String | N | 20 | 매수호가7 |
| Body | `buy_7th_pre_req` | 매수7차선잔량 | String | N | 20 | 매수호가수량7 |
| Body | `buy_7th_pre_req_pre` | 매수7차선잔량대비 | String | N | 20 | 매수호가직전대비7 |
| Body | `buy_8th_pre_bid` | 매수8차선호가 | String | N | 20 | 매수호가8 |
| Body | `buy_8th_pre_req` | 매수8차선잔량 | String | N | 20 | 매수호가수량8 |
| Body | `buy_8th_pre_req_pre` | 매수8차선잔량대비 | String | N | 20 | 매수호가직전대비8 |
| Body | `buy_9th_pre_bid` | 매수9차선호가 | String | N | 20 | 매수호가9 |
| Body | `buy_9th_pre_req` | 매수9차선잔량 | String | N | 20 | 매수호가수량9 |
| Body | `buy_9th_pre_req_pre` | 매수9차선잔량대비 | String | N | 20 | 매수호가직전대비9 |
| Body | `buy_10th_pre_bid` | 매수10차선호가 | String | N | 20 | 매수호가10 |
| Body | `buy_10th_pre_req` | 매수10차선잔량 | String | N | 20 | 매수호가수량10 |
| Body | `buy_10th_pre_req_pre` | 매수10차선잔량대비 | String | N | 20 | 매수호가직전대비10 |
| Body | `tot_sel_req_jub_pre` | 총매도잔량직전대비 | String | N | 20 | 매도호가총잔량직전대비 |
| Body | `tot_sel_req` | 총매도잔량 | String | N | 20 | 매도호가총잔량 |
| Body | `tot_buy_req` | 총매수잔량 | String | N | 20 | 매수호가총잔량 |
| Body | `tot_buy_req_jub_pre` | 총매수잔량직전대비 | String | N | 20 | 매수호가총잔량직전대비 |
| Body | `ovt_sel_req_pre` | 시간외매도잔량대비 | String | N | 20 | 시간외 매도호가 총잔량 직전대비 |
| Body | `ovt_sel_req` | 시간외매도잔량 | String | N | 20 | 시간외 매도호가 총잔량 |
| Body | `ovt_buy_req` | 시간외매수잔량 | String | N | 20 | 시간외 매수호가 총잔량 |
| Body | `ovt_buy_req_pre` | 시간외매수잔량대비 | String | N | 20 | 시간외 매수호가 총잔량 직전대비 |

---

### 주식일주월시분요청 (`ka10005`)

- **메뉴 위치**: 국내주식 > 시세 > 주식일주월시분요청(ka10005)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_ddwkmm` | 주식일주월시분 | LIST | N |  |  |
| Body | `- date` | 날짜 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |
| Body | `- close_pric` | 종가 | String | N | 20 |  |
| Body | `- pre` | 대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- trde_prica` | 거래대금 | String | N | 20 |  |
| Body | `- for_poss` | 외인보유 | String | N | 20 |  |
| Body | `- for_wght` | 외인비중 | String | N | 20 |  |
| Body | `- for_netprps` | 외인순매수 | String | N | 20 |  |
| Body | `- orgn_netprps` | 기관순매수 | String | N | 20 |  |
| Body | `- ind_netprps` | 개인순매수 | String | N | 20 |  |
| Body | `- crd_remn_rt` | 신용잔고율 | String | N | 20 |  |
| Body | `- frgn` | 외국계 | String | N | 20 |  |
| Body | `- prm` | 프로그램 | String | N | 20 |  |

---

### 주식시분요청 (`ka10006`)

- **메뉴 위치**: 국내주식 > 시세 > 주식시분요청(ka10006)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `date` | 날짜 | String | N | 20 |  |
| Body | `open_pric` | 시가 | String | N | 20 |  |
| Body | `high_pric` | 고가 | String | N | 20 |  |
| Body | `low_pric` | 저가 | String | N | 20 |  |
| Body | `close_pric` | 종가 | String | N | 20 |  |
| Body | `pre` | 대비 | String | N | 20 |  |
| Body | `flu_rt` | 등락률 | String | N | 20 |  |
| Body | `trde_qty` | 거래량 | String | N | 20 |  |
| Body | `trde_prica` | 거래대금 | String | N | 20 |  |
| Body | `cntr_str` | 체결강도 | String | N | 20 |  |

---

### 시세표성정보요청 (`ka10007`)

- **메뉴 위치**: 국내주식 > 시세 > 시세표성정보요청(ka10007)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_nm` | 종목명 | String | N | 40 |  |
| Body | `stk_cd` | 종목코드 | String | N | 6 |  |
| Body | `date` | 날짜 | String | N | 20 |  |
| Body | `tm` | 시간 | String | N | 20 |  |
| Body | `pred_close_pric` | 전일종가 | String | N | 20 |  |
| Body | `pred_trde_qty` | 전일거래량 | String | N | 20 |  |
| Body | `upl_pric` | 상한가 | String | N | 20 |  |
| Body | `lst_pric` | 하한가 | String | N | 20 |  |
| Body | `pred_trde_prica` | 전일거래대금 | String | N | 20 |  |
| Body | `flo_stkcnt` | 상장주식수 | String | N | 20 |  |
| Body | `cur_prc` | 현재가 | String | N | 20 |  |
| Body | `smbol` | 부호 | String | N | 20 |  |
| Body | `flu_rt` | 등락률 | String | N | 20 |  |
| Body | `pred_rt` | 전일비 | String | N | 20 |  |
| Body | `open_pric` | 시가 | String | N | 20 |  |
| Body | `high_pric` | 고가 | String | N | 20 |  |
| Body | `low_pric` | 저가 | String | N | 20 |  |
| Body | `cntr_qty` | 체결량 | String | N | 20 |  |
| Body | `trde_qty` | 거래량 | String | N | 20 |  |
| Body | `trde_prica` | 거래대금 | String | N | 20 |  |
| Body | `exp_cntr_pric` | 예상체결가 | String | N | 20 |  |
| Body | `exp_cntr_qty` | 예상체결량 | String | N | 20 |  |
| Body | `exp_sel_pri_bid` | 예상매도우선호가 | String | N | 20 |  |
| Body | `exp_buy_pri_bid` | 예상매수우선호가 | String | N | 20 |  |
| Body | `trde_strt_dt` | 거래시작일 | String | N | 20 |  |
| Body | `exec_pric` | 행사가격 | String | N | 20 |  |
| Body | `hgst_pric` | 최고가 | String | N | 20 |  |
| Body | `lwst_pric` | 최저가 | String | N | 20 |  |
| Body | `hgst_pric_dt` | 최고가일 | String | N | 20 |  |
| Body | `lwst_pric_dt` | 최저가일 | String | N | 20 |  |
| Body | `sel_1bid` | 매도1호가 | String | N | 20 |  |
| Body | `sel_2bid` | 매도2호가 | String | N | 20 |  |
| Body | `sel_3bid` | 매도3호가 | String | N | 20 |  |
| Body | `sel_4bid` | 매도4호가 | String | N | 20 |  |
| Body | `sel_5bid` | 매도5호가 | String | N | 20 |  |
| Body | `sel_6bid` | 매도6호가 | String | N | 20 |  |
| Body | `sel_7bid` | 매도7호가 | String | N | 20 |  |
| Body | `sel_8bid` | 매도8호가 | String | N | 20 |  |
| Body | `sel_9bid` | 매도9호가 | String | N | 20 |  |
| Body | `sel_10bid` | 매도10호가 | String | N | 20 |  |
| Body | `buy_1bid` | 매수1호가 | String | N | 20 |  |
| Body | `buy_2bid` | 매수2호가 | String | N | 20 |  |
| Body | `buy_3bid` | 매수3호가 | String | N | 20 |  |
| Body | `buy_4bid` | 매수4호가 | String | N | 20 |  |
| Body | `buy_5bid` | 매수5호가 | String | N | 20 |  |
| Body | `buy_6bid` | 매수6호가 | String | N | 20 |  |
| Body | `buy_7bid` | 매수7호가 | String | N | 20 |  |
| Body | `buy_8bid` | 매수8호가 | String | N | 20 |  |
| Body | `buy_9bid` | 매수9호가 | String | N | 20 |  |
| Body | `buy_10bid` | 매수10호가 | String | N | 20 |  |
| Body | `sel_1bid_req` | 매도1호가잔량 | String | N | 20 |  |
| Body | `sel_2bid_req` | 매도2호가잔량 | String | N | 20 |  |
| Body | `sel_3bid_req` | 매도3호가잔량 | String | N | 20 |  |
| Body | `sel_4bid_req` | 매도4호가잔량 | String | N | 20 |  |
| Body | `sel_5bid_req` | 매도5호가잔량 | String | N | 20 |  |
| Body | `sel_6bid_req` | 매도6호가잔량 | String | N | 20 |  |
| Body | `sel_7bid_req` | 매도7호가잔량 | String | N | 20 |  |
| Body | `sel_8bid_req` | 매도8호가잔량 | String | N | 20 |  |
| Body | `sel_9bid_req` | 매도9호가잔량 | String | N | 20 |  |
| Body | `sel_10bid_req` | 매도10호가잔량 | String | N | 20 |  |
| Body | `buy_1bid_req` | 매수1호가잔량 | String | N | 20 |  |
| Body | `buy_2bid_req` | 매수2호가잔량 | String | N | 20 |  |
| Body | `buy_3bid_req` | 매수3호가잔량 | String | N | 20 |  |
| Body | `buy_4bid_req` | 매수4호가잔량 | String | N | 20 |  |
| Body | `buy_5bid_req` | 매수5호가잔량 | String | N | 20 |  |
| Body | `buy_6bid_req` | 매수6호가잔량 | String | N | 20 |  |
| Body | `buy_7bid_req` | 매수7호가잔량 | String | N | 20 |  |
| Body | `buy_8bid_req` | 매수8호가잔량 | String | N | 20 |  |
| Body | `buy_9bid_req` | 매수9호가잔량 | String | N | 20 |  |
| Body | `buy_10bid_req` | 매수10호가잔량 | String | N | 20 |  |
| Body | `sel_1bid_jub_pre` | 매도1호가직전대비 | String | N | 20 |  |
| Body | `sel_2bid_jub_pre` | 매도2호가직전대비 | String | N | 20 |  |
| Body | `sel_3bid_jub_pre` | 매도3호가직전대비 | String | N | 20 |  |
| Body | `sel_4bid_jub_pre` | 매도4호가직전대비 | String | N | 20 |  |
| Body | `sel_5bid_jub_pre` | 매도5호가직전대비 | String | N | 20 |  |
| Body | `sel_6bid_jub_pre` | 매도6호가직전대비 | String | N | 20 |  |
| Body | `sel_7bid_jub_pre` | 매도7호가직전대비 | String | N | 20 |  |
| Body | `sel_8bid_jub_pre` | 매도8호가직전대비 | String | N | 20 |  |
| Body | `sel_9bid_jub_pre` | 매도9호가직전대비 | String | N | 20 |  |
| Body | `sel_10bid_jub_pre` | 매도10호가직전대비 | String | N | 20 |  |
| Body | `buy_1bid_jub_pre` | 매수1호가직전대비 | String | N | 20 |  |
| Body | `buy_2bid_jub_pre` | 매수2호가직전대비 | String | N | 20 |  |
| Body | `buy_3bid_jub_pre` | 매수3호가직전대비 | String | N | 20 |  |
| Body | `buy_4bid_jub_pre` | 매수4호가직전대비 | String | N | 20 |  |
| Body | `buy_5bid_jub_pre` | 매수5호가직전대비 | String | N | 20 |  |
| Body | `buy_6bid_jub_pre` | 매수6호가직전대비 | String | N | 20 |  |
| Body | `buy_7bid_jub_pre` | 매수7호가직전대비 | String | N | 20 |  |
| Body | `buy_8bid_jub_pre` | 매수8호가직전대비 | String | N | 20 |  |
| Body | `buy_9bid_jub_pre` | 매수9호가직전대비 | String | N | 20 |  |
| Body | `buy_10bid_jub_pre` | 매수10호가직전대비 | String | N | 20 |  |
| Body | `sel_1bid_cnt` | 매도1호가건수 | String | N | 20 |  |
| Body | `sel_2bid_cnt` | 매도2호가건수 | String | N | 20 |  |
| Body | `sel_3bid_cnt` | 매도3호가건수 | String | N | 20 |  |
| Body | `sel_4bid_cnt` | 매도4호가건수 | String | N | 20 |  |
| Body | `sel_5bid_cnt` | 매도5호가건수 | String | N | 20 |  |
| Body | `buy_1bid_cnt` | 매수1호가건수 | String | N | 20 |  |
| Body | `buy_2bid_cnt` | 매수2호가건수 | String | N | 20 |  |
| Body | `buy_3bid_cnt` | 매수3호가건수 | String | N | 20 |  |
| Body | `buy_4bid_cnt` | 매수4호가건수 | String | N | 20 |  |
| Body | `buy_5bid_cnt` | 매수5호가건수 | String | N | 20 |  |
| Body | `lpsel_1bid_req` | LP매도1호가잔량 | String | N | 20 |  |
| Body | `lpsel_2bid_req` | LP매도2호가잔량 | String | N | 20 |  |
| Body | `lpsel_3bid_req` | LP매도3호가잔량 | String | N | 20 |  |
| Body | `lpsel_4bid_req` | LP매도4호가잔량 | String | N | 20 |  |
| Body | `lpsel_5bid_req` | LP매도5호가잔량 | String | N | 20 |  |
| Body | `lpsel_6bid_req` | LP매도6호가잔량 | String | N | 20 |  |
| Body | `lpsel_7bid_req` | LP매도7호가잔량 | String | N | 20 |  |
| Body | `lpsel_8bid_req` | LP매도8호가잔량 | String | N | 20 |  |
| Body | `lpsel_9bid_req` | LP매도9호가잔량 | String | N | 20 |  |
| Body | `lpsel_10bid_req` | LP매도10호가잔량 | String | N | 20 |  |
| Body | `lpbuy_1bid_req` | LP매수1호가잔량 | String | N | 20 |  |
| Body | `lpbuy_2bid_req` | LP매수2호가잔량 | String | N | 20 |  |
| Body | `lpbuy_3bid_req` | LP매수3호가잔량 | String | N | 20 |  |
| Body | `lpbuy_4bid_req` | LP매수4호가잔량 | String | N | 20 |  |
| Body | `lpbuy_5bid_req` | LP매수5호가잔량 | String | N | 20 |  |
| Body | `lpbuy_6bid_req` | LP매수6호가잔량 | String | N | 20 |  |
| Body | `lpbuy_7bid_req` | LP매수7호가잔량 | String | N | 20 |  |
| Body | `lpbuy_8bid_req` | LP매수8호가잔량 | String | N | 20 |  |
| Body | `lpbuy_9bid_req` | LP매수9호가잔량 | String | N | 20 |  |
| Body | `lpbuy_10bid_req` | LP매수10호가잔량 | String | N | 20 |  |
| Body | `tot_buy_req` | 총매수잔량 | String | N | 20 |  |
| Body | `tot_sel_req` | 총매도잔량 | String | N | 20 |  |
| Body | `tot_buy_cnt` | 총매수건수 | String | N | 20 |  |
| Body | `tot_sel_cnt` | 총매도건수 | String | N | 20 |  |

---

### 주식외국인종목별매매동향 (`ka10008`)

- **메뉴 위치**: 국내주식 > 기관/외국인 > 주식외국인종목별매매동향(ka10008)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/frgnistt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_frgnr` | 주식외국인 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- close_pric` | 종가 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- chg_qty` | 변동수량 | String | N | 20 |  |
| Body | `- poss_stkcnt` | 보유주식수 | String | N | 20 |  |
| Body | `- wght` | 비중 | String | N | 20 |  |
| Body | `- gain_pos_stkcnt` | 취득가능주식수 | String | N | 20 |  |
| Body | `- frgnr_limit` | 외국인한도 | String | N | 20 |  |
| Body | `- frgnr_limit_irds` | 외국인한도증감 | String | N | 20 |  |
| Body | `- limit_exh_rt` | 한도소진률 | String | N | 20 |  |

---

### 주식기관요청 (`ka10009`)

- **메뉴 위치**: 국내주식 > 기관/외국인 > 주식기관요청(ka10009)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/frgnistt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `date` | 날짜 | String | N | 20 |  |
| Body | `close_pric` | 종가 | String | N | 20 |  |
| Body | `pre` | 대비 | String | N | 20 |  |
| Body | `orgn_dt_acc` | 기관기간누적 | String | N | 20 |  |
| Body | `orgn_daly_nettrde` | 기관일별순매매 | String | N | 20 |  |
| Body | `frgnr_daly_nettrde` | 외국인일별순매매 | String | N | 20 |  |
| Body | `frgnr_qota_rt` | 외국인지분율 | String | N | 20 |  |

---

### 업종프로그램요청 (`ka10010`)

- **메뉴 위치**: 국내주식 > 업종 > 업종프로그램요청(ka10010)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/sect`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dfrt_trst_sell_qty` | 차익위탁매도수량 | String | N | 20 |  |
| Body | `dfrt_trst_sell_amt` | 차익위탁매도금액 | String | N | 20 |  |
| Body | `dfrt_trst_buy_qty` | 차익위탁매수수량 | String | N | 20 |  |
| Body | `dfrt_trst_buy_amt` | 차익위탁매수금액 | String | N | 20 |  |
| Body | `dfrt_trst_netprps_qty` | 차익위탁순매수수량 | String | N | 20 |  |
| Body | `dfrt_trst_netprps_amt` | 차익위탁순매수금액 | String | N | 20 |  |
| Body | `ndiffpro_trst_sell_qty` | 비차익위탁매도수량 | String | N | 20 |  |
| Body | `ndiffpro_trst_sell_amt` | 비차익위탁매도금액 | String | N | 20 |  |
| Body | `ndiffpro_trst_buy_qty` | 비차익위탁매수수량 | String | N | 20 |  |
| Body | `ndiffpro_trst_buy_amt` | 비차익위탁매수금액 | String | N | 20 |  |
| Body | `ndiffpro_trst_netprps_qty` | 비차익위탁순매수수량 | String | N | 20 |  |
| Body | `ndiffpro_trst_netprps_amt` | 비차익위탁순매수금액 | String | N | 20 |  |
| Body | `all_dfrt_trst_sell_qty` | 전체차익위탁매도수량 | String | N | 20 |  |
| Body | `all_dfrt_trst_sell_amt` | 전체차익위탁매도금액 | String | N | 20 |  |
| Body | `all_dfrt_trst_buy_qty` | 전체차익위탁매수수량 | String | N | 20 |  |
| Body | `all_dfrt_trst_buy_amt` | 전체차익위탁매수금액 | String | N | 20 |  |
| Body | `all_dfrt_trst_netprps_qty` | 전체차익위탁순매수수량 | String | N | 20 |  |
| Body | `all_dfrt_trst_netprps_amt` | 전체차익위탁순매수금액 | String | N | 20 |  |

---

### 신주인수권전체시세요청 (`ka10011`)

- **메뉴 위치**: 국내주식 > 시세 > 신주인수권전체시세요청(ka10011)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `newstk_recvrht_tp` | 신주인수권구분 | String | Y | 2 | 00:전체, 05:신주인수권증권, 07:신주인수권증서 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `newstk_recvrht_mrpr` | 신주인수권시세 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- fpr_sel_bid` | 최우선매도호가 | String | N | 20 |  |
| Body | `- fpr_buy_bid` | 최우선매수호가 | String | N | 20 |  |
| Body | `- acc_trde_qty` | 누적거래량 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |

---

### 신용매매동향요청 (`ka10013`)

- **메뉴 위치**: 국내주식 > 종목정보 > 신용매매동향요청(ka10013)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `dt` | 일자 | String | Y | 8 | YYYYMMDD |
| Body | `qry_tp` | 조회구분 | String | Y | 1 | 1:융자, 2:대주 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `crd_trde_trend` | 신용매매동향 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- new` | 신규 | String | N | 20 |  |
| Body | `- rpya` | 상환 | String | N | 20 |  |
| Body | `- remn` | 잔고 | String | N | 20 |  |
| Body | `- amt` | 금액 | String | N | 20 |  |
| Body | `- pre` | 대비 | String | N | 20 |  |
| Body | `- shr_rt` | 공여율 | String | N | 20 |  |
| Body | `- remn_rt` | 잔고율 | String | N | 20 |  |

---

### 공매도추이요청 (`ka10014`)

- **메뉴 위치**: 국내주식 > 공매도 > 공매도추이요청(ka10014)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/shsa`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `tm_tp` | 시간구분 | String | N | 1 | 0:시작일, 1:기간 |
| Body | `strt_dt` | 시작일자 | String | Y | 8 | YYYYMMDD |
| Body | `end_dt` | 종료일자 | String | Y | 8 | YYYYMMDD |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `shrts_trnsn` | 공매도추이 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- close_pric` | 종가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- shrts_qty` | 공매도량 | String | N | 20 |  |
| Body | `- ovr_shrts_qty` | 누적공매도량 | String | N | 20 | 설정 기간의 공매도량 합산데이터 |
| Body | `- trde_wght` | 매매비중 | String | N | 20 |  |
| Body | `- shrts_trde_prica` | 공매도거래대금 | String | N | 20 |  |
| Body | `- shrts_avg_pric` | 공매도평균가 | String | N | 20 |  |

---

### 일별거래상세요청 (`ka10015`)

- **메뉴 위치**: 국내주식 > 종목정보 > 일별거래상세요청(ka10015)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `strt_dt` | 시작일자 | String | Y | 8 | YYYYMMDD |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `daly_trde_dtl` | 일별거래상세 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- close_pric` | 종가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- trde_prica` | 거래대금 | String | N | 20 |  |
| Body | `- bf_mkrt_trde_qty` | 장전거래량 | String | N | 20 |  |
| Body | `- bf_mkrt_trde_wght` | 장전거래비중 | String | N | 20 |  |
| Body | `- opmr_trde_qty` | 장중거래량 | String | N | 20 |  |
| Body | `- opmr_trde_wght` | 장중거래비중 | String | N | 20 |  |
| Body | `- af_mkrt_trde_qty` | 장후거래량 | String | N | 20 |  |
| Body | `- af_mkrt_trde_wght` | 장후거래비중 | String | N | 20 |  |
| Body | `- tot_3` | 합계3 | String | N | 20 |  |
| Body | `- prid_trde_qty` | 기간중거래량 | String | N | 20 |  |
| Body | `- cntr_str` | 체결강도 | String | N | 20 |  |
| Body | `- for_poss` | 외인보유 | String | N | 20 |  |
| Body | `- for_wght` | 외인비중 | String | N | 20 |  |
| Body | `- for_netprps` | 외인순매수 | String | N | 20 |  |
| Body | `- orgn_netprps` | 기관순매수 | String | N | 20 |  |
| Body | `- ind_netprps` | 개인순매수 | String | N | 20 |  |
| Body | `- frgn` | 외국계 | String | N | 20 |  |
| Body | `- crd_remn_rt` | 신용잔고율 | String | N | 20 |  |
| Body | `- prm` | 프로그램 | String | N | 20 |  |
| Body | `- bf_mkrt_trde_prica` | 장전거래대금 | String | N | 20 |  |
| Body | `- bf_mkrt_trde_prica_wght` | 장전거래대금비중 | String | N | 20 |  |
| Body | `- opmr_trde_prica` | 장중거래대금 | String | N | 20 |  |
| Body | `- opmr_trde_prica_wght` | 장중거래대금비중 | String | N | 20 |  |
| Body | `- af_mkrt_trde_prica` | 장후거래대금 | String | N | 20 |  |
| Body | `- af_mkrt_trde_prica_wght` | 장후거래대금비중 | String | N | 20 |  |

---

### 신고저가요청 (`ka10016`)

- **메뉴 위치**: 국내주식 > 종목정보 > 신고저가요청(ka10016)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `ntl_tp` | 신고저구분 | String | Y | 1 | 1:신고가,2:신저가 |
| Body | `high_low_close_tp` | 고저종구분 | String | Y | 1 | 1:고저기준, 2:종가기준 |
| Body | `stk_cnd` | 종목조건 | String | Y | 1 | 0:전체조회,1:관리종목제외, 3:우선주제외, 5:증100제외, 6:증100만보기, 7:증40만보기, 8:증30만보기 |
| Body | `trde_qty_tp` | 거래량구분 | String | Y | 5 | 00000:전체조회, 00010:만주이상, 00050:5만주이상, 00100:10만주이상, 00150:15만주이상, 00200:20만주이상, 00300:30만주이상, 00500:50만주이상, 01000:백만주이상 |
| Body | `crd_cnd` | 신용조건 | String | Y | 1 | 0:전체조회, 1:신용융자A군, 2:신용융자B군, 3:신용융자C군, 4:신용융자D군, 7:신용융자E군, 9:신용융자전체 |
| Body | `updown_incls` | 상하한포함 | String | Y | 1 | 0:미포함, 1:포함 |
| Body | `dt` | 기간 | String | Y | 3 | 5:5일, 10:10일, 20:20일, 60:60일, 250:250일, 250일까지 입력가능 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ntl_pric` | 신고저가 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- pred_trde_qty_pre_rt` | 전일거래량대비율 | String | N | 20 |  |
| Body | `- sel_bid` | 매도호가 | String | N | 20 |  |
| Body | `- buy_bid` | 매수호가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |

---

### 상하한가요청 (`ka10017`)

- **메뉴 위치**: 국내주식 > 종목정보 > 상하한가요청(ka10017)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `updown_tp` | 상하한구분 | String | Y | 1 | 1:상한, 2:상승, 3:보합, 4: 하한, 5:하락, 6:전일상한, 7:전일하한 |
| Body | `sort_tp` | 정렬구분 | String | Y | 1 | 1:종목코드순, 2:연속횟수순(상위100개), 3:등락률순 |
| Body | `stk_cnd` | 종목조건 | String | Y | 1 | 0:전체조회,1:관리종목제외, 3:우선주제외, 4:우선주+관리종목제외, 5:증100제외, 6:증100만 보기, 7:증40만 보기, 8:증30만 보기, 9:증20만 보기, 10:우선주+관리종목+환기종목제외 |
| Body | `trde_qty_tp` | 거래량구분 | String | Y | 5 | 00000:전체조회, 00010:만주이상, 00050:5만주이상, 00100:10만주이상, 00150:15만주이상, 00200:20만주이상, 00300:30만주이상, 00500:50만주이상, 01000:백만주이상 |
| Body | `crd_cnd` | 신용조건 | String | Y | 1 | 0:전체조회, 1:신용융자A군, 2:신용융자B군, 3:신용융자C군, 4:신용융자D군, 7:신용융자E군, 9:신용융자전체 |
| Body | `trde_gold_tp` | 매매금구분 | String | Y | 1 | 0:전체조회, 1:1천원미만, 2:1천원~2천원, 3:2천원~3천원, 4:5천원~1만원, 5:1만원이상, 8:1천원이상 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `updown_pric` | 상하한가 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_infr` | 종목정보 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- pred_trde_qty` | 전일거래량 | String | N | 20 |  |
| Body | `- sel_req` | 매도잔량 | String | N | 20 |  |
| Body | `- sel_bid` | 매도호가 | String | N | 20 |  |
| Body | `- buy_bid` | 매수호가 | String | N | 20 |  |
| Body | `- buy_req` | 매수잔량 | String | N | 20 |  |
| Body | `- cnt` | 횟수 | String | N | 20 |  |

---

### 고저가근접요청 (`ka10018`)

- **메뉴 위치**: 국내주식 > 종목정보 > 고저가근접요청(ka10018)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `high_low_tp` | 고저구분 | String | Y | 1 | 1:고가, 2:저가 |
| Body | `alacc_rt` | 근접율 | String | Y | 2 | 05:0.5 10:1.0, 15:1.5, 20:2.0. 25:2.5, 30:3.0 |
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `trde_qty_tp` | 거래량구분 | String | Y | 5 | 00000:전체조회, 00010:만주이상, 00050:5만주이상, 00100:10만주이상, 00150:15만주이상, 00200:20만주이상, 00300:30만주이상, 00500:50만주이상, 01000:백만주이상 |
| Body | `stk_cnd` | 종목조건 | String | Y | 1 | 0:전체조회,1:관리종목제외, 3:우선주제외, 5:증100제외, 6:증100만보기, 7:증40만보기, 8:증30만보기 |
| Body | `crd_cnd` | 신용조건 | String | Y | 1 | 0:전체조회, 1:신용융자A군, 2:신용융자B군, 3:신용융자C군, 4:신용융자D군, 7:신용융자E군, 9:신용융자전체 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `high_low_pric_alacc` | 고저가근접 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- sel_bid` | 매도호가 | String | N | 20 |  |
| Body | `- buy_bid` | 매수호가 | String | N | 20 |  |
| Body | `- tdy_high_pric` | 당일고가 | String | N | 20 |  |
| Body | `- tdy_low_pric` | 당일저가 | String | N | 20 |  |

---

### 가격급등락요청 (`ka10019`)

- **메뉴 위치**: 국내주식 > 종목정보 > 가격급등락요청(ka10019)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥, 201:코스피200 |
| Body | `flu_tp` | 등락구분 | String | Y | 1 | 1:급등, 2:급락 |
| Body | `tm_tp` | 시간구분 | String | Y | 1 | 1:분전, 2:일전 |
| Body | `tm` | 시간 | String | Y | 2 | 분 혹은 일입력 |
| Body | `trde_qty_tp` | 거래량구분 | String | Y | 4 | 00000:전체조회, 00010:만주이상, 00050:5만주이상, 00100:10만주이상, 00150:15만주이상, 00200:20만주이상, 00300:30만주이상, 00500:50만주이상, 01000:백만주이상 |
| Body | `stk_cnd` | 종목조건 | String | Y | 1 | 0:전체조회,1:관리종목제외, 3:우선주제외, 5:증100제외, 6:증100만보기, 7:증40만보기, 8:증30만보기 |
| Body | `crd_cnd` | 신용조건 | String | Y | 1 | 0:전체조회, 1:신용융자A군, 2:신용융자B군, 3:신용융자C군, 4:신용융자D군, 7:신용융자E군, 9:신용융자전체 |
| Body | `pric_cnd` | 가격조건 | String | Y | 1 | 0:전체조회, 1:1천원미만, 2:1천원~2천원, 3:2천원~3천원, 4:5천원~1만원, 5:1만원이상, 8:1천원이상 |
| Body | `updown_incls` | 상하한포함 | String | Y | 1 | 0:미포함, 1:포함 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `pric_jmpflu` | 가격급등락 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_cls` | 종목분류 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- base_pric` | 기준가 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- base_pre` | 기준대비 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- jmp_rt` | 급등률 | String | N | 20 |  |

---

### 호가잔량상위요청 (`ka10020`)

- **메뉴 위치**: 국내주식 > 순위정보 > 호가잔량상위요청(ka10020)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 001:코스피, 101:코스닥 |
| Body | `sort_tp` | 정렬구분 | String | Y | 1 | 1:순매수잔량순, 2:순매도잔량순, 3:매수비율순, 4:매도비율순 |
| Body | `trde_qty_tp` | 거래량구분 | String | Y | 4 | 0000:장시작전(0주이상), 0010:만주이상, 0050:5만주이상, 00100:10만주이상 |
| Body | `stk_cnd` | 종목조건 | String | Y | 1 | 0:전체조회, 1:관리종목제외, 5:증100제외, 6:증100만보기, 7:증40만보기, 8:증30만보기, 9:증20만보기 |
| Body | `crd_cnd` | 신용조건 | String | Y | 1 | 0:전체조회, 1:신용융자A군, 2:신용융자B군, 3:신용융자C군, 4:신용융자D군, 7:신용융자E군, 9:신용융자전체 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `bid_req_upper` | 호가잔량상위 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- tot_sel_req` | 총매도잔량 | String | N | 20 |  |
| Body | `- tot_buy_req` | 총매수잔량 | String | N | 20 |  |
| Body | `- netprps_req` | 순매수잔량 | String | N | 20 |  |
| Body | `- buy_rt` | 매수비율 | String | N | 20 |  |

---

### 호가잔량급증요청 (`ka10021`)

- **메뉴 위치**: 국내주식 > 순위정보 > 호가잔량급증요청(ka10021)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 001:코스피, 101:코스닥 |
| Body | `trde_tp` | 매매구분 | String | Y | 1 | 1:매수잔량, 2:매도잔량 |
| Body | `sort_tp` | 정렬구분 | String | Y | 1 | 1:급증량, 2:급증률 |
| Body | `tm_tp` | 시간구분 | String | Y | 2 | 분 입력 |
| Body | `trde_qty_tp` | 거래량구분 | String | Y | 4 | 1:천주이상, 5:5천주이상, 10:만주이상, 50:5만주이상, 100:10만주이상 |
| Body | `stk_cnd` | 종목조건 | String | Y | 1 | 0:전체조회, 1:관리종목제외, 5:증100제외, 6:증100만보기, 7:증40만보기, 8:증30만보기, 9:증20만보기 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `bid_req_sdnin` | 호가잔량급증 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- int` | 기준률 | String | N | 20 |  |
| Body | `- now` | 현재 | String | N | 20 |  |
| Body | `- sdnin_qty` | 급증수량 | String | N | 20 |  |
| Body | `- sdnin_rt` | 급증률 | String | N | 20 |  |
| Body | `- tot_buy_qty` | 총매수량 | String | N | 20 |  |

---

### 잔량율급증요청 (`ka10022`)

- **메뉴 위치**: 국내주식 > 순위정보 > 잔량율급증요청(ka10022)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 001:코스피, 101:코스닥 |
| Body | `rt_tp` | 비율구분 | String | Y | 1 | 1:매수/매도비율, 2:매도/매수비율 |
| Body | `tm_tp` | 시간구분 | String | Y | 2 | 분 입력 |
| Body | `trde_qty_tp` | 거래량구분 | String | Y | 1 | 5:5천주이상, 10:만주이상, 50:5만주이상, 100:10만주이상 |
| Body | `stk_cnd` | 종목조건 | String | Y | 1 | 0:전체조회, 1:관리종목제외, 5:증100제외, 6:증100만보기, 7:증40만보기, 8:증30만보기, 9:증20만보기 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `req_rt_sdnin` | 잔량율급증 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- int` | 기준률 | String | N | 20 |  |
| Body | `- now_rt` | 현재비율 | String | N | 20 |  |
| Body | `- sdnin_rt` | 급증률 | String | N | 20 |  |
| Body | `- tot_sel_req` | 총매도잔량 | String | N | 20 |  |
| Body | `- tot_buy_req` | 총매수잔량 | String | N | 20 |  |

---

### 거래량급증요청 (`ka10023`)

- **메뉴 위치**: 국내주식 > 순위정보 > 거래량급증요청(ka10023)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `sort_tp` | 정렬구분 | String | Y | 1 | 1:급증량, 2:급증률, 3:급감량, 4:급감률 |
| Body | `tm_tp` | 시간구분 | String | Y | 1 | 1:분, 2:전일 |
| Body | `trde_qty_tp` | 거래량구분 | String | Y | 1 | 5:5천주이상, 10:만주이상, 50:5만주이상, 100:10만주이상, 200:20만주이상, 300:30만주이상, 500:50만주이상, 1000:백만주이상 |
| Body | `tm` | 시간 | String | N | 2 | 분 입력 |
| Body | `stk_cnd` | 종목조건 | String | Y | 1 | 0:전체조회, 1:관리종목제외, 3:우선주제외, 11:정리매매종목제외, 4:관리종목,우선주제외, 5:증100제외, 6:증100만보기, 13:증60만보기, 12:증50만보기, 7:증40만보기, 8:증30만보기, 9:증20만보기, 17:ETN제외, 14:ETF제외, 18:ETF+ETN제외, 15:스팩제외, 20:ETF+ETN+스팩제외 |
| Body | `pric_tp` | 가격구분 | String | Y | 1 | 0:전체조회, 2:5만원이상, 5:1만원이상, 6:5천원이상, 8:1천원이상, 9:10만원이상 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trde_qty_sdnin` | 거래량급증 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- prev_trde_qty` | 이전거래량 | String | N | 20 |  |
| Body | `- now_trde_qty` | 현재거래량 | String | N | 20 |  |
| Body | `- sdnin_qty` | 급증량 | String | N | 20 |  |
| Body | `- sdnin_rt` | 급증률 | String | N | 20 |  |

---

### 거래량갱신요청 (`ka10024`)

- **메뉴 위치**: 국내주식 > 종목정보 > 거래량갱신요청(ka10024)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `cycle_tp` | 주기구분 | String | Y | 1 | 5:5일, 10:10일, 20:20일, 60:60일, 250:250일 |
| Body | `trde_qty_tp` | 거래량구분 | String | Y | 1 | 5:5천주이상, 10:만주이상, 50:5만주이상, 100:10만주이상, 200:20만주이상, 300:30만주이상, 500:50만주이상, 1000:백만주이상 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trde_qty_updt` | 거래량갱신 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- prev_trde_qty` | 이전거래량 | String | N | 20 |  |
| Body | `- now_trde_qty` | 현재거래량 | String | N | 20 |  |
| Body | `- sel_bid` | 매도호가 | String | N | 20 |  |
| Body | `- buy_bid` | 매수호가 | String | N | 20 |  |

---

### 매물대집중요청 (`ka10025`)

- **메뉴 위치**: 국내주식 > 종목정보 > 매물대집중요청(ka10025)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `prps_cnctr_rt` | 매물집중비율 | String | Y | 3 | 0~100 입력 |
| Body | `cur_prc_entry` | 현재가진입 | String | Y | 1 | 0:현재가 매물대 진입 포함안함, 1:현재가 매물대 진입포함 |
| Body | `prpscnt` | 매물대수 | String | Y | 2 | 숫자입력 |
| Body | `cycle_tp` | 주기구분 | String | Y | 2 | 50:50일, 100:100일, 150:150일, 200:200일, 250:250일, 300:300일 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `prps_cnctr` | 매물대집중 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- now_trde_qty` | 현재거래량 | String | N | 20 |  |
| Body | `- pric_strt` | 가격대시작 | String | N | 20 |  |
| Body | `- pric_end` | 가격대끝 | String | N | 20 |  |
| Body | `- prps_qty` | 매물량 | String | N | 20 |  |
| Body | `- prps_rt` | 매물비 | String | N | 20 |  |

---

### 고저PER요청 (`ka10026`)

- **메뉴 위치**: 국내주식 > 종목정보 > 고저PER요청(ka10026)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `pertp` | PER구분 | String | Y | 1 | 1:저PBR, 2:고PBR, 3:저PER, 4:고PER, 5:저ROE, 6:고ROE |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `high_low_per` | 고저PER | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- per` | PER | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- now_trde_qty` | 현재거래량 | String | N | 20 |  |
| Body | `- sel_bid` | 매도호가 | String | N | 20 |  |

---

### 전일대비등락률상위요청 (`ka10027`)

- **메뉴 위치**: 국내주식 > 순위정보 > 전일대비등락률상위요청(ka10027)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `sort_tp` | 정렬구분 | String | Y | 1 | 1:상승률, 2:상승폭, 3:하락률, 4:하락폭, 5:보합 |
| Body | `trde_qty_cnd` | 거래량조건 | String | Y | 5 | 0000:전체조회, 0010:만주이상, 0050:5만주이상, 0100:10만주이상, 0150:15만주이상, 0200:20만주이상, 0300:30만주이상, 0500:50만주이상, 1000:백만주이상 |
| Body | `stk_cnd` | 종목조건 | String | Y | 2 | 0:전체조회, 1:관리종목제외, 4:우선주+관리주제외, 3:우선주제외, 5:증100제외, 6:증100만보기, 7:증40만보기, 8:증30만보기, 9:증20만보기, 11:정리매매종목제외, 12:증50만보기, 13:증60만보기, 14:ETF제외, 15:스펙제외, 16:ETF+ETN제외 |
| Body | `crd_cnd` | 신용조건 | String | Y | 1 | 0:전체조회, 1:신용융자A군, 2:신용융자B군, 3:신용융자C군, 4:신용융자D군, 7:신용융자E군, 9:신용융자전체 |
| Body | `updown_incls` | 상하한포함 | String | Y | 2 | 0:불 포함, 1:포함 |
| Body | `pric_cnd` | 가격조건 | String | Y | 2 | 0:전체조회, 1:1천원미만, 2:1천원~2천원, 3:2천원~5천원, 4:5천원~1만원, 5:1만원이상, 8:1천원이상, 10: 1만원미만 |
| Body | `trde_prica_cnd` | 거래대금조건 | String | Y | 4 | 0:전체조회, 3:3천만원이상, 5:5천만원이상, 10:1억원이상, 30:3억원이상, 50:5억원이상, 100:10억원이상, 300:30억원이상, 500:50억원이상, 1000:100억원이상, 3000:300억원이상, 5000:500억원이상 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `pred_pre_flu_rt_upper` | 전일대비등락률상위 | LIST | N |  |  |
| Body | `- stk_cls` | 종목분류 | String | N | 20 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- sel_req` | 매도잔량 | String | N | 20 |  |
| Body | `- buy_req` | 매수잔량 | String | N | 20 |  |
| Body | `- now_trde_qty` | 현재거래량 | String | N | 20 |  |
| Body | `- cntr_str` | 체결강도 | String | N | 20 |  |
| Body | `- cnt` | 횟수 | String | N | 20 |  |

---

### 시가대비등락률요청 (`ka10028`)

- **메뉴 위치**: 국내주식 > 종목정보 > 시가대비등락률요청(ka10028)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `sort_tp` | 정렬구분 | String | Y | 1 | 1:시가, 2:고가, 3:저가, 4:기준가 |
| Body | `trde_qty_cnd` | 거래량조건 | String | Y | 4 | 0000:전체조회, 0010:만주이상, 0050:5만주이상, 0100:10만주이상, 0500:50만주이상, 1000:백만주이상 |
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `updown_incls` | 상하한포함 | String | Y | 1 | 0:불 포함, 1:포함 |
| Body | `stk_cnd` | 종목조건 | String | Y | 2 | 0:전체조회, 1:관리종목제외, 4:우선주+관리주제외, 3:우선주제외, 5:증100제외, 6:증100만보기, 7:증40만보기, 8:증30만보기, 9:증20만보기 |
| Body | `crd_cnd` | 신용조건 | String | Y | 1 | 0:전체조회, 1:신용융자A군, 2:신용융자B군, 3:신용융자C군, 4:신용융자D군, 7:신용융자E군, 9:신용융자전체 |
| Body | `trde_prica_cnd` | 거래대금조건 | String | Y | 4 | 0:전체조회, 3:3천만원이상, 5:5천만원이상, 10:1억원이상, 30:3억원이상, 50:5억원이상, 100:10억원이상, 300:30억원이상, 500:50억원이상, 1000:100억원이상, 3000:300억원이상, 5000:500억원이상 |
| Body | `flu_cnd` | 등락조건 | String | Y | 1 | 1:상위, 2:하위 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `open_pric_pre_flu_rt` | 시가대비등락률 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |
| Body | `- open_pric_pre` | 시가대비 | String | N | 20 |  |
| Body | `- now_trde_qty` | 현재거래량 | String | N | 20 |  |
| Body | `- cntr_str` | 체결강도 | String | N | 20 |  |

---

### 예상체결등락률상위요청 (`ka10029`)

- **메뉴 위치**: 국내주식 > 순위정보 > 예상체결등락률상위요청(ka10029)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `sort_tp` | 정렬구분 | String | Y | 1 | 1:상승률, 2:상승폭, 3:보합, 4:하락률, 5:하락폭, 6:체결량, 7:상한, 8:하한 |
| Body | `trde_qty_cnd` | 거래량조건 | String | Y | 5 | 0:전체조회, 1;천주이상, 3:3천주, 5:5천주, 10:만주이상, 50:5만주이상, 100:10만주이상 |
| Body | `stk_cnd` | 종목조건 | String | Y | 2 | 0:전체조회, 1:관리종목제외, 3:우선주제외, 4:관리종목,우선주제외, 5:증100제외, 6:증100만보기, 7:증40만보기, 8:증30만보기, 9:증20만보기, 11:정리매매종목제외, 12:증50만보기, 13:증60만보기, 14:ETF제외, 15:스팩제외, 16:ETF+ETN제외 |
| Body | `crd_cnd` | 신용조건 | String | Y | 1 | 0:전체조회, 1:신용융자A군, 2:신용융자B군, 3:신용융자C군, 4:신용융자D군, 5:신용한도초과제외, 7:신용융자E군, 8:신용대주, 9:신용융자전체 |
| Body | `pric_cnd` | 가격조건 | String | Y | 2 | 0:전체조회, 1:1천원미만, 2:1천원~2천원, 3:2천원~5천원, 4:5천원~1만원, 5:1만원이상, 8:1천원이상, 10:1만원미만 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `exp_cntr_flu_rt_upper` | 예상체결등락률상위 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- exp_cntr_pric` | 예상체결가 | String | N | 20 |  |
| Body | `- base_pric` | 기준가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- exp_cntr_qty` | 예상체결량 | String | N | 20 |  |
| Body | `- sel_req` | 매도잔량 | String | N | 20 |  |
| Body | `- sel_bid` | 매도호가 | String | N | 20 |  |
| Body | `- buy_bid` | 매수호가 | String | N | 20 |  |
| Body | `- buy_req` | 매수잔량 | String | N | 20 |  |

---

### 당일거래량상위요청 (`ka10030`)

- **메뉴 위치**: 국내주식 > 순위정보 > 당일거래량상위요청(ka10030)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `sort_tp` | 정렬구분 | String | Y | 1 | 1:거래량, 2:거래회전율, 3:거래대금 |
| Body | `mang_stk_incls` | 관리종목포함 | String | Y | 1 | 0:관리종목 포함, 1:관리종목 미포함, 3:우선주제외, 11:정리매매종목제외, 4:관리종목, 우선주제외, 5:증100제외, 6:증100마나보기, 13:증60만보기, 12:증50만보기, 7:증40만보기, 8:증30만보기, 9:증20만보기, 14:ETF제외, 15:스팩제외, 16:ETF+ETN제외 |
| Body | `crd_tp` | 신용구분 | String | Y | 1 | 0:전체조회, 9:신용융자전체, 1:신용융자A군, 2:신용융자B군, 3:신용융자C군, 4:신용융자D군, 8:신용대주 |
| Body | `trde_qty_tp` | 거래량구분 | String | Y | 1 | 0:전체조회, 5:5천주이상, 10:1만주이상, 50:5만주이상, 100:10만주이상, 200:20만주이상, 300:30만주이상, 500:500만주이상, 1000:백만주이상 |
| Body | `pric_tp` | 가격구분 | String | Y | 1 | 0:전체조회, 1:1천원미만, 2:1천원이상, 3:1천원~2천원, 4:2천원~5천원, 5:5천원이상, 6:5천원~1만원, 10:1만원미만, 7:1만원이상, 8:5만원이상, 9:10만원이상 |
| Body | `trde_prica_tp` | 거래대금구분 | String | Y | 1 | 0:전체조회, 1:1천만원이상, 3:3천만원이상, 4:5천만원이상, 10:1억원이상, 30:3억원이상, 50:5억원이상, 100:10억원이상, 300:30억원이상, 500:50억원이상, 1000:100억원이상, 3000:300억원이상, 5000:500억원이상 |
| Body | `mrkt_open_tp` | 장운영구분 | String | Y | 1 | 0:전체조회, 1:장중, 2:장전시간외, 3:장후시간외 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `tdy_trde_qty_upper` | 당일거래량상위 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- pred_rt` | 전일비 | String | N | 20 |  |
| Body | `- trde_tern_rt` | 거래회전율 | String | N | 20 |  |
| Body | `- trde_amt` | 거래금액 | String | N | 20 |  |
| Body | `- opmr_trde_qty` | 장중거래량 | String | N | 20 |  |
| Body | `- opmr_pred_rt` | 장중전일비 | String | N | 20 |  |
| Body | `- opmr_trde_rt` | 장중거래회전율 | String | N | 20 |  |
| Body | `- opmr_trde_amt` | 장중거래금액 | String | N | 20 |  |
| Body | `- af_mkrt_trde_qty` | 장후거래량 | String | N | 20 |  |
| Body | `- af_mkrt_pred_rt` | 장후전일비 | String | N | 20 |  |
| Body | `- af_mkrt_trde_rt` | 장후거래회전율 | String | N | 20 |  |
| Body | `- af_mkrt_trde_amt` | 장후거래금액 | String | N | 20 |  |
| Body | `- bf_mkrt_trde_qty` | 장전거래량 | String | N | 20 |  |
| Body | `- bf_mkrt_pred_rt` | 장전전일비 | String | N | 20 |  |
| Body | `- bf_mkrt_trde_rt` | 장전거래회전율 | String | N | 20 |  |
| Body | `- bf_mkrt_trde_amt` | 장전거래금액 | String | N | 20 |  |

---

### 전일거래량상위요청 (`ka10031`)

- **메뉴 위치**: 국내주식 > 순위정보 > 전일거래량상위요청(ka10031)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `qry_tp` | 조회구분 | String | Y | 1 | 1:전일거래량 상위100종목, 2:전일거래대금 상위100종목 |
| Body | `rank_strt` | 순위시작 | String | Y | 3 | 0 ~ 100 값 중에  조회를 원하는 순위 시작값 |
| Body | `rank_end` | 순위끝 | String | Y | 3 | 0 ~ 100 값 중에  조회를 원하는 순위 끝값 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `pred_trde_qty_upper` | 전일거래량상위 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |

---

### 거래대금상위요청 (`ka10032`)

- **메뉴 위치**: 국내주식 > 순위정보 > 거래대금상위요청(ka10032)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `mang_stk_incls` | 관리종목포함 | String | Y | 1 | 0:관리종목 미포함, 1:관리종목 포함 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trde_prica_upper` | 거래대금상위 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- now_rank` | 현재순위 | String | N | 20 |  |
| Body | `- pred_rank` | 전일순위 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- sel_bid` | 매도호가 | String | N | 20 |  |
| Body | `- buy_bid` | 매수호가 | String | N | 20 |  |
| Body | `- now_trde_qty` | 현재거래량 | String | N | 20 |  |
| Body | `- pred_trde_qty` | 전일거래량 | String | N | 20 |  |
| Body | `- trde_prica` | 거래대금 | String | N | 20 |  |

---

### 신용비율상위요청 (`ka10033`)

- **메뉴 위치**: 국내주식 > 순위정보 > 신용비율상위요청(ka10033)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `trde_qty_tp` | 거래량구분 | String | Y | 3 | 0:전체조회, 10:만주이상, 50:5만주이상, 100:10만주이상, 200:20만주이상, 300:30만주이상, 500:50만주이상, 1000:백만주이상 |
| Body | `stk_cnd` | 종목조건 | String | Y | 1 | 0:전체조회, 1:관리종목제외, 5:증100제외, 6:증100만보기, 7:증40만보기, 8:증30만보기, 9:증20만보기 |
| Body | `updown_incls` | 상하한포함 | String | Y | 1 | 0:상하한 미포함, 1:상하한포함 |
| Body | `crd_cnd` | 신용조건 | String | Y | 1 | 0:전체조회, 1:신용융자A군, 2:신용융자B군, 3:신용융자C군, 4:신용융자D군, 7:신용융자E군, 9:신용융자전체 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `crd_rt_upper` | 신용비율상위 | LIST | N |  |  |
| Body | `- stk_infr` | 종목정보 | String | N | 20 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- crd_rt` | 신용비율 | String | N | 20 |  |
| Body | `- sel_req` | 매도잔량 | String | N | 20 |  |
| Body | `- buy_req` | 매수잔량 | String | N | 20 |  |
| Body | `- now_trde_qty` | 현재거래량 | String | N | 20 |  |

---

### 외인기간별매매상위요청 (`ka10034`)

- **메뉴 위치**: 국내주식 > 순위정보 > 외인기간별매매상위요청(ka10034)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `trde_tp` | 매매구분 | String | Y | 1 | 1:순매도, 2:순매수, 3:순매매 |
| Body | `dt` | 기간 | String | Y | 2 | 0:당일, 1:전일, 5:5일, 10;10일, 20:20일, 60:60일 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT, 3:통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `for_dt_trde_upper` | 외인기간별매매상위 | LIST | N |  |  |
| Body | `- rank` | 순위 | String | N | 20 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- sel_bid` | 매도호가 | String | N | 20 |  |
| Body | `- buy_bid` | 매수호가 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- netprps_qty` | 순매수량 | String | N | 20 |  |
| Body | `- gain_pos_stkcnt` | 취득가능주식수 | String | N | 20 |  |

---

### 외인연속순매매상위요청 (`ka10035`)

- **메뉴 위치**: 국내주식 > 순위정보 > 외인연속순매매상위요청(ka10035)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `trde_tp` | 매매구분 | String | Y | 1 | 1:연속순매도, 2:연속순매수 |
| Body | `base_dt_tp` | 기준일구분 | String | Y | 1 | 0:당일기준, 1:전일기준 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT, 3:통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `for_cont_nettrde_upper` | 외인연속순매매상위 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- dm1` | D-1 | String | N | 20 |  |
| Body | `- dm2` | D-2 | String | N | 20 |  |
| Body | `- dm3` | D-3 | String | N | 20 |  |
| Body | `- tot` | 합계 | String | N | 20 |  |
| Body | `- limit_exh_rt` | 한도소진율 | String | N | 20 |  |
| Body | `- pred_pre_1` | 전일대비1 | String | N | 20 |  |
| Body | `- pred_pre_2` | 전일대비2 | String | N | 20 |  |
| Body | `- pred_pre_3` | 전일대비3 | String | N | 20 |  |

---

### 외인한도소진율증가상위 (`ka10036`)

- **메뉴 위치**: 국내주식 > 순위정보 > 외인한도소진율증가상위(ka10036)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `dt` | 기간 | String | Y | 2 | 0:당일, 1:전일, 5:5일, 10;10일, 20:20일, 60:60일 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT, 3:통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `for_limit_exh_rt_incrs_upper` | 외인한도소진율증가상위 | LIST | N |  |  |
| Body | `- rank` | 순위 | String | N | 20 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- poss_stkcnt` | 보유주식수 | String | N | 20 |  |
| Body | `- gain_pos_stkcnt` | 취득가능주식수 | String | N | 20 |  |
| Body | `- base_limit_exh_rt` | 기준한도소진율 | String | N | 20 |  |
| Body | `- limit_exh_rt` | 한도소진율 | String | N | 20 |  |
| Body | `- exh_rt_incrs` | 소진율증가 | String | N | 20 |  |

---

### 외국계창구매매상위요청 (`ka10037`)

- **메뉴 위치**: 국내주식 > 순위정보 > 외국계창구매매상위요청(ka10037)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `dt` | 기간 | String | Y | 2 | 0:당일, 1:전일, 5:5일, 10;10일, 20:20일, 60:60일 |
| Body | `trde_tp` | 매매구분 | String | Y | 1 | 1:순매수, 2:순매도, 3:매수, 4:매도 |
| Body | `sort_tp` | 정렬구분 | String | Y | 1 | 1:금액, 2:수량 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT, 3:통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `frgn_wicket_trde_upper` | 외국계창구매매상위 | LIST | N |  |  |
| Body | `- rank` | 순위 | String | N | 20 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- sel_trde_qty` | 매도거래량 | String | N | 20 |  |
| Body | `- buy_trde_qty` | 매수거래량 | String | N | 20 |  |
| Body | `- netprps_trde_qty` | 순매수거래량 | String | N | 20 |  |
| Body | `- netprps_prica` | 순매수대금 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- trde_prica` | 거래대금 | String | N | 20 |  |

---

### 종목별증권사순위요청 (`ka10038`)

- **메뉴 위치**: 국내주식 > 순위정보 > 종목별증권사순위요청(ka10038)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `strt_dt` | 시작일자 | String | N | 8 | YYYYMMDD
(연도4자리, 월 2자리, 일 2자리 형식) |
| Body | `end_dt` | 종료일자 | String | N | 8 | YYYYMMDD
(연도4자리, 월 2자리, 일 2자리 형식) |
| Body | `qry_tp` | 조회구분 | String | Y | 1 | 1:순매도순위정렬, 2:순매수순위정렬 |
| Body | `dt` | 기간 | String | N | 2 | 1:전일, 4:5일, 9:10일, 19:20일, 39:40일, 59:60일, 119:120일 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `rank_1` | 순위1 | String | N | 20 |  |
| Body | `rank_2` | 순위2 | String | N | 20 |  |
| Body | `rank_3` | 순위3 | String | N | 20 |  |
| Body | `prid_trde_qty` | 기간중거래량 | String | N | 20 |  |
| Body | `stk_sec_rank` | 종목별증권사순위 | LIST | N |  |  |
| Body | `- rank` | 순위 | String | N | 20 |  |
| Body | `- mmcm_nm` | 회원사명 | String | N | 20 |  |
| Body | `- buy_qty` | 매수수량 | String | N | 20 |  |
| Body | `- sell_qty` | 매도수량 | String | N | 20 |  |
| Body | `- acc_netprps_qty` | 누적순매수수량 | String | N | 20 |  |

---

### 증권사별매매상위요청 (`ka10039`)

- **메뉴 위치**: 국내주식 > 순위정보 > 증권사별매매상위요청(ka10039)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mmcm_cd` | 회원사코드 | String | Y | 3 | 회원사 코드는 ka10102 조회 |
| Body | `trde_qty_tp` | 거래량구분 | String | Y | 4 | 0:전체, 5:5000주, 10:1만주, 50:5만주, 100:10만주, 500:50만주, 1000: 100만주 |
| Body | `trde_tp` | 매매구분 | String | Y | 2 | 1:순매수, 2:순매도 |
| Body | `dt` | 기간 | String | Y | 2 | 1:전일, 5:5일, 10:10일, 60:60일 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `sec_trde_upper` | 증권사별매매상위 | LIST | N |  |  |
| Body | `- rank` | 순위 | String | N | 20 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- prid_stkpc_flu` | 기간중주가등락 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- prid_trde_qty` | 기간중거래량 | String | N | 20 |  |
| Body | `- netprps` | 순매수 | String | N | 20 |  |
| Body | `- buy_trde_qty` | 매수거래량 | String | N | 20 |  |
| Body | `- sel_trde_qty` | 매도거래량 | String | N | 20 |  |
| Body | `- netprps_amt` | 순매수금액 | String | N | 20 |  |
| Body | `- buy_amt` | 매수금액 | String | N | 20 |  |
| Body | `- sell_amt` | 매도금액 | String | N | 20 |  |

---

### 당일주요거래원요청 (`ka10040`)

- **메뉴 위치**: 국내주식 > 순위정보 > 당일주요거래원요청(ka10040)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `sel_trde_ori_irds_1` | 매도거래원별증감1 | String | N |  |  |
| Body | `sel_trde_ori_qty_1` | 매도거래원수량1 | String | N |  |  |
| Body | `sel_trde_ori_1` | 매도거래원1 | String | N |  |  |
| Body | `sel_trde_ori_cd_1` | 매도거래원코드1 | String | N |  |  |
| Body | `buy_trde_ori_1` | 매수거래원1 | String | N |  |  |
| Body | `buy_trde_ori_cd_1` | 매수거래원코드1 | String | N |  |  |
| Body | `buy_trde_ori_qty_1` | 매수거래원수량1 | String | N |  |  |
| Body | `buy_trde_ori_irds_1` | 매수거래원별증감1 | String | N |  |  |
| Body | `sel_trde_ori_irds_2` | 매도거래원별증감2 | String | N |  |  |
| Body | `sel_trde_ori_qty_2` | 매도거래원수량2 | String | N |  |  |
| Body | `sel_trde_ori_2` | 매도거래원2 | String | N |  |  |
| Body | `sel_trde_ori_cd_2` | 매도거래원코드2 | String | N |  |  |
| Body | `buy_trde_ori_2` | 매수거래원2 | String | N |  |  |
| Body | `buy_trde_ori_cd_2` | 매수거래원코드2 | String | N |  |  |
| Body | `buy_trde_ori_qty_2` | 매수거래원수량2 | String | N |  |  |
| Body | `buy_trde_ori_irds_2` | 매수거래원별증감2 | String | N |  |  |
| Body | `sel_trde_ori_irds_3` | 매도거래원별증감3 | String | N |  |  |
| Body | `sel_trde_ori_qty_3` | 매도거래원수량3 | String | N |  |  |
| Body | `sel_trde_ori_3` | 매도거래원3 | String | N |  |  |
| Body | `sel_trde_ori_cd_3` | 매도거래원코드3 | String | N |  |  |
| Body | `buy_trde_ori_3` | 매수거래원3 | String | N |  |  |
| Body | `buy_trde_ori_cd_3` | 매수거래원코드3 | String | N |  |  |
| Body | `buy_trde_ori_qty_3` | 매수거래원수량3 | String | N |  |  |
| Body | `buy_trde_ori_irds_3` | 매수거래원별증감3 | String | N |  |  |
| Body | `sel_trde_ori_irds_4` | 매도거래원별증감4 | String | N |  |  |
| Body | `sel_trde_ori_qty_4` | 매도거래원수량4 | String | N |  |  |
| Body | `sel_trde_ori_4` | 매도거래원4 | String | N |  |  |
| Body | `sel_trde_ori_cd_4` | 매도거래원코드4 | String | N |  |  |
| Body | `buy_trde_ori_4` | 매수거래원4 | String | N |  |  |
| Body | `buy_trde_ori_cd_4` | 매수거래원코드4 | String | N |  |  |
| Body | `buy_trde_ori_qty_4` | 매수거래원수량4 | String | N |  |  |
| Body | `buy_trde_ori_irds_4` | 매수거래원별증감4 | String | N |  |  |
| Body | `sel_trde_ori_irds_5` | 매도거래원별증감5 | String | N |  |  |
| Body | `sel_trde_ori_qty_5` | 매도거래원수량5 | String | N |  |  |
| Body | `sel_trde_ori_5` | 매도거래원5 | String | N |  |  |
| Body | `sel_trde_ori_cd_5` | 매도거래원코드5 | String | N |  |  |
| Body | `buy_trde_ori_5` | 매수거래원5 | String | N |  |  |
| Body | `buy_trde_ori_cd_5` | 매수거래원코드5 | String | N |  |  |
| Body | `buy_trde_ori_qty_5` | 매수거래원수량5 | String | N |  |  |
| Body | `buy_trde_ori_irds_5` | 매수거래원별증감5 | String | N |  |  |
| Body | `frgn_sel_prsm_sum_chang` | 외국계매도추정합변동 | String | N |  |  |
| Body | `frgn_sel_prsm_sum` | 외국계매도추정합 | String | N |  |  |
| Body | `frgn_buy_prsm_sum` | 외국계매수추정합 | String | N |  |  |
| Body | `frgn_buy_prsm_sum_chang` | 외국계매수추정합변동 | String | N |  |  |
| Body | `tdy_main_trde_ori` | 당일주요거래원 | LIST | N |  |  |
| Body | `- sel_scesn_tm` | 매도이탈시간 | String | N | 20 |  |
| Body | `- sell_qty` | 매도수량 | String | N | 20 |  |
| Body | `- sel_upper_scesn_ori` | 매도상위이탈원 | String | N | 20 |  |
| Body | `- buy_scesn_tm` | 매수이탈시간 | String | N | 20 |  |
| Body | `- buy_qty` | 매수수량 | String | N | 20 |  |
| Body | `- buy_upper_scesn_ori` | 매수상위이탈원 | String | N | 20 |  |
| Body | `- qry_dt` | 조회일자 | String | N | 20 |  |
| Body | `- qry_tm` | 조회시간 | String | N | 20 |  |

---

### 순매수거래원순위요청 (`ka10042`)

- **메뉴 위치**: 국내주식 > 순위정보 > 순매수거래원순위요청(ka10042)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `strt_dt` | 시작일자 | String | N | 8 | YYYYMMDD
(연도4자리, 월 2자리, 일 2자리 형식) |
| Body | `end_dt` | 종료일자 | String | N | 8 | YYYYMMDD
(연도4자리, 월 2자리, 일 2자리 형식) |
| Body | `qry_dt_tp` | 조회기간구분 | String | Y | 1 | 0:기간으로 조회, 1:시작일자, 종료일자로 조회 |
| Body | `pot_tp` | 시점구분 | String | Y | 1 | 0:당일, 1:전일 |
| Body | `dt` | 기간 | String | N | 4 | 5:5일, 10:10일, 20:20일, 40:40일, 60:60일, 120:120일 |
| Body | `sort_base` | 정렬기준 | String | Y | 1 | 1:종가순, 2:날짜순 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `netprps_trde_ori_rank` | 순매수거래원순위 | LIST | N |  |  |
| Body | `- rank` | 순위 | String | N | 20 |  |
| Body | `- mmcm_cd` | 회원사코드 | String | N | 20 |  |
| Body | `- mmcm_nm` | 회원사명 | String | N | 20 |  |

---

### 거래원매물대분석요청 (`ka10043`)

- **메뉴 위치**: 국내주식 > 종목정보 > 거래원매물대분석요청(ka10043)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `strt_dt` | 시작일자 | String | Y | 8 | YYYYMMDD |
| Body | `end_dt` | 종료일자 | String | Y | 8 | YYYYMMDD |
| Body | `qry_dt_tp` | 조회기간구분 | String | Y | 1 | 0:기간으로 조회, 1:시작일자, 종료일자로 조회 |
| Body | `pot_tp` | 시점구분 | String | Y | 1 | 0:당일, 1:전일 |
| Body | `dt` | 기간 | String | Y | 4 | 5:5일, 10:10일, 20:20일, 40:40일, 60:60일, 120:120일 |
| Body | `sort_base` | 정렬기준 | String | Y | 1 | 1:종가순, 2:날짜순 |
| Body | `mmcm_cd` | 회원사코드 | String | Y | 3 | 회원사 코드는 ka10102 조회 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trde_ori_prps_anly` | 거래원매물대분석 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- close_pric` | 종가 | String | N | 20 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- sel_qty` | 매도량 | String | N | 20 |  |
| Body | `- buy_qty` | 매수량 | String | N | 20 |  |
| Body | `- netprps_qty` | 순매수수량 | String | N | 20 |  |
| Body | `- trde_qty_sum` | 거래량합 | String | N | 20 |  |
| Body | `- trde_wght` | 거래비중 | String | N | 20 |  |

---

### 일별기관매매종목요청 (`ka10044`)

- **메뉴 위치**: 국내주식 > 시세 > 일별기관매매종목요청(ka10044)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `strt_dt` | 시작일자 | String | Y | 8 | YYYYMMDD |
| Body | `end_dt` | 종료일자 | String | Y | 8 | YYYYMMDD |
| Body | `trde_tp` | 매매구분 | String | Y | 1 | 1:순매도, 2:순매수 |
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 001:코스피, 101:코스닥 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `daly_orgn_trde_stk` | 일별기관매매종목 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- netprps_qty` | 순매수수량 | String | N | 20 |  |
| Body | `- netprps_amt` | 순매수금액 | String | N | 20 |  |

---

### 종목별기관매매추이요청 (`ka10045`)

- **메뉴 위치**: 국내주식 > 시세 > 종목별기관매매추이요청(ka10045)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `strt_dt` | 시작일자 | String | Y | 8 | YYYYMMDD |
| Body | `end_dt` | 종료일자 | String | Y | 8 | YYYYMMDD |
| Body | `orgn_prsm_unp_tp` | 기관추정단가구분 | String | Y | 1 | 1:매수단가, 2:매도단가 |
| Body | `for_prsm_unp_tp` | 외인추정단가구분 | String | Y | 1 | 1:매수단가, 2:매도단가 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `orgn_prsm_avg_pric` | 기관추정평균가 | String | N |  |  |
| Body | `for_prsm_avg_pric` | 외인추정평균가 | String | N |  |  |
| Body | `stk_orgn_trde_trnsn` | 종목별기관매매추이 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- close_pric` | 종가 | String | N | 20 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- orgn_dt_acc` | 기관기간누적 | String | N | 20 |  |
| Body | `- orgn_daly_nettrde_qty` | 기관일별순매매수량 | String | N | 20 |  |
| Body | `- for_dt_acc` | 외인기간누적 | String | N | 20 |  |
| Body | `- for_daly_nettrde_qty` | 외인일별순매매수량 | String | N | 20 |  |
| Body | `- limit_exh_rt` | 한도소진율 | String | N | 20 |  |

---

### 체결강도추이시간별요청 (`ka10046`)

- **메뉴 위치**: 국내주식 > 시세 > 체결강도추이시간별요청(ka10046)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `cntr_str_tm` | 체결강도시간별 | LIST | N |  |  |
| Body | `- cntr_tm` | 체결시간 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- acc_trde_prica` | 누적거래대금 | String | N | 20 |  |
| Body | `- acc_trde_qty` | 누적거래량 | String | N | 20 |  |
| Body | `- cntr_str` | 체결강도 | String | N | 20 |  |
| Body | `- cntr_str_5min` | 체결강도5분 | String | N | 20 |  |
| Body | `- cntr_str_20min` | 체결강도20분 | String | N | 20 |  |
| Body | `- cntr_str_60min` | 체결강도60분 | String | N | 20 |  |
| Body | `- stex_tp` | 거래소구분 | String | N | 20 |  |

---

### 체결강도추이일별요청 (`ka10047`)

- **메뉴 위치**: 국내주식 > 시세 > 체결강도추이일별요청(ka10047)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `cntr_str_daly` | 체결강도일별 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- acc_trde_prica` | 누적거래대금 | String | N | 20 |  |
| Body | `- acc_trde_qty` | 누적거래량 | String | N | 20 |  |
| Body | `- cntr_str` | 체결강도 | String | N | 20 |  |
| Body | `- cntr_str_5min` | 체결강도5일 | String | N | 20 |  |
| Body | `- cntr_str_20min` | 체결강도20일 | String | N | 20 |  |
| Body | `- cntr_str_60min` | 체결강도60일 | String | N | 20 |  |

---

### ELW일별민감도지표요청 (`ka10048`)

- **메뉴 위치**: 국내주식 > ELW > ELW일별민감도지표요청(ka10048)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/elw`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `elwdaly_snst_ix` | ELW일별민감도지표 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- iv` | IV | String | N | 20 |  |
| Body | `- delta` | 델타 | String | N | 20 |  |
| Body | `- gam` | 감마 | String | N | 20 |  |
| Body | `- theta` | 쎄타 | String | N | 20 |  |
| Body | `- vega` | 베가 | String | N | 20 |  |
| Body | `- law` | 로 | String | N | 20 |  |
| Body | `- lp` | LP | String | N | 20 |  |

---

### ELW민감도지표요청 (`ka10050`)

- **메뉴 위치**: 국내주식 > ELW > ELW민감도지표요청(ka10050)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/elw`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `elwsnst_ix_array` | ELW민감도지표배열 | LIST | N |  |  |
| Body | `- cntr_tm` | 체결시간 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- elwtheory_pric` | ELW이론가 | String | N | 20 |  |
| Body | `- iv` | IV | String | N | 20 |  |
| Body | `- delta` | 델타 | String | N | 20 |  |
| Body | `- gam` | 감마 | String | N | 20 |  |
| Body | `- theta` | 쎄타 | String | N | 20 |  |
| Body | `- vega` | 베가 | String | N | 20 |  |
| Body | `- law` | 로 | String | N | 20 |  |
| Body | `- lp` | LP | String | N | 20 |  |

---

### 업종별투자자순매수요청 (`ka10051`)

- **메뉴 위치**: 국내주식 > 업종 > 업종별투자자순매수요청(ka10051)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/sect`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 1 | 코스피:0, 코스닥:1 |
| Body | `amt_qty_tp` | 금액수량구분 | String | Y | 1 | 금액:0, 수량:1 |
| Body | `base_dt` | 기준일자 | String | N | 8 | YYYYMMDD |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT, 3:통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `inds_netprps` | 업종별순매수 | LIST | N |  |  |
| Body | `- inds_cd` | 업종코드 | String | N | 20 |  |
| Body | `- inds_nm` | 업종명 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pre_smbol` | 대비부호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- sc_netprps` | 증권순매수 | String | N | 20 |  |
| Body | `- insrnc_netprps` | 보험순매수 | String | N | 20 |  |
| Body | `- invtrt_netprps` | 투신순매수 | String | N | 20 |  |
| Body | `- bank_netprps` | 은행순매수 | String | N | 20 |  |
| Body | `- jnsinkm_netprps` | 종신금순매수 | String | N | 20 |  |
| Body | `- endw_netprps` | 기금순매수 | String | N | 20 |  |
| Body | `- etc_corp_netprps` | 기타법인순매수 | String | N | 20 |  |
| Body | `- ind_netprps` | 개인순매수 | String | N | 20 |  |
| Body | `- frgnr_netprps` | 외국인순매수 | String | N | 20 |  |
| Body | `- native_trmt_frgnr_netprps` | 내국인대우외국인순매수 | String | N | 20 |  |
| Body | `- natn_netprps` | 국가순매수 | String | N | 20 |  |
| Body | `- samo_fund_netprps` | 사모펀드순매수 | String | N | 20 |  |
| Body | `- orgn_netprps` | 기관계순매수 | String | N | 20 |  |

---

### 거래원순간거래량요청 (`ka10052`)

- **메뉴 위치**: 국내주식 > 종목정보 > 거래원순간거래량요청(ka10052)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mmcm_cd` | 회원사코드 | String | Y | 3 | 회원사 코드는 ka10102 조회 |
| Body | `stk_cd` | 종목코드 | String | N | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `mrkt_tp` | 시장구분 | String | Y | 1 | 0:전체, 1:코스피, 2:코스닥, 3:종목 |
| Body | `qty_tp` | 수량구분 | String | Y | 3 | 0:전체, 1:1000주, 2:2000주, 3:, 5:, 10:10000주, 30: 30000주, 50: 50000주, 100: 100000주 |
| Body | `pric_tp` | 가격구분 | String | Y | 1 | 0:전체, 1:1천원 미만, 8:1천원 이상, 2:1천원 ~ 2천원, 3:2천원 ~ 5천원, 4:5천원 ~ 1만원, 5:1만원 이상 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trde_ori_mont_trde_qty` | 거래원순간거래량 | LIST | N |  |  |
| Body | `- tm` | 시간 | String | N | 20 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 20 |  |
| Body | `- trde_ori_nm` | 거래원명 | String | N | 20 |  |
| Body | `- tp` | 구분 | String | N | 20 |  |
| Body | `- mont_trde_qty` | 순간거래량 | String | N | 20 |  |
| Body | `- acc_netprps` | 누적순매수 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |

---

### 당일상위이탈원요청 (`ka10053`)

- **메뉴 위치**: 국내주식 > 순위정보 > 당일상위이탈원요청(ka10053)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `tdy_upper_scesn_ori` | 당일상위이탈원 | LIST | N |  |  |
| Body | `- sel_scesn_tm` | 매도이탈시간 | String | N | 20 |  |
| Body | `- sell_qty` | 매도수량 | String | N | 20 |  |
| Body | `- sel_upper_scesn_ori` | 매도상위이탈원 | String | N | 20 |  |
| Body | `- buy_scesn_tm` | 매수이탈시간 | String | N | 20 |  |
| Body | `- buy_qty` | 매수수량 | String | N | 20 |  |
| Body | `- buy_upper_scesn_ori` | 매수상위이탈원 | String | N | 20 |  |
| Body | `- qry_dt` | 조회일자 | String | N | 20 |  |
| Body | `- qry_tm` | 조회시간 | String | N | 20 |  |

---

### 변동성완화장치발동종목요청 (`ka10054`)

- **메뉴 위치**: 국내주식 > 종목정보 > 변동성완화장치발동종목요청(ka10054)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001: 코스피, 101:코스닥 |
| Body | `bf_mkrt_tp` | 장전구분 | String | Y | 1 | 0:전체, 1:정규시장,2:시간외단일가 |
| Body | `stk_cd` | 종목코드 | String | N | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL)
 공백입력시 시장구분으로 설정한 전체종목조회 |
| Body | `motn_tp` | 발동구분 | String | Y | 1 | 0:전체, 1:정적VI, 2:동적VI, 3:동적VI + 정적VI |
| Body | `skip_stk` | 제외종목 | String | Y | 9 | 전종목포함 조회시 9개 0으로 설정(000000000),전종목제외 조회시 9개 1으로 설정(111111111),9개 종목조회여부를 조회포함(0), 조회제외(1)로 설정하며 종목순서는 우선주,관리종목,투자경고/위험,투자주의,환기종목,단기과열종목,증거금100%,ETF,ETN가 됨.우선주만 조회시"011111111"", 관리종목만 조회시 ""101111111"" 설정" |
| Body | `trde_qty_tp` | 거래량구분 | String | Y | 1 | 0:사용안함, 1:사용 |
| Body | `min_trde_qty` | 최소거래량 | String | Y | 12 | 0 주 이상, 거래량구분이 1일때만 입력(공백허용) |
| Body | `max_trde_qty` | 최대거래량 | String | Y | 12 | 100000000 주 이하, 거래량구분이 1일때만 입력(공백허용) |
| Body | `trde_prica_tp` | 거래대금구분 | String | Y | 1 | 0:사용안함, 1:사용 |
| Body | `min_trde_prica` | 최소거래대금 | String | Y | 10 | 0 백만원 이상, 거래대금구분 1일때만 입력(공백허용) |
| Body | `max_trde_prica` | 최대거래대금 | String | Y | 10 | 100000000 백만원 이하, 거래대금구분 1일때만 입력(공백허용) |
| Body | `motn_drc` | 발동방향 | String | Y | 1 | 0:전체, 1:상승, 2:하락 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `motn_stk` | 발동종목 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- acc_trde_qty` | 누적거래량 | String | N | 20 |  |
| Body | `- motn_pric` | 발동가격 | String | N | 20 |  |
| Body | `- dynm_dispty_rt` | 동적괴리율 | String | N | 20 |  |
| Body | `- trde_cntr_proc_time` | 매매체결처리시각 | String | N | 20 |  |
| Body | `- virelis_time` | VI해제시각 | String | N | 20 |  |
| Body | `- viaplc_tp` | VI적용구분 | String | N | 20 |  |
| Body | `- dynm_stdpc` | 동적기준가격 | String | N | 20 |  |
| Body | `- static_stdpc` | 정적기준가격 | String | N | 20 |  |
| Body | `- static_dispty_rt` | 정적괴리율 | String | N | 20 |  |
| Body | `- open_pric_pre_flu_rt` | 시가대비등락률 | String | N | 20 |  |
| Body | `- vimotn_cnt` | VI발동횟수 | String | N | 20 |  |
| Body | `- stex_tp` | 거래소구분 | String | N | 20 |  |

---

### 당일전일체결량요청 (`ka10055`)

- **메뉴 위치**: 국내주식 > 종목정보 > 당일전일체결량요청(ka10055)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `tdy_pred` | 당일전일 | String | Y | 1 | 1:당일, 2:전일 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `tdy_pred_cntr_qty` | 당일전일체결량 | LIST | N |  |  |
| Body | `- cntr_tm` | 체결시간 | String | N | 20 |  |
| Body | `- cntr_pric` | 체결가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- cntr_qty` | 체결량 | String | N | 20 |  |
| Body | `- acc_trde_qty` | 누적거래량 | String | N | 20 |  |
| Body | `- acc_trde_prica` | 누적거래대금 | String | N | 20 |  |

---

### 투자자별일별매매종목요청 (`ka10058`)

- **메뉴 위치**: 국내주식 > 종목정보 > 투자자별일별매매종목요청(ka10058)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `strt_dt` | 시작일자 | String | Y | 8 | YYYYMMDD |
| Body | `end_dt` | 종료일자 | String | Y | 8 | YYYYMMDD |
| Body | `trde_tp` | 매매구분 | String | Y | 1 | 순매도:1, 순매수:2 |
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 001:코스피, 101:코스닥 |
| Body | `invsr_tp` | 투자자구분 | String | Y | 4 | 8000:개인, 9000:외국인, 1000:금융투자, 3000:투신, 3100:사모펀드, 5000:기타금융, 4000:은행, 2000:보험, 6000:연기금, 7000:국가, 7100:기타법인, 9999:기관계 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `invsr_daly_trde_stk` | 투자자별일별매매종목 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- netslmt_qty` | 순매도수량 | String | N | 20 |  |
| Body | `- netslmt_amt` | 순매도금액 | String | N | 20 |  |
| Body | `- prsm_avg_pric` | 추정평균가 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- avg_pric_pre` | 평균가대비 | String | N | 20 |  |
| Body | `- pre_rt` | 대비율 | String | N | 20 |  |
| Body | `- dt_trde_qty` | 기간거래량 | String | N | 20 |  |

---

### 종목별투자자기관별요청 (`ka10059`)

- **메뉴 위치**: 국내주식 > 종목정보 > 종목별투자자기관별요청(ka10059)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dt` | 일자 | String | Y | 8 | YYYYMMDD |
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `amt_qty_tp` | 금액수량구분 | String | Y | 1 | 1:금액, 2:수량 |
| Body | `trde_tp` | 매매구분 | String | Y | 1 | 0:순매수, 1:매수, 2:매도 |
| Body | `unit_tp` | 단위구분 | String | Y | 4 | 1000:천주, 1:단주 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_invsr_orgn` | 종목별투자자기관별 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 | 우측 2자리 소수점자리수 |
| Body | `- acc_trde_qty` | 누적거래량 | String | N | 20 |  |
| Body | `- acc_trde_prica` | 누적거래대금 | String | N | 20 |  |
| Body | `- ind_invsr` | 개인투자자 | String | N | 20 |  |
| Body | `- frgnr_invsr` | 외국인투자자 | String | N | 20 |  |
| Body | `- orgn` | 기관계 | String | N | 20 |  |
| Body | `- fnnc_invt` | 금융투자 | String | N | 20 |  |
| Body | `- insrnc` | 보험 | String | N | 20 |  |
| Body | `- invtrt` | 투신 | String | N | 20 |  |
| Body | `- etc_fnnc` | 기타금융 | String | N | 20 |  |
| Body | `- bank` | 은행 | String | N | 20 |  |
| Body | `- penfnd_etc` | 연기금등 | String | N | 20 |  |
| Body | `- samo_fund` | 사모펀드 | String | N | 20 |  |
| Body | `- natn` | 국가 | String | N | 20 |  |
| Body | `- etc_corp` | 기타법인 | String | N | 20 |  |
| Body | `- natfor` | 내외국인 | String | N | 20 |  |

---

### 종목별투자자기관별차트요청 (`ka10060`)

- **메뉴 위치**: 국내주식 > 차트 > 종목별투자자기관별차트요청(ka10060)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dt` | 일자 | String | Y | 8 | YYYYMMDD |
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `amt_qty_tp` | 금액수량구분 | String | Y | 1 | 1:금액, 2:수량 |
| Body | `trde_tp` | 매매구분 | String | Y | 1 | 0:순매수, 1:매수, 2:매도 |
| Body | `unit_tp` | 단위구분 | String | Y | 4 | 1000:천주, 1:단주 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_invsr_orgn_chart` | 종목별투자자기관별차트 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- acc_trde_prica` | 누적거래대금 | String | N | 20 |  |
| Body | `- ind_invsr` | 개인투자자 | String | N | 20 |  |
| Body | `- frgnr_invsr` | 외국인투자자 | String | N | 20 |  |
| Body | `- orgn` | 기관계 | String | N | 20 |  |
| Body | `- fnnc_invt` | 금융투자 | String | N | 20 |  |
| Body | `- insrnc` | 보험 | String | N | 20 |  |
| Body | `- invtrt` | 투신 | String | N | 20 |  |
| Body | `- etc_fnnc` | 기타금융 | String | N | 20 |  |
| Body | `- bank` | 은행 | String | N | 20 |  |
| Body | `- penfnd_etc` | 연기금등 | String | N | 20 |  |
| Body | `- samo_fund` | 사모펀드 | String | N | 20 |  |
| Body | `- natn` | 국가 | String | N | 20 |  |
| Body | `- etc_corp` | 기타법인 | String | N | 20 |  |
| Body | `- natfor` | 내외국인 | String | N | 20 |  |

---

### 종목별투자자기관별합계요청 (`ka10061`)

- **메뉴 위치**: 국내주식 > 종목정보 > 종목별투자자기관별합계요청(ka10061)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `strt_dt` | 시작일자 | String | Y | 8 | YYYYMMDD |
| Body | `end_dt` | 종료일자 | String | Y | 8 | YYYYMMDD |
| Body | `amt_qty_tp` | 금액수량구분 | String | Y | 1 | 1:금액, 2:수량 |
| Body | `trde_tp` | 매매구분 | String | Y | 1 | 0:순매수 |
| Body | `unit_tp` | 단위구분 | String | Y | 4 | 1000:천주, 1:단주 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_invsr_orgn_tot` | 종목별투자자기관별합계 | LIST | N |  |  |
| Body | `- ind_invsr` | 개인투자자 | String | N | 20 |  |
| Body | `- frgnr_invsr` | 외국인투자자 | String | N | 20 |  |
| Body | `- orgn` | 기관계 | String | N | 20 |  |
| Body | `- fnnc_invt` | 금융투자 | String | N | 20 |  |
| Body | `- insrnc` | 보험 | String | N | 20 |  |
| Body | `- invtrt` | 투신 | String | N | 20 |  |
| Body | `- etc_fnnc` | 기타금융 | String | N | 20 |  |
| Body | `- bank` | 은행 | String | N | 20 |  |
| Body | `- penfnd_etc` | 연기금등 | String | N | 20 |  |
| Body | `- samo_fund` | 사모펀드 | String | N | 20 |  |
| Body | `- natn` | 국가 | String | N | 20 |  |
| Body | `- etc_corp` | 기타법인 | String | N | 20 |  |
| Body | `- natfor` | 내외국인 | String | N | 20 |  |

---

### 동일순매매순위요청 (`ka10062`)

- **메뉴 위치**: 국내주식 > 순위정보 > 동일순매매순위요청(ka10062)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `strt_dt` | 시작일자 | String | Y | 8 | YYYYMMDD
(연도4자리, 월 2자리, 일 2자리 형식) |
| Body | `end_dt` | 종료일자 | String | N | 8 | YYYYMMDD
(연도4자리, 월 2자리, 일 2자리 형식) |
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001: 코스피, 101:코스닥 |
| Body | `trde_tp` | 매매구분 | String | Y | 1 | 1:순매수, 2:순매도 |
| Body | `sort_cnd` | 정렬조건 | String | Y | 1 | 1:수량, 2:금액 |
| Body | `unit_tp` | 단위구분 | String | Y | 1 | 1:단주, 1000:천주 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `eql_nettrde_rank` | 동일순매매순위 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- rank` | 순위 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- acc_trde_qty` | 누적거래량 | String | N | 20 |  |
| Body | `- orgn_nettrde_qty` | 기관순매매수량 | String | N | 20 |  |
| Body | `- orgn_nettrde_amt` | 기관순매매금액 | String | N | 20 |  |
| Body | `- orgn_nettrde_avg_pric` | 기관순매매평균가 | String | N | 20 |  |
| Body | `- for_nettrde_qty` | 외인순매매수량 | String | N | 20 |  |
| Body | `- for_nettrde_amt` | 외인순매매금액 | String | N | 20 |  |
| Body | `- for_nettrde_avg_pric` | 외인순매매평균가 | String | N | 20 |  |
| Body | `- nettrde_qty` | 순매매수량 | String | N | 20 |  |
| Body | `- nettrde_amt` | 순매매금액 | String | N | 20 |  |

---

### 장중투자자별매매요청 (`ka10063`)

- **메뉴 위치**: 국내주식 > 시세 > 장중투자자별매매요청(ka10063)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `amt_qty_tp` | 금액수량구분 | String | Y | 1 | 1: 금액&수량 |
| Body | `invsr` | 투자자별 | String | Y | 1 | 6:외국인, 7:기관계, 1:투신, 0:보험, 2:은행, 3:연기금, 4:국가, 5:기타법인 |
| Body | `frgn_all` | 외국계전체 | String | Y | 1 | 1:체크, 0:미체크 |
| Body | `smtm_netprps_tp` | 동시순매수구분 | String | Y | 1 | 1:체크, 0:미체크 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `opmr_invsr_trde` | 장중투자자별매매 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- acc_trde_qty` | 누적거래량 | String | N | 20 |  |
| Body | `- netprps_amt` | 순매수금액 | String | N | 20 |  |
| Body | `- prev_netprps_amt` | 이전순매수금액 | String | N | 20 |  |
| Body | `- buy_amt` | 매수금액 | String | N | 20 |  |
| Body | `- netprps_amt_irds` | 순매수금액증감 | String | N | 20 |  |
| Body | `- buy_amt_irds` | 매수금액증감 | String | N | 20 |  |
| Body | `- sell_amt` | 매도금액 | String | N | 20 |  |
| Body | `- sell_amt_irds` | 매도금액증감 | String | N | 20 |  |
| Body | `- netprps_qty` | 순매수수량 | String | N | 20 |  |
| Body | `- prev_pot_netprps_qty` | 이전시점순매수수량 | String | N | 20 |  |
| Body | `- netprps_irds` | 순매수증감 | String | N | 20 |  |
| Body | `- buy_qty` | 매수수량 | String | N | 20 |  |
| Body | `- buy_qty_irds` | 매수수량증감 | String | N | 20 |  |
| Body | `- sell_qty` | 매도수량 | String | N | 20 |  |
| Body | `- sell_qty_irds` | 매도수량증감 | String | N | 20 |  |

---

### 장중투자자별매매차트요청 (`ka10064`)

- **메뉴 위치**: 국내주식 > 차트 > 장중투자자별매매차트요청(ka10064)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `amt_qty_tp` | 금액수량구분 | String | Y | 1 | 1:금액, 2:수량 |
| Body | `trde_tp` | 매매구분 | String | Y | 1 | 0:순매수, 1:매수, 2:매도 |
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `opmr_invsr_trde_chart` | 장중투자자별매매차트 | LIST | N |  |  |
| Body | `- tm` | 시간 | String | N | 20 |  |
| Body | `- frgnr_invsr` | 외국인투자자 | String | N | 20 |  |
| Body | `- orgn` | 기관계 | String | N | 20 |  |
| Body | `- invtrt` | 투신 | String | N | 20 |  |
| Body | `- insrnc` | 보험 | String | N | 20 |  |
| Body | `- bank` | 은행 | String | N | 20 |  |
| Body | `- penfnd_etc` | 연기금등 | String | N | 20 |  |
| Body | `- etc_corp` | 기타법인 | String | N | 20 |  |
| Body | `- natn` | 국가 | String | N | 20 |  |

---

### 장중투자자별매매상위요청 (`ka10065`)

- **메뉴 위치**: 국내주식 > 순위정보 > 장중투자자별매매상위요청(ka10065)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trde_tp` | 매매구분 | String | Y | 1 | 1:순매수, 2:순매도 |
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `orgn_tp` | 기관구분 | String | Y | 4 | 9000:외국인, 9100:외국계, 1000:금융투자, 3000:투신, 5000:기타금융, 4000:은행, 2000:보험, 6000:연기금, 7000:국가, 7100:기타법인, 9999:기관계 |
| Body | `amt_qty_tp` | 금액수량구분 | String | N | 1 | 1:금액, 2:수량 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `opmr_invsr_trde_upper` | 장중투자자별매매상위 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- sel_qty` | 매도량 | String | N | 20 | 매도금액/매도량 |
| Body | `- buy_qty` | 매수량 | String | N | 20 | 매수금액/매수량 |
| Body | `- netslmt` | 순매도 | String | N | 20 | 순매수/순매도(금액/수량) |

---

### 장마감후투자자별매매요청 (`ka10066`)

- **메뉴 위치**: 국내주식 > 시세 > 장마감후투자자별매매요청(ka10066)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `amt_qty_tp` | 금액수량구분 | String | Y | 1 | 1:금액, 2:수량 |
| Body | `trde_tp` | 매매구분 | String | Y | 1 | 0:순매수, 1:매수, 2:매도 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `opaf_invsr_trde` | 장중투자자별매매차트 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- ind_invsr` | 개인투자자 | String | N | 20 |  |
| Body | `- frgnr_invsr` | 외국인투자자 | String | N | 20 |  |
| Body | `- orgn` | 기관계 | String | N | 20 |  |
| Body | `- fnnc_invt` | 금융투자 | String | N | 20 |  |
| Body | `- insrnc` | 보험 | String | N | 20 |  |
| Body | `- invtrt` | 투신 | String | N | 20 |  |
| Body | `- etc_fnnc` | 기타금융 | String | N | 20 |  |
| Body | `- bank` | 은행 | String | N | 20 |  |
| Body | `- penfnd_etc` | 연기금등 | String | N | 20 |  |
| Body | `- samo_fund` | 사모펀드 | String | N | 20 |  |
| Body | `- natn` | 국가 | String | N | 20 |  |
| Body | `- etc_corp` | 기타법인 | String | N | 20 |  |

---

### 대차거래추이요청 (`ka10068`)

- **메뉴 위치**: 국내주식 > 대차거래 > 대차거래추이요청(ka10068)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/slb`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `strt_dt` | 시작일자 | String | N | 8 | YYYYMMDD |
| Body | `end_dt` | 종료일자 | String | N | 8 | YYYYMMDD |
| Body | `all_tp` | 전체구분 | String | Y | 6 | 1: 전체표시 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dbrt_trde_trnsn` | 대차거래추이 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 8 |  |
| Body | `- dbrt_trde_cntrcnt` | 대차거래체결주수 | String | N | 12 |  |
| Body | `- dbrt_trde_rpy` | 대차거래상환주수 | String | N | 18 |  |
| Body | `- dbrt_trde_irds` | 대차거래증감 | String | N | 60 |  |
| Body | `- rmnd` | 잔고주수 | String | N | 18 |  |
| Body | `- remn_amt` | 잔고금액 | String | N | 18 |  |

---

### 대차거래상위10종목요청 (`ka10069`)

- **메뉴 위치**: 국내주식 > 대차거래 > 대차거래상위10종목요청(ka10069)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/slb`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `strt_dt` | 시작일자 | String | Y | 8 | YYYYMMDD
(연도4자리, 월 2자리, 일 2자리 형식) |
| Body | `end_dt` | 종료일자 | String | N | 8 | YYYYMMDD
(연도4자리, 월 2자리, 일 2자리 형식) |
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 001:코스피, 101:코스닥 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dbrt_trde_cntrcnt_sum` | 대차거래체결주수합 | String | N |  |  |
| Body | `dbrt_trde_rpy_sum` | 대차거래상환주수합 | String | N |  |  |
| Body | `rmnd_sum` | 잔고주수합 | String | N |  |  |
| Body | `remn_amt_sum` | 잔고금액합 | String | N |  |  |
| Body | `dbrt_trde_cntrcnt_rt` | 대차거래체결주수비율 | String | N |  |  |
| Body | `dbrt_trde_rpy_rt` | 대차거래상환주수비율 | String | N |  |  |
| Body | `rmnd_rt` | 잔고주수비율 | String | N |  |  |
| Body | `remn_amt_rt` | 잔고금액비율 | String | N |  |  |
| Body | `dbrt_trde_upper_10stk` | 대차거래상위10종목 | LIST | N |  |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- dbrt_trde_cntrcnt` | 대차거래체결주수 | String | N | 20 |  |
| Body | `- dbrt_trde_rpy` | 대차거래상환주수 | String | N | 20 |  |
| Body | `- rmnd` | 잔고주수 | String | N | 20 |  |
| Body | `- remn_amt` | 잔고금액 | String | N | 20 |  |

---

### 일자별종목별실현손익요청_일자 (`ka10072`)

- **메뉴 위치**: 국내주식 > 계좌 > 일자별종목별실현손익요청_일자(ka10072)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | N | 6 |  |
| Body | `strt_dt` | 시작일자 | String | Y | 8 | YYYYMMDD |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dt_stk_div_rlzt_pl` | 일자별종목별실현손익 | LIST | N |  |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cntr_qty` | 체결량 | String | N | 20 |  |
| Body | `- buy_uv` | 매입단가 | String | N | 20 |  |
| Body | `- cntr_pric` | 체결가 | String | N | 20 |  |
| Body | `- tdy_sel_pl` | 당일매도손익 | String | N | 20 |  |
| Body | `- pl_rt` | 손익율 | String | N | 20 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- tdy_trde_cmsn` | 당일매매수수료 | String | N | 20 |  |
| Body | `- tdy_trde_tax` | 당일매매세금 | String | N | 20 |  |
| Body | `- wthd_alowa` | 인출가능금액 | String | N | 20 |  |
| Body | `- loan_dt` | 대출일 | String | N | 20 |  |
| Body | `- crd_tp` | 신용구분 | String | N | 20 |  |
| Body | `- stk_cd_1` | 종목코드1 | String | N | 20 |  |
| Body | `- tdy_sel_pl_1` | 당일매도손익1 | String | N | 20 |  |

---

### 일자별종목별실현손익요청_기간 (`ka10073`)

- **메뉴 위치**: 국내주식 > 계좌 > 일자별종목별실현손익요청_기간(ka10073)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | N | 6 |  |
| Body | `strt_dt` | 시작일자 | String | Y | 8 | YYYYMMDD |
| Body | `end_dt` | 종료일자 | String | Y | 8 | YYYYMMDD |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dt_stk_rlzt_pl` | 일자별종목별실현손익 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- tdy_htssel_cmsn` | 당일hts매도수수료 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cntr_qty` | 체결량 | String | N | 20 |  |
| Body | `- buy_uv` | 매입단가 | String | N | 20 |  |
| Body | `- cntr_pric` | 체결가 | String | N | 20 |  |
| Body | `- tdy_sel_pl` | 당일매도손익 | String | N | 20 |  |
| Body | `- pl_rt` | 손익율 | String | N | 20 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- tdy_trde_cmsn` | 당일매매수수료 | String | N | 20 |  |
| Body | `- tdy_trde_tax` | 당일매매세금 | String | N | 20 |  |
| Body | `- wthd_alowa` | 인출가능금액 | String | N | 20 |  |
| Body | `- loan_dt` | 대출일 | String | N | 20 |  |
| Body | `- crd_tp` | 신용구분 | String | N | 20 |  |

---

### 일자별실현손익요청 (`ka10074`)

- **메뉴 위치**: 국내주식 > 계좌 > 일자별실현손익요청(ka10074)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `strt_dt` | 시작일자 | String | Y | 8 |  |
| Body | `end_dt` | 종료일자 | String | Y | 8 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `tot_buy_amt` | 총매수금액 | String | N |  |  |
| Body | `tot_sell_amt` | 총매도금액 | String | N |  |  |
| Body | `rlzt_pl` | 실현손익 | String | N |  |  |
| Body | `trde_cmsn` | 매매수수료 | String | N |  |  |
| Body | `trde_tax` | 매매세금 | String | N |  |  |
| Body | `dt_rlzt_pl` | 일자별실현손익 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- buy_amt` | 매수금액 | String | N | 20 |  |
| Body | `- sell_amt` | 매도금액 | String | N | 20 |  |
| Body | `- tdy_sel_pl` | 당일매도손익 | String | N | 20 |  |
| Body | `- tdy_trde_cmsn` | 당일매매수수료 | String | N | 20 |  |
| Body | `- tdy_trde_tax` | 당일매매세금 | String | N | 20 |  |

---

### 미체결요청 (`ka10075`)

- **메뉴 위치**: 국내주식 > 계좌 > 미체결요청(ka10075)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `all_stk_tp` | 전체종목구분 | String | Y | 1 | 0:전체, 1:종목 |
| Body | `trde_tp` | 매매구분 | String | Y | 1 | 0:전체, 1:매도, 2:매수 |
| Body | `stk_cd` | 종목코드 | String | N | 6 |  |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 0 : 통합, 1 : KRX, 2 : NXT |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `oso` | 미체결 | LIST | N |  |  |
| Body | `- acnt_no` | 계좌번호 | String | N | 20 |  |
| Body | `- ord_no` | 주문번호 | String | N | 20 |  |
| Body | `- mang_empno` | 관리사번 | String | N | 20 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- tsk_tp` | 업무구분 | String | N | 20 |  |
| Body | `- ord_stt` | 주문상태 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- ord_qty` | 주문수량 | String | N | 20 |  |
| Body | `- ord_pric` | 주문가격 | String | N | 20 |  |
| Body | `- oso_qty` | 미체결수량 | String | N | 20 |  |
| Body | `- cntr_tot_amt` | 체결누계금액 | String | N | 20 |  |
| Body | `- orig_ord_no` | 원주문번호 | String | N | 20 |  |
| Body | `- io_tp_nm` | 주문구분 | String | N | 20 |  |
| Body | `- trde_tp` | 매매구분 | String | N | 20 |  |
| Body | `- tm` | 시간 | String | N | 20 |  |
| Body | `- cntr_no` | 체결번호 | String | N | 20 |  |
| Body | `- cntr_pric` | 체결가 | String | N | 20 |  |
| Body | `- cntr_qty` | 체결량 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- sel_bid` | 매도호가 | String | N | 20 |  |
| Body | `- buy_bid` | 매수호가 | String | N | 20 |  |
| Body | `- unit_cntr_pric` | 단위체결가 | String | N | 20 |  |
| Body | `- unit_cntr_qty` | 단위체결량 | String | N | 20 |  |
| Body | `- tdy_trde_cmsn` | 당일매매수수료 | String | N | 20 |  |
| Body | `- tdy_trde_tax` | 당일매매세금 | String | N | 20 |  |
| Body | `- ind_invsr` | 개인투자자 | String | N | 20 |  |
| Body | `- stex_tp` | 거래소구분 | String | N | 20 | 0 : 통합, 1 : KRX, 2 : NXT |
| Body | `- stex_tp_txt` | 거래소구분텍스트 | String | N | 20 | 통합,KRX,NXT |
| Body | `- sor_yn` | SOR 여부값 | String | N | 20 | Y,N |
| Body | `- stop_pric` | 스톱가 | String | N | 20 | 스톱지정가주문 스톱가 |

---

### 체결요청 (`ka10076`)

- **메뉴 위치**: 국내주식 > 계좌 > 체결요청(ka10076)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | N | 6 |  |
| Body | `qry_tp` | 조회구분 | String | Y | 1 | 0:전체, 1:종목 |
| Body | `sell_tp` | 매도수구분 | String | Y | 1 | 0:전체, 1:매도, 2:매수 |
| Body | `ord_no` | 주문번호 | String | N | 10 | 검색 기준 값으로 입력한 주문번호 보다 과거에 체결된 내역이 조회됩니다. |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 0 : 통합, 1 : KRX, 2 : NXT |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `cntr` | 체결 | LIST | N |  |  |
| Body | `- ord_no` | 주문번호 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- io_tp_nm` | 주문구분 | String | N | 20 |  |
| Body | `- ord_pric` | 주문가격 | String | N | 20 |  |
| Body | `- ord_qty` | 주문수량 | String | N | 20 |  |
| Body | `- cntr_pric` | 체결가 | String | N | 20 |  |
| Body | `- cntr_qty` | 체결량 | String | N | 20 |  |
| Body | `- oso_qty` | 미체결수량 | String | N | 20 |  |
| Body | `- tdy_trde_cmsn` | 당일매매수수료 | String | N | 20 |  |
| Body | `- tdy_trde_tax` | 당일매매세금 | String | N | 20 |  |
| Body | `- ord_stt` | 주문상태 | String | N | 20 |  |
| Body | `- trde_tp` | 매매구분 | String | N | 20 |  |
| Body | `- orig_ord_no` | 원주문번호 | String | N | 20 |  |
| Body | `- ord_tm` | 주문시간 | String | N | 20 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stex_tp` | 거래소구분 | String | N | 20 | 0 : 통합, 1 : KRX, 2 : NXT |
| Body | `- stex_tp_txt` | 거래소구분텍스트 | String | N | 20 | 통합,KRX,NXT |
| Body | `- sor_yn` | SOR 여부값 | String | N | 20 | Y,N |
| Body | `- stop_pric` | 스톱가 | String | N | 20 | 스톱지정가주문 스톱가 |

---

### 당일실현손익상세요청 (`ka10077`)

- **메뉴 위치**: 국내주식 > 계좌 > 당일실현손익상세요청(ka10077)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `tdy_rlzt_pl` | 당일실현손익 | String | N |  |  |
| Body | `tdy_rlzt_pl_dtl` | 당일실현손익상세 | LIST | N |  |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cntr_qty` | 체결량 | String | N | 20 |  |
| Body | `- buy_uv` | 매입단가 | String | N | 20 |  |
| Body | `- cntr_pric` | 체결가 | String | N | 20 |  |
| Body | `- tdy_sel_pl` | 당일매도손익 | String | N | 20 |  |
| Body | `- pl_rt` | 손익율 | String | N | 20 |  |
| Body | `- tdy_trde_cmsn` | 당일매매수수료 | String | N | 20 |  |
| Body | `- tdy_trde_tax` | 당일매매세금 | String | N | 20 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |

---

### 증권사별종목매매동향요청 (`ka10078`)

- **메뉴 위치**: 국내주식 > 시세 > 증권사별종목매매동향요청(ka10078)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mmcm_cd` | 회원사코드 | String | Y | 3 | 회원사 코드는 ka10102 조회 |
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `strt_dt` | 시작일자 | String | Y | 8 | YYYYMMDD |
| Body | `end_dt` | 종료일자 | String | Y | 8 | YYYYMMDD |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `sec_stk_trde_trend` | 증권사별종목매매동향 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- acc_trde_qty` | 누적거래량 | String | N | 20 |  |
| Body | `- netprps_qty` | 순매수수량 | String | N | 20 |  |
| Body | `- buy_qty` | 매수수량 | String | N | 20 |  |
| Body | `- sell_qty` | 매도수량 | String | N | 20 |  |

---

### 주식틱차트조회요청 (`ka10079`)

- **메뉴 위치**: 국내주식 > 차트 > 주식틱차트조회요청(ka10079)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `tic_scope` | 틱범위 | String | Y | 2 | 1:1틱, 3:3틱, 5:5틱, 10:10틱, 30:30틱 |
| Body | `upd_stkpc_tp` | 수정주가구분 | String | Y | 1 | 0 or 1 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | N | 6 |  |
| Body | `last_tic_cnt` | 마지막틱갯수 | String | N |  |  |
| Body | `stk_tic_chart_qry` | 주식틱차트조회 | LIST | N |  |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- cntr_tm` | 체결시간 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 | 현재가 - 전일종가 |
| Body | `- pred_pre_sig` | 전일대비 기호 | String | N | 20 | 1: 상한가, 2:상승, 3:보합, 4:하한가, 5:하락 |

---

### 주식분봉차트조회요청 (`ka10080`)

- **메뉴 위치**: 국내주식 > 차트 > 주식분봉차트조회요청(ka10080)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `tic_scope` | 틱범위 | String | Y | 2 | 1:1분, 3:3분, 5:5분, 10:10분, 15:15분, 30:30분, 45:45분, 60:60분 |
| Body | `upd_stkpc_tp` | 수정주가구분 | String | Y | 1 | 0 or 1 |
| Body | `base_dt` | 기준일자 | String | N | 8 | YYYYMMDD |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | N | 6 |  |
| Body | `stk_min_pole_chart_qry` | 주식분봉차트조회 | LIST | N |  |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 | 종가 |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- cntr_tm` | 체결시간 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 | 현재가 - 전일종가 |
| Body | `- pred_pre_sig` | 전일대비 기호 | String | N | 20 | 1: 상한가, 2:상승, 3:보합, 4:하한가, 5:하락 |

---

### 주식일봉차트조회요청 (`ka10081`)

- **메뉴 위치**: 국내주식 > 차트 > 주식일봉차트조회요청(ka10081)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `base_dt` | 기준일자 | String | Y | 8 | YYYYMMDD |
| Body | `upd_stkpc_tp` | 수정주가구분 | String | Y | 1 | 0 or 1 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | N | 6 |  |
| Body | `stk_dt_pole_chart_qry` | 주식일봉차트조회 | LIST | N |  |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- trde_prica` | 거래대금 | String | N | 20 |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 | 현재가 - 전일종가 |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 | 1: 상한가, 2:상승, 3:보합, 4:하한가, 5:하락 |
| Body | `- trde_tern_rt` | 거래회전율 | String | N | 20 |  |

---

### 주식주봉차트조회요청 (`ka10082`)

- **메뉴 위치**: 국내주식 > 차트 > 주식주봉차트조회요청(ka10082)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `base_dt` | 기준일자 | String | Y | 8 | YYYYMMDD |
| Body | `upd_stkpc_tp` | 수정주가구분 | String | Y | 1 | 0 or 1 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | N | 6 |  |
| Body | `stk_stk_pole_chart_qry` | 주식주봉차트조회 | LIST | N |  |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- trde_prica` | 거래대금 | String | N | 20 |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 | 현재가 - 전일종가 |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 | 1: 상한가, 2:상승, 3:보합, 4:하한가, 5:하락 |
| Body | `- trde_tern_rt` | 거래회전율 | String | N | 20 |  |

---

### 주식월봉차트조회요청 (`ka10083`)

- **메뉴 위치**: 국내주식 > 차트 > 주식월봉차트조회요청(ka10083)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `base_dt` | 기준일자 | String | Y | 8 | YYYYMMDD |
| Body | `upd_stkpc_tp` | 수정주가구분 | String | Y | 1 | 0 or 1 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | N | 6 |  |
| Body | `stk_mth_pole_chart_qry` | 주식월봉차트조회 | LIST | N |  |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- trde_prica` | 거래대금 | String | N | 20 |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 | 현재가 - 전일종가 |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 | 1: 상한가, 2:상승, 3:보합, 4:하한가, 5:하락 |
| Body | `- trde_tern_rt` | 거래회전율 | String | N | 20 |  |

---

### 당일전일체결요청 (`ka10084`)

- **메뉴 위치**: 국내주식 > 종목정보 > 당일전일체결요청(ka10084)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `tdy_pred` | 당일전일 | String | Y | 1 | 당일 : 1, 전일 : 2 |
| Body | `tic_min` | 틱분 | String | Y | 1 | 0:틱, 1:분 |
| Body | `tm` | 시간 | String | N | 4 | 조회시간 4자리, 오전 9시일 경우 0900, 오후 2시 30분일 경우 1430 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `tdy_pred_cntr` | 당일전일체결 | LIST | N |  |  |
| Body | `- tm` | 시간 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- pre_rt` | 대비율 | String | N | 20 |  |
| Body | `- pri_sel_bid_unit` | 우선매도호가단위 | String | N | 20 |  |
| Body | `- pri_buy_bid_unit` | 우선매수호가단위 | String | N | 20 |  |
| Body | `- cntr_trde_qty` | 체결거래량 | String | N | 20 |  |
| Body | `- sign` | 전일대비기호 | String | N | 20 |  |
| Body | `- acc_trde_qty` | 누적거래량 | String | N | 20 |  |
| Body | `- acc_trde_prica` | 누적거래대금 | String | N | 20 |  |
| Body | `- cntr_str` | 체결강도 | String | N | 20 |  |
| Body | `- stex_tp` | 거래소구분 | String | N | 20 | KRX , NXT , 통합 |

---

### 계좌수익률요청 (`ka10085`)

- **메뉴 위치**: 국내주식 > 계좌 > 계좌수익률요청(ka10085)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 0 : 통합, 1 : KRX, 2 : NXT |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `acnt_prft_rt` | 계좌수익률 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pur_pric` | 매입가 | String | N | 20 |  |
| Body | `- pur_amt` | 매입금액 | String | N | 20 |  |
| Body | `- rmnd_qty` | 보유수량 | String | N | 20 |  |
| Body | `- tdy_sel_pl` | 당일매도손익 | String | N | 20 |  |
| Body | `- tdy_trde_cmsn` | 당일매매수수료 | String | N | 20 |  |
| Body | `- tdy_trde_tax` | 당일매매세금 | String | N | 20 |  |
| Body | `- crd_tp` | 신용구분 | String | N | 20 |  |
| Body | `- loan_dt` | 대출일 | String | N | 20 |  |
| Body | `- setl_remn` | 결제잔고 | String | N | 20 |  |
| Body | `- clrn_alow_qty` | 청산가능수량 | String | N | 20 |  |
| Body | `- crd_amt` | 신용금액 | String | N | 20 |  |
| Body | `- crd_int` | 신용이자 | String | N | 20 |  |
| Body | `- expr_dt` | 만기일 | String | N | 20 |  |

---

### 일별주가요청 (`ka10086`)

- **메뉴 위치**: 국내주식 > 시세 > 일별주가요청(ka10086)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `qry_dt` | 조회일자 | String | Y | 8 | YYYYMMDD |
| Body | `indc_tp` | 표시구분 | String | Y | 1 | 0:수량, 1:금액(백만원) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `daly_stkpc` | 일별주가 | LIST | N |  |  |
| Body | `- date` | 날짜 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |
| Body | `- close_pric` | 종가 | String | N | 20 |  |
| Body | `- pred_rt` | 전일비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- amt_mn` | 금액(백만) | String | N | 20 |  |
| Body | `- crd_rt` | 신용비 | String | N | 20 |  |
| Body | `- ind` | 개인 | String | N | 20 |  |
| Body | `- orgn` | 기관 | String | N | 20 |  |
| Body | `- for_qty` | 외인수량 | String | N | 20 |  |
| Body | `- frgn` | 외국계 | String | N | 20 |  |
| Body | `- prm` | 프로그램 | String | N | 20 |  |
| Body | `- for_rt` | 외인비 | String | N | 20 |  |
| Body | `- for_poss` | 외인보유 | String | N | 20 |  |
| Body | `- for_wght` | 외인비중 | String | N | 20 |  |
| Body | `- for_netprps` | 외인순매수 | String | N | 20 |  |
| Body | `- orgn_netprps` | 기관순매수 | String | N | 20 |  |
| Body | `- ind_netprps` | 개인순매수 | String | N | 20 |  |
| Body | `- crd_remn_rt` | 신용잔고율 | String | N | 20 |  |

---

### 시간외단일가요청 (`ka10087`)

- **메뉴 위치**: 국내주식 > 시세 > 시간외단일가요청(ka10087)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `bid_req_base_tm` | 호가잔량기준시간 | String | N |  |  |
| Body | `ovt_sigpric_sel_bid_jub_pre_5` | 시간외단일가_매도호가직전대비5 | String | N |  |  |
| Body | `ovt_sigpric_sel_bid_jub_pre_4` | 시간외단일가_매도호가직전대비4 | String | N |  |  |
| Body | `ovt_sigpric_sel_bid_jub_pre_3` | 시간외단일가_매도호가직전대비3 | String | N |  |  |
| Body | `ovt_sigpric_sel_bid_jub_pre_2` | 시간외단일가_매도호가직전대비2 | String | N |  |  |
| Body | `ovt_sigpric_sel_bid_jub_pre_1` | 시간외단일가_매도호가직전대비1 | String | N |  |  |
| Body | `ovt_sigpric_sel_bid_qty_5` | 시간외단일가_매도호가수량5 | String | N |  |  |
| Body | `ovt_sigpric_sel_bid_qty_4` | 시간외단일가_매도호가수량4 | String | N |  |  |
| Body | `ovt_sigpric_sel_bid_qty_3` | 시간외단일가_매도호가수량3 | String | N |  |  |
| Body | `ovt_sigpric_sel_bid_qty_2` | 시간외단일가_매도호가수량2 | String | N |  |  |
| Body | `ovt_sigpric_sel_bid_qty_1` | 시간외단일가_매도호가수량1 | String | N |  |  |
| Body | `ovt_sigpric_sel_bid_5` | 시간외단일가_매도호가5 | String | N |  |  |
| Body | `ovt_sigpric_sel_bid_4` | 시간외단일가_매도호가4 | String | N |  |  |
| Body | `ovt_sigpric_sel_bid_3` | 시간외단일가_매도호가3 | String | N |  |  |
| Body | `ovt_sigpric_sel_bid_2` | 시간외단일가_매도호가2 | String | N |  |  |
| Body | `ovt_sigpric_sel_bid_1` | 시간외단일가_매도호가1 | String | N |  |  |
| Body | `ovt_sigpric_buy_bid_1` | 시간외단일가_매수호가1 | String | N |  |  |
| Body | `ovt_sigpric_buy_bid_2` | 시간외단일가_매수호가2 | String | N |  |  |
| Body | `ovt_sigpric_buy_bid_3` | 시간외단일가_매수호가3 | String | N |  |  |
| Body | `ovt_sigpric_buy_bid_4` | 시간외단일가_매수호가4 | String | N |  |  |
| Body | `ovt_sigpric_buy_bid_5` | 시간외단일가_매수호가5 | String | N |  |  |
| Body | `ovt_sigpric_buy_bid_qty_1` | 시간외단일가_매수호가수량1 | String | N |  |  |
| Body | `ovt_sigpric_buy_bid_qty_2` | 시간외단일가_매수호가수량2 | String | N |  |  |
| Body | `ovt_sigpric_buy_bid_qty_3` | 시간외단일가_매수호가수량3 | String | N |  |  |
| Body | `ovt_sigpric_buy_bid_qty_4` | 시간외단일가_매수호가수량4 | String | N |  |  |
| Body | `ovt_sigpric_buy_bid_qty_5` | 시간외단일가_매수호가수량5 | String | N |  |  |
| Body | `ovt_sigpric_buy_bid_jub_pre_1` | 시간외단일가_매수호가직전대비1 | String | N |  |  |
| Body | `ovt_sigpric_buy_bid_jub_pre_2` | 시간외단일가_매수호가직전대비2 | String | N |  |  |
| Body | `ovt_sigpric_buy_bid_jub_pre_3` | 시간외단일가_매수호가직전대비3 | String | N |  |  |
| Body | `ovt_sigpric_buy_bid_jub_pre_4` | 시간외단일가_매수호가직전대비4 | String | N |  |  |
| Body | `ovt_sigpric_buy_bid_jub_pre_5` | 시간외단일가_매수호가직전대비5 | String | N |  |  |
| Body | `ovt_sigpric_sel_bid_tot_req` | 시간외단일가_매도호가총잔량 | String | N |  |  |
| Body | `ovt_sigpric_buy_bid_tot_req` | 시간외단일가_매수호가총잔량 | String | N |  |  |
| Body | `sel_bid_tot_req_jub_pre` | 매도호가총잔량직전대비 | String | N |  |  |
| Body | `sel_bid_tot_req` | 매도호가총잔량 | String | N |  |  |
| Body | `buy_bid_tot_req` | 매수호가총잔량 | String | N |  |  |
| Body | `buy_bid_tot_req_jub_pre` | 매수호가총잔량직전대비 | String | N |  |  |
| Body | `ovt_sel_bid_tot_req_jub_pre` | 시간외매도호가총잔량직전대비 | String | N |  |  |
| Body | `ovt_sel_bid_tot_req` | 시간외매도호가총잔량 | String | N |  |  |
| Body | `ovt_buy_bid_tot_req` | 시간외매수호가총잔량 | String | N |  |  |
| Body | `ovt_buy_bid_tot_req_jub_pre` | 시간외매수호가총잔량직전대비 | String | N |  |  |
| Body | `ovt_sigpric_cur_prc` | 시간외단일가_현재가 | String | N |  |  |
| Body | `ovt_sigpric_pred_pre_sig` | 시간외단일가_전일대비기호 | String | N |  |  |
| Body | `ovt_sigpric_pred_pre` | 시간외단일가_전일대비 | String | N |  |  |
| Body | `ovt_sigpric_flu_rt` | 시간외단일가_등락률 | String | N |  |  |
| Body | `ovt_sigpric_acc_trde_qty` | 시간외단일가_누적거래량 | String | N |  |  |

---

### 미체결 분할주문 상세 (`ka10088`)

- **메뉴 위치**: 국내주식 > 계좌 > 미체결 분할주문 상세(ka10088)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ord_no` | 주문번호 | String | Y | 20 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `osop` | 미체결분할주문리스트 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- ord_no` | 주문번호 | String | N | 20 |  |
| Body | `- ord_qty` | 주문수량 | String | N | 20 |  |
| Body | `- ord_pric` | 주문가격 | String | N | 20 |  |
| Body | `- osop_qty` | 미체결수량 | String | N | 20 |  |
| Body | `- io_tp_nm` | 주문구분 | String | N | 20 |  |
| Body | `- trde_tp` | 매매구분 | String | N | 20 |  |
| Body | `- sell_tp` | 매도/수 구분 | String | N | 20 |  |
| Body | `- cntr_qty` | 체결량 | String | N | 20 |  |
| Body | `- ord_stt` | 주문상태 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- stex_tp` | 거래소구분 | String | N | 20 | 0 : 통합, 1 : KRX, 2 : NXT |
| Body | `- stex_tp_txt` | 거래소구분텍스트 | String | N | 20 | 통합,KRX,NXT |

---

### 주식년봉차트조회요청 (`ka10094`)

- **메뉴 위치**: 국내주식 > 차트 > 주식년봉차트조회요청(ka10094)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `base_dt` | 기준일자 | String | Y | 8 | YYYYMMDD |
| Body | `upd_stkpc_tp` | 수정주가구분 | String | Y | 1 | 0 or 1 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | N | 6 |  |
| Body | `stk_yr_pole_chart_qry` | 주식년봉차트조회 | LIST | N |  |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- trde_prica` | 거래대금 | String | N | 20 |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |

---

### 관심종목정보요청 (`ka10095`)

- **메뉴 위치**: 국내주식 > 종목정보 > 관심종목정보요청(ka10095)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL)
여러개의 종목코드 입력시 | 로 구분 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `atn_stk_infr` | 관심종목정보 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- base_pric` | 기준가 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- trde_prica` | 거래대금 | String | N | 20 |  |
| Body | `- cntr_qty` | 체결량 | String | N | 20 |  |
| Body | `- cntr_str` | 체결강도 | String | N | 20 |  |
| Body | `- pred_trde_qty_pre` | 전일거래량대비 | String | N | 20 |  |
| Body | `- sel_bid` | 매도호가 | String | N | 20 |  |
| Body | `- buy_bid` | 매수호가 | String | N | 20 |  |
| Body | `- sel_1th_bid` | 매도1차호가 | String | N | 20 |  |
| Body | `- sel_2th_bid` | 매도2차호가 | String | N | 20 |  |
| Body | `- sel_3th_bid` | 매도3차호가 | String | N | 20 |  |
| Body | `- sel_4th_bid` | 매도4차호가 | String | N | 20 |  |
| Body | `- sel_5th_bid` | 매도5차호가 | String | N | 20 |  |
| Body | `- buy_1th_bid` | 매수1차호가 | String | N | 20 |  |
| Body | `- buy_2th_bid` | 매수2차호가 | String | N | 20 |  |
| Body | `- buy_3th_bid` | 매수3차호가 | String | N | 20 |  |
| Body | `- buy_4th_bid` | 매수4차호가 | String | N | 20 |  |
| Body | `- buy_5th_bid` | 매수5차호가 | String | N | 20 |  |
| Body | `- upl_pric` | 상한가 | String | N | 20 |  |
| Body | `- lst_pric` | 하한가 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |
| Body | `- close_pric` | 종가 | String | N | 20 |  |
| Body | `- cntr_tm` | 체결시간 | String | N | 20 |  |
| Body | `- exp_cntr_pric` | 예상체결가 | String | N | 20 |  |
| Body | `- exp_cntr_qty` | 예상체결량 | String | N | 20 |  |
| Body | `- cap` | 자본금 | String | N | 20 |  |
| Body | `- fav` | 액면가 | String | N | 20 |  |
| Body | `- mac` | 시가총액 | String | N | 20 |  |
| Body | `- stkcnt` | 주식수 | String | N | 20 |  |
| Body | `- bid_tm` | 호가시간 | String | N | 20 |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- pri_sel_req` | 우선매도잔량 | String | N | 20 |  |
| Body | `- pri_buy_req` | 우선매수잔량 | String | N | 20 |  |
| Body | `- pri_sel_cnt` | 우선매도건수 | String | N | 20 |  |
| Body | `- pri_buy_cnt` | 우선매수건수 | String | N | 20 |  |
| Body | `- tot_sel_req` | 총매도잔량 | String | N | 20 |  |
| Body | `- tot_buy_req` | 총매수잔량 | String | N | 20 |  |
| Body | `- tot_sel_cnt` | 총매도건수 | String | N | 20 |  |
| Body | `- tot_buy_cnt` | 총매수건수 | String | N | 20 |  |
| Body | `- prty` | 패리티 | String | N | 20 |  |
| Body | `- gear` | 기어링 | String | N | 20 |  |
| Body | `- pl_qutr` | 손익분기 | String | N | 20 |  |
| Body | `- cap_support` | 자본지지 | String | N | 20 |  |
| Body | `- elwexec_pric` | ELW행사가 | String | N | 20 |  |
| Body | `- cnvt_rt` | 전환비율 | String | N | 20 |  |
| Body | `- elwexpr_dt` | ELW만기일 | String | N | 20 |  |
| Body | `- cntr_engg` | 미결제약정 | String | N | 20 |  |
| Body | `- cntr_pred_pre` | 미결제전일대비 | String | N | 20 |  |
| Body | `- theory_pric` | 이론가 | String | N | 20 |  |
| Body | `- innr_vltl` | 내재변동성 | String | N | 20 |  |
| Body | `- delta` | 델타 | String | N | 20 |  |
| Body | `- gam` | 감마 | String | N | 20 |  |
| Body | `- theta` | 쎄타 | String | N | 20 |  |
| Body | `- vega` | 베가 | String | N | 20 |  |
| Body | `- law` | 로 | String | N | 20 |  |

---

### 시간외단일가등락율순위요청 (`ka10098`)

- **메뉴 위치**: 국내주식 > 순위정보 > 시간외단일가등락율순위요청(ka10098)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체,001:코스피,101:코스닥 |
| Body | `sort_base` | 정렬기준 | String | Y | 1 | 1:상승률, 2:상승폭, 3:하락률, 4:하락폭, 5:보합 |
| Body | `stk_cnd` | 종목조건 | String | Y | 2 | 0:전체조회,1:관리종목제외,2:정리매매종목제외,3:우선주제외,4:관리종목우선주제외,5:증100제외,6:증100만보기,7:증40만보기,8:증30만보기,9:증20만보기,12:증50만보기,13:증60만보기,14:ETF제외,15:스팩제외,16:ETF+ETN제외,17:ETN제외 |
| Body | `trde_qty_cnd` | 거래량조건 | String | Y | 5 | 0:전체조회, 10:백주이상,50:5백주이상,100;천주이상, 500:5천주이상, 1000:만주이상, 5000:5만주이상, 10000:10만주이상 |
| Body | `crd_cnd` | 신용조건 | String | Y | 1 | 0:전체조회, 9:신용융자전체, 1:신용융자A군, 2:신용융자B군, 3:신용융자C군, 4:신용융자D군, 7:신용융자E군, 8:신용대주, 5:신용한도초과제외 |
| Body | `trde_prica` | 거래대금 | String | Y | 5 | 0:전체조회, 5:5백만원이상,10:1천만원이상, 30:3천만원이상, 50:5천만원이상, 100:1억원이상, 300:3억원이상, 500:5억원이상, 1000:10억원이상, 3000:30억원이상, 5000:50억원이상, 10000:100억원이상 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ovt_sigpric_flu_rt_rank` | 시간외단일가등락율순위 | LIST | N |  |  |
| Body | `- rank` | 순위 | String | N | 20 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- sel_tot_req` | 매도총잔량 | String | N | 20 |  |
| Body | `- buy_tot_req` | 매수총잔량 | String | N | 20 |  |
| Body | `- acc_trde_qty` | 누적거래량 | String | N | 20 |  |
| Body | `- acc_trde_prica` | 누적거래대금 | String | N | 20 |  |
| Body | `- tdy_close_pric` | 당일종가 | String | N | 20 |  |
| Body | `- tdy_close_pric_flu_rt` | 당일종가등락률 | String | N | 20 |  |

---

### 종목정보 리스트 (`ka10099`)

- **메뉴 위치**: 국내주식 > 종목정보 > 종목정보 리스트(ka10099)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 2 | 0 : 코스피,
10 : 코스닥,
30 : K-OTC,
50 : 코넥스,
60 : ETN,
70 : 손실제한 ETN,
80 : 금현물,
90 : 변동성 ETN,
2 : 인프라투융자,
3 : ELW,
4 : 뮤추얼펀드,
5 : 신주인수권,
6 : 리츠종목,
7 : 신주인수권증서,
8 : ETF,
9 : 하이일드펀드 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `list` | 종목리스트 | LIST | N |  |  |
| Body | `- code` | 종목코드 | String | N | 20 | 단축코드 |
| Body | `- name` | 종목명 | String | N | 40 |  |
| Body | `- listCount` | 상장주식수 | String | N | 20 |  |
| Body | `- auditInfo` | 감리구분 | String | N | 20 |  |
| Body | `- regDay` | 상장일 | String | N | 20 |  |
| Body | `- lastPrice` | 전일종가 | String | N | 20 |  |
| Body | `- state` | 종목상태 | String | N | 20 |  |
| Body | `- marketCode` | 시장구분코드 | String | N | 20 |  |
| Body | `- marketName` | 시장명 | String | N | 20 |  |
| Body | `- upName` | 업종명 | String | N | 20 |  |
| Body | `- upSizeName` | 회사크기분류 | String | N | 20 |  |
| Body | `- orderWarning` | 투자유의종목여부 | String | N | 20 | 0: 해당없음, 2: 정리매매, 3: 단기과열, 4: 투자위험, 5: 투자경과, 1: ETF투자주의요망(ETF인 경우만 전달 |
| Body | `- companyClassName` | 회사분류 | String | N | 20 | 코스닥만 존재함 |
| Body | `- nxtEnable` | NXT가능여부 | String | N | 20 | Y: 가능 |

---

### 종목정보 조회 (`ka10100`)

- **메뉴 위치**: 국내주식 > 종목정보 > 종목정보 조회(ka10100)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `code` | 종목코드 | String | N |  | 단축코드 |
| Body | `name` | 종목명 | String | N | 40 |  |
| Body | `listCount` | 상장주식수 | String | N |  |  |
| Body | `auditInfo` | 감리구분 | String | N |  |  |
| Body | `regDay` | 상장일 | String | N |  |  |
| Body | `lastPrice` | 전일종가 | String | N |  |  |
| Body | `state` | 종목상태 | String | N |  |  |
| Body | `marketCode` | 시장구분코드 | String | N |  |  |
| Body | `marketName` | 시장명 | String | N |  |  |
| Body | `upName` | 업종명 | String | N |  |  |
| Body | `upSizeName` | 회사크기분류 | String | N |  |  |
| Body | `companyClassName` | 회사분류 | String | N |  | 코스닥만 존재함 |
| Body | `orderWarning` | 투자유의종목여부 | String | N |  | 0: 해당없음, 2: 정리매매, 3: 단기과열, 4: 투자위험, 5: 투자경과, 1: ETF투자주의요망(ETF인 경우만 전달 |
| Body | `nxtEnable` | NXT가능여부 | String | N |  | Y: 가능 |

---

### 업종코드 리스트 (`ka10101`)

- **메뉴 위치**: 국내주식 > 종목정보 > 업종코드 리스트(ka10101)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 1 | 0:코스피(거래소),1:코스닥,2:KOSPI200,4:KOSPI100,7:KRX100(통합지수) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `list` | 업종코드리스트 | LIST | N |  |  |
| Body | `- marketCode` | 시장구분코드 | LIST | N |  |  |
| Body | `- code` | 코드 | String | N |  |  |
| Body | `- name` | 업종명 | String | N |  |  |
| Body | `- group` | 그룹 | String | N |  |  |

---

### 회원사 리스트 (`ka10102`)

- **메뉴 위치**: 국내주식 > 종목정보 > 회원사 리스트(ka10102)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `list` | 회원사코드리스트 | LIST | N |  |  |
| Body | `- code` | 코드 | String | N |  |  |
| Body | `- name` | 업종명 | String | N |  |  |
| Body | `- gb` | 구분 | String | N |  |  |

---

### 기관외국인연속매매현황요청 (`ka10131`)

- **메뉴 위치**: 국내주식 > 기관/외국인 > 기관외국인연속매매현황요청(ka10131)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/frgnistt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dt` | 기간 | String | Y | 3 | 1:최근일, 3:3일, 5:5일, 10:10일, 20:20일, 120:120일, 0:시작일자/종료일자로 조회 |
| Body | `strt_dt` | 시작일자 | String | N | 8 | YYYYMMDD |
| Body | `end_dt` | 종료일자 | String | N | 8 | YYYYMMDD |
| Body | `mrkt_tp` | 장구분 | String | Y | 3 | 001:코스피, 101:코스닥 |
| Body | `netslmt_tp` | 순매도수구분 | String | Y | 1 | 2:순매수(고정값) |
| Body | `stk_inds_tp` | 종목업종구분 | String | Y | 1 | 0:종목(주식),1:업종 |
| Body | `amt_qty_tp` | 금액수량구분 | String | Y | 1 | 0:금액, 1:수량 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT, 3:통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `orgn_frgnr_cont_trde_prst` | 기관외국인연속매매현황 | LIST | N |  |  |
| Body | `- rank` | 순위 | String | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 6 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- prid_stkpc_flu_rt` | 기간중주가등락률 | String | N |  |  |
| Body | `- orgn_nettrde_amt` | 기관순매매금액 | String | N |  |  |
| Body | `- orgn_nettrde_qty` | 기관순매매량 | String | N |  |  |
| Body | `- orgn_cont_netprps_dys` | 기관계연속순매수일수 | String | N |  |  |
| Body | `- orgn_cont_netprps_qty` | 기관계연속순매수량 | String | N |  |  |
| Body | `- orgn_cont_netprps_amt` | 기관계연속순매수금액 | String | N |  |  |
| Body | `- frgnr_nettrde_qty` | 외국인순매매량 | String | N |  |  |
| Body | `- frgnr_nettrde_amt` | 외국인순매매액 | String | N |  |  |
| Body | `- frgnr_cont_netprps_dys` | 외국인연속순매수일수 | String | N |  |  |
| Body | `- frgnr_cont_netprps_qty` | 외국인연속순매수량 | String | N |  |  |
| Body | `- frgnr_cont_netprps_amt` | 외국인연속순매수금액 | String | N |  |  |
| Body | `- nettrde_qty` | 순매매량 | String | N |  |  |
| Body | `- nettrde_amt` | 순매매액 | String | N |  |  |
| Body | `- tot_cont_netprps_dys` | 합계연속순매수일수 | String | N |  |  |
| Body | `- tot_cont_nettrde_qty` | 합계연속순매매수량 | String | N |  |  |
| Body | `- tot_cont_netprps_amt` | 합계연속순매수금액 | String | N |  |  |

---

### 당일매매일지요청 (`ka10170`)

- **메뉴 위치**: 국내주식 > 계좌 > 당일매매일지요청(ka10170)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `base_dt` | 기준일자 | String | N | 8 | YYYYMMDD(공백입력시 금일데이터,최근 2개월까지 제공) |
| Body | `ottks_tp` | 단주구분 | String | Y | 1 | 1:당일매수에 대한 당일매도,2:당일매도 전체 |
| Body | `ch_crd_tp` | 현금신용구분 | String | Y | 1 | 0:전체, 1:현금매매만, 2:신용매매만 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `tot_sell_amt` | 총매도금액 | String | N |  |  |
| Body | `tot_buy_amt` | 총매수금액 | String | N |  |  |
| Body | `tot_cmsn_tax` | 총수수료_세금 | String | N |  |  |
| Body | `tot_exct_amt` | 총정산금액 | String | N |  |  |
| Body | `tot_pl_amt` | 총손익금액 | String | N |  |  |
| Body | `tot_prft_rt` | 총수익률 | String | N |  |  |
| Body | `tdy_trde_diary` | 당일매매일지 | LIST | N |  |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- buy_avg_pric` | 매수평균가 | String | N |  |  |
| Body | `- buy_qty` | 매수수량 | String | N |  |  |
| Body | `- sel_avg_pric` | 매도평균가 | String | N |  |  |
| Body | `- sell_qty` | 매도수량 | String | N |  |  |
| Body | `- cmsn_alm_tax` | 수수료_제세금 | String | N |  |  |
| Body | `- pl_amt` | 손익금액 | String | N |  |  |
| Body | `- sell_amt` | 매도금액 | String | N |  |  |
| Body | `- buy_amt` | 매수금액 | String | N |  |  |
| Body | `- prft_rt` | 수익률 | String | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 6 |  |

---

### 조건검색 목록조회 (`ka10171`)

- **메뉴 위치**: 국내주식 > 조건검색 > 조건검색 목록조회(ka10171)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | TR명 | String | Y | 7 | CNSRLST고정값 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 정상 : 0 |
| Body | `return_msg` | 결과메시지 | String | N |  | 정상인 경우는 메시지 없음 |
| Body | `trnm` | 서비스명 | String | N | 7 | CNSRLST 고정값 |
| Body | `data` | 조건검색식 목록 | LIST | N |  |  |
| Body | `- seq` | 조건검색식 일련번호 | String | N |  |  |
| Body | `- name` | 조건검색식 명 | String | N |  |  |

---

### 조건검색 요청 일반 (`ka10172`)

- **메뉴 위치**: 국내주식 > 조건검색 > 조건검색 요청 일반(ka10172)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 7 | CNSRREQ 고정값 |
| Body | `seq` | 조건검색식 일련번호 | String | Y | 3 |  |
| Body | `search_type` | 조회타입 | String | Y |  | 0:조건검색 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | K:KRX |
| Body | `cont_yn` | 연속조회여부 | String | N | 1 | Y:연속조회요청,N:연속조회미요청 |
| Body | `next_key` | 연속조회키 | String | N | 20 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 정상:0 나머지:에러 |
| Body | `return_msg` | 결과메시지 | String | N |  | 정상인 경우는 메시지 없음 |
| Body | `trnm` | 서비스명 | String | N |  | CNSRREQ |
| Body | `seq` | 조건검색식 일련번호 | String | N |  |  |
| Body | `cont_yn` | 연속조회여부 | String | N |  | 연속 데이터가 존재하는경우 Y, 없으면 N |
| Body | `next_key` | 연속조회키 | String | N |  | 연속조회여부가Y일경우 다음 조회시 필요한 조회값 |
| Body | `data` | 검색결과데이터 | LIST | N |  |  |
| Body | `- 9001` | 종목코드 | String | N |  |  |
| Body | `- 302` | 종목명 | String | N |  |  |
| Body | `- 10` | 현재가 | String | N |  |  |
| Body | `- 25` | 전일대비기호 | String | N |  |  |
| Body | `- 11` | 전일대비 | String | N |  |  |
| Body | `- 12` | 등락율 | String | N |  |  |
| Body | `- 13` | 누적거래량 | String | N |  |  |
| Body | `- 16` | 시가 | String | N |  |  |
| Body | `- 17` | 고가 | String | N |  |  |
| Body | `- 18` | 저가 | String | N |  |  |

---

### 조건검색 요청 실시간 (`ka10173`)

- **메뉴 위치**: 국내주식 > 조건검색 > 조건검색 요청 실시간(ka10173)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 7 | CNSRREQ 고정값 |
| Body | `seq` | 조건검색식 일련번호 | String | Y | 3 |  |
| Body | `search_type` | 조회타입 | String | Y | 1 | 1: 조건검색+실시간조건검색 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | K:KRX |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `조회 데이터` |  |  |  |  |  |
| Body | `return_code` | 결과코드 | String | N |  | 정상:0 나머지:에러 |
| Body | `return_msg` | 결과메시지 | String | N |  | 정상인 경우는 메시지 없음 |
| Body | `trnm` | 서비스명 | String | N |  | CNSRREQ |
| Body | `seq` | 조건검색식 일련번호 | String | N |  |  |
| Body | `data` | 검색결과데이터 | LIST | N |  |  |
| Body | `- jmcode` | 종목코드 | String | N |  |  |
| Body | `실시간 데이터` |  |  |  |  |  |
| Body | `data` | 검색결과데이터 | LIST | Y |  |  |
| Body | `trnm` | 서비스명 | String | Y |  | REAL |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |
| Body | `- name` | 실시간 항목명 | String | Y |  | 종목코드 |
| Body | `- values` | 실시간 수신 값 | Object | Y |  |  |
| Body | `- - 841` | 일련번호 | String | Y |  |  |
| Body | `- - 9001` | 종목코드 | String | Y |  |  |
| Body | `- - 843` | 삽입삭제 구분 | String | Y |  | I: 삽입, D: 삭제 |
| Body | `- - 20` | 체결시간 | String | Y |  |  |
| Body | `- - 907` | 매도/수 구분 | String | Y |  |  |

---

### 조건검색 실시간 해제 (`ka10174`)

- **메뉴 위치**: 국내주식 > 조건검색 > 조건검색 실시간 해제(ka10174)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 7 | CNSRCLR 고정값 |
| Body | `seq` | 조건검색식 일련번호 | String | Y |  |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | Y |  | 정상:0 나머지:에러 |
| Body | `return_msg` | 결과메시지 | String | Y |  | 정상인 경우는 메시지 없음 |
| Body | `trnm` | 서비스명 | String | Y |  | CNSRCLR 고정값 |
| Body | `seq` | 조건검색식 일련번호 | String | Y |  |  |

---

### 업종현재가요청 (`ka20001`)

- **메뉴 위치**: 국내주식 > 업종 > 업종현재가요청(ka20001)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/sect`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 1 | 0:코스피, 1:코스닥, 2:코스피200 |
| Body | `inds_cd` | 업종코드 | String | Y | 3 | 001:종합(KOSPI), 002:대형주, 003:중형주, 004:소형주 101:종합(KOSDAQ), 201:KOSPI200, 302:KOSTAR, 701: KRX100 나머지 ※ 업종코드 참고 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `cur_prc` | 현재가 | String | N | 20 |  |
| Body | `pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `flu_rt` | 등락률 | String | N | 20 |  |
| Body | `trde_qty` | 거래량 | String | N | 20 |  |
| Body | `trde_prica` | 거래대금 | String | N | 20 |  |
| Body | `trde_frmatn_stk_num` | 거래형성종목수 | String | N | 20 |  |
| Body | `trde_frmatn_rt` | 거래형성비율 | String | N | 20 |  |
| Body | `open_pric` | 시가 | String | N | 20 |  |
| Body | `high_pric` | 고가 | String | N | 20 |  |
| Body | `low_pric` | 저가 | String | N | 20 |  |
| Body | `upl` | 상한 | String | N | 20 |  |
| Body | `rising` | 상승 | String | N | 20 |  |
| Body | `stdns` | 보합 | String | N | 20 |  |
| Body | `fall` | 하락 | String | N | 20 |  |
| Body | `lst` | 하한 | String | N | 20 |  |
| Body | `52wk_hgst_pric` | 52주최고가 | String | N | 20 |  |
| Body | `52wk_hgst_pric_dt` | 52주최고가일 | String | N | 20 |  |
| Body | `52wk_hgst_pric_pre_rt` | 52주최고가대비율 | String | N | 20 |  |
| Body | `52wk_lwst_pric` | 52주최저가 | String | N | 20 |  |
| Body | `52wk_lwst_pric_dt` | 52주최저가일 | String | N | 20 |  |
| Body | `52wk_lwst_pric_pre_rt` | 52주최저가대비율 | String | N | 20 |  |
| Body | `inds_cur_prc_tm` | 업종현재가_시간별 | LIST | N |  |  |
| Body | `- tm_n` | 시간n | String | N | 20 |  |
| Body | `- cur_prc_n` | 현재가n | String | N | 20 |  |
| Body | `- pred_pre_sig_n` | 전일대비기호n | String | N | 20 |  |
| Body | `- pred_pre_n` | 전일대비n | String | N | 20 |  |
| Body | `- flu_rt_n` | 등락률n | String | N | 20 |  |
| Body | `- trde_qty_n` | 거래량n | String | N | 20 |  |
| Body | `- acc_trde_qty_n` | 누적거래량n | String | N | 20 |  |

---

### 업종별주가요청 (`ka20002`)

- **메뉴 위치**: 국내주식 > 업종 > 업종별주가요청(ka20002)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/sect`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 1 | 0:코스피, 1:코스닥, 2:코스피200 |
| Body | `inds_cd` | 업종코드 | String | Y | 3 | 001:종합(KOSPI), 002:대형주, 003:중형주, 004:소형주 101:종합(KOSDAQ), 201:KOSPI200, 302:KOSTAR, 701: KRX100 나머지 ※ 업종코드 참고 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT, 3:통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `inds_stkpc` | 업종별주가 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- now_trde_qty` | 현재거래량 | String | N | 20 |  |
| Body | `- sel_bid` | 매도호가 | String | N | 20 |  |
| Body | `- buy_bid` | 매수호가 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |

---

### 전업종지수요청 (`ka20003`)

- **메뉴 위치**: 국내주식 > 업종 > 전업종지수요청(ka20003)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/sect`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `inds_cd` | 업종코드 | String | Y | 3 | 001:종합(KOSPI), 101:종합(KOSDAQ) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `all_inds_idex` | 전업종지수 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- wght` | 비중 | String | N | 20 |  |
| Body | `- trde_prica` | 거래대금 | String | N | 20 |  |
| Body | `- upl` | 상한 | String | N | 20 |  |
| Body | `- rising` | 상승 | String | N | 20 |  |
| Body | `- stdns` | 보합 | String | N | 20 |  |
| Body | `- fall` | 하락 | String | N | 20 |  |
| Body | `- lst` | 하한 | String | N | 20 |  |
| Body | `- flo_stk_num` | 상장종목수 | String | N | 20 |  |

---

### 업종틱차트조회요청 (`ka20004`)

- **메뉴 위치**: 국내주식 > 차트 > 업종틱차트조회요청(ka20004)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `inds_cd` | 업종코드 | String | Y | 3 | 001:종합(KOSPI), 002:대형주, 003:중형주, 004:소형주 101:종합(KOSDAQ), 201:KOSPI200, 302:KOSTAR, 701: KRX100 나머지 ※ 업종코드 참고 |
| Body | `tic_scope` | 틱범위 | String | Y | 2 | 1:1틱, 3:3틱, 5:5틱, 10:10틱, 30:30틱 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `inds_cd` | 업종코드 | String | N | 20 |  |
| Body | `inds_tic_chart_qry` | 업종틱차트조회 | LIST | N |  |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- cntr_tm` | 체결시간 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- high_pric` | 고가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- low_pric` | 저가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- pred_pre` | 전일대비 | String | N | 20 | 현재가 - 전일종가 |
| Body | `- pred_pre_sig` | 전일대비 기호 | String | N | 20 | 1: 상한가, 2:상승, 3:보합, 4:하한가, 5:하락 |

---

### 업종분봉조회요청 (`ka20005`)

- **메뉴 위치**: 국내주식 > 차트 > 업종분봉조회요청(ka20005)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `inds_cd` | 업종코드 | String | Y | 3 | 001:종합(KOSPI), 002:대형주, 003:중형주, 004:소형주 101:종합(KOSDAQ), 201:KOSPI200, 302:KOSTAR, 701: KRX100 나머지 ※ 업종코드 참고 |
| Body | `tic_scope` | 틱범위 | String | Y | 2 | 1:1틱, 3:3틱, 5:5틱, 10:10틱, 30:30틱 |
| Body | `base_dt` | 기준일자 | String | N | 8 | YYYYMMDD |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `inds_cd` | 업종코드 | String | N | 20 |  |
| Body | `inds_min_pole_qry` | 업종분봉조회 | LIST | N |  |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- cntr_tm` | 체결시간 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- high_pric` | 고가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- low_pric` | 저가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- acc_trde_qty` | 누적거래량 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 | 현재가 - 전일종가 |
| Body | `- pred_pre_sig` | 전일대비 기호 | String | N | 20 | 1: 상한가, 2:상승, 3:보합, 4:하한가, 5:하락 |

---

### 업종일봉조회요청 (`ka20006`)

- **메뉴 위치**: 국내주식 > 차트 > 업종일봉조회요청(ka20006)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `inds_cd` | 업종코드 | String | Y | 3 | 001:종합(KOSPI), 002:대형주, 003:중형주, 004:소형주 101:종합(KOSDAQ), 201:KOSPI200, 302:KOSTAR, 701: KRX100 나머지 ※ 업종코드 참고 |
| Body | `base_dt` | 기준일자 | String | Y | 8 | YYYYMMDD |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `inds_cd` | 업종코드 | String | N | 20 |  |
| Body | `inds_dt_pole_qry` | 업종일봉조회 | LIST | N |  |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- high_pric` | 고가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- low_pric` | 저가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- trde_prica` | 거래대금 | String | N | 20 |  |

---

### 업종주봉조회요청 (`ka20007`)

- **메뉴 위치**: 국내주식 > 차트 > 업종주봉조회요청(ka20007)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `inds_cd` | 업종코드 | String | Y | 8 | 001:종합(KOSPI), 002:대형주, 003:중형주, 004:소형주 101:종합(KOSDAQ), 201:KOSPI200, 302:KOSTAR, 701: KRX100 나머지 ※ 업종코드 참고 |
| Body | `base_dt` | 기준일자 | String | Y | 3 | YYYYMMDD |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `inds_cd` | 업종코드 | String | N | 20 |  |
| Body | `inds_stk_pole_qry` | 업종주봉조회 | LIST | N |  |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- high_pric` | 고가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- low_pric` | 저가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- trde_prica` | 거래대금 | String | N | 20 |  |

---

### 업종월봉조회요청 (`ka20008`)

- **메뉴 위치**: 국내주식 > 차트 > 업종월봉조회요청(ka20008)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `inds_cd` | 업종코드 | String | Y | 3 | 001:종합(KOSPI), 002:대형주, 003:중형주, 004:소형주 101:종합(KOSDAQ), 201:KOSPI200, 302:KOSTAR, 701: KRX100 나머지 ※ 업종코드 참고 |
| Body | `base_dt` | 기준일자 | String | Y | 8 | YYYYMMDD |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `inds_cd` | 업종코드 | String | N | 20 |  |
| Body | `inds_mth_pole_qry` | 업종월봉조회 | LIST | N |  |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- high_pric` | 고가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- low_pric` | 저가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- trde_prica` | 거래대금 | String | N | 20 |  |

---

### 업종현재가일별요청 (`ka20009`)

- **메뉴 위치**: 국내주식 > 업종 > 업종현재가일별요청(ka20009)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/sect`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 1 | 0:코스피, 1:코스닥, 2:코스피200 |
| Body | `inds_cd` | 업종코드 | String | Y | 3 | 001:종합(KOSPI), 002:대형주, 003:중형주, 004:소형주 101:종합(KOSDAQ), 201:KOSPI200, 302:KOSTAR, 701: KRX100 나머지 ※ 업종코드 참고 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `cur_prc` | 현재가 | String | N | 20 |  |
| Body | `pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `flu_rt` | 등락률 | String | N | 20 |  |
| Body | `trde_qty` | 거래량 | String | N | 20 |  |
| Body | `trde_prica` | 거래대금 | String | N | 20 |  |
| Body | `trde_frmatn_stk_num` | 거래형성종목수 | String | N | 20 |  |
| Body | `trde_frmatn_rt` | 거래형성비율 | String | N | 20 |  |
| Body | `open_pric` | 시가 | String | N | 20 |  |
| Body | `high_pric` | 고가 | String | N | 20 |  |
| Body | `low_pric` | 저가 | String | N | 20 |  |
| Body | `upl` | 상한 | String | N | 20 |  |
| Body | `rising` | 상승 | String | N | 20 |  |
| Body | `stdns` | 보합 | String | N | 20 |  |
| Body | `fall` | 하락 | String | N | 20 |  |
| Body | `lst` | 하한 | String | N | 20 |  |
| Body | `52wk_hgst_pric` | 52주최고가 | String | N | 20 |  |
| Body | `52wk_hgst_pric_dt` | 52주최고가일 | String | N | 20 |  |
| Body | `52wk_hgst_pric_pre_rt` | 52주최고가대비율 | String | N | 20 |  |
| Body | `52wk_lwst_pric` | 52주최저가 | String | N | 20 |  |
| Body | `52wk_lwst_pric_dt` | 52주최저가일 | String | N | 20 |  |
| Body | `52wk_lwst_pric_pre_rt` | 52주최저가대비율 | String | N | 20 |  |
| Body | `inds_cur_prc_daly_rept` | 업종현재가_일별반복 | LIST | N |  |  |
| Body | `- dt_n` | 일자n | String | N | 20 |  |
| Body | `- cur_prc_n` | 현재가n | String | N | 20 |  |
| Body | `- pred_pre_sig_n` | 전일대비기호n | String | N | 20 |  |
| Body | `- pred_pre_n` | 전일대비n | String | N | 20 |  |
| Body | `- flu_rt_n` | 등락률n | String | N | 20 |  |
| Body | `- acc_trde_qty_n` | 누적거래량n | String | N | 20 |  |

---

### 업종년봉조회요청 (`ka20019`)

- **메뉴 위치**: 국내주식 > 차트 > 업종년봉조회요청(ka20019)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `inds_cd` | 업종코드 | String | Y | 3 | 001:종합(KOSPI), 002:대형주, 003:중형주, 004:소형주 101:종합(KOSDAQ), 201:KOSPI200, 302:KOSTAR, 701: KRX100 나머지 ※ 업종코드 참고 |
| Body | `base_dt` | 기준일자 | String | Y | 8 | YYYYMMDD |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `inds_cd` | 업종코드 | String | N | 20 |  |
| Body | `inds_yr_pole_qry` | 업종년봉조회 | LIST | N |  |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- high_pric` | 고가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- low_pric` | 저가 | String | N | 20 | 지수 값은 소수점 제거 후 100배 값으로 반환 |
| Body | `- trde_prica` | 거래대금 | String | N | 20 |  |

---

### 대차거래추이요청(종목별) (`ka20068`)

- **메뉴 위치**: 국내주식 > 대차거래 > 대차거래추이요청(종목별)(ka20068)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/slb`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `strt_dt` | 시작일자 | String | N | 8 | YYYYMMDD |
| Body | `end_dt` | 종료일자 | String | N | 8 | YYYYMMDD |
| Body | `all_tp` | 전체구분 | String | N | 1 | 0:종목코드 입력종목만 표시 |
| Body | `stk_cd` | 종목코드 | String | Y | 6 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dbrt_trde_trnsn` | 대차거래추이 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- dbrt_trde_cntrcnt` | 대차거래체결주수 | String | N | 20 |  |
| Body | `- dbrt_trde_rpy` | 대차거래상환주수 | String | N | 20 |  |
| Body | `- dbrt_trde_irds` | 대차거래증감 | String | N | 20 |  |
| Body | `- rmnd` | 잔고주수 | String | N | 20 |  |
| Body | `- remn_amt` | 잔고금액 | String | N | 20 |  |

---

### ELW가격급등락요청 (`ka30001`)

- **메뉴 위치**: 국내주식 > ELW > ELW가격급등락요청(ka30001)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/elw`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `flu_tp` | 등락구분 | String | Y | 1 | 1:급등, 2:급락 |
| Body | `tm_tp` | 시간구분 | String | Y | 1 | 1:분전, 2:일전 |
| Body | `tm` | 시간 | String | Y | 2 | 분 혹은 일입력 (예 1, 3, 5) |
| Body | `trde_qty_tp` | 거래량구분 | String | Y | 4 | 0:전체, 10:만주이상, 50:5만주이상, 100:10만주이상, 300:30만주이상, 500:50만주이상, 1000:백만주이상 |
| Body | `isscomp_cd` | 발행사코드 | String | Y | 12 | 전체:000000000000, 한국투자증권:3, 미래대우:5, 신영:6, NK투자증권:12, KB증권:17 |
| Body | `bsis_aset_cd` | 기초자산코드 | String | Y | 12 | 전체:000000000000, KOSPI200:201, KOSDAQ150:150, 삼성전자:005930, KT:030200.. |
| Body | `rght_tp` | 권리구분 | String | Y | 3 | 000:전체, 001:콜, 002:풋, 003:DC, 004:DP, 005:EX, 006:조기종료콜, 007:조기종료풋 |
| Body | `lpcd` | LP코드 | String | Y | 12 | 전체:000000000000, 한국투자증권:3, 미래대우:5, 신영:6, NK투자증권:12, KB증권:17 |
| Body | `trde_end_elwskip` | 거래종료ELW제외 | String | Y | 1 | 0:포함, 1:제외 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `base_pric_tm` | 기준가시간 | String | N | 20 |  |
| Body | `elwpric_jmpflu` | ELW가격급등락 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- rank` | 순위 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- trde_end_elwbase_pric` | 거래종료ELW기준가 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- base_pre` | 기준대비 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- jmp_rt` | 급등율 | String | N | 20 |  |

---

### 거래원별ELW순매매상위요청 (`ka30002`)

- **메뉴 위치**: 국내주식 > ELW > 거래원별ELW순매매상위요청(ka30002)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/elw`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `isscomp_cd` | 발행사코드 | String | Y | 3 | 3자리, 영웅문4 0273화면참조 (교보:001, 신한금융투자:002, 한국투자증권:003, 대신:004, 미래대우:005, ,,,) |
| Body | `trde_qty_tp` | 거래량구분 | String | Y | 4 | 0:전체, 5:5천주, 10:만주, 50:5만주, 100:10만주, 500:50만주, 1000:백만주 |
| Body | `trde_tp` | 매매구분 | String | Y | 1 | 1:순매수, 2:순매도 |
| Body | `dt` | 기간 | String | Y | 2 | 1:전일, 5:5일, 10:10일, 40:40일, 60:60일 |
| Body | `trde_end_elwskip` | 거래종료ELW제외 | String | Y | 1 | 0:포함, 1:제외 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trde_ori_elwnettrde_upper` | 거래원별ELW순매매상위 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- stkpc_flu` | 주가등락 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- netprps` | 순매수 | String | N | 20 |  |
| Body | `- buy_trde_qty` | 매수거래량 | String | N | 20 |  |
| Body | `- sel_trde_qty` | 매도거래량 | String | N | 20 |  |

---

### ELWLP보유일별추이요청 (`ka30003`)

- **메뉴 위치**: 국내주식 > ELW > ELWLP보유일별추이요청(ka30003)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/elw`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `bsis_aset_cd` | 기초자산코드 | String | Y | 12 |  |
| Body | `base_dt` | 기준일자 | String | Y | 8 | YYYYMMDD |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `elwlpposs_daly_trnsn` | ELWLP보유일별추이 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pre_tp` | 대비구분 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- trde_prica` | 거래대금 | String | N | 20 |  |
| Body | `- chg_qty` | 변동수량 | String | N | 20 |  |
| Body | `- lprmnd_qty` | LP보유수량 | String | N | 20 |  |
| Body | `- wght` | 비중 | String | N | 20 |  |

---

### ELW괴리율요청 (`ka30004`)

- **메뉴 위치**: 국내주식 > ELW > ELW괴리율요청(ka30004)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/elw`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `isscomp_cd` | 발행사코드 | String | Y | 12 | 전체:000000000000, 한국투자증권:3, 미래대우:5, 신영:6, NK투자증권:12, KB증권:17 |
| Body | `bsis_aset_cd` | 기초자산코드 | String | Y | 12 | 전체:000000000000, KOSPI200:201, KOSDAQ150:150, 삼성전자:005930, KT:030200.. |
| Body | `rght_tp` | 권리구분 | String | Y | 3 | 000: 전체, 001: 콜, 002: 풋, 003: DC, 004: DP, 005: EX, 006: 조기종료콜, 007: 조기종료풋 |
| Body | `lpcd` | LP코드 | String | Y | 12 | 전체:000000000000, 한국투자증권:3, 미래대우:5, 신영:6, NK투자증권:12, KB증권:17 |
| Body | `trde_end_elwskip` | 거래종료ELW제외 | String | Y | 1 | 1:거래종료ELW제외, 0:거래종료ELW포함 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `elwdispty_rt` | ELW괴리율 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- isscomp_nm` | 발행사명 | String | N | 20 |  |
| Body | `- sqnc` | 회차 | String | N | 20 |  |
| Body | `- base_aset_nm` | 기초자산명 | String | N | 20 |  |
| Body | `- rght_tp` | 권리구분 | String | N | 20 |  |
| Body | `- dispty_rt` | 괴리율 | String | N | 20 |  |
| Body | `- basis` | 베이시스 | String | N | 20 |  |
| Body | `- srvive_dys` | 잔존일수 | String | N | 20 |  |
| Body | `- theory_pric` | 이론가 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pre_tp` | 대비구분 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |

---

### ELW조건검색요청 (`ka30005`)

- **메뉴 위치**: 국내주식 > ELW > ELW조건검색요청(ka30005)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/elw`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `isscomp_cd` | 발행사코드 | String | Y | 12 | 12자리입력(전체:000000000000, 한국투자증권:000,,,3, 미래대우:000,,,5, 신영:000,,,6, NK투자증권:000,,,12, KB증권:000,,,17) |
| Body | `bsis_aset_cd` | 기초자산코드 | String | Y | 12 | 전체일때만 12자리입력(전체:000000000000, KOSPI200:201, KOSDAQ150:150, 삼정전자:005930, KT:030200,,) |
| Body | `rght_tp` | 권리구분 | String | Y | 1 | 0:전체, 1:콜, 2:풋, 3:DC, 4:DP, 5:EX, 6:조기종료콜, 7:조기종료풋 |
| Body | `lpcd` | LP코드 | String | Y | 12 | 전체일때만 12자리입력(전체:000000000000, 한국투자증권:003, 미래대우:005, 신영:006, NK투자증권:012, KB증권:017) |
| Body | `sort_tp` | 정렬구분 | String | Y | 1 | 0:정렬없음, 1:상승율순, 2:상승폭순, 3:하락율순, 4:하락폭순, 5:거래량순, 6:거래대금순, 7:잔존일순 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `elwcnd_qry` | ELW조건검색 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- isscomp_nm` | 발행사명 | String | N | 20 |  |
| Body | `- sqnc` | 회차 | String | N | 20 |  |
| Body | `- base_aset_nm` | 기초자산명 | String | N | 20 |  |
| Body | `- rght_tp` | 권리구분 | String | N | 20 |  |
| Body | `- expr_dt` | 만기일 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pre_tp` | 대비구분 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- trde_qty_pre` | 거래량대비 | String | N | 20 |  |
| Body | `- trde_prica` | 거래대금 | String | N | 20 |  |
| Body | `- pred_trde_qty` | 전일거래량 | String | N | 20 |  |
| Body | `- sel_bid` | 매도호가 | String | N | 20 |  |
| Body | `- buy_bid` | 매수호가 | String | N | 20 |  |
| Body | `- prty` | 패리티 | String | N | 20 |  |
| Body | `- gear_rt` | 기어링비율 | String | N | 20 |  |
| Body | `- pl_qutr_rt` | 손익분기율 | String | N | 20 |  |
| Body | `- cfp` | 자본지지점 | String | N | 20 |  |
| Body | `- theory_pric` | 이론가 | String | N | 20 |  |
| Body | `- innr_vltl` | 내재변동성 | String | N | 20 |  |
| Body | `- delta` | 델타 | String | N | 20 |  |
| Body | `- lvrg` | 레버리지 | String | N | 20 |  |
| Body | `- exec_pric` | 행사가격 | String | N | 20 |  |
| Body | `- cnvt_rt` | 전환비율 | String | N | 20 |  |
| Body | `- lpposs_rt` | LP보유비율 | String | N | 20 |  |
| Body | `- pl_qutr_pt` | 손익분기점 | String | N | 20 |  |
| Body | `- fin_trde_dt` | 최종거래일 | String | N | 20 |  |
| Body | `- flo_dt` | 상장일 | String | N | 20 |  |
| Body | `- lpinitlast_suply_dt` | LP초종공급일 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- srvive_dys` | 잔존일수 | String | N | 20 |  |
| Body | `- dispty_rt` | 괴리율 | String | N | 20 |  |
| Body | `- lpmmcm_nm` | LP회원사명 | String | N | 20 |  |
| Body | `- lpmmcm_nm_1` | LP회원사명1 | String | N | 20 |  |
| Body | `- lpmmcm_nm_2` | LP회원사명2 | String | N | 20 |  |
| Body | `- xraymont_cntr_qty_arng_trde_tp` | Xray순간체결량정리매매구분 | String | N | 20 |  |
| Body | `- xraymont_cntr_qty_profa_100tp` | Xray순간체결량증거금100구분 | String | N | 20 |  |

---

### ELW등락율순위요청 (`ka30009`)

- **메뉴 위치**: 국내주식 > ELW > ELW등락율순위요청(ka30009)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/elw`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `sort_tp` | 정렬구분 | String | Y | 1 | 1:상승률, 2:상승폭, 3:하락률, 4:하락폭 |
| Body | `rght_tp` | 권리구분 | String | Y | 3 | 000:전체, 001:콜, 002:풋, 003:DC, 004:DP, 006:조기종료콜, 007:조기종료풋 |
| Body | `trde_end_skip` | 거래종료제외 | String | Y | 1 | 1:거래종료제외, 0:거래종료포함 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `elwflu_rt_rank` | ELW등락율순위 | LIST | N |  |  |
| Body | `- rank` | 순위 | String | N | 20 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- sel_req` | 매도잔량 | String | N | 20 |  |
| Body | `- buy_req` | 매수잔량 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- trde_prica` | 거래대금 | String | N | 20 |  |

---

### ELW잔량순위요청 (`ka30010`)

- **메뉴 위치**: 국내주식 > ELW > ELW잔량순위요청(ka30010)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/elw`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `sort_tp` | 정렬구분 | String | Y | 1 | 1:순매수잔량상위, 2: 순매도 잔량상위 |
| Body | `rght_tp` | 권리구분 | String | Y | 3 | 000: 전체, 001: 콜, 002: 풋, 003: DC, 004: DP, 006: 조기종료콜, 007: 조기종료풋 |
| Body | `trde_end_skip` | 거래종료제외 | String | Y | 1 | 1:거래종료제외, 0:거래종료포함 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `elwreq_rank` | ELW잔량순위 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- rank` | 순위 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락률 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- sel_req` | 매도잔량 | String | N | 20 |  |
| Body | `- buy_req` | 매수잔량 | String | N | 20 |  |
| Body | `- netprps_req` | 순매수잔량 | String | N | 20 |  |
| Body | `- trde_prica` | 거래대금 | String | N | 20 |  |

---

### ELW근접율요청 (`ka30011`)

- **메뉴 위치**: 국내주식 > ELW > ELW근접율요청(ka30011)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/elw`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `elwalacc_rt` | ELW근접율 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- acc_trde_qty` | 누적거래량 | String | N | 20 |  |
| Body | `- alacc_rt` | 근접율 | String | N | 20 |  |

---

### ELW종목상세정보요청 (`ka30012`)

- **메뉴 위치**: 국내주식 > ELW > ELW종목상세정보요청(ka30012)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/elw`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `aset_cd` | 자산코드 | String | N | 20 |  |
| Body | `cur_prc` | 현재가 | String | N | 20 |  |
| Body | `pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `flu_rt` | 등락율 | String | N | 20 |  |
| Body | `lpmmcm_nm` | LP회원사명 | String | N | 20 |  |
| Body | `lpmmcm_nm_1` | LP회원사명1 | String | N | 20 |  |
| Body | `lpmmcm_nm_2` | LP회원사명2 | String | N | 20 |  |
| Body | `elwrght_cntn` | ELW권리내용 | String | N | 20 |  |
| Body | `elwexpr_evlt_pric` | ELW만기평가가격 | String | N | 20 |  |
| Body | `elwtheory_pric` | ELW이론가 | String | N | 20 |  |
| Body | `dispty_rt` | 괴리율 | String | N | 20 |  |
| Body | `elwinnr_vltl` | ELW내재변동성 | String | N | 20 |  |
| Body | `exp_rght_pric` | 예상권리가 | String | N | 20 |  |
| Body | `elwpl_qutr_rt` | ELW손익분기율 | String | N | 20 |  |
| Body | `elwexec_pric` | ELW행사가 | String | N | 20 |  |
| Body | `elwcnvt_rt` | ELW전환비율 | String | N | 20 |  |
| Body | `elwcmpn_rt` | ELW보상율 | String | N | 20 |  |
| Body | `elwpric_rising_part_rt` | ELW가격상승참여율 | String | N | 20 |  |
| Body | `elwrght_type` | ELW권리유형 | String | N | 20 |  |
| Body | `elwsrvive_dys` | ELW잔존일수 | String | N | 20 |  |
| Body | `stkcnt` | 주식수 | String | N | 20 |  |
| Body | `elwlpord_pos` | ELWLP주문가능 | String | N | 20 |  |
| Body | `lpposs_rt` | LP보유비율 | String | N | 20 |  |
| Body | `lprmnd_qty` | LP보유수량 | String | N | 20 |  |
| Body | `elwspread` | ELW스프레드 | String | N | 20 |  |
| Body | `elwprty` | ELW패리티 | String | N | 20 |  |
| Body | `elwgear` | ELW기어링 | String | N | 20 |  |
| Body | `elwflo_dt` | ELW상장일 | String | N | 20 |  |
| Body | `elwfin_trde_dt` | ELW최종거래일 | String | N | 20 |  |
| Body | `expr_dt` | 만기일 | String | N | 20 |  |
| Body | `exec_dt` | 행사일 | String | N | 20 |  |
| Body | `lpsuply_end_dt` | LP공급종료일 | String | N | 20 |  |
| Body | `elwpay_dt` | ELW지급일 | String | N | 20 |  |
| Body | `elwinvt_ix_comput` | ELW투자지표산출 | String | N |  |  |
| Body | `elwpay_agnt` | ELW지급대리인 | String | N |  |  |
| Body | `elwappr_way` | ELW결재방법 | String | N |  |  |
| Body | `elwrght_exec_way` | ELW권리행사방식 | String | N |  |  |
| Body | `elwpblicte_orgn` | ELW발행기관 | String | N |  |  |
| Body | `dcsn_pay_amt` | 확정지급액 | String | N |  |  |
| Body | `kobarr` | KO베리어 | String | N |  |  |
| Body | `iv` | IV | String | N |  |  |
| Body | `clsprd_end_elwocr` | 종기종료ELW발생 | String | N |  |  |
| Body | `bsis_aset_1` | 기초자산1 | String | N |  |  |
| Body | `bsis_aset_comp_rt_1` | 기초자산구성비율1 | String | N |  |  |
| Body | `bsis_aset_2` | 기초자산2 | String | N |  |  |
| Body | `bsis_aset_comp_rt_2` | 기초자산구성비율2 | String | N |  |  |
| Body | `bsis_aset_3` | 기초자산3 | String | N |  |  |
| Body | `bsis_aset_comp_rt_3` | 기초자산구성비율3 | String | N |  |  |
| Body | `bsis_aset_4` | 기초자산4 | String | N |  |  |
| Body | `bsis_aset_comp_rt_4` | 기초자산구성비율4 | String | N |  |  |
| Body | `bsis_aset_5` | 기초자산5 | String | N |  |  |
| Body | `bsis_aset_comp_rt_5` | 기초자산구성비율5 | String | N |  |  |
| Body | `fr_dt` | 평가시작일자 | String | N |  |  |
| Body | `to_dt` | 평가종료일자 | String | N |  |  |
| Body | `fr_tm` | 평가시작시간 | String | N |  |  |
| Body | `evlt_end_tm` | 평가종료시간 | String | N |  |  |
| Body | `evlt_pric` | 평가가격 | String | N |  |  |
| Body | `evlt_fnsh_yn` | 평가완료여부 | String | N |  |  |
| Body | `all_hgst_pric` | 전체최고가 | String | N |  |  |
| Body | `all_lwst_pric` | 전체최저가 | String | N |  |  |
| Body | `imaf_hgst_pric` | 직후최고가 | String | N |  |  |
| Body | `imaf_lwst_pric` | 직후최저가 | String | N |  |  |
| Body | `sndhalf_mrkt_hgst_pric` | 후반장최고가 | String | N |  |  |
| Body | `sndhalf_mrkt_lwst_pric` | 후반장최저가 | String | N |  |  |

---

### ETF수익율요청 (`ka40001`)

- **메뉴 위치**: 국내주식 > ETF > ETF수익율요청(ka40001)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/etf`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 |  |
| Body | `etfobjt_idex_cd` | ETF대상지수코드 | String | Y | 3 |  |
| Body | `dt` | 기간 | String | Y | 1 | 0:1주, 1:1달, 2:6개월, 3:1년 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `etfprft_rt_lst` | ETF수익율 | LIST | N |  |  |
| Body | `- etfprft_rt` | ETF수익률 | String | N | 20 |  |
| Body | `- cntr_prft_rt` | 체결수익률 | String | N | 20 |  |
| Body | `- for_netprps_qty` | 외인순매수수량 | String | N | 20 |  |
| Body | `- orgn_netprps_qty` | 기관순매수수량 | String | N | 20 |  |

---

### ETF종목정보요청 (`ka40002`)

- **메뉴 위치**: 국내주식 > ETF > ETF종목정보요청(ka40002)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/etf`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_nm` | 종목명 | String | N | 40 |  |
| Body | `etfobjt_idex_nm` | ETF대상지수명 | String | N | 20 |  |
| Body | `wonju_pric` | 원주가격 | String | N | 20 |  |
| Body | `etftxon_type` | ETF과세유형 | String | N | 20 |  |
| Body | `etntxon_type` | ETN과세유형 | String | N | 20 |  |

---

### ETF일별추이요청 (`ka40003`)

- **메뉴 위치**: 국내주식 > ETF > ETF일별추이요청(ka40003)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/etf`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `etfdaly_trnsn` | ETF일별추이 | LIST | N |  |  |
| Body | `- cntr_dt` | 체결일자 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- pre_rt` | 대비율 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- nav` | NAV | String | N | 20 |  |
| Body | `- acc_trde_prica` | 누적거래대금 | String | N | 20 |  |
| Body | `- navidex_dispty_rt` | NAV/지수괴리율 | String | N | 20 |  |
| Body | `- navetfdispty_rt` | NAV/ETF괴리율 | String | N | 20 |  |
| Body | `- trace_eor_rt` | 추적오차율 | String | N | 20 |  |
| Body | `- trace_cur_prc` | 추적현재가 | String | N | 20 |  |
| Body | `- trace_pred_pre` | 추적전일대비 | String | N | 20 |  |
| Body | `- trace_pre_sig` | 추적대비기호 | String | N | 20 |  |

---

### ETF전체시세요청 (`ka40004`)

- **메뉴 위치**: 국내주식 > ETF > ETF전체시세요청(ka40004)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/etf`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `txon_type` | 과세유형 | String | Y | 1 | 0:전체, 1:비과세, 2:보유기간과세, 3:회사형, 4:외국, 5:비과세해외(보유기간관세) |
| Body | `navpre` | NAV대비 | String | Y | 1 | 0:전체, 1:NAV > 전일종가, 2:NAV < 전일종가 |
| Body | `mngmcomp` | 운용사 | String | Y | 4 | 0000:전체, 3020:KODEX(삼성), 3027:KOSEF(키움), 3191:TIGER(미래에셋), 3228:KINDEX(한국투자), 3023:KStar(KB), 3022:아리랑(한화), 9999:기타운용사 |
| Body | `txon_yn` | 과세여부 | String | Y | 1 | 0:전체, 1:과세, 2:비과세 |
| Body | `trace_idex` | 추적지수 | String | Y | 1 | 0:전체 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT, 3:통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `etfall_mrpr` | ETF전체시세 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_cls` | 종목분류 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- close_pric` | 종가 | String | N | 20 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- pre_rt` | 대비율 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- nav` | NAV | String | N | 20 |  |
| Body | `- trace_eor_rt` | 추적오차율 | String | N | 20 |  |
| Body | `- txbs` | 과표기준 | String | N | 20 |  |
| Body | `- dvid_bf_base` | 배당전기준 | String | N | 20 |  |
| Body | `- pred_dvida` | 전일배당금 | String | N | 20 |  |
| Body | `- trace_idex_nm` | 추적지수명 | String | N | 20 |  |
| Body | `- drng` | 배수 | String | N | 20 |  |
| Body | `- trace_idex_cd` | 추적지수코드 | String | N | 20 |  |
| Body | `- trace_idex` | 추적지수 | String | N | 20 |  |
| Body | `- trace_flu_rt` | 추적등락율 | String | N | 20 |  |

---

### ETF시간대별추이요청 (`ka40006`)

- **메뉴 위치**: 국내주식 > ETF > ETF시간대별추이요청(ka40006)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/etf`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_nm` | 종목명 | String | N | 40 |  |
| Body | `etfobjt_idex_nm` | ETF대상지수명 | String | N | 20 |  |
| Body | `wonju_pric` | 원주가격 | String | N | 20 |  |
| Body | `etftxon_type` | ETF과세유형 | String | N | 20 |  |
| Body | `etntxon_type` | ETN과세유형 | String | N | 20 |  |
| Body | `etftisl_trnsn` | ETF시간대별추이 | LIST | N |  |  |
| Body | `- tm` | 시간 | String | N | 20 |  |
| Body | `- close_pric` | 종가 | String | N | 20 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- nav` | NAV | String | N | 20 |  |
| Body | `- trde_prica` | 거래대금 | String | N | 20 |  |
| Body | `- navidex` | NAV지수 | String | N | 20 |  |
| Body | `- navetf` | NAVETF | String | N | 20 |  |
| Body | `- trace` | 추적 | String | N | 20 |  |
| Body | `- trace_idex` | 추적지수 | String | N | 20 |  |
| Body | `- trace_idex_pred_pre` | 추적지수전일대비 | String | N | 20 |  |
| Body | `- trace_idex_pred_pre_sig` | 추적지수전일대비기호 | String | N | 20 |  |

---

### ETF시간대별체결요청 (`ka40007`)

- **메뉴 위치**: 국내주식 > ETF > ETF시간대별체결요청(ka40007)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/etf`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cls` | 종목분류 | String | N | 20 |  |
| Body | `stk_nm` | 종목명 | String | N | 40 |  |
| Body | `etfobjt_idex_nm` | ETF대상지수명 | String | N | 20 |  |
| Body | `etfobjt_idex_cd` | ETF대상지수코드 | String | N | 20 |  |
| Body | `objt_idex_pre_rt` | 대상지수대비율 | String | N | 20 |  |
| Body | `wonju_pric` | 원주가격 | String | N | 20 |  |
| Body | `etftisl_cntr_array` | ETF시간대별체결배열 | LIST | N |  |  |
| Body | `- cntr_tm` | 체결시간 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- stex_tp` | 거래소구분 | String | N | 20 | KRX , NXT , 통합 |

---

### ETF일자별체결요청 (`ka40008`)

- **메뉴 위치**: 국내주식 > ETF > ETF일자별체결요청(ka40008)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/etf`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `cntr_tm` | 체결시간 | String | N | 20 |  |
| Body | `cur_prc` | 현재가 | String | N | 20 |  |
| Body | `pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `trde_qty` | 거래량 | String | N | 20 |  |
| Body | `etfnetprps_qty_array` | ETF순매수수량배열 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- cur_prc_n` | 현재가n | String | N | 20 |  |
| Body | `- pre_sig_n` | 대비기호n | String | N | 20 |  |
| Body | `- pred_pre_n` | 전일대비n | String | N | 20 |  |
| Body | `- acc_trde_qty` | 누적거래량 | String | N | 20 |  |
| Body | `- for_netprps_qty` | 외인순매수수량 | String | N | 20 |  |
| Body | `- orgn_netprps_qty` | 기관순매수수량 | String | N | 20 |  |

---

### ETF시간대별체결요청 (`ka40009`)

- **메뉴 위치**: 국내주식 > ETF > ETF시간대별체결요청(ka40009)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/etf`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `etfnavarray` | ETFNAV배열 | LIST | N |  |  |
| Body | `- nav` | NAV | String | N | 20 |  |
| Body | `- navpred_pre` | NAV전일대비 | String | N | 20 |  |
| Body | `- navflu_rt` | NAV등락율 | String | N | 20 |  |
| Body | `- trace_eor_rt` | 추적오차율 | String | N | 20 |  |
| Body | `- dispty_rt` | 괴리율 | String | N | 20 |  |
| Body | `- stkcnt` | 주식수 | String | N | 20 |  |
| Body | `- base_pric` | 기준가 | String | N | 20 |  |
| Body | `- for_rmnd_qty` | 외인보유수량 | String | N | 20 |  |
| Body | `- repl_pric` | 대용가 | String | N | 20 |  |
| Body | `- conv_pric` | 환산가격 | String | N | 20 |  |
| Body | `- drstk` | DR/주 | String | N | 20 |  |
| Body | `- wonju_pric` | 원주가격 | String | N | 20 |  |

---

### ETF시간대별추이요청 (`ka40010`)

- **메뉴 위치**: 국내주식 > ETF > ETF시간대별추이요청(ka40010)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/etf`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 6 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `etftisl_trnsn` | ETF시간대별추이 | LIST | N |  |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- for_netprps` | 외인순매수 | String | N | 20 |  |

---

### 금현물체결추이 (`ka50010`)

- **메뉴 위치**: 국내주식 > 시세 > 금현물체결추이(ka50010)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | M04020000 금 99.99_1kg, M04020100 미니금 99.99_100g |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `gold_cntr` | 금현물체결추이 | LIST | N |  |  |
| Body | `- cntr_pric` | 체결가 | String | N | 20 |  |
| Body | `- pred_pre` | 전일 대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- trde_qty` | 누적 거래량 | String | N | 20 |  |
| Body | `- acc_trde_prica` | 누적 거래대금 | String | N | 20 |  |
| Body | `- cntr_trde_qty` | 거래량(체결량) | String | N | 20 |  |
| Body | `- tm` | 체결시간 | String | N | 20 |  |
| Body | `- pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pri_sel_bid_unit` | 매도호가 | String | N | 20 |  |
| Body | `- pri_buy_bid_unit` | 매수호가 | String | N | 20 |  |
| Body | `- trde_pre` | 전일 거래량 대비 비율 | String | N | 20 |  |
| Body | `- trde_tern_rt` | 전일 거래량 대비 순간 거래량 비율 | String | N | 20 |  |
| Body | `- cntr_str` | 체결강도 | String | N | 20 |  |

---

### 금현물일별추이 (`ka50012`)

- **메뉴 위치**: 국내주식 > 시세 > 금현물일별추이(ka50012)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | M04020000 금 99.99_1kg, M04020100 미니금 99.99_100g |
| Body | `base_dt` | 기준일자 | String | Y | 8 | YYYYMMDD |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `gold_daly_trnsn` | 금현물일별추이 | LIST | N |  |  |
| Body | `- cur_prc` | 종가 | String | N | 20 |  |
| Body | `- pred_pre` | 전일 대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- trde_qty` | 누적 거래량 | String | N | 20 |  |
| Body | `- acc_trde_prica` | 누적 거래대금(백만) | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- orgn_netprps` | 기관 순매수 수량 | String | N | 20 |  |
| Body | `- for_netprps` | 외국인 순매수 수량 | String | N | 20 |  |
| Body | `- ind_netprps` | 순매매량(개인) | String | N | 20 |  |

---

### 금현물틱차트조회요청 (`ka50079`)

- **메뉴 위치**: 국내주식 > 차트 > 금현물틱차트조회요청(ka50079)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | M04020000 금 99.99_1kg, M04020100 미니금 99.99_100g |
| Body | `tic_scope` | 틱범위 | String | Y | 2 | 1:1틱, 3:3틱, 5:5틱, 10:10틱, 30:30틱 |
| Body | `upd_stkpc_tp` | 수정주가구분 | String | Y | 1 | 0 or 1 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `gds_tic_chart_qry` | 금현물틱차트조회 | LIST | N |  |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N |  |  |
| Body | `- cntr_tm` | 체결시간 | String | N | 20 |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |

---

### 금현물분봉차트조회요청 (`ka50080`)

- **메뉴 위치**: 국내주식 > 차트 > 금현물분봉차트조회요청(ka50080)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | M04020000 금 99.99_1kg, M04020100 미니금 99.99_100g |
| Body | `tic_scope` | 틱범위 | String | Y | 3 | 1:1분, 3:3분, 5:5분, 10:10분, 15:15분, 30:30분, 45:45분, 60:60분 |
| Body | `upd_stkpc_tp` | 수정주가구분 | String | N | 1 | 0 or 1 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `gds_min_chart_qry` | 금현물분봉차트조회 | LIST | N |  |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- acc_trde_qty` | 누적거래량 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |
| Body | `- cntr_tm` | 체결시간 | String | N | 20 |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |

---

### 금현물일봉차트조회요청 (`ka50081`)

- **메뉴 위치**: 국내주식 > 차트 > 금현물일봉차트조회요청(ka50081)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | M04020000 금 99.99_1kg, M04020100 미니금 99.99_100g |
| Body | `base_dt` | 기준일자 | String | Y | 8 | YYYYMMDD |
| Body | `upd_stkpc_tp` | 수정주가구분 | String | Y | 1 | 0 or 1 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `gds_day_chart_qry` | 금현물일봉차트조회 | LIST | N |  |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- acc_trde_qty` | 누적 거래량 | String | N | 20 |  |
| Body | `- acc_trde_prica` | 누적 거래대금 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |

---

### 금현물주봉차트조회요청 (`ka50082`)

- **메뉴 위치**: 국내주식 > 차트 > 금현물주봉차트조회요청(ka50082)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | M04020000 금 99.99_1kg, M04020100 미니금 99.99_100g |
| Body | `base_dt` | 기준일자 | String | Y | 8 | YYYYMMDD |
| Body | `upd_stkpc_tp` | 수정주가구분 | String | Y | 1 | 0 or 1 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `gds_week_chart_qry` | 금현물일봉차트조회 | LIST | N |  |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- acc_trde_qty` | 누적 거래량 | String | N | 20 |  |
| Body | `- acc_trde_prica` | 누적 거래대금 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |
| Body | `- dt` | 일자 | String | N | 20 |  |

---

### 금현물월봉차트조회요청 (`ka50083`)

- **메뉴 위치**: 국내주식 > 차트 > 금현물월봉차트조회요청(ka50083)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | M04020000 금 99.99_1kg, M04020100 미니금 99.99_100g |
| Body | `base_dt` | 기준일자 | String | Y | 8 | YYYYMMDD |
| Body | `upd_stkpc_tp` | 수정주가구분 | String | Y | 1 | 0 or 1 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `gds_month_chart_qry` | 금현물일봉차트조회 | LIST | N |  |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- acc_trde_qty` | 누적 거래량 | String | N | 20 |  |
| Body | `- acc_trde_prica` | 누적 거래대금 | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |
| Body | `- dt` | 일자 | String | N | 20 |  |

---

### 금현물예상체결 (`ka50087`)

- **메뉴 위치**: 국내주식 > 시세 > 금현물예상체결(ka50087)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | M04020000 금 99.99_1kg, M04020100 미니금 99.99_100g |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `gold_expt_exec` | 금현물예상체결 | LIST | N |  |  |
| Body | `- exp_cntr_pric` | 예상 체결가 | String | N | 20 |  |
| Body | `- exp_pred_pre` | 예상 체결가 전일대비 | String | N | 20 |  |
| Body | `- exp_flu_rt` | 예상 체결가 등락율 | String | N | 20 |  |
| Body | `- exp_acc_trde_qty` | 예상 체결 수량(누적) | String | N | 20 |  |
| Body | `- exp_cntr_trde_qty` | 예상 체결 수량 | String | N | 20 |  |
| Body | `- exp_tm` | 예상 체결 시간 | String | N | 20 |  |
| Body | `- exp_pre_sig` | 예상 체결가 전일대비기호 | String | N | 20 |  |
| Body | `- stex_tp` | 거래소 구분 | String | N |  |  |

---

### 금현물당일틱차트조회요청 (`ka50091`)

- **메뉴 위치**: 국내주식 > 차트 > 금현물당일틱차트조회요청(ka50091)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | M04020000 금 99.99_1kg, M04020100 미니금 99.99_100g |
| Body | `tic_scope` | 틱범위 | String | Y | 2 | 1:1틱, 3:3틱, 5:5틱, 10:10틱, 30:30틱 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `gds_tic_chart_qry` | 금현물일봉차트조회 | LIST | N |  |  |
| Body | `- cntr_pric` | 체결가 | String | N | 20 |  |
| Body | `- pred_pre` | 전일 대비(원) | String | N | 20 |  |
| Body | `- trde_qty` | 거래량(체결량) | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |
| Body | `- cntr_tm` | 체결시간 | String | N | 20 |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |

---

### 금현물당일분봉차트조회요청 (`ka50092`)

- **메뉴 위치**: 국내주식 > 차트 > 금현물당일분봉차트조회요청(ka50092)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/chart`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | M04020000 금 99.99_1kg, M04020100 미니금 99.99_100g |
| Body | `tic_scope` | 틱범위 | String | Y | 2 | 1:1틱, 3:3틱, 5:5틱, 10:10틱, 30:30틱 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `gds_min_chart_qry` | 금현물일봉차트조회 | LIST | N |  |  |
| Body | `- cntr_pric` | 체결가 | String | N | 20 |  |
| Body | `- pred_pre` | 전일 대비(원) | String | N | 20 |  |
| Body | `- acc_trde_qty` | 누적 거래량 | String | N | 20 |  |
| Body | `- acc_trde_prica` | 누적 거래대금 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량(체결량) | String | N | 20 |  |
| Body | `- open_pric` | 시가 | String | N | 20 |  |
| Body | `- high_pric` | 고가 | String | N | 20 |  |
| Body | `- low_pric` | 저가 | String | N | 20 |  |
| Body | `- cntr_tm` | 체결시간 | String | N | 20 |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- pred_pre_sig` | 전일대비기호 | String | N | 20 |  |

---

### 금현물 시세정보 (`ka50100`)

- **메뉴 위치**: 국내주식 > 시세 > 금현물 시세정보(ka50100)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `pred_pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `flu_rt` | 등락율 | String | N | 20 |  |
| Body | `trde_qty` | 거래량 | String | N | 20 |  |
| Body | `open_pric` | 시가 | String | N | 20 |  |
| Body | `high_pric` | 고가 | String | N | 20 |  |
| Body | `low_pric` | 저가 | String | N | 20 |  |
| Body | `pred_rt` | 전일비 | String | N | 20 |  |
| Body | `upl_pric` | 상한가 | String | N | 20 |  |
| Body | `lst_pric` | 하한가 | String | N | 20 |  |
| Body | `pred_close_pric` | 전일종가 | String | N | 20 |  |

---

### 금현물 호가 (`ka50101`)

- **메뉴 위치**: 국내주식 > 시세 > 금현물 호가(ka50101)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 20 | M04020000 금 99.99_1kg, M04020100 미니금 99.99_100g |
| Body | `tic_scope` | 틱범위 | String | Y | 2 | 1:1틱, 3:3틱, 5:5틱, 10:10틱, 30:30틱 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `gold_bid` | 금현물호가 | LIST | N |  |  |
| Body | `- cntr_pric` | 체결가 | String | N | 20 |  |
| Body | `- pred_pre` | 전일 대비(원) | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- trde_qty` | 누적 거래량 | String | N | 20 |  |
| Body | `- acc_trde_prica` | 누적 거래대금 | String | N | 20 |  |
| Body | `- cntr_trde_qty` | 거래량(체결량) | String | N | 20 |  |
| Body | `- tm` | 체결시간 | String | N | 20 |  |
| Body | `- pre_sig` | 전일대비기호 | String | N | 20 |  |
| Body | `- pri_sel_bid_unit` | 매도호가 | String | N | 20 |  |
| Body | `- pri_buy_bid_unit` | 매수호가 | String | N | 20 |  |
| Body | `- trde_pre` | 전일 거래량 대비 비율 | String | N | 20 |  |
| Body | `- trde_tern_rt` | 전일 거래량 대비 순간 거래량 비율 | String | N |  |  |
| Body | `- cntr_str` | 체결강도 | String | N | 20 |  |
| Body | `- lpmmcm_nm_1` | K.O 접근도 | String | N | 20 |  |
| Body | `- stex_tp` | 거래소구분 | String | N | 20 |  |

---

### 금현물투자자현황 (`ka52301`)

- **메뉴 위치**: 국내주식 > 기관/외국인 > 금현물투자자현황(ka52301)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/frgnistt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `inve_trad_stat` | 금현물투자자현황 | LIST | N |  |  |
| Body | `- all_dfrt_trst_sell_qty` | 투자자별 매도 수량(천) | String | N | 20 |  |
| Body | `- sell_qty_irds` | 투자자별 매도 수량 증감(천) | String | N | 20 |  |
| Body | `- all_dfrt_trst_sell_amt` | 투자자별 매도 금액(억) | String | N | 20 |  |
| Body | `- sell_amt_irds` | 투자자별 매도 금액 증감(억) | String | N | 20 |  |
| Body | `- all_dfrt_trst_buy_qty` | 투자자별 매수 수량(천) | String | N | 20 |  |
| Body | `- buy_qty_irds` | 투자자별 매수 수량 증감(천) | String | N | 20 |  |
| Body | `- all_dfrt_trst_buy_amt` | 투자자별 매수 금액(억) | String | N | 20 |  |
| Body | `- buy_amt_irds` | 투자자별 매수 금액 증감(억) | String | N | 20 |  |
| Body | `- all_dfrt_trst_netprps_qty` | 투자자별 순매수 수량(천) | String | N | 20 |  |
| Body | `- netprps_qty_irds` | 투자자별 순매수 수량 증감(천) | String | N | 20 |  |
| Body | `- all_dfrt_trst_netprps_amt` | 투자자별 순매수 금액(억) | String | N | 20 |  |
| Body | `- netprps_amt_irds` | 투자자별 순매수 금액 증감(억) | String | N | 20 |  |
| Body | `- sell_uv` | 투자자별 매도 단가 | String | N | 20 |  |
| Body | `- buy_uv` | 투자자별 매수 단가 | String | N | 20 |  |
| Body | `- stk_nm` | 투자자 구분명 | String | N | 20 |  |
| Body | `- acc_netprps_amt` | 누적 순매수 금액(억) | String | N | 20 |  |
| Body | `- acc_netprps_qty` | 누적 순매수 수량(천) | String | N | 20 |  |
| Body | `- stk_cd` | 투자자 코드 | String | N | 20 |  |

---

### 테마그룹별요청 (`ka90001`)

- **메뉴 위치**: 국내주식 > 테마 > 테마그룹별요청(ka90001)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/thme`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `qry_tp` | 검색구분 | String | Y | 1 | 0:전체검색, 1:테마검색, 2:종목검색 |
| Body | `stk_cd` | 종목코드 | String | N | 6 | 검색하려는 종목코드 |
| Body | `date_tp` | 날짜구분 | String | Y | 2 | n일전 (1일 ~ 99일 날짜입력) |
| Body | `thema_nm` | 테마명 | String | N | 50 | 검색하려는 테마명 |
| Body | `flu_pl_amt_tp` | 등락수익구분 | String | Y | 1 | 1:상위기간수익률, 2:하위기간수익률, 3:상위등락률, 4:하위등락률 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `thema_grp` | 테마그룹별 | LIST | N |  |  |
| Body | `- thema_grp_cd` | 테마그룹코드 | String | N | 20 |  |
| Body | `- thema_nm` | 테마명 | String | N | 20 |  |
| Body | `- stk_num` | 종목수 | String | N | 20 |  |
| Body | `- flu_sig` | 등락기호 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- rising_stk_num` | 상승종목수 | String | N | 20 |  |
| Body | `- fall_stk_num` | 하락종목수 | String | N | 20 |  |
| Body | `- dt_prft_rt` | 기간수익률 | String | N | 20 |  |
| Body | `- main_stk` | 주요종목 | String | N | 20 |  |

---

### 테마구성종목요청 (`ka90002`)

- **메뉴 위치**: 국내주식 > 테마 > 테마구성종목요청(ka90002)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/thme`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `date_tp` | 날짜구분 | String | N | 1 | 1일 ~ 99일 날짜입력 |
| Body | `thema_grp_cd` | 테마그룹코드 | String | Y | 6 | 테마그룹코드 번호 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `flu_rt` | 등락률 | String | N | 20 |  |
| Body | `dt_prft_rt` | 기간수익률 | String | N | 20 |  |
| Body | `thema_comp_stk` | 테마구성종목 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- flu_sig` | 등락기호 | String | N | 20 | 1: 상한가, 2:상승, 3:보합, 4:하한가, 5:하락 |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- acc_trde_qty` | 누적거래량 | String | N | 20 |  |
| Body | `- sel_bid` | 매도호가 | String | N | 20 |  |
| Body | `- sel_req` | 매도잔량 | String | N | 20 |  |
| Body | `- buy_bid` | 매수호가 | String | N | 20 |  |
| Body | `- buy_req` | 매수잔량 | String | N | 20 |  |
| Body | `- dt_prft_rt_n` | 기간수익률n | String | N | 20 |  |

---

### 프로그램순매수상위50요청 (`ka90003`)

- **메뉴 위치**: 국내주식 > 종목정보 > 프로그램순매수상위50요청(ka90003)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trde_upper_tp` | 매매상위구분 | String | Y | 1 | 1:순매도상위, 2:순매수상위 |
| Body | `amt_qty_tp` | 금액수량구분 | String | Y | 2 | 1:금액, 2:수량 |
| Body | `mrkt_tp` | 시장구분 | String | Y | 10 | P00101:코스피, P10102:코스닥 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `prm_netprps_upper_50` | 프로그램순매수상위50 | LIST | N |  |  |
| Body | `- rank` | 순위 | String | N | 20 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- flu_sig` | 등락기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- acc_trde_qty` | 누적거래량 | String | N | 20 |  |
| Body | `- prm_sell_amt` | 프로그램매도금액 | String | N | 20 |  |
| Body | `- prm_buy_amt` | 프로그램매수금액 | String | N | 20 |  |
| Body | `- prm_netprps_amt` | 프로그램순매수금액 | String | N | 20 |  |

---

### 종목별프로그램매매현황요청 (`ka90004`)

- **메뉴 위치**: 국내주식 > 종목정보 > 종목별프로그램매매현황요청(ka90004)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dt` | 일자 | String | Y | 8 | YYYYMMDD |
| Body | `mrkt_tp` | 시장구분 | String | Y | 10 | P00101:코스피, P10102:코스닥 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `tot_1` | 매수체결수량합계 | String | N | 20 |  |
| Body | `tot_2` | 매수체결금액합계 | String | N | 20 |  |
| Body | `tot_3` | 매도체결수량합계 | String | N | 20 |  |
| Body | `tot_4` | 매도체결금액합계 | String | N | 20 |  |
| Body | `tot_5` | 순매수대금합계 | String | N | 20 |  |
| Body | `tot_6` | 합계6 | String | N | 20 |  |
| Body | `stk_prm_trde_prst` | 종목별프로그램매매현황 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- flu_sig` | 등락기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- buy_cntr_qty` | 매수체결수량 | String | N | 20 |  |
| Body | `- buy_cntr_amt` | 매수체결금액 | String | N | 20 |  |
| Body | `- sel_cntr_qty` | 매도체결수량 | String | N | 20 |  |
| Body | `- sel_cntr_amt` | 매도체결금액 | String | N | 20 |  |
| Body | `- netprps_prica` | 순매수대금 | String | N | 20 |  |
| Body | `- all_trde_rt` | 전체거래비율 | String | N | 20 |  |

---

### 프로그램매매추이요청 시간대별 (`ka90005`)

- **메뉴 위치**: 국내주식 > 시세 > 프로그램매매추이요청 시간대별(ka90005)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `date` | 날짜 | String | Y | 8 | YYYYMMDD |
| Body | `amt_qty_tp` | 금액수량구분 | String | Y | 1 | 1:금액(백만원), 2:수량(천주) |
| Body | `mrkt_tp` | 시장구분 | String | Y | 10 | 코스피- 거래소구분값 1일경우:P00101, 2일경우:P001_NX01, 3일경우:P001_AL01
코스닥- 거래소구분값 1일경우:P10102, 2일경우:P101_NX02, 3일경우:P101_AL02 |
| Body | `min_tic_tp` | 분틱구분 | String | Y | 1 | 0:틱, 1:분 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `prm_trde_trnsn` | 프로그램매매추이 | LIST | N |  |  |
| Body | `- cntr_tm` | 체결시간 | String | N | 20 |  |
| Body | `- dfrt_trde_sel` | 차익거래매도 | String | N | 20 |  |
| Body | `- dfrt_trde_buy` | 차익거래매수 | String | N | 20 |  |
| Body | `- dfrt_trde_netprps` | 차익거래순매수 | String | N | 20 |  |
| Body | `- ndiffpro_trde_sel` | 비차익거래매도 | String | N | 20 |  |
| Body | `- ndiffpro_trde_buy` | 비차익거래매수 | String | N | 20 |  |
| Body | `- ndiffpro_trde_netprps` | 비차익거래순매수 | String | N | 20 |  |
| Body | `- dfrt_trde_sell_qty` | 차익거래매도수량 | String | N | 20 |  |
| Body | `- dfrt_trde_buy_qty` | 차익거래매수수량 | String | N | 20 |  |
| Body | `- dfrt_trde_netprps_qty` | 차익거래순매수수량 | String | N | 20 |  |
| Body | `- ndiffpro_trde_sell_qty` | 비차익거래매도수량 | String | N | 20 |  |
| Body | `- ndiffpro_trde_buy_qty` | 비차익거래매수수량 | String | N | 20 |  |
| Body | `- ndiffpro_trde_netprps_qty` | 비차익거래순매수수량 | String | N | 20 |  |
| Body | `- all_sel` | 전체매도 | String | N | 20 |  |
| Body | `- all_buy` | 전체매수 | String | N | 20 |  |
| Body | `- all_netprps` | 전체순매수 | String | N | 20 |  |
| Body | `- kospi200` | KOSPI200 | String | N | 20 |  |
| Body | `- basis` | BASIS | String | N | 20 |  |

---

### 프로그램매매차익잔고추이요청 (`ka90006`)

- **메뉴 위치**: 국내주식 > 시세 > 프로그램매매차익잔고추이요청(ka90006)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `date` | 날짜 | String | Y | 8 | YYYYMMDD |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `prm_trde_dfrt_remn_trnsn` | 프로그램매매차익잔고추이 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- buy_dfrt_trde_qty` | 매수차익거래수량 | String | N | 20 |  |
| Body | `- buy_dfrt_trde_amt` | 매수차익거래금액 | String | N | 20 |  |
| Body | `- buy_dfrt_trde_irds_amt` | 매수차익거래증감액 | String | N | 20 |  |
| Body | `- sel_dfrt_trde_qty` | 매도차익거래수량 | String | N | 20 |  |
| Body | `- sel_dfrt_trde_amt` | 매도차익거래금액 | String | N | 20 |  |
| Body | `- sel_dfrt_trde_irds_amt` | 매도차익거래증감액 | String | N | 20 |  |

---

### 프로그램매매누적추이요청 (`ka90007`)

- **메뉴 위치**: 국내주식 > 시세 > 프로그램매매누적추이요청(ka90007)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `date` | 날짜 | String | Y | 8 | YYYYMMDD (종료일기준 1년간 데이터만 조회가능) |
| Body | `amt_qty_tp` | 금액수량구분 | String | Y | 1 | 1:금액, 2:수량 |
| Body | `mrkt_tp` | 시장구분 | String | Y | 5 | 0:코스피 , 1:코스닥 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT, 3:통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `prm_trde_acc_trnsn` | 프로그램매매누적추이 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- kospi200` | KOSPI200 | String | N | 20 |  |
| Body | `- basis` | BASIS | String | N | 20 |  |
| Body | `- dfrt_trde_tdy` | 차익거래당일 | String | N | 20 |  |
| Body | `- dfrt_trde_acc` | 차익거래누적 | String | N | 20 |  |
| Body | `- ndiffpro_trde_tdy` | 비차익거래당일 | String | N | 20 |  |
| Body | `- ndiffpro_trde_acc` | 비차익거래누적 | String | N | 20 |  |
| Body | `- all_tdy` | 전체당일 | String | N | 20 |  |
| Body | `- all_acc` | 전체누적 | String | N | 20 |  |

---

### 종목시간별프로그램매매추이요청 (`ka90008`)

- **메뉴 위치**: 국내주식 > 시세 > 종목시간별프로그램매매추이요청(ka90008)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `amt_qty_tp` | 금액수량구분 | String | Y | 1 | 1:금액, 2:수량 |
| Body | `stk_cd` | 종목코드 | String | Y | 6 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `date` | 날짜 | String | Y | 8 | YYYYMMDD |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_tm_prm_trde_trnsn` | 종목시간별프로그램매매추이 | LIST | N |  |  |
| Body | `- tm` | 시간 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- prm_sell_amt` | 프로그램매도금액 | String | N | 20 |  |
| Body | `- prm_buy_amt` | 프로그램매수금액 | String | N | 20 |  |
| Body | `- prm_netprps_amt` | 프로그램순매수금액 | String | N | 20 |  |
| Body | `- prm_netprps_amt_irds` | 프로그램순매수금액증감 | String | N | 20 |  |
| Body | `- prm_sell_qty` | 프로그램매도수량 | String | N | 20 |  |
| Body | `- prm_buy_qty` | 프로그램매수수량 | String | N | 20 |  |
| Body | `- prm_netprps_qty` | 프로그램순매수수량 | String | N | 20 |  |
| Body | `- prm_netprps_qty_irds` | 프로그램순매수수량증감 | String | N | 20 |  |
| Body | `- base_pric_tm` | 기준가시간 | String | N | 20 |  |
| Body | `- dbrt_trde_rpy_sum` | 대차거래상환주수합 | String | N | 20 |  |
| Body | `- remn_rcvord_sum` | 잔고수주합 | String | N | 20 |  |
| Body | `- stex_tp` | 거래소구분 | String | N | 20 | KRX , NXT , 통합 |

---

### 외국인기관매매상위요청 (`ka90009`)

- **메뉴 위치**: 국내주식 > 순위정보 > 외국인기관매매상위요청(ka90009)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/rkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 000:전체, 001:코스피, 101:코스닥 |
| Body | `amt_qty_tp` | 금액수량구분 | String | Y | 1 | 1:금액(천만), 2:수량(천) |
| Body | `qry_dt_tp` | 조회일자구분 | String | Y | 1 | 0:조회일자 미포함, 1:조회일자 포함 |
| Body | `date` | 날짜 | String | N | 8 | YYYYMMDD
(연도4자리, 월 2자리, 일 2자리 형식) |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT, 3:통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `frgnr_orgn_trde_upper` | 외국인기관매매상위 | LIST | N |  |  |
| Body | `- for_netslmt_stk_cd` | 외인순매도종목코드 | String | N | 20 |  |
| Body | `- for_netslmt_stk_nm` | 외인순매도종목명 | String | N | 20 |  |
| Body | `- for_netslmt_amt` | 외인순매도금액 | String | N | 20 |  |
| Body | `- for_netslmt_qty` | 외인순매도수량 | String | N | 20 |  |
| Body | `- for_netprps_stk_cd` | 외인순매수종목코드 | String | N | 20 |  |
| Body | `- for_netprps_stk_nm` | 외인순매수종목명 | String | N | 20 |  |
| Body | `- for_netprps_amt` | 외인순매수금액 | String | N | 20 |  |
| Body | `- for_netprps_qty` | 외인순매수수량 | String | N | 20 |  |
| Body | `- orgn_netslmt_stk_cd` | 기관순매도종목코드 | String | N | 20 |  |
| Body | `- orgn_netslmt_stk_nm` | 기관순매도종목명 | String | N | 20 |  |
| Body | `- orgn_netslmt_amt` | 기관순매도금액 | String | N | 20 |  |
| Body | `- orgn_netslmt_qty` | 기관순매도수량 | String | N | 20 |  |
| Body | `- orgn_netprps_stk_cd` | 기관순매수종목코드 | String | N | 20 |  |
| Body | `- orgn_netprps_stk_nm` | 기관순매수종목명 | String | N | 20 |  |
| Body | `- orgn_netprps_amt` | 기관순매수금액 | String | N | 20 |  |
| Body | `- orgn_netprps_qty` | 기관순매수수량 | String | N | 20 |  |

---

### 프로그램매매추이요청 일자별 (`ka90010`)

- **메뉴 위치**: 국내주식 > 시세 > 프로그램매매추이요청 일자별(ka90010)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `date` | 날짜 | String | Y | 8 | YYYYMMDD |
| Body | `amt_qty_tp` | 금액수량구분 | String | Y | 1 | 1:금액(백만원), 2:수량(천주) |
| Body | `mrkt_tp` | 시장구분 | String | Y | 10 | 코스피- 거래소구분값 1일경우:P00101, 2일경우:P001_NX01, 3일경우:P001_AL01
코스닥- 거래소구분값 1일경우:P10102, 2일경우:P101_NX02, 3일경우:P001_AL02 |
| Body | `min_tic_tp` | 분틱구분 | String | Y | 1 | 0:틱, 1:분 |
| Body | `stex_tp` | 거래소구분 | String | Y | 1 | 1:KRX, 2:NXT 3.통합 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `prm_trde_trnsn` | 프로그램매매추이 | LIST | N |  |  |
| Body | `- cntr_tm` | 체결시간 | String | N | 20 |  |
| Body | `- dfrt_trde_sel` | 차익거래매도 | String | N | 20 |  |
| Body | `- dfrt_trde_buy` | 차익거래매수 | String | N | 20 |  |
| Body | `- dfrt_trde_netprps` | 차익거래순매수 | String | N | 20 |  |
| Body | `- ndiffpro_trde_sel` | 비차익거래매도 | String | N | 20 |  |
| Body | `- ndiffpro_trde_buy` | 비차익거래매수 | String | N | 20 |  |
| Body | `- ndiffpro_trde_netprps` | 비차익거래순매수 | String | N | 20 |  |
| Body | `- dfrt_trde_sell_qty` | 차익거래매도수량 | String | N | 20 |  |
| Body | `- dfrt_trde_buy_qty` | 차익거래매수수량 | String | N | 20 |  |
| Body | `- dfrt_trde_netprps_qty` | 차익거래순매수수량 | String | N | 20 |  |
| Body | `- ndiffpro_trde_sell_qty` | 비차익거래매도수량 | String | N | 20 |  |
| Body | `- ndiffpro_trde_buy_qty` | 비차익거래매수수량 | String | N | 20 |  |
| Body | `- ndiffpro_trde_netprps_qty` | 비차익거래순매수수량 | String | N | 20 |  |
| Body | `- all_sel` | 전체매도 | String | N | 20 |  |
| Body | `- all_buy` | 전체매수 | String | N | 20 |  |
| Body | `- all_netprps` | 전체순매수 | String | N | 20 |  |
| Body | `- kospi200` | KOSPI200 | String | N | 20 |  |
| Body | `- basis` | BASIS | String | N | 20 |  |

---

### 대차거래내역요청 (`ka90012`)

- **메뉴 위치**: 국내주식 > 대차거래 > 대차거래내역요청(ka90012)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/slb`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dt` | 일자 | String | Y | 8 | YYYYMMDD |
| Body | `mrkt_tp` | 시장구분 | String | Y | 3 | 001:코스피, 101:코스닥 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dbrt_trde_prps` | 대차거래내역 | LIST | N |  |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 20 |  |
| Body | `- dbrt_trde_cntrcnt` | 대차거래체결주수 | String | N | 20 |  |
| Body | `- dbrt_trde_rpy` | 대차거래상환주수 | String | N | 20 |  |
| Body | `- rmnd` | 잔고주수 | String | N | 20 |  |
| Body | `- remn_amt` | 잔고금액 | String | N | 20 |  |

---

### 종목일별프로그램매매추이요청 (`ka90013`)

- **메뉴 위치**: 국내주식 > 시세 > 종목일별프로그램매매추이요청(ka90013)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/mrkcond`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `amt_qty_tp` | 금액수량구분 | String | N | 1 | 1:금액, 2:수량 |
| Body | `stk_cd` | 종목코드 | String | Y | 20 | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `date` | 날짜 | String | N | 8 | YYYYMMDD |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_daly_prm_trde_trnsn` | 종목일별프로그램매매추이 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 20 |  |
| Body | `- cur_prc` | 현재가 | String | N | 20 |  |
| Body | `- pre_sig` | 대비기호 | String | N | 20 |  |
| Body | `- pred_pre` | 전일대비 | String | N | 20 |  |
| Body | `- flu_rt` | 등락율 | String | N | 20 |  |
| Body | `- trde_qty` | 거래량 | String | N | 20 |  |
| Body | `- prm_sell_amt` | 프로그램매도금액 | String | N | 20 |  |
| Body | `- prm_buy_amt` | 프로그램매수금액 | String | N | 20 |  |
| Body | `- prm_netprps_amt` | 프로그램순매수금액 | String | N | 20 |  |
| Body | `- prm_netprps_amt_irds` | 프로그램순매수금액증감 | String | N | 20 |  |
| Body | `- prm_sell_qty` | 프로그램매도수량 | String | N | 20 |  |
| Body | `- prm_buy_qty` | 프로그램매수수량 | String | N | 20 |  |
| Body | `- prm_netprps_qty` | 프로그램순매수수량 | String | N | 20 |  |
| Body | `- prm_netprps_qty_irds` | 프로그램순매수수량증감 | String | N | 20 |  |
| Body | `- base_pric_tm` | 기준가시간 | String | N | 20 |  |
| Body | `- dbrt_trde_rpy_sum` | 대차거래상환주수합 | String | N | 20 |  |
| Body | `- remn_rcvord_sum` | 잔고수주합 | String | N | 20 |  |
| Body | `- stex_tp` | 거래소구분 | String | N | 20 | KRX , NXT , 통합 |

---

### 예수금상세현황요청 (`kt00001`)

- **메뉴 위치**: 국내주식 > 계좌 > 예수금상세현황요청(kt00001)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `qry_tp` | 조회구분 | String | Y | 1 | 3:추정조회, 2:일반조회 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `entr` | 예수금 | String | N | 15 |  |
| Body | `profa_ch` | 주식증거금현금 | String | N | 15 |  |
| Body | `bncr_profa_ch` | 수익증권증거금현금 | String | N | 15 |  |
| Body | `nxdy_bncr_sell_exct` | 익일수익증권매도정산대금 | String | N | 15 |  |
| Body | `fc_stk_krw_repl_set_amt` | 해외주식원화대용설정금 | String | N | 15 |  |
| Body | `crd_grnta_ch` | 신용보증금현금 | String | N | 15 |  |
| Body | `crd_grnt_ch` | 신용담보금현금 | String | N | 15 |  |
| Body | `add_grnt_ch` | 추가담보금현금 | String | N | 15 |  |
| Body | `etc_profa` | 기타증거금 | String | N | 15 |  |
| Body | `uncl_stk_amt` | 미수확보금 | String | N | 15 |  |
| Body | `shrts_prica` | 공매도대금 | String | N | 15 |  |
| Body | `crd_set_grnta` | 신용설정평가금 | String | N | 15 |  |
| Body | `chck_ina_amt` | 수표입금액 | String | N | 15 |  |
| Body | `etc_chck_ina_amt` | 기타수표입금액 | String | N | 15 |  |
| Body | `crd_grnt_ruse` | 신용담보재사용 | String | N | 15 |  |
| Body | `knx_asset_evltv` | 코넥스기본예탁금 | String | N | 15 |  |
| Body | `elwdpst_evlta` | ELW예탁평가금 | String | N | 15 |  |
| Body | `crd_ls_rght_frcs_amt` | 신용대주권리예정금액 | String | N | 15 |  |
| Body | `lvlh_join_amt` | 생계형가입금액 | String | N | 15 |  |
| Body | `lvlh_trns_alowa` | 생계형입금가능금액 | String | N | 15 |  |
| Body | `repl_amt` | 대용금평가금액(합계) | String | N | 15 |  |
| Body | `remn_repl_evlta` | 잔고대용평가금액 | String | N | 15 |  |
| Body | `trst_remn_repl_evlta` | 위탁대용잔고평가금액 | String | N | 15 |  |
| Body | `bncr_remn_repl_evlta` | 수익증권대용평가금액 | String | N | 15 |  |
| Body | `profa_repl` | 위탁증거금대용 | String | N | 15 |  |
| Body | `crd_grnta_repl` | 신용보증금대용 | String | N | 15 |  |
| Body | `crd_grnt_repl` | 신용담보금대용 | String | N | 15 |  |
| Body | `add_grnt_repl` | 추가담보금대용 | String | N | 15 |  |
| Body | `rght_repl_amt` | 권리대용금 | String | N | 15 |  |
| Body | `pymn_alow_amt` | 출금가능금액 | String | N | 15 |  |
| Body | `wrap_pymn_alow_amt` | 랩출금가능금액 | String | N | 15 |  |
| Body | `ord_alow_amt` | 주문가능금액 | String | N | 15 |  |
| Body | `bncr_buy_alowa` | 수익증권매수가능금액 | String | N | 15 |  |
| Body | `20stk_ord_alow_amt` | 20%종목주문가능금액 | String | N | 15 |  |
| Body | `30stk_ord_alow_amt` | 30%종목주문가능금액 | String | N | 15 |  |
| Body | `40stk_ord_alow_amt` | 40%종목주문가능금액 | String | N | 15 |  |
| Body | `100stk_ord_alow_amt` | 100%종목주문가능금액 | String | N | 15 |  |
| Body | `ch_uncla` | 현금미수금 | String | N | 15 |  |
| Body | `ch_uncla_dlfe` | 현금미수연체료 | String | N | 15 |  |
| Body | `ch_uncla_tot` | 현금미수금합계 | String | N | 15 |  |
| Body | `crd_int_npay` | 신용이자미납 | String | N | 15 |  |
| Body | `int_npay_amt_dlfe` | 신용이자미납연체료 | String | N | 15 |  |
| Body | `int_npay_amt_tot` | 신용이자미납합계 | String | N | 15 |  |
| Body | `etc_loana` | 기타대여금 | String | N | 15 |  |
| Body | `etc_loana_dlfe` | 기타대여금연체료 | String | N | 15 |  |
| Body | `etc_loan_tot` | 기타대여금합계 | String | N | 15 |  |
| Body | `nrpy_loan` | 미상환융자금 | String | N | 15 |  |
| Body | `loan_sum` | 융자금합계 | String | N | 15 |  |
| Body | `ls_sum` | 대주금합계 | String | N | 15 |  |
| Body | `crd_grnt_rt` | 신용담보비율 | String | N | 15 |  |
| Body | `mdstrm_usfe` | 중도이용료 | String | N | 15 |  |
| Body | `min_ord_alow_yn` | 최소주문가능금액 | String | N | 15 |  |
| Body | `loan_remn_evlt_amt` | 대출총평가금액 | String | N | 15 |  |
| Body | `dpst_grntl_remn` | 예탁담보대출잔고 | String | N | 15 |  |
| Body | `sell_grntl_remn` | 매도담보대출잔고 | String | N | 15 |  |
| Body | `d1_entra` | d+1추정예수금 | String | N | 15 |  |
| Body | `d1_slby_exct_amt` | d+1매도매수정산금 | String | N | 15 |  |
| Body | `d1_buy_exct_amt` | d+1매수정산금 | String | N | 15 |  |
| Body | `d1_out_rep_mor` | d+1미수변제소요금 | String | N | 15 |  |
| Body | `d1_sel_exct_amt` | d+1매도정산금 | String | N | 15 |  |
| Body | `d1_pymn_alow_amt` | d+1출금가능금액 | String | N | 15 |  |
| Body | `d2_entra` | d+2추정예수금 | String | N | 15 |  |
| Body | `d2_slby_exct_amt` | d+2매도매수정산금 | String | N | 15 |  |
| Body | `d2_buy_exct_amt` | d+2매수정산금 | String | N | 15 |  |
| Body | `d2_out_rep_mor` | d+2미수변제소요금 | String | N | 15 |  |
| Body | `d2_sel_exct_amt` | d+2매도정산금 | String | N | 15 |  |
| Body | `d2_pymn_alow_amt` | d+2출금가능금액 | String | N | 15 |  |
| Body | `50stk_ord_alow_amt` | 50%종목주문가능금액 | String | N | 15 |  |
| Body | `60stk_ord_alow_amt` | 60%종목주문가능금액 | String | N | 15 |  |
| Body | `stk_entr_prst` | 종목별예수금 | LIST | N |  |  |
| Body | `- crnc_cd` | 통화코드 | String | N | 3 |  |
| Body | `- fx_entr` | 외화예수금 | String | N | 15 |  |
| Body | `- fc_krw_repl_evlta` | 원화대용평가금 | String | N | 15 |  |
| Body | `- fc_trst_profa` | 해외주식증거금 | String | N | 15 |  |
| Body | `- pymn_alow_amt_entr` | 출금가능금액(예수금) | String | N | 15 |  |
| Body | `- pymn_alow_amt` | 출금가능금액 | String | N | 15 |  |
| Body | `- ord_alow_amt_entr` | 주문가능금액(예수금) | String | N | 15 |  |
| Body | `- fc_uncla` | 외화미수(합계) | String | N | 15 |  |
| Body | `- fc_ch_uncla` | 외화현금미수금 | String | N | 15 |  |
| Body | `- dly_amt` | 연체료 | String | N | 15 |  |
| Body | `- d1_fx_entr` | d+1외화예수금 | String | N | 15 |  |
| Body | `- d2_fx_entr` | d+2외화예수금 | String | N | 15 |  |
| Body | `- d3_fx_entr` | d+3외화예수금 | String | N | 15 |  |
| Body | `- d4_fx_entr` | d+4외화예수금 | String | N | 15 |  |

---

### 일별추정예탁자산현황요청 (`kt00002`)

- **메뉴 위치**: 국내주식 > 계좌 > 일별추정예탁자산현황요청(kt00002)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `start_dt` | 시작조회기간 | String | Y | 8 | YYYYMMDD |
| Body | `end_dt` | 종료조회기간 | String | Y | 8 | YYYYMMDD |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `daly_prsm_dpst_aset_amt_prst` | 일별추정예탁자산현황 | LIST | N |  |  |
| Body | `- dt` | 일자 | String | N | 8 |  |
| Body | `- entr` | 예수금 | String | N | 12 |  |
| Body | `- grnt_use_amt` | 담보대출금 | String | N | 12 |  |
| Body | `- crd_loan` | 신용융자금 | String | N | 12 |  |
| Body | `- ls_grnt` | 대주담보금 | String | N | 12 |  |
| Body | `- repl_amt` | 대용금 | String | N | 12 |  |
| Body | `- prsm_dpst_aset_amt` | 추정예탁자산 | String | N | 12 |  |
| Body | `- prsm_dpst_aset_amt_bncr_skip` | 추정예탁자산수익증권제외 | String | N | 12 |  |

---

### 추정자산조회요청 (`kt00003`)

- **메뉴 위치**: 국내주식 > 계좌 > 추정자산조회요청(kt00003)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `qry_tp` | 상장폐지조회구분 | String | Y | 1 | 0:전체, 1:상장폐지종목제외 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `prsm_dpst_aset_amt` | 추정예탁자산 | String | N | 12 |  |

---

### 계좌평가현황요청 (`kt00004`)

- **메뉴 위치**: 국내주식 > 계좌 > 계좌평가현황요청(kt00004)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `qry_tp` | 상장폐지조회구분 | String | Y | 1 | 0:전체, 1:상장폐지종목제외 |
| Body | `dmst_stex_tp` | 국내거래소구분 | String | Y | 6 | KRX:한국거래소,NXT:넥스트트레이드 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `acnt_nm` | 계좌명 | String | N | 30 |  |
| Body | `brch_nm` | 지점명 | String | N | 30 |  |
| Body | `entr` | 예수금 | String | N | 12 |  |
| Body | `d2_entra` | D+2추정예수금 | String | N | 12 |  |
| Body | `tot_est_amt` | 유가잔고평가액 | String | N | 12 |  |
| Body | `aset_evlt_amt` | 예탁자산평가액 | String | N | 12 |  |
| Body | `tot_pur_amt` | 총매입금액 | String | N | 12 |  |
| Body | `prsm_dpst_aset_amt` | 추정예탁자산 | String | N | 12 |  |
| Body | `tot_grnt_sella` | 매도담보대출금 | String | N | 12 |  |
| Body | `tdy_lspft_amt` | 당일투자원금 | String | N | 12 |  |
| Body | `invt_bsamt` | 당월투자원금 | String | N | 12 |  |
| Body | `lspft_amt` | 누적투자원금 | String | N | 12 |  |
| Body | `tdy_lspft` | 당일투자손익 | String | N | 12 |  |
| Body | `lspft2` | 당월투자손익 | String | N | 12 |  |
| Body | `lspft` | 누적투자손익 | String | N | 12 |  |
| Body | `tdy_lspft_rt` | 당일손익율 | String | N | 12 |  |
| Body | `lspft_ratio` | 당월손익율 | String | N | 12 |  |
| Body | `lspft_rt` | 누적손익율 | String | N | 12 |  |
| Body | `stk_acnt_evlt_prst` | 종목별계좌평가현황 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 12 |  |
| Body | `- stk_nm` | 종목명 | String | N | 30 |  |
| Body | `- rmnd_qty` | 보유수량 | String | N | 12 |  |
| Body | `- avg_prc` | 평균단가 | String | N | 12 |  |
| Body | `- cur_prc` | 현재가 | String | N | 12 |  |
| Body | `- evlt_amt` | 평가금액 | String | N | 12 |  |
| Body | `- pl_amt` | 손익금액 | String | N | 12 |  |
| Body | `- pl_rt` | 손익율 | String | N | 12 |  |
| Body | `- loan_dt` | 대출일 | String | N | 10 |  |
| Body | `- pur_amt` | 매입금액 | String | N | 12 |  |
| Body | `- setl_remn` | 결제잔고 | String | N | 12 |  |
| Body | `- pred_buyq` | 전일매수수량 | String | N | 12 |  |
| Body | `- pred_sellq` | 전일매도수량 | String | N | 12 |  |
| Body | `- tdy_buyq` | 금일매수수량 | String | N | 12 |  |
| Body | `- tdy_sellq` | 금일매도수량 | String | N | 12 |  |

---

### 체결잔고요청 (`kt00005`)

- **메뉴 위치**: 국내주식 > 계좌 > 체결잔고요청(kt00005)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dmst_stex_tp` | 국내거래소구분 | String | Y | 6 | KRX:한국거래소,NXT:넥스트트레이드 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `entr` | 예수금 | String | N | 12 |  |
| Body | `entr_d1` | 예수금D+1 | String | N | 12 |  |
| Body | `entr_d2` | 예수금D+2 | String | N | 12 |  |
| Body | `pymn_alow_amt` | 출금가능금액 | String | N | 12 |  |
| Body | `uncl_stk_amt` | 미수확보금 | String | N | 12 |  |
| Body | `repl_amt` | 대용금 | String | N | 12 |  |
| Body | `rght_repl_amt` | 권리대용금 | String | N | 12 |  |
| Body | `ord_alowa` | 주문가능현금 | String | N | 12 |  |
| Body | `ch_uncla` | 현금미수금 | String | N | 12 |  |
| Body | `crd_int_npay_gold` | 신용이자미납금 | String | N | 12 |  |
| Body | `etc_loana` | 기타대여금 | String | N | 12 |  |
| Body | `nrpy_loan` | 미상환융자금 | String | N | 12 |  |
| Body | `profa_ch` | 증거금현금 | String | N | 12 |  |
| Body | `repl_profa` | 증거금대용 | String | N | 12 |  |
| Body | `stk_buy_tot_amt` | 주식매수총액 | String | N | 12 |  |
| Body | `evlt_amt_tot` | 평가금액합계 | String | N | 12 |  |
| Body | `tot_pl_tot` | 총손익합계 | String | N | 12 |  |
| Body | `tot_pl_rt` | 총손익률 | String | N | 12 |  |
| Body | `tot_re_buy_alowa` | 총재매수가능금액 | String | N | 12 |  |
| Body | `20ord_alow_amt` | 20%주문가능금액 | String | N | 12 |  |
| Body | `30ord_alow_amt` | 30%주문가능금액 | String | N | 12 |  |
| Body | `40ord_alow_amt` | 40%주문가능금액 | String | N | 12 |  |
| Body | `50ord_alow_amt` | 50%주문가능금액 | String | N | 12 |  |
| Body | `60ord_alow_amt` | 60%주문가능금액 | String | N | 12 |  |
| Body | `100ord_alow_amt` | 100%주문가능금액 | String | N | 12 |  |
| Body | `crd_loan_tot` | 신용융자합계 | String | N | 12 |  |
| Body | `crd_loan_ls_tot` | 신용융자대주합계 | String | N | 12 |  |
| Body | `crd_grnt_rt` | 신용담보비율 | String | N | 12 |  |
| Body | `dpst_grnt_use_amt_amt` | 예탁담보대출금액 | String | N | 12 |  |
| Body | `grnt_loan_amt` | 매도담보대출금액 | String | N | 12 |  |
| Body | `stk_cntr_remn` | 종목별체결잔고 | LIST | N |  |  |
| Body | `- crd_tp` | 신용구분 | String | N | 2 |  |
| Body | `- loan_dt` | 대출일 | String | N | 8 |  |
| Body | `- expr_dt` | 만기일 | String | N | 8 |  |
| Body | `- stk_cd` | 종목번호 | String | N | 12 |  |
| Body | `- stk_nm` | 종목명 | String | N | 30 |  |
| Body | `- setl_remn` | 결제잔고 | String | N | 12 |  |
| Body | `- cur_qty` | 현재잔고 | String | N | 12 |  |
| Body | `- cur_prc` | 현재가 | String | N | 12 |  |
| Body | `- buy_uv` | 매입단가 | String | N | 12 |  |
| Body | `- pur_amt` | 매입금액 | String | N | 12 |  |
| Body | `- evlt_amt` | 평가금액 | String | N | 12 |  |
| Body | `- evltv_prft` | 평가손익 | String | N | 12 |  |
| Body | `- pl_rt` | 손익률 | String | N | 12 |  |

---

### 계좌별주문체결내역상세요청 (`kt00007`)

- **메뉴 위치**: 국내주식 > 계좌 > 계좌별주문체결내역상세요청(kt00007)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ord_dt` | 주문일자 | String | N | 8 | YYYYMMDD |
| Body | `qry_tp` | 조회구분 | String | Y | 1 | 1:주문순, 2:역순, 3:미체결, 4:체결내역만 |
| Body | `stk_bond_tp` | 주식채권구분 | String | Y | 1 | 0:전체, 1:주식, 2:채권 |
| Body | `sell_tp` | 매도수구분 | String | Y | 1 | 0:전체, 1:매도, 2:매수 |
| Body | `stk_cd` | 종목코드 | String | N | 12 | 공백허용 (공백일때 전체종목) |
| Body | `fr_ord_no` | 시작주문번호 | String | N | 7 | 공백허용 (공백일때 전체주문) |
| Body | `dmst_stex_tp` | 국내거래소구분 | String | Y | 6 | %:(전체),KRX:한국거래소,NXT:넥스트트레이드,SOR:최선주문집행 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `acnt_ord_cntr_prps_dtl` | 계좌별주문체결내역상세 | LIST | N |  |  |
| Body | `- ord_no` | 주문번호 | String | N | 7 |  |
| Body | `- stk_cd` | 종목번호 | String | N | 12 |  |
| Body | `- trde_tp` | 매매구분 | String | N | 20 |  |
| Body | `- crd_tp` | 신용구분 | String | N | 20 |  |
| Body | `- ord_qty` | 주문수량 | String | N | 10 |  |
| Body | `- ord_uv` | 주문단가 | String | N | 10 |  |
| Body | `- cnfm_qty` | 확인수량 | String | N | 10 |  |
| Body | `- acpt_tp` | 접수구분 | String | N | 20 |  |
| Body | `- rsrv_tp` | 반대여부 | String | N | 20 |  |
| Body | `- ord_tm` | 주문시간 | String | N | 8 |  |
| Body | `- ori_ord` | 원주문 | String | N | 7 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- io_tp_nm` | 주문구분 | String | N | 20 |  |
| Body | `- loan_dt` | 대출일 | String | N | 8 |  |
| Body | `- cntr_qty` | 체결수량 | String | N | 10 |  |
| Body | `- cntr_uv` | 체결단가 | String | N | 10 |  |
| Body | `- ord_remnq` | 주문잔량 | String | N | 10 |  |
| Body | `- comm_ord_tp` | 통신구분 | String | N | 20 |  |
| Body | `- mdfy_cncl` | 정정취소 | String | N | 20 |  |
| Body | `- cnfm_tm` | 확인시간 | String | N | 8 |  |
| Body | `- dmst_stex_tp` | 국내거래소구분 | String | N | 8 |  |
| Body | `- cond_uv` | 스톱가 | String | N | 10 |  |

---

### 계좌별익일결제예정내역요청 (`kt00008`)

- **메뉴 위치**: 국내주식 > 계좌 > 계좌별익일결제예정내역요청(kt00008)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `strt_dcd_seq` | 시작결제번호 | String | N | 7 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trde_dt` | 매매일자 | String | N | 8 |  |
| Body | `setl_dt` | 결제일자 | String | N | 8 |  |
| Body | `sell_amt_sum` | 매도정산합 | String | N | 12 |  |
| Body | `buy_amt_sum` | 매수정산합 | String | N | 12 |  |
| Body | `acnt_nxdy_setl_frcs_prps_array` | 계좌별익일결제예정내역배열 | LIST | N |  |  |
| Body | `- seq` | 일련번호 | String | N | 7 |  |
| Body | `- stk_cd` | 종목번호 | String | N | 12 |  |
| Body | `- loan_dt` | 대출일 | String | N | 8 |  |
| Body | `- qty` | 수량 | String | N | 12 |  |
| Body | `- engg_amt` | 약정금액 | String | N | 12 |  |
| Body | `- cmsn` | 수수료 | String | N | 12 |  |
| Body | `- incm_tax` | 소득세 | String | N | 12 |  |
| Body | `- rstx` | 농특세 | String | N | 12 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- sell_tp` | 매도수구분 | String | N | 10 |  |
| Body | `- unp` | 단가 | String | N | 12 |  |
| Body | `- exct_amt` | 정산금액 | String | N | 12 |  |
| Body | `- trde_tax` | 거래세 | String | N | 12 |  |
| Body | `- resi_tax` | 주민세 | String | N | 12 |  |
| Body | `- crd_tp` | 신용구분 | String | N | 20 |  |

---

### 계좌별주문체결현황요청 (`kt00009`)

- **메뉴 위치**: 국내주식 > 계좌 > 계좌별주문체결현황요청(kt00009)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ord_dt` | 주문일자 | String | N | 8 | YYYYMMDD |
| Body | `stk_bond_tp` | 주식채권구분 | String | Y | 1 | 0:전체, 1:주식, 2:채권 |
| Body | `mrkt_tp` | 시장구분 | String | Y | 1 | 0:전체, 1:코스피, 2:코스닥, 3:OTCBB, 4:ECN |
| Body | `sell_tp` | 매도수구분 | String | Y | 1 | 0:전체, 1:매도, 2:매수 |
| Body | `qry_tp` | 조회구분 | String | Y | 1 | 0:전체, 1:체결 |
| Body | `stk_cd` | 종목코드 | String | N | 12 | 전문 조회할 종목코드 |
| Body | `fr_ord_no` | 시작주문번호 | String | N | 7 |  |
| Body | `dmst_stex_tp` | 국내거래소구분 | String | Y | 6 | %:(전체),KRX:한국거래소,NXT:넥스트트레이드,SOR:최선주문집행 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `sell_grntl_engg_amt` | 매도약정금액 | String | N | 12 |  |
| Body | `buy_engg_amt` | 매수약정금액 | String | N | 12 |  |
| Body | `engg_amt` | 약정금액 | String | N | 12 |  |
| Body | `acnt_ord_cntr_prst_array` | 계좌별주문체결현황배열 | LIST | N |  |  |
| Body | `- stk_bond_tp` | 주식채권구분 | String | N | 1 |  |
| Body | `- ord_no` | 주문번호 | String | N | 7 |  |
| Body | `- stk_cd` | 종목번호 | String | N | 12 |  |
| Body | `- trde_tp` | 매매구분 | String | N | 15 |  |
| Body | `- io_tp_nm` | 주문유형구분 | String | N | 20 |  |
| Body | `- ord_qty` | 주문수량 | String | N | 10 |  |
| Body | `- ord_uv` | 주문단가 | String | N | 10 |  |
| Body | `- cnfm_qty` | 확인수량 | String | N | 10 |  |
| Body | `- rsrv_oppo` | 예약/반대 | String | N | 4 |  |
| Body | `- cntr_no` | 체결번호 | String | N | 7 |  |
| Body | `- acpt_tp` | 접수구분 | String | N | 8 |  |
| Body | `- orig_ord_no` | 원주문번호 | String | N | 7 |  |
| Body | `- stk_nm` | 종목명 | String | N | 20 |  |
| Body | `- setl_tp` | 결제구분 | String | N | 8 |  |
| Body | `- crd_deal_tp` | 신용거래구분 | String | N | 20 |  |
| Body | `- cntr_qty` | 체결수량 | String | N | 10 |  |
| Body | `- cntr_uv` | 체결단가 | String | N | 10 |  |
| Body | `- comm_ord_tp` | 통신구분 | String | N | 8 |  |
| Body | `- mdfy_cncl_tp` | 정정/취소구분 | String | N | 12 |  |
| Body | `- cntr_tm` | 체결시간 | String | N | 8 |  |
| Body | `- dmst_stex_tp` | 국내거래소구분 | String | N | 6 |  |
| Body | `- cond_uv` | 스톱가 | String | N | 10 |  |

---

### 주문인출가능금액요청 (`kt00010`)

- **메뉴 위치**: 국내주식 > 계좌 > 주문인출가능금액요청(kt00010)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `io_amt` | 입출금액 | String | N | 12 |  |
| Body | `stk_cd` | 종목번호 | String | Y | 12 |  |
| Body | `trde_tp` | 매매구분 | String | Y | 1 | 1:매도, 2:매수 |
| Body | `trde_qty` | 매매수량 | String | N | 10 |  |
| Body | `uv` | 매수가격 | String | Y | 10 |  |
| Body | `exp_buy_unp` | 예상매수단가 | String | N | 10 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `profa_20ord_alow_amt` | 증거금20%주문가능금액 | String | N | 12 |  |
| Body | `profa_20ord_alowq` | 증거금20%주문가능수량 | String | N | 10 |  |
| Body | `profa_30ord_alow_amt` | 증거금30%주문가능금액 | String | N | 12 |  |
| Body | `profa_30ord_alowq` | 증거금30%주문가능수량 | String | N | 10 |  |
| Body | `profa_40ord_alow_amt` | 증거금40%주문가능금액 | String | N | 12 |  |
| Body | `profa_40ord_alowq` | 증거금40%주문가능수량 | String | N | 10 |  |
| Body | `profa_50ord_alow_amt` | 증거금50%주문가능금액 | String | N | 12 |  |
| Body | `profa_50ord_alowq` | 증거금50%주문가능수량 | String | N | 10 |  |
| Body | `profa_60ord_alow_amt` | 증거금60%주문가능금액 | String | N | 12 |  |
| Body | `profa_60ord_alowq` | 증거금60%주문가능수량 | String | N | 10 |  |
| Body | `profa_rdex_60ord_alow_amt` | 증거금감면60%주문가능금 | String | N | 12 |  |
| Body | `profa_rdex_60ord_alowq` | 증거금감면60%주문가능수 | String | N | 10 |  |
| Body | `profa_100ord_alow_amt` | 증거금100%주문가능금액 | String | N | 12 |  |
| Body | `profa_100ord_alowq` | 증거금100%주문가능수량 | String | N | 10 |  |
| Body | `pred_reu_alowa` | 전일재사용가능금액 | String | N | 12 |  |
| Body | `tdy_reu_alowa` | 금일재사용가능금액 | String | N | 12 |  |
| Body | `entr` | 예수금 | String | N | 12 |  |
| Body | `repl_amt` | 대용금 | String | N | 12 |  |
| Body | `uncla` | 미수금 | String | N | 12 |  |
| Body | `ord_pos_repl` | 주문가능대용 | String | N | 12 |  |
| Body | `ord_alowa` | 주문가능현금 | String | N | 12 |  |
| Body | `wthd_alowa` | 인출가능금액 | String | N | 12 |  |
| Body | `nxdy_wthd_alowa` | 익일인출가능금액 | String | N | 12 |  |
| Body | `pur_amt` | 매입금액 | String | N | 12 |  |
| Body | `cmsn` | 수수료 | String | N | 12 |  |
| Body | `pur_exct_amt` | 매입정산금 | String | N | 12 |  |
| Body | `d2entra` | D2추정예수금 | String | N | 12 |  |
| Body | `profa_rdex_aplc_tp` | 증거금감면적용구분 | String | N | 1 | 0:일반,1:60%감면 |

---

### 증거금율별주문가능수량조회요청 (`kt00011`)

- **메뉴 위치**: 국내주식 > 계좌 > 증거금율별주문가능수량조회요청(kt00011)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목번호 | String | Y | 12 |  |
| Body | `uv` | 매수가격 | String | N | 10 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_profa_rt` | 종목증거금율 | String | N | 15 |  |
| Body | `profa_rt` | 계좌증거금율 | String | N | 15 |  |
| Body | `aplc_rt` | 적용증거금율 | String | N | 15 |  |
| Body | `profa_20ord_alow_amt` | 증거금20%주문가능금액 | String | N | 12 |  |
| Body | `profa_20ord_alowq` | 증거금20%주문가능수량 | String | N | 12 |  |
| Body | `profa_20pred_reu_amt` | 증거금20%전일재사용금액 | String | N | 12 |  |
| Body | `profa_20tdy_reu_amt` | 증거금20%금일재사용금액 | String | N | 12 |  |
| Body | `profa_30ord_alow_amt` | 증거금30%주문가능금액 | String | N | 12 |  |
| Body | `profa_30ord_alowq` | 증거금30%주문가능수량 | String | N | 12 |  |
| Body | `profa_30pred_reu_amt` | 증거금30%전일재사용금액 | String | N | 12 |  |
| Body | `profa_30tdy_reu_amt` | 증거금30%금일재사용금액 | String | N | 12 |  |
| Body | `profa_40ord_alow_amt` | 증거금40%주문가능금액 | String | N | 12 |  |
| Body | `profa_40ord_alowq` | 증거금40%주문가능수량 | String | N | 12 |  |
| Body | `profa_40pred_reu_amt` | 증거금40전일재사용금액 | String | N | 12 |  |
| Body | `profa_40tdy_reu_amt` | 증거금40%금일재사용금액 | String | N | 12 |  |
| Body | `profa_50ord_alow_amt` | 증거금50%주문가능금액 | String | N | 12 |  |
| Body | `profa_50ord_alowq` | 증거금50%주문가능수량 | String | N | 12 |  |
| Body | `profa_50pred_reu_amt` | 증거금50%전일재사용금액 | String | N | 12 |  |
| Body | `profa_50tdy_reu_amt` | 증거금50%금일재사용금액 | String | N | 12 |  |
| Body | `profa_60ord_alow_amt` | 증거금60%주문가능금액 | String | N | 12 |  |
| Body | `profa_60ord_alowq` | 증거금60%주문가능수량 | String | N | 12 |  |
| Body | `profa_60pred_reu_amt` | 증거금60%전일재사용금액 | String | N | 12 |  |
| Body | `profa_60tdy_reu_amt` | 증거금60%금일재사용금액 | String | N | 12 |  |
| Body | `profa_100ord_alow_amt` | 증거금100%주문가능금액 | String | N | 12 |  |
| Body | `profa_100ord_alowq` | 증거금100%주문가능수량 | String | N | 12 |  |
| Body | `profa_100pred_reu_amt` | 증거금100%전일재사용금액 | String | N | 12 |  |
| Body | `profa_100tdy_reu_amt` | 증거금100%금일재사용금액 | String | N | 12 |  |
| Body | `min_ord_alow_amt` | 미수불가주문가능금액 | String | N | 12 |  |
| Body | `min_ord_alowq` | 미수불가주문가능수량 | String | N | 12 |  |
| Body | `min_pred_reu_amt` | 미수불가전일재사용금액 | String | N | 12 |  |
| Body | `min_tdy_reu_amt` | 미수불가금일재사용금액 | String | N | 12 |  |
| Body | `entr` | 예수금 | String | N | 12 |  |
| Body | `repl_amt` | 대용금 | String | N | 12 |  |
| Body | `uncla` | 미수금 | String | N | 12 |  |
| Body | `ord_pos_repl` | 주문가능대용 | String | N | 12 |  |
| Body | `ord_alowa` | 주문가능현금 | String | N | 12 |  |

---

### 신용보증금율별주문가능수량조회요청 (`kt00012`)

- **메뉴 위치**: 국내주식 > 계좌 > 신용보증금율별주문가능수량조회요청(kt00012)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목번호 | String | Y | 12 |  |
| Body | `uv` | 매수가격 | String | N | 10 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_assr_rt` | 종목보증금율 | String | N | 1 |  |
| Body | `stk_assr_rt_nm` | 종목보증금율명 | String | N | 4 |  |
| Body | `assr_30ord_alow_amt` | 보증금30%주문가능금액 | String | N | 12 |  |
| Body | `assr_30ord_alowq` | 보증금30%주문가능수량 | String | N | 12 |  |
| Body | `assr_30pred_reu_amt` | 보증금30%전일재사용금액 | String | N | 12 |  |
| Body | `assr_30tdy_reu_amt` | 보증금30%금일재사용금액 | String | N | 12 |  |
| Body | `assr_40ord_alow_amt` | 보증금40%주문가능금액 | String | N | 12 |  |
| Body | `assr_40ord_alowq` | 보증금40%주문가능수량 | String | N | 12 |  |
| Body | `assr_40pred_reu_amt` | 보증금40%전일재사용금액 | String | N | 12 |  |
| Body | `assr_40tdy_reu_amt` | 보증금40%금일재사용금액 | String | N | 12 |  |
| Body | `assr_50ord_alow_amt` | 보증금50%주문가능금액 | String | N | 12 |  |
| Body | `assr_50ord_alowq` | 보증금50%주문가능수량 | String | N | 12 |  |
| Body | `assr_50pred_reu_amt` | 보증금50%전일재사용금액 | String | N | 12 |  |
| Body | `assr_50tdy_reu_amt` | 보증금50%금일재사용금액 | String | N | 12 |  |
| Body | `assr_60ord_alow_amt` | 보증금60%주문가능금액 | String | N | 12 |  |
| Body | `assr_60ord_alowq` | 보증금60%주문가능수량 | String | N | 12 |  |
| Body | `assr_60pred_reu_amt` | 보증금60%전일재사용금액 | String | N | 12 |  |
| Body | `assr_60tdy_reu_amt` | 보증금60%금일재사용금액 | String | N | 12 |  |
| Body | `entr` | 예수금 | String | N | 12 |  |
| Body | `repl_amt` | 대용금 | String | N | 12 |  |
| Body | `uncla` | 미수금 | String | N | 12 |  |
| Body | `ord_pos_repl` | 주문가능대용 | String | N | 12 |  |
| Body | `ord_alowa` | 주문가능현금 | String | N | 12 |  |
| Body | `out_alowa` | 미수가능금액 | String | N | 12 |  |
| Body | `out_pos_qty` | 미수가능수량 | String | N | 12 |  |
| Body | `min_amt` | 미수불가금액 | String | N | 12 |  |
| Body | `min_qty` | 미수불가수량 | String | N | 12 |  |

---

### 증거금세부내역조회요청 (`kt00013`)

- **메뉴 위치**: 국내주식 > 계좌 > 증거금세부내역조회요청(kt00013)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `tdy_reu_objt_amt` | 금일재사용대상금액 | String | N | 15 |  |
| Body | `tdy_reu_use_amt` | 금일재사용사용금액 | String | N | 15 |  |
| Body | `tdy_reu_alowa` | 금일재사용가능금액 | String | N | 15 |  |
| Body | `tdy_reu_lmtt_amt` | 금일재사용제한금액 | String | N | 15 |  |
| Body | `tdy_reu_alowa_fin` | 금일재사용가능금액최종 | String | N | 15 |  |
| Body | `pred_reu_objt_amt` | 전일재사용대상금액 | String | N | 15 |  |
| Body | `pred_reu_use_amt` | 전일재사용사용금액 | String | N | 15 |  |
| Body | `pred_reu_alowa` | 전일재사용가능금액 | String | N | 15 |  |
| Body | `pred_reu_lmtt_amt` | 전일재사용제한금액 | String | N | 15 |  |
| Body | `pred_reu_alowa_fin` | 전일재사용가능금액최종 | String | N | 15 |  |
| Body | `ch_amt` | 현금금액 | String | N | 15 |  |
| Body | `ch_profa` | 현금증거금 | String | N | 15 |  |
| Body | `use_pos_ch` | 사용가능현금 | String | N | 15 |  |
| Body | `ch_use_lmtt_amt` | 현금사용제한금액 | String | N | 15 |  |
| Body | `use_pos_ch_fin` | 사용가능현금최종 | String | N | 15 |  |
| Body | `repl_amt_amt` | 대용금액 | String | N | 15 |  |
| Body | `repl_profa` | 대용증거금 | String | N | 15 |  |
| Body | `use_pos_repl` | 사용가능대용 | String | N | 15 |  |
| Body | `repl_use_lmtt_amt` | 대용사용제한금액 | String | N | 15 |  |
| Body | `use_pos_repl_fin` | 사용가능대용최종 | String | N | 15 |  |
| Body | `crd_grnta_ch` | 신용보증금현금 | String | N | 15 |  |
| Body | `crd_grnta_repl` | 신용보증금대용 | String | N | 15 |  |
| Body | `crd_grnt_ch` | 신용담보금현금 | String | N | 15 |  |
| Body | `crd_grnt_repl` | 신용담보금대용 | String | N | 15 |  |
| Body | `uncla` | 미수금 | String | N | 12 |  |
| Body | `ls_grnt_reu_gold` | 대주담보금재사용금 | String | N | 15 |  |
| Body | `20ord_alow_amt` | 20%주문가능금액 | String | N | 15 |  |
| Body | `30ord_alow_amt` | 30%주문가능금액 | String | N | 15 |  |
| Body | `40ord_alow_amt` | 40%주문가능금액 | String | N | 15 |  |
| Body | `50ord_alow_amt` | 50%주문가능금액 | String | N | 15 |  |
| Body | `60ord_alow_amt` | 60%주문가능금액 | String | N | 15 |  |
| Body | `100ord_alow_amt` | 100%주문가능금액 | String | N | 15 |  |
| Body | `tdy_crd_rpya_loss_amt` | 금일신용상환손실금액 | String | N | 15 |  |
| Body | `pred_crd_rpya_loss_amt` | 전일신용상환손실금액 | String | N | 15 |  |
| Body | `tdy_ls_rpya_loss_repl_profa` | 금일대주상환손실대용증거금 | String | N | 15 |  |
| Body | `pred_ls_rpya_loss_repl_profa` | 전일대주상환손실대용증거금 | String | N | 15 |  |
| Body | `evlt_repl_amt_spg_use_skip` | 평가대용금(현물사용제외) | String | N | 15 |  |
| Body | `evlt_repl_rt` | 평가대용비율 | String | N | 15 |  |
| Body | `crd_repl_profa` | 신용대용증거금 | String | N | 15 |  |
| Body | `ch_ord_repl_profa` | 현금주문대용증거금 | String | N | 15 |  |
| Body | `crd_ord_repl_profa` | 신용주문대용증거금 | String | N | 15 |  |
| Body | `crd_repl_conv_gold` | 신용대용환산금 | String | N | 15 |  |
| Body | `repl_alowa` | 대용가능금액(현금제한) | String | N | 15 |  |
| Body | `repl_alowa_2` | 대용가능금액2(신용제한) | String | N | 15 |  |
| Body | `ch_repl_lck_gold` | 현금대용부족금 | String | N | 15 |  |
| Body | `crd_repl_lck_gold` | 신용대용부족금 | String | N | 15 |  |
| Body | `ch_ord_alow_repla` | 현금주문가능대용금 | String | N | 15 |  |
| Body | `crd_ord_alow_repla` | 신용주문가능대용금 | String | N | 15 |  |
| Body | `d2vexct_entr` | D2가정산예수금 | String | N | 15 |  |
| Body | `d2ch_ord_alow_amt` | D2현금주문가능금액 | String | N | 15 |  |

---

### 위탁종합거래내역요청 (`kt00015`)

- **메뉴 위치**: 국내주식 > 계좌 > 위탁종합거래내역요청(kt00015)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `strt_dt` | 시작일자 | String | Y | 8 |  |
| Body | `end_dt` | 종료일자 | String | Y | 8 |  |
| Body | `tp` | 구분 | String | Y | 1 | 0:전체,1:입출금,2:입출고,3:매매,4:매수,5:매도,6:입금,7:출금,A:예탁담보대출입금,B:매도담보대출입금,C:현금상환(융자,담보상환),F:환전,M:입출금+환전,G:외화매수,H:외화매도,I:환전정산입금,J:환전정산출금 |
| Body | `stk_cd` | 종목코드 | String | N | 12 |  |
| Body | `crnc_cd` | 통화코드 | String | N | 3 |  |
| Body | `gds_tp` | 상품구분 | String | Y | 1 | 0:전체, 1:국내주식, 2:수익증권, 3:해외주식, 4:금융상품 |
| Body | `frgn_stex_code` | 해외거래소코드 | String | N | 10 |  |
| Body | `dmst_stex_tp` | 국내거래소구분 | String | Y | 6 | %:(전체),KRX:한국거래소,NXT:넥스트트레이드 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trst_ovrl_trde_prps_array` | 위탁종합거래내역배열 | LIST | N |  |  |
| Body | `- trde_dt` | 거래일자 | String | N | 8 |  |
| Body | `- trde_no` | 거래번호 | String | N | 9 |  |
| Body | `- rmrk_nm` | 적요명 | String | N | 60 |  |
| Body | `- crd_deal_tp_nm` | 신용거래구분명 | String | N | 20 |  |
| Body | `- exct_amt` | 정산금액 | String | N | 15 |  |
| Body | `- loan_amt_rpya` | 대출금상환 | String | N | 15 |  |
| Body | `- fc_trde_amt` | 거래금액(외) | String | N | 15 |  |
| Body | `- fc_exct_amt` | 정산금액(외) | String | N | 15 |  |
| Body | `- entra_remn` | 예수금잔고 | String | N | 15 |  |
| Body | `- crnc_cd` | 통화코드 | String | N | 3 |  |
| Body | `- trde_ocr_tp` | 거래종류구분 | String | N | 2 | 1:입출금, 2:펀드, 3:ELS, 4:채권, 5:해외채권, 6:외화RP, 7:외화발행어음 |
| Body | `- trde_kind_nm` | 거래종류명 | String | N | 20 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- trde_amt` | 거래금액 | String | N | 15 |  |
| Body | `- trde_agri_tax` | 거래및농특세 | String | N | 15 |  |
| Body | `- rpy_diffa` | 상환차금 | String | N | 15 |  |
| Body | `- fc_trde_tax` | 거래세(외) | String | N | 15 |  |
| Body | `- dly_sum` | 연체합 | String | N | 15 |  |
| Body | `- fc_entra` | 외화예수금잔고 | String | N | 15 |  |
| Body | `- mdia_tp_nm` | 매체구분명 | String | N | 20 |  |
| Body | `- io_tp` | 입출구분 | String | N | 1 |  |
| Body | `- io_tp_nm` | 입출구분명 | String | N | 10 |  |
| Body | `- orig_deal_no` | 원거래번호 | String | N | 9 |  |
| Body | `- stk_cd` | 종목코드 | String | N | 12 |  |
| Body | `- trde_qty_jwa_cnt` | 거래수량/좌수 | String | N | 30 |  |
| Body | `- cmsn` | 수수료 | String | N | 15 |  |
| Body | `- int_ls_usfe` | 이자/대주이용 | String | N | 15 |  |
| Body | `- fc_cmsn` | 수수료(외) | String | N | 15 |  |
| Body | `- fc_dly_sum` | 연체합(외) | String | N | 15 |  |
| Body | `- vlbl_nowrm` | 유가금잔 | String | N | 30 |  |
| Body | `- proc_tm` | 처리시간 | String | N | 111 |  |
| Body | `- isin_cd` | ISIN코드 | String | N | 12 |  |
| Body | `- stex_cd` | 거래소코드 | String | N | 10 |  |
| Body | `- stex_nm` | 거래소명 | String | N | 20 |  |
| Body | `- trde_unit` | 거래단가/환율 | String | N | 20 |  |
| Body | `- incm_resi_tax` | 소득/주민세 | String | N | 15 |  |
| Body | `- loan_dt` | 대출일 | String | N | 8 |  |
| Body | `- uncl_ocr` | 미수(원/주) | String | N | 30 |  |
| Body | `- rpym_sum` | 변제합 | String | N | 30 |  |
| Body | `- cntr_dt` | 체결일 | String | N | 8 |  |
| Body | `- rcpy_no` | 출납번호 | String | N | 20 |  |
| Body | `- prcsr` | 처리자 | String | N | 20 |  |
| Body | `- proc_brch` | 처리점 | String | N | 20 |  |
| Body | `- trde_stle` | 매매형태 | String | N | 40 |  |
| Body | `- txon_base_pric` | 과세기준가 | String | N | 15 |  |
| Body | `- tax_sum_cmsn` | 세금수수료합 | String | N | 15 |  |
| Body | `- frgn_pay_txam` | 외국납부세액(외) | String | N | 15 |  |
| Body | `- fc_uncl_ocr` | 미수(외) | String | N | 15 |  |
| Body | `- rpym_sum_fr` | 변제합(외) | String | N | 30 |  |
| Body | `- rcpmnyer` | 입금자 | String | N | 20 |  |
| Body | `- trde_prtc_tp` | 거래내역구분 | String | N | 2 |  |

---

### 일별계좌수익률상세현황요청 (`kt00016`)

- **메뉴 위치**: 국내주식 > 계좌 > 일별계좌수익률상세현황요청(kt00016)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `fr_dt` | 평가시작일 | String | Y | 8 |  |
| Body | `to_dt` | 평가종료일 | String | Y | 8 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `mang_empno` | 관리사원번호 | String | N | 8 |  |
| Body | `mngr_nm` | 관리자명 | String | N | 8 |  |
| Body | `dept_nm` | 관리자지점 | String | N | 30 |  |
| Body | `entr_fr` | 예수금_초 | String | N | 30 |  |
| Body | `entr_to` | 예수금_말 | String | N | 12 |  |
| Body | `scrt_evlt_amt_fr` | 유가증권평가금액_초 | String | N | 12 |  |
| Body | `scrt_evlt_amt_to` | 유가증권평가금액_말 | String | N | 12 |  |
| Body | `ls_grnt_fr` | 대주담보금_초 | String | N | 12 |  |
| Body | `ls_grnt_to` | 대주담보금_말 | String | N | 12 |  |
| Body | `crd_loan_fr` | 신용융자금_초 | String | N | 12 |  |
| Body | `crd_loan_to` | 신용융자금_말 | String | N | 12 |  |
| Body | `ch_uncla_fr` | 현금미수금_초 | String | N | 12 |  |
| Body | `ch_uncla_to` | 현금미수금_말 | String | N | 12 |  |
| Body | `krw_asgna_fr` | 원화대용금_초 | String | N | 12 |  |
| Body | `krw_asgna_to` | 원화대용금_말 | String | N | 12 |  |
| Body | `ls_evlta_fr` | 대주평가금_초 | String | N | 12 |  |
| Body | `ls_evlta_to` | 대주평가금_말 | String | N | 12 |  |
| Body | `rght_evlta_fr` | 권리평가금_초 | String | N | 12 |  |
| Body | `rght_evlta_to` | 권리평가금_말 | String | N | 12 |  |
| Body | `loan_amt_fr` | 대출금_초 | String | N | 12 |  |
| Body | `loan_amt_to` | 대출금_말 | String | N | 12 |  |
| Body | `etc_loana_fr` | 기타대여금_초 | String | N | 12 |  |
| Body | `etc_loana_to` | 기타대여금_말 | String | N | 12 |  |
| Body | `crd_int_npay_gold_fr` | 신용이자미납금_초 | String | N | 12 |  |
| Body | `crd_int_npay_gold_to` | 신용이자미납금_말 | String | N | 12 |  |
| Body | `crd_int_fr` | 신용이자_초 | String | N | 12 |  |
| Body | `crd_int_to` | 신용이자_말 | String | N | 12 |  |
| Body | `tot_amt_fr` | 순자산액계_초 | String | N | 12 |  |
| Body | `tot_amt_to` | 순자산액계_말 | String | N | 12 |  |
| Body | `invt_bsamt` | 투자원금평잔 | String | N | 12 |  |
| Body | `evltv_prft` | 평가손익 | String | N | 12 |  |
| Body | `prft_rt` | 수익률 | String | N | 12 |  |
| Body | `tern_rt` | 회전율 | String | N | 12 |  |
| Body | `termin_tot_trns` | 기간내총입금 | String | N | 12 |  |
| Body | `termin_tot_pymn` | 기간내총출금 | String | N | 12 |  |
| Body | `termin_tot_inq` | 기간내총입고 | String | N | 12 |  |
| Body | `termin_tot_outq` | 기간내총출고 | String | N | 12 |  |
| Body | `futr_repl_sella` | 선물대용매도금액 | String | N | 12 |  |
| Body | `trst_repl_sella` | 위탁대용매도금액 | String | N | 12 |  |

---

### 계좌별당일현황요청 (`kt00017`)

- **메뉴 위치**: 국내주식 > 계좌 > 계좌별당일현황요청(kt00017)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `d2_entra` | D+2추정예수금 | String | N | 12 |  |
| Body | `crd_int_npay_gold` | 신용이자미납금 | String | N | 12 |  |
| Body | `etc_loana` | 기타대여금 | String | N | 12 |  |
| Body | `gnrl_stk_evlt_amt_d2` | 일반주식평가금액D+2 | String | N | 12 |  |
| Body | `dpst_grnt_use_amt_d2` | 예탁담보대출금D+2 | String | N | 12 |  |
| Body | `crd_stk_evlt_amt_d2` | 예탁담보주식평가금액D+2 | String | N | 12 |  |
| Body | `crd_loan_d2` | 신용융자금D+2 | String | N | 12 |  |
| Body | `crd_loan_evlta_d2` | 신용융자평가금D+2 | String | N | 12 |  |
| Body | `crd_ls_grnt_d2` | 신용대주담보금D+2 | String | N | 12 |  |
| Body | `crd_ls_evlta_d2` | 신용대주평가금D+2 | String | N | 12 |  |
| Body | `ina_amt` | 입금금액 | String | N | 12 |  |
| Body | `outa` | 출금금액 | String | N | 12 |  |
| Body | `inq_amt` | 입고금액 | String | N | 12 |  |
| Body | `outq_amt` | 출고금액 | String | N | 12 |  |
| Body | `sell_amt` | 매도금액 | String | N | 12 |  |
| Body | `buy_amt` | 매수금액 | String | N | 12 |  |
| Body | `cmsn` | 수수료 | String | N | 12 |  |
| Body | `tax` | 세금 | String | N | 12 |  |
| Body | `stk_pur_cptal_loan_amt` | 주식매입자금대출금 | String | N | 12 |  |
| Body | `rp_evlt_amt` | RP평가금액 | String | N | 12 |  |
| Body | `bd_evlt_amt` | 채권평가금액 | String | N | 12 |  |
| Body | `elsevlt_amt` | ELS평가금액 | String | N | 12 |  |
| Body | `crd_int_amt` | 신용이자금액 | String | N | 12 |  |
| Body | `sel_prica_grnt_loan_int_amt_amt` | 매도대금담보대출이자금액 | String | N | 12 |  |
| Body | `dvida_amt` | 배당금액 | String | N | 12 |  |

---

### 계좌평가잔고내역요청 (`kt00018`)

- **메뉴 위치**: 국내주식 > 계좌 > 계좌평가잔고내역요청(kt00018)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `qry_tp` | 조회구분 | String | Y | 1 | 1:합산, 2:개별 |
| Body | `dmst_stex_tp` | 국내거래소구분 | String | Y | 6 | KRX:한국거래소,NXT:넥스트트레이드 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `tot_pur_amt` | 총매입금액 | String | N | 15 |  |
| Body | `tot_evlt_amt` | 총평가금액 | String | N | 15 |  |
| Body | `tot_evlt_pl` | 총평가손익금액 | String | N | 15 |  |
| Body | `tot_prft_rt` | 총수익률(%) | String | N | 12 |  |
| Body | `prsm_dpst_aset_amt` | 추정예탁자산 | String | N | 15 |  |
| Body | `tot_loan_amt` | 총대출금 | String | N | 15 |  |
| Body | `tot_crd_loan_amt` | 총융자금액 | String | N | 15 |  |
| Body | `tot_crd_ls_amt` | 총대주금액 | String | N | 15 |  |
| Body | `acnt_evlt_remn_indv_tot` | 계좌평가잔고개별합산 | LIST | N |  |  |
| Body | `- stk_cd` | 종목번호 | String | N | 12 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- evltv_prft` | 평가손익 | String | N | 15 |  |
| Body | `- prft_rt` | 수익률(%) | String | N | 12 |  |
| Body | `- pur_pric` | 매입가 | String | N | 15 |  |
| Body | `- pred_close_pric` | 전일종가 | String | N | 12 |  |
| Body | `- rmnd_qty` | 보유수량 | String | N | 15 |  |
| Body | `- trde_able_qty` | 매매가능수량 | String | N | 15 |  |
| Body | `- cur_prc` | 현재가 | String | N | 12 |  |
| Body | `- pred_buyq` | 전일매수수량 | String | N | 15 |  |
| Body | `- pred_sellq` | 전일매도수량 | String | N | 15 |  |
| Body | `- tdy_buyq` | 금일매수수량 | String | N | 15 |  |
| Body | `- tdy_sellq` | 금일매도수량 | String | N | 15 |  |
| Body | `- pur_amt` | 매입금액 | String | N | 15 |  |
| Body | `- pur_cmsn` | 매입수수료 | String | N | 15 |  |
| Body | `- evlt_amt` | 평가금액 | String | N | 15 |  |
| Body | `- sell_cmsn` | 평가수수료 | String | N | 15 |  |
| Body | `- tax` | 세금 | String | N | 15 |  |
| Body | `- sum_cmsn` | 수수료합 | String | N | 15 | 매입수수료 + 평가수수료 |
| Body | `- poss_rt` | 보유비중(%) | String | N | 12 |  |
| Body | `- crd_tp` | 신용구분 | String | N | 2 |  |
| Body | `- crd_tp_nm` | 신용구분명 | String | N | 4 |  |
| Body | `- crd_loan_dt` | 대출일 | String | N | 8 |  |

---

### 주식 매수주문 (`kt10000`)

- **메뉴 위치**: 국내주식 > 주문 > 주식 매수주문(kt10000)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/ordr`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dmst_stex_tp` | 국내거래소구분 | String | Y | 3 | KRX,NXT,SOR |
| Body | `stk_cd` | 종목코드 | String | Y | 12 |  |
| Body | `ord_qty` | 주문수량 | String | Y | 12 |  |
| Body | `ord_uv` | 주문단가 | String | N | 12 |  |
| Body | `trde_tp` | 매매구분 | String | Y | 2 | 0:보통 , 3:시장가 , 5:조건부지정가 , 81:장마감후시간외 , 61:장시작전시간외, 62:시간외단일가 , 6:최유리지정가 , 7:최우선지정가 , 10:보통(IOC) , 13:시장가(IOC) , 16:최유리(IOC) , 20:보통(FOK) , 23:시장가(FOK) , 26:최유리(FOK) , 28:스톱지정가,29:중간가,30:중간가(IOC),31:중간가(FOK) |
| Body | `cond_uv` | 조건단가 | String | N | 12 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ord_no` | 주문번호 | String | N | 7 |  |
| Body | `dmst_stex_tp` | 국내거래소구분 | String | N | 6 |  |

---

### 주식 매도주문 (`kt10001`)

- **메뉴 위치**: 국내주식 > 주문 > 주식 매도주문(kt10001)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/ordr`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dmst_stex_tp` | 국내거래소구분 | String | Y | 3 | KRX,NXT,SOR |
| Body | `stk_cd` | 종목코드 | String | Y | 12 |  |
| Body | `ord_qty` | 주문수량 | String | Y | 12 |  |
| Body | `ord_uv` | 주문단가 | String | N | 12 |  |
| Body | `trde_tp` | 매매구분 | String | Y | 2 | 0:보통 , 3:시장가 , 5:조건부지정가 , 81:장마감후시간외 , 61:장시작전시간외, 62:시간외단일가 , 6:최유리지정가 , 7:최우선지정가 , 10:보통(IOC) , 13:시장가(IOC) , 16:최유리(IOC) , 20:보통(FOK) , 23:시장가(FOK) , 26:최유리(FOK) , 28:스톱지정가,29:중간가,30:중간가(IOC),31:중간가(FOK) |
| Body | `cond_uv` | 조건단가 | String | N | 12 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ord_no` | 주문번호 | String | N | 7 |  |
| Body | `dmst_stex_tp` | 국내거래소구분 | String | N | 6 |  |

---

### 주식 정정주문 (`kt10002`)

- **메뉴 위치**: 국내주식 > 주문 > 주식 정정주문(kt10002)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/ordr`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dmst_stex_tp` | 국내거래소구분 | String | Y | 3 | KRX,NXT,SOR |
| Body | `orig_ord_no` | 원주문번호 | String | Y | 7 |  |
| Body | `stk_cd` | 종목코드 | String | Y | 12 |  |
| Body | `mdfy_qty` | 정정수량 | String | Y | 12 |  |
| Body | `mdfy_uv` | 정정단가 | String | Y | 12 |  |
| Body | `mdfy_cond_uv` | 정정조건단가 | String | N | 12 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ord_no` | 주문번호 | String | N | 7 |  |
| Body | `base_orig_ord_no` | 모주문번호 | String | N | 7 |  |
| Body | `mdfy_qty` | 정정수량 | String | N | 12 |  |
| Body | `dmst_stex_tp` | 국내거래소구분 | String | N | 6 |  |

---

### 주식 취소주문 (`kt10003`)

- **메뉴 위치**: 국내주식 > 주문 > 주식 취소주문(kt10003)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/ordr`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dmst_stex_tp` | 국내거래소구분 | String | Y | 3 | KRX,NXT,SOR |
| Body | `orig_ord_no` | 원주문번호 | String | Y | 7 |  |
| Body | `stk_cd` | 종목코드 | String | Y | 12 |  |
| Body | `cncl_qty` | 취소수량 | String | Y | 12 | '0' 입력시 잔량 전부 취소 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ord_no` | 주문번호 | String | N | 7 |  |
| Body | `base_orig_ord_no` | 모주문번호 | String | N | 7 |  |
| Body | `cncl_qty` | 취소수량 | String | N | 12 |  |

---

### 신용 매수주문 (`kt10006`)

- **메뉴 위치**: 국내주식 > 신용주문 > 신용 매수주문(kt10006)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/crdordr`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dmst_stex_tp` | 국내거래소구분 | String | Y | 3 | KRX,NXT,SOR |
| Body | `stk_cd` | 종목코드 | String | Y | 12 |  |
| Body | `ord_qty` | 주문수량 | String | Y | 12 |  |
| Body | `ord_uv` | 주문단가 | String | N | 12 |  |
| Body | `trde_tp` | 매매구분 | String | Y | 2 | 0:보통 , 3:시장가 , 5:조건부지정가 , 81:장마감후시간외 , 61:장시작전시간외, 62:시간외단일가 , 6:최유리지정가 , 7:최우선지정가 , 10:보통(IOC) , 13:시장가(IOC) , 16:최유리(IOC) , 20:보통(FOK) , 23:시장가(FOK) , 26:최유리(FOK) , 28:스톱지정가,29:중간가,30:중간가(IOC),31:중간가(FOK) |
| Body | `cond_uv` | 조건단가 | String | N | 12 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ord_no` | 주문번호 | String | N | 7 |  |
| Body | `dmst_stex_tp` | 국내거래소구분 | String | N | 6 |  |

---

### 신용 매도주문 (`kt10007`)

- **메뉴 위치**: 국내주식 > 신용주문 > 신용 매도주문(kt10007)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/crdordr`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dmst_stex_tp` | 국내거래소구분 | String | Y | 3 | KRX,NXT,SOR |
| Body | `stk_cd` | 종목코드 | String | Y | 12 |  |
| Body | `ord_qty` | 주문수량 | String | Y | 12 |  |
| Body | `ord_uv` | 주문단가 | String | N | 12 |  |
| Body | `trde_tp` | 매매구분 | String | Y | 2 | 0:보통 , 3:시장가 , 5:조건부지정가 , 81:장마감후시간외 , 61:장시작전시간외, 62:시간외단일가 , 6:최유리지정가 , 7:최우선지정가 , 10:보통(IOC) , 13:시장가(IOC) , 16:최유리(IOC) , 20:보통(FOK) , 23:시장가(FOK) , 26:최유리(FOK) , 28:스톱지정가,29:중간가,30:중간가(IOC),31:중간가(FOK) |
| Body | `crd_deal_tp` | 신용거래구분 | String | Y | 2 | 33:융자 , 99:융자합 |
| Body | `crd_loan_dt` | 대출일 | String | N | 8 | YYYYMMDD(융자일경우필수) |
| Body | `cond_uv` | 조건단가 | String | N | 12 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ord_no` | 주문번호 | String | N | 7 |  |
| Body | `dmst_stex_tp` | 국내거래소구분 | String | N | 6 |  |

---

### 신용 정정주문 (`kt10008`)

- **메뉴 위치**: 국내주식 > 신용주문 > 신용 정정주문(kt10008)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/crdordr`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dmst_stex_tp` | 국내거래소구분 | String | Y | 3 | KRX,NXT,SOR |
| Body | `orig_ord_no` | 원주문번호 | String | Y | 7 |  |
| Body | `stk_cd` | 종목코드 | String | Y | 12 |  |
| Body | `mdfy_qty` | 정정수량 | String | Y | 12 |  |
| Body | `mdfy_uv` | 정정단가 | String | Y | 12 |  |
| Body | `mdfy_cond_uv` | 정정조건단가 | String | N | 12 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ord_no` | 주문번호 | String | N | 7 |  |
| Body | `base_orig_ord_no` | 모주문번호 | String | N | 7 |  |
| Body | `mdfy_qty` | 정정수량 | String | N | 12 |  |
| Body | `dmst_stex_tp` | 국내거래소구분 | String | N | 6 |  |

---

### 신용 취소주문 (`kt10009`)

- **메뉴 위치**: 국내주식 > 신용주문 > 신용 취소주문(kt10009)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/crdordr`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `dmst_stex_tp` | 국내거래소구분 | String | Y | 3 | KRX,NXT,SOR |
| Body | `orig_ord_no` | 원주문번호 | String | Y | 7 |  |
| Body | `stk_cd` | 종목코드 | String | Y | 12 |  |
| Body | `cncl_qty` | 취소수량 | String | Y | 12 | '0' 입력시 잔량 전부 취소 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ord_no` | 주문번호 | String | N | 7 |  |
| Body | `base_orig_ord_no` | 모주문번호 | String | N | 7 |  |
| Body | `cncl_qty` | 취소수량 | String | N | 12 |  |

---

### 신용융자 가능종목요청 (`kt20016`)

- **메뉴 위치**: 국내주식 > 종목정보 > 신용융자 가능종목요청(kt20016)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `crd_stk_grde_tp` | 신용종목등급구분 | String | N | 1 | %:전체, A:A군, B:B군, C:C군, D:D군, E:E군 |
| Body | `mrkt_deal_tp` | 시장거래구분 | String | Y | 1 | %:전체, 1:코스피, 0:코스닥 |
| Body | `stk_cd` | 종목코드 | String | N | 12 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `crd_loan_able` | 신용융자가능여부 | String | N | 40 |  |
| Body | `crd_loan_pos_stk` | 신용융자가능종목 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 12 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- crd_assr_rt` | 신용보증금율 | String | N | 4 |  |
| Body | `- repl_pric` | 대용가 | String | N | 12 |  |
| Body | `- pred_close_pric` | 전일종가 | String | N | 12 |  |
| Body | `- crd_limit_over_yn` | 신용한도초과여부 | String | N | 1 |  |
| Body | `- crd_limit_over_txt` | 신용한도초과 | String | N | 40 | N:공란,Y:회사한도 초과 |

---

### 신용융자 가능문의 (`kt20017`)

- **메뉴 위치**: 국내주식 > 종목정보 > 신용융자 가능문의(kt20017)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/stkinfo`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 12 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `crd_alow_yn` | 신용가능여부 | String | N | 40 |  |

---

### 금현물 매수주문 (`kt50000`)

- **메뉴 위치**: 국내주식 > 주문 > 금현물 매수주문(kt50000)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/ordr`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 12 | M04020000 금 99.99_1kg, M04020100 미니금 99.99_100g |
| Body | `ord_qty` | 주문수량 | String | Y | 12 |  |
| Body | `ord_uv` | 주문단가 | String | N | 12 |  |
| Body | `trde_tp` | 매매구분 | String | Y | 2 | 00:보통, 10:보통(IOC), 20:보통(FOK) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ord_no` | 주문번호 | String | N | 7 |  |

---

### 금현물 매도주문 (`kt50001`)

- **메뉴 위치**: 국내주식 > 주문 > 금현물 매도주문(kt50001)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/ordr`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 12 | M04020000 금 99.99_1kg, M04020100 미니금 99.99_100g |
| Body | `ord_qty` | 주문수량 | String | Y | 12 |  |
| Body | `ord_uv` | 주문단가 | String | N | 12 |  |
| Body | `trde_tp` | 매매구분 | String | Y | 2 | 00:보통, 10:보통(IOC), 20:보통(FOK) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ord_no` | 주문번호 | String | N | 7 |  |

---

### 금현물 정정주문 (`kt50002`)

- **메뉴 위치**: 국내주식 > 주문 > 금현물 정정주문(kt50002)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/ordr`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `stk_cd` | 종목코드 | String | Y | 12 | M04020000 금 99.99_1kg, M04020100 미니금 99.99_100g |
| Body | `orig_ord_no` | 원주문번호 | String | Y | 7 |  |
| Body | `mdfy_qty` | 정정수량 | String | Y | 12 |  |
| Body | `mdfy_uv` | 정정단가 | String | Y | 12 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ord_no` | 주문번호 | String | N | 7 |  |
| Body | `base_orig_ord_no` | 모주문번호 | String | N | 7 |  |
| Body | `mdfy_qty` | 정정수량 | String | N | 12 |  |

---

### 금현물 취소주문 (`kt50003`)

- **메뉴 위치**: 국내주식 > 주문 > 금현물 취소주문(kt50003)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/ordr`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `orig_ord_no` | 원주문번호 | String | Y | 7 |  |
| Body | `stk_cd` | 종목코드 | String | Y | 12 | M04020000 금 99.99_1kg, M04020100 미니금 99.99_100g |
| Body | `cncl_qty` | 취소수량 | String | Y | 12 | '0' 입력시 잔량 전부 취소 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ord_no` | 주문번호 | String | N | 7 |  |
| Body | `base_orig_ord_no` | 모주문번호 | String | N | 7 |  |
| Body | `cncl_qty` | 취소수량 | String | N | 12 |  |

---

### 금현물 잔고확인 (`kt50020`)

- **메뉴 위치**: 국내주식 > 계좌 > 금현물 잔고확인(kt50020)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `tot_entr` | 예수금 | String | N | 12 |  |
| Body | `net_entr` | 추정예수금 | String | N | 12 |  |
| Body | `tot_est_amt` | 잔고평가액 | String | N | 12 |  |
| Body | `net_amt` | 예탁자산평가액 | String | N | 12 |  |
| Body | `tot_book_amt2` | 총매입금액 | String | N | 12 |  |
| Body | `tot_dep_amt` | 추정예탁자산 | String | N | 12 |  |
| Body | `paym_alowa` | 출금가능금액 | String | N | 12 |  |
| Body | `pl_amt` | 실현손익 | String | N | 12 |  |
| Body | `gold_acnt_evlt_prst` | 금현물계좌평가현황 | LIST | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N | 30 |  |
| Body | `- stk_nm` | 종목명 | String | N | 12 |  |
| Body | `- real_qty` | 보유수량 | String | N | 12 |  |
| Body | `- avg_prc` | 평균단가 | String | N | 12 |  |
| Body | `- cur_prc` | 현재가 | String | N | 12 |  |
| Body | `- est_amt` | 평가금액 | String | N | 12 |  |
| Body | `- est_lspft` | 손익금액 | String | N | 12 |  |
| Body | `- est_ratio` | 손익율 | String | N | 12 |  |
| Body | `- cmsn` | 수수료 | String | N | 12 |  |
| Body | `- vlad_tax` | 부가가치세 | String | N | 12 |  |
| Body | `- book_amt2` | 매입금액 | String | N | 12 |  |
| Body | `- pl_prch_prc` | 손익분기매입가 | String | N | 12 |  |
| Body | `- qty` | 결제잔고 | String | N | 12 |  |
| Body | `- buy_qty` | 매수수량 | String | N | 12 |  |
| Body | `- sell_qty` | 매도수량 | String | N | 12 |  |
| Body | `- able_qty` | 가능수량 | String | N | 12 |  |

---

### 금현물 예수금 (`kt50021`)

- **메뉴 위치**: 국내주식 > 계좌 > 금현물 예수금(kt50021)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `entra` | 예수금 | String | N | 15 |  |
| Body | `profa_ch` | 증거금현금 | String | N | 15 |  |
| Body | `chck_ina_amt` | 수표입금액 | String | N | 15 |  |
| Body | `etc_loan` | 기타대여금 | String | N | 15 |  |
| Body | `etc_loan_dlfe` | 기타대여금연체료 | String | N | 15 |  |
| Body | `etc_loan_tot` | 기타대여금합계 | String | N | 15 |  |
| Body | `prsm_entra` | 추정예수금 | String | N | 15 |  |
| Body | `buy_exct_amt` | 매수정산금 | String | N | 15 |  |
| Body | `sell_exct_amt` | 매도정산금 | String | N | 15 |  |
| Body | `sell_buy_exct_amt` | 매도매수정산금 | String | N | 15 |  |
| Body | `dly_amt` | 미수변제소요금 | String | N | 15 |  |
| Body | `prsm_pymn_alow_amt` | 추정출금가능금액 | String | N | 15 |  |
| Body | `pymn_alow_amt` | 출금가능금액 | String | N | 15 |  |
| Body | `ord_alow_amt` | 주문가능금액 | String | N | 15 |  |

---

### 금현물 주문체결전체조회 (`kt50030`)

- **메뉴 위치**: 국내주식 > 계좌 > 금현물 주문체결전체조회(kt50030)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ord_dt` | 주문일자 | String | Y | 8 |  |
| Body | `qry_tp` | 조회구분 | String | N | 1 | 1: 주문순, 2: 역순 |
| Body | `mrkt_deal_tp` | 시장구분 | String | Y | 1 |  |
| Body | `stk_bond_tp` | 주식채권구분 | String | Y | 1 | 0:전체, 1:주식, 2:채권 |
| Body | `slby_tp` | 매도수구분 | String | Y | 1 | 0:전체, 1:매도, 2:매수 |
| Body | `stk_cd` | 종목코드 | String | N | 12 |  |
| Body | `fr_ord_no` | 시작주문번호 | String | N | 7 |  |
| Body | `dmst_stex_tp` | 국내거래소구분 | String | N | 6 | %:(전체), KRX, NXT, SOR |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `acnt_ord_cntr_prst` | 계좌별주문체결현황 | LIST | N |  |  |
| Body | `- stk_bond_tp` | 주식채권구분 | String | N | 1 |  |
| Body | `- ord_no` | 주문번호 | String | N | 7 |  |
| Body | `- stk_cd` | 상품코드 | String | N | 12 |  |
| Body | `- trde_tp` | 매매구분 | String | N | 12 |  |
| Body | `- io_tp_nm` | 주문유형구분 | String | N | 20 |  |
| Body | `- ord_qty` | 주문수량 | String | N | 10 |  |
| Body | `- ord_uv` | 주문단가 | String | N | 10 |  |
| Body | `- cnfm_qty` | 확인수량 | String | N | 10 |  |
| Body | `- data_send_end_tp` | 접수구분 | String | N | 12 |  |
| Body | `- mrkt_deal_tp` | 시장구분 | String | N | 1 |  |
| Body | `- rsrv_tp` | 예약/반대여부 | String | N | 4 |  |
| Body | `- orig_ord_no` | 원주문번호 | String | N | 7 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- dcd_tp_nm` | 결제구분 | String | N | 4 |  |
| Body | `- crd_deal_tp` | 신용거래구분 | String | N | 20 |  |
| Body | `- cntr_qty` | 체결수량 | String | N | 10 |  |
| Body | `- cntr_uv` | 체결단가 | String | N | 10 |  |
| Body | `- ord_remnq` | 미체결수량 | String | N | 10 |  |
| Body | `- comm_ord_tp` | 통신구분 | String | N | 10 |  |
| Body | `- mdfy_cncl_tp` | 정정취소구분 | String | N | 20 |  |
| Body | `- dmst_stex_tp` | 국내거래소구분 | String | N | 6 |  |
| Body | `- cond_uv` | 스톱가 | String | N | 10 |  |

---

### 금현물 주문체결조회 (`kt50031`)

- **메뉴 위치**: 국내주식 > 계좌 > 금현물 주문체결조회(kt50031)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ord_dt` | 주문일자 | String | N | 8 | YYYYMMDD |
| Body | `qry_tp` | 조회구분 | String | Y | 1 | 1:주문순, 2:역순, 3:미체결, 4:체결내역만 |
| Body | `stk_bond_tp` | 주식채권구분 | String | Y | 1 | 0:전체, 1:주식, 2:채권 |
| Body | `sell_tp` | 매도수구분 | String | Y | 1 | 0:전체, 1:매도, 2:매수 |
| Body | `stk_cd` | 종목코드 | String | N | 12 | 공백허용 (공백일때 전체종목) |
| Body | `fr_ord_no` | 시작주문번호 | String | N | 7 | 공백허용 (공백일때 전체주문) |
| Body | `dmst_stex_tp` | 국내거래소구분 | String | Y | 6 | %:(전체),KRX:한국거래소,NXT:넥스트트레이드,SOR:최선주문집행 |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `acnt_ord_cntr_prps_dtl` | 계좌별주문체결내역상세 | LIST | N |  |  |
| Body | `- ord_no` | 주문번호 | String | N | 7 |  |
| Body | `- stk_cd` | 종목번호 | String | N | 12 |  |
| Body | `- trde_tp` | 매매구분 | String | N | 20 |  |
| Body | `- crd_tp` | 신용구분 | String | N | 20 |  |
| Body | `- ord_qty` | 주문수량 | String | N | 10 |  |
| Body | `- ord_uv` | 주문단가 | String | N | 10 |  |
| Body | `- cnfm_qty` | 확인수량 | String | N | 10 |  |
| Body | `- acpt_tp` | 접수구분 | String | N | 20 |  |
| Body | `- rsrv_tp` | 반대여부 | String | N | 20 |  |
| Body | `- ord_tm` | 주문시간 | String | N | 8 |  |
| Body | `- ori_ord` | 원주문 | String | N | 7 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- io_tp_nm` | 주문구분 | String | N | 20 |  |
| Body | `- loan_dt` | 대출일 | String | N | 8 |  |
| Body | `- cntr_qty` | 체결수량 | String | N | 10 |  |
| Body | `- cntr_uv` | 체결단가 | String | N | 10 |  |
| Body | `- ord_remnq` | 주문잔량 | String | N | 10 |  |
| Body | `- comm_ord_tp` | 통신구분 | String | N | 20 |  |
| Body | `- mdfy_cncl` | 정정취소 | String | N | 20 |  |
| Body | `- cnfm_tm` | 확인시간 | String | N | 8 |  |
| Body | `- dmst_stex_tp` | 국내거래소구분 | String | N | 8 |  |
| Body | `- cond_uv` | 스톱가 | String | N | 10 |  |

---

### 금현물 거래내역조회 (`kt50032`)

- **메뉴 위치**: 국내주식 > 계좌 > 금현물 거래내역조회(kt50032)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `strt_dt` | 시작일자 | String | N | 8 |  |
| Body | `end_dt` | 종료일자 | String | N | 8 |  |
| Body | `tp` | 구분 | String | N | 1 | 0:전체, 1:입출금, 2:출고, 3:매매, 4:매수, 5:매도, 6:입금, 7:출금 |
| Body | `stk_cd` | 종목코드 | String | N | 12 |  |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `acnt_print` | 계좌번호 | String | N | 62 | 계좌번호 출력용 |
| Body | `gold_trde_hist` | 금현물거래내역 | LIST | N |  |  |
| Body | `- deal_dt` | 거래일자 | String | N |  |  |
| Body | `- deal_no` | 거래번호 | String | N |  |  |
| Body | `- rmrk_nm` | 적요명 | String | N |  |  |
| Body | `- deal_qty` | 거래수량 | String | N |  |  |
| Body | `- gold_spot_vat` | 금현물부가가치세 | String | N |  |  |
| Body | `- exct_amt` | 정산금액 | String | N |  |  |
| Body | `- dly_sum` | 연체합 | String | N |  |  |
| Body | `- entra_remn` | 예수금잔고 | String | N |  |  |
| Body | `- mdia_nm` | 메체구분명 | String | N |  |  |
| Body | `- orig_deal_no` | 원거래번호 | String | N |  |  |
| Body | `- stk_nm` | 종목명 | String | N |  |  |
| Body | `- uv_exrt` | 거래단가 | String | N |  |  |
| Body | `- cmsn` | 수수료 | String | N |  |  |
| Body | `- uncl_ocr` | 미수(원/g) | String | N |  |  |
| Body | `- rpym_sum` | 변제합 | String | N |  |  |
| Body | `- spot_remn` | 현물잔고 | String | N |  |  |
| Body | `- proc_time` | 처리시간 | String | N |  |  |
| Body | `- rcpy_no` | 출납번호 | String | N |  |  |
| Body | `- stk_cd` | 종목코드 | String | N |  |  |
| Body | `- deal_amt` | 거래금액 | String | N |  |  |
| Body | `- tax_tot_amt` | 소득/주민세 | String | N |  |  |
| Body | `- cntr_dt` | 체결일 | String | N |  |  |
| Body | `- proc_brch_nm` | 처리점 | String | N |  |  |
| Body | `- prcsr` | 처리자 | String | N |  |  |

---

### 금현물 미체결조회 (`kt50075`)

- **메뉴 위치**: 국내주식 > 계좌 > 금현물 미체결조회(kt50075)
- **Method**: `POST`
- **운영 도메인**: `https://api.kiwoom.com`
- **모의투자 도메인**: `https://mockapi.kiwoom.com(KRX만 지원가능)`
- **URL**: `/api/dostk/acnt`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `ord_dt` | 주문일자 | String | Y | 8 |  |
| Body | `qry_tp` | 조회구분 | String | N | 1 | 1: 주문순, 2: 역순 |
| Body | `mrkt_deal_tp` | 시장구분 | String | Y | 1 |  |
| Body | `stk_bond_tp` | 주식채권구분 | String | Y | 1 | 0:전체, 1:주식, 2:채권 |
| Body | `sell_tp` | 매도수구분 | String | Y | 1 | 0:전체, 1:매도, 2:매수 |
| Body | `stk_cd` | 종목코드 | String | N | 12 |  |
| Body | `fr_ord_no` | 시작주문번호 | String | N | 7 |  |
| Body | `dmst_stex_tp` | 국내거래소구분 | String | N | 6 | %:(전체), KRX, NXT, SOR |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `acnt_ord_oso_prst` | 계좌별주문미체결현황 | LIST | N |  |  |
| Body | `- stk_bond_tp` | 주식채권구분 | String | N | 1 |  |
| Body | `- ord_no` | 주문번호 | String | N | 7 |  |
| Body | `- stk_cd` | 상품코드 | String | N | 12 |  |
| Body | `- trde_tp` | 매매구분 | String | N | 12 |  |
| Body | `- io_tp_nm` | 주문유형구분 | String | N | 20 |  |
| Body | `- ord_qty` | 주문수량 | String | N | 10 |  |
| Body | `- ord_uv` | 주문단가 | String | N | 10 |  |
| Body | `- cnfm_qty` | 확인수량 | String | N | 10 |  |
| Body | `- data_send_end_tp` | 접수구분 | String | N | 12 |  |
| Body | `- mrkt_deal_tp` | 시장구분 | String | N | 1 |  |
| Body | `- rsrv_tp` | 예약/반대여부 | String | N | 4 |  |
| Body | `- orig_ord_no` | 원주문번호 | String | N | 7 |  |
| Body | `- stk_nm` | 종목명 | String | N | 40 |  |
| Body | `- dcd_tp_nm` | 결제구분 | String | N | 4 |  |
| Body | `- crd_deal_tp` | 신용거래구분 | String | N | 20 |  |
| Body | `- cntr_qty` | 체결수량 | String | N | 10 |  |
| Body | `- cntr_uv` | 체결단가 | String | N | 10 |  |
| Body | `- ord_remnq` | 미체결수량 | String | N | 10 |  |
| Body | `- comm_ord_tp` | 통신구분 | String | N | 10 |  |
| Body | `- mdfy_cncl_tp` | 정정취소구분 | String | N | 20 |  |
| Body | `- dmst_stex_tp` | 국내거래소구분 | String | N | 6 |  |
| Body | `- cond_uv` | 스톱가 | String | N | 10 |  |

---

### 주문체결 (`00`)

- **메뉴 위치**: 국내주식 > 실시간시세 > 주문체결(00)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 10 | REG : 등록 , REMOVE : 해지 |
| Body | `grp_no` | 그룹번호 | String | Y | 4 |  |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 등록(REG)시

0:기존유지안함 1:기존유지(Default)

0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지

해지(REMOVE)시 값 불필요 |
| Body | `data` | 실시간 등록 리스트 | LIST |  |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N | 100 |  |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 통신결과에대한 코드
(등록,해지요청시에만 값 전송 0:정상,1:오류 , 데이터 실시간 수신시 미전송) |
| Body | `return_msg` | 결과메시지 | String | N |  | 통신결과에대한메시지 |
| Body | `trnm` | 서비스명 | String | N |  | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |
| Body | `data` | 실시간 등록리스트 | LIST | N |  |  |
| Body | `- type` | 실시간항목 | String | N |  | TR 명(0A,0B....) |
| Body | `- name` | 실시간 항목명 | String | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N |  | 종목코드 |
| Body | `- values` | 실시간 값 리스트 | LIST | N |  |  |
| Body | `- - 9201` | 계좌번호 | String | N |  |  |
| Body | `- - 9203` | 주문번호 | String | N |  |  |
| Body | `- - 9205` | 관리자사번 | String | N |  |  |
| Body | `- - 9001` | 종목코드,업종코드 | String | N |  |  |
| Body | `- - 912` | 주문업무분류 | String | N |  |  |
| Body | `- - 913` | 주문상태 | String | N |  | 접수, 체결, 확인, 취소, 거부 |
| Body | `- - 302` | 종목명 | String | N |  |  |
| Body | `- - 900` | 주문수량 | String | N |  |  |
| Body | `- - 901` | 주문가격 | String | N |  |  |
| Body | `- - 902` | 미체결수량 | String | N |  |  |
| Body | `- - 903` | 체결누계금액 | String | N |  |  |
| Body | `- - 904` | 원주문번호 | String | N |  |  |
| Body | `- - 905` | 주문구분 | String | N |  | "+/-", 매도, 매수, 매도정정, 매수정정, 매수취소, 매도취소


※ 영웅문4에서 적색으로 표기되어있으면 +가, 청색으로 표기되어있으면 -가 앞에 기재됩니다 |
| Body | `- - 906` | 매매구분 | String | N |  | 보통, 시장가, 조건부지정가, 최유리지정가, 최우선지정가, 보통(IOC), 시장가(IOC), 최유리(IOC), 보통(FOK), 시장가(FOK), 최유리(FOK), 스톰지정가, 중간가, 중간가(IOC), 중간가(FOK), 장전시간외, 장후시간외, 시간외대량, 시간외바스켓, 시간외자사주, 시간외단일가 |
| Body | `- - 907` | 매도수구분 | String | N |  | 1:매도, 2:매수 |
| Body | `- - 908` | 주문/체결시간 | String | N |  |  |
| Body | `- - 909` | 체결번호 | String | N |  |  |
| Body | `- - 910` | 체결가 | String | N |  |  |
| Body | `- - 911` | 체결량 | String | N |  |  |
| Body | `- - 10` | 현재가 | String | N |  |  |
| Body | `- - 27` | (최우선)매도호가 | String | N |  |  |
| Body | `- - 28` | (최우선)매수호가 | String | N |  |  |
| Body | `- - 914` | 단위체결가 | String | N |  |  |
| Body | `- - 915` | 단위체결량 | String | N |  |  |
| Body | `- - 938` | 당일매매수수료 | String | N |  |  |
| Body | `- - 939` | 당일매매세금 | String | N |  |  |
| Body | `- - 919` | 거부사유 | String | N |  |  |
| Body | `- - 920` | 화면번호 | String | N |  |  |
| Body | `- - 921` | 터미널번호 | String | N |  |  |
| Body | `- - 922` | 신용구분 | String | N |  | 실시간 체결용 |
| Body | `- - 923` | 대출일 | String | N |  | 실시간 체결용 |
| Body | `- - 10010` | 시간외단일가_현재가 | String | N |  |  |
| Body | `- - 2134` | 거래소구분 | String | N |  | 0:통합,1:KRX,2:NXT |
| Body | `- - 2135` | 거래소구분명 | String | N |  | 통합,KRX,NXT |
| Body | `- - 2136` | SOR여부 | String | N |  | Y,N |

---

### 잔고 (`04`)

- **메뉴 위치**: 국내주식 > 실시간시세 > 잔고(04)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 10 | REG : 등록 , REMOVE : 해지 |
| Body | `grp_no` | 그룹번호 | String | Y | 4 |  |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 등록(REG)시
 
0:기존유지안함 1:기존유지(Default)

0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지

해지(REMOVE)시 값 불필요 |
| Body | `data` | 실시간 등록 리스트 | LIST |  |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N | 104 |  |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 통신결과에대한 코드
(등록,해지요청시에만 값 전송 0:정상,1:오류 , 데이터 실시간 수신시 미전송) |
| Body | `return_msg` | 결과메시지 | String | N |  | 통신결과에대한메시지 |
| Body | `trnm` | 서비스명 | String | N |  | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |
| Body | `data` | 실시간 등록리스트 | LIST | N |  |  |
| Body | `- type` | 실시간항목 | String | N |  | TR 명(0A,0B....) |
| Body | `- name` | 실시간 항목명 | String | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N |  | 종목코드 |
| Body | `- values` | 실시간 값 리스트 | LIST | N |  |  |
| Body | `- - 9201` | 계좌번호 | String | N |  |  |
| Body | `- - 9001` | 종목코드,업종코드 | String | N |  |  |
| Body | `- - 917` | 신용구분 | String | N |  |  |
| Body | `- - 916` | 대출일 | String | N |  |  |
| Body | `- - 302` | 종목명 | String | N |  |  |
| Body | `- - 10` | 현재가 | String | N |  |  |
| Body | `- - 930` | 보유수량 | String | N |  |  |
| Body | `- - 931` | 매입단가 | String | N |  |  |
| Body | `- - 932` | 총매입가(당일누적) | String | N |  |  |
| Body | `- - 933` | 주문가능수량 | String | N |  |  |
| Body | `- - 945` | 당일순매수량 | String | N |  |  |
| Body | `- - 946` | 매도/매수구분 | String | N |  | 계약,주 |
| Body | `- - 950` | 당일총매도손익 | String | N |  |  |
| Body | `- - 951` | Extra Item | String | N |  |  |
| Body | `- - 27` | (최우선)매도호가 | String | N |  |  |
| Body | `- - 28` | (최우선)매수호가 | String | N |  |  |
| Body | `- - 307` | 기준가 | String | N |  |  |
| Body | `- - 8019` | 손익률(실현손익) | String | N |  |  |
| Body | `- - 957` | 신용금액 | String | N |  |  |
| Body | `- - 958` | 신용이자 | String | N |  |  |
| Body | `- - 918` | 만기일 | String | N |  |  |
| Body | `- - 990` | 당일실현손익(유가) | String | N |  |  |
| Body | `- - 991` | 당일실현손익율(유가) | String | N |  |  |
| Body | `- - 992` | 당일실현손익(신용) | String | N |  |  |
| Body | `- - 993` | 당일실현손익율(신용) | String | N |  |  |
| Body | `- - 959` | 담보대출수량 | String | N |  |  |
| Body | `- - 924` | Extra Item | String | N |  |  |

---

### 주식기세 (`0A`)

- **메뉴 위치**: 국내주식 > 실시간시세 > 주식기세(0A)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 10 | REG : 등록 , REMOVE : 해지 |
| Body | `grp_no` | 그룹번호 | String | Y | 4 |  |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 등록(REG)시

0:기존유지안함 1:기존유지(Default)

0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지

해지(REMOVE)시 값 불필요 |
| Body | `data` | 실시간 등록 리스트 | LIST |  |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N | 100 | 거래소별 종목코드, 업종코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 통신결과에대한 코드
(등록,해지요청시에만 값 전송 0:정상,1:오류 , 데이터 실시간 수신시 미전송) |
| Body | `return_msg` | 결과메시지 | String | N |  | 통신결과에대한메시지(등록,해지시에만 값 전송,데이터 실시간 수신시 미전송) |
| Body | `trnm` | 서비스명 | String | N |  | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |
| Body | `data` | 실시간 등록리스트 | LIST | N |  |  |
| Body | `- type` | 실시간항목 | String | N |  | TR 명(0A,0B....) |
| Body | `- name` | 실시간 항목명 | String | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N |  | 종목코드 |
| Body | `- values` | 실시간 값 리스트 | LIST | N |  |  |
| Body | `- - 10` | 현재가 | String | N |  |  |
| Body | `- - 11` | 전일대비 | String | N |  |  |
| Body | `- - 12` | 등락율 | String | N |  |  |
| Body | `- - 27` | (최우선)매도호가 | String | N |  |  |
| Body | `- - 28` | (최우선)매수호가 | String | N |  |  |
| Body | `- - 13` | 누적거래량 | String | N |  |  |
| Body | `- - 14` | 누적거래대금 | String | N |  |  |
| Body | `- - 16` | 시가 | String | N |  |  |
| Body | `- - 17` | 고가 | String | N |  |  |
| Body | `- - 18` | 저가 | String | N |  |  |
| Body | `- - 25` | 전일대비기호 | String | N |  |  |
| Body | `- - 26` | 전일거래량대비(계약,주) | String | N |  |  |
| Body | `- - 29` | 거래대금증감 | String | N |  |  |
| Body | `- - 30` | 전일거래량대비(비율) | String | N |  |  |
| Body | `- - 31` | 거래회전율 | String | N |  |  |
| Body | `- - 32` | 거래비용 | String | N |  |  |
| Body | `- - 311` | 시가총액(억) | String | N |  |  |
| Body | `- - 567` | 상한가발생시간 | String | N |  |  |
| Body | `- - 568` | 하한가발생시간 | String | N |  |  |

---

### 주식체결 (`0B`)

- **메뉴 위치**: 국내주식 > 실시간시세 > 주식체결(0B)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 10 | REG : 등록 , REMOVE : 해지 |
| Body | `grp_no` | 그룹번호 | String | Y | 4 |  |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 등록(REG)시
0:기존유지안함 1:기존유지(Default)
 0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지
해지(REMOVE)시 값 불필요 |
| Body | `data` | 실시간 등록 리스트 | LIST |  |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N | 100 | 거래소별 종목코드, 업종코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 통신결과에대한 코드
(등록,해지요청시에만 값 전송 0:정상,1:오류 , 데이터 실시간 수신시 미전송) |
| Body | `return_msg` | 결과메시지 | String | N |  | 통신결과에대한메시지 |
| Body | `trnm` | 서비스명 | String | N |  | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |
| Body | `data` | 실시간 등록리스트 | LIST | N |  |  |
| Body | `- type` | 실시간항목 | String | N |  | TR 명(0B,0B....) |
| Body | `- name` | 실시간 항목명 | String | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N |  | 종목코드 |
| Body | `- values` | 실시간 값 리스트 | LIST | N |  |  |
| Body | `- - 20` | 체결시간 | String | N |  |  |
| Body | `- - 10` | 현재가 | String | N |  |  |
| Body | `- - 11` | 전일대비 | String | N |  |  |
| Body | `- - 12` | 등락율 | String | N |  |  |
| Body | `- - 27` | (최우선)매도호가 | String | N |  |  |
| Body | `- - 28` | (최우선)매수호가 | String | N |  |  |
| Body | `- - 15` | 거래량 | String | N |  | +는 매수체결,-는 매도체결 |
| Body | `- - 13` | 누적거래량 | String | N |  |  |
| Body | `- - 14` | 누적거래대금 | String | N |  |  |
| Body | `- - 16` | 시가 | String | N |  |  |
| Body | `- - 17` | 고가 | String | N |  |  |
| Body | `- - 18` | 저가 | String | N |  |  |
| Body | `- - 25` | 전일대비기호 | String | N |  |  |
| Body | `- - 26` | 전일거래량대비(계약,주) | String | N |  |  |
| Body | `- - 29` | 거래대금증감 | String | N |  |  |
| Body | `- - 30` | 전일거래량대비(비율) | String | N |  |  |
| Body | `- - 31` | 거래회전율 | String | N |  |  |
| Body | `- - 32` | 거래비용 | String | N |  |  |
| Body | `- - 228` | 체결강도 | String | N |  |  |
| Body | `- - 311` | 시가총액(억) | String | N |  |  |
| Body | `- - 290` | 장구분 | String | N |  | 1: 장전 시간외 , 2: 장중 , 3: 장후 시간외 |
| Body | `- - 691` | K.O 접근도 | String | N |  |  |
| Body | `- - 567` | 상한가발생시간 | String | N |  |  |
| Body | `- - 568` | 하한가발생시간 | String | N |  |  |
| Body | `- - 851` | 전일 동시간 거래량 비율 | String | N |  |  |
| Body | `- - 1890` | 시가시간 | String | N |  |  |
| Body | `- - 1891` | 고가시간 | String | N |  |  |
| Body | `- - 1892` | 저가시간 | String | N |  |  |
| Body | `- - 1030` | 매도체결량 | String | N |  |  |
| Body | `- - 1031` | 매수체결량 | String | N |  |  |
| Body | `- - 1032` | 매수비율 | String | N |  |  |
| Body | `- - 1071` | 매도체결건수 | String | N |  |  |
| Body | `- - 1072` | 매수체결건수 | String | N |  |  |
| Body | `- - 1313` | 순간거래대금 | String | N |  |  |
| Body | `- - 1315` | 매도체결량_단건 | String | N |  |  |
| Body | `- - 1316` | 매수체결량_단건 | String | N |  |  |
| Body | `- - 1314` | 순매수체결량 | String | N |  |  |
| Body | `- - 1497` | CFD증거금 | String | N |  |  |
| Body | `- - 1498` | 유지증거금 | String | N |  |  |
| Body | `- - 620` | 당일거래평균가 | String | N |  |  |
| Body | `- - 732` | CFD거래비용 | String | N |  |  |
| Body | `- - 852` | 대주거래비용 | String | N |  |  |
| Body | `- - 9081` | 거래소구분 | String | N |  |  |

---

### 주식우선호가 (`0C`)

- **메뉴 위치**: 국내주식 > 실시간시세 > 주식우선호가(0C)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 10 | REG : 등록 , REMOVE : 해지 |
| Body | `grp_no` | 그룹번호 | String | Y | 4 |  |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 등록(REG)시
0:기존유지안함 1:기존유지(Default)
 0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지
해지(REMOVE)시 값 불필요 |
| Body | `data` | 실시간 등록 리스트 | LIST |  |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N | 100 | 거래소별 종목코드, 업종코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 통신결과에대한 코드
(등록,해지요청시에만 값 전송 0:정상,1:오류 , 데이터 실시간 수신시 미전송) |
| Body | `return_msg` | 결과메시지 | String | N |  | 통신결과에대한메시지 |
| Body | `trnm` | 서비스명 | String | N |  | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |
| Body | `data` | 실시간 등록리스트 | LIST | N |  |  |
| Body | `- type` | 실시간항목 | String | N |  | TR 명(0A,0B....) |
| Body | `- name` | 실시간 항목명 | String | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N |  | 종목코드 |
| Body | `- values` | 실시간 값 리스트 | LIST | N |  |  |
| Body | `- - 27` | (최우선)매도호가 | String | N |  |  |
| Body | `- - 28` | (최우선)매수호가 | String | N |  |  |

---

### 주식호가잔량 (`0D`)

- **메뉴 위치**: 국내주식 > 실시간시세 > 주식호가잔량(0D)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 10 | REG : 등록 , REMOVE : 해지 |
| Body | `grp_no` | 그룹번호 | String | Y | 4 |  |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 등록(REG)시
0:기존유지안함 1:기존유지(Default)
 0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지
해지(REMOVE)시 값 불필요 |
| Body | `data` | 실시간 등록 리스트 | LIST |  |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N | 100 | 거래소별 종목코드, 업종코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 통신결과에대한 코드
(등록,해지요청시에만 값 전송 0:정상,1:오류 , 데이터 실시간 수신시 미전송) |
| Body | `return_msg` | 결과메시지 | String | N |  | 통신결과에대한메시지 |
| Body | `trnm` | 서비스명 | String | N |  | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |
| Body | `data` | 실시간 등록리스트 | LIST | N |  |  |
| Body | `- type` | 실시간항목 | String | N |  | TR 명(0A,0B....) |
| Body | `- name` | 실시간 항목명 | String | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N |  | 종목코드 |
| Body | `- values` | 실시간 값 리스트 | LIST | N |  |  |
| Body | `- - 21` | 호가시간 | String | N |  |  |
| Body | `- - 41` | 매도호가1 | String | N |  |  |
| Body | `- - 61` | 매도호가수량1 | String | N |  |  |
| Body | `- - 81` | 매도호가직전대비1 | String | N |  |  |
| Body | `- - 51` | 매수호가1 | String | N |  |  |
| Body | `- - 71` | 매수호가수량1 | String | N |  |  |
| Body | `- - 91` | 매수호가직전대비1 | String | N |  |  |
| Body | `- - 42` | 매도호가2 | String | N |  |  |
| Body | `- - 62` | 매도호가수량2 | String | N |  |  |
| Body | `- - 82` | 매도호가직전대비2 | String | N |  |  |
| Body | `- - 52` | 매수호가2 | String | N |  |  |
| Body | `- - 72` | 매수호가수량2 | String | N |  |  |
| Body | `- - 92` | 매수호가직전대비2 | String | N |  |  |
| Body | `- - 43` | 매도호가3 | String | N |  |  |
| Body | `- - 63` | 매도호가수량3 | String | N |  |  |
| Body | `- - 83` | 매도호가직전대비3 | String | N |  |  |
| Body | `- - 53` | 매수호가3 | String | N |  |  |
| Body | `- - 73` | 매수호가수량3 | String | N |  |  |
| Body | `- - 93` | 매수호가직전대비3 | String | N |  |  |
| Body | `- - 44` | 매도호가4 | String | N |  |  |
| Body | `- - 64` | 매도호가수량4 | String | N |  |  |
| Body | `- - 84` | 매도호가직전대비4 | String | N |  |  |
| Body | `- - 54` | 매수호가4 | String | N |  |  |
| Body | `- - 74` | 매수호가수량4 | String | N |  |  |
| Body | `- - 94` | 매수호가직전대비4 | String | N |  |  |
| Body | `- - 45` | 매도호가5 | String | N |  |  |
| Body | `- - 65` | 매도호가수량5 | String | N |  |  |
| Body | `- - 85` | 매도호가직전대비5 | String | N |  |  |
| Body | `- - 55` | 매수호가5 | String | N |  |  |
| Body | `- - 75` | 매수호가수량5 | String | N |  |  |
| Body | `- - 95` | 매수호가직전대비5 | String | N |  |  |
| Body | `- - 46` | 매도호가6 | String | N |  |  |
| Body | `- - 66` | 매도호가수량6 | String | N |  |  |
| Body | `- - 86` | 매도호가직전대비6 | String | N |  |  |
| Body | `- - 56` | 매수호가6 | String | N |  |  |
| Body | `- - 76` | 매수호가수량6 | String | N |  |  |
| Body | `- - 96` | 매수호가직전대비6 | String | N |  |  |
| Body | `- - 47` | 매도호가7 | String | N |  |  |
| Body | `- - 67` | 매도호가수량7 | String | N |  |  |
| Body | `- - 87` | 매도호가직전대비7 | String | N |  |  |
| Body | `- - 57` | 매수호가7 | String | N |  |  |
| Body | `- - 77` | 매수호가수량7 | String | N |  |  |
| Body | `- - 97` | 매수호가직전대비7 | String | N |  |  |
| Body | `- - 48` | 매도호가8 | String | N |  |  |
| Body | `- - 68` | 매도호가수량8 | String | N |  |  |
| Body | `- - 88` | 매도호가직전대비8 | String | N |  |  |
| Body | `- - 58` | 매수호가8 | String | N |  |  |
| Body | `- - 78` | 매수호가수량8 | String | N |  |  |
| Body | `- - 98` | 매수호가직전대비8 | String | N |  |  |
| Body | `- - 49` | 매도호가9 | String | N |  |  |
| Body | `- - 69` | 매도호가수량9 | String | N |  |  |
| Body | `- - 89` | 매도호가직전대비9 | String | N |  |  |
| Body | `- - 59` | 매수호가9 | String | N |  |  |
| Body | `- - 79` | 매수호가수량9 | String | N |  |  |
| Body | `- - 99` | 매수호가직전대비9 | String | N |  |  |
| Body | `- - 50` | 매도호가10 | String | N |  |  |
| Body | `- - 70` | 매도호가수량10 | String | N |  |  |
| Body | `- - 60` | 매수호가10 | String | N |  |  |
| Body | `- - 90` | 매도호가직전대비10 | String | N |  |  |
| Body | `- - 80` | 매수호가수량10 | String | N |  |  |
| Body | `- - 100` | 매수호가직전대비10 | String | N |  |  |
| Body | `- - 121` | 매도호가총잔량 | String | N |  |  |
| Body | `- - 122` | 매도호가총잔량직전대비 | String | N |  |  |
| Body | `- - 125` | 매수호가총잔량 | String | N |  |  |
| Body | `- - 126` | 매수호가총잔량직전대비 | String | N |  |  |
| Body | `- - 23` | 예상체결가 | String | N |  |  |
| Body | `- - 24` | 예상체결수량 | String | N |  |  |
| Body | `- - 128` | 순매수잔량 | String | N |  |  |
| Body | `- - 129` | 매수비율 | String | N |  |  |
| Body | `- - 138` | 순매도잔량 | String | N |  |  |
| Body | `- - 139` | 매도비율 | String | N |  |  |
| Body | `- - 200` | 예상체결가전일종가대비 | String | N |  |  |
| Body | `- - 201` | 예상체결가전일종가대비등락율 | String | N |  |  |
| Body | `- - 238` | 예상체결가전일종가대비기호 | String | N |  |  |
| Body | `- - 291` | 예상체결가 | String | N |  | 예상체결 시간동안에만 유효한 값 |
| Body | `- - 292` | 예상체결량 | String | N |  |  |
| Body | `- - 293` | 예상체결가전일대비기호 | String | N |  |  |
| Body | `- - 294` | 예상체결가전일대비 | String | N |  |  |
| Body | `- - 295` | 예상체결가전일대비등락율 | String | N |  |  |
| Body | `- - 621` | LP매도호가수량1 | String | N |  |  |
| Body | `- - 631` | LP매수호가수량1 | String | N |  |  |
| Body | `- - 622` | LP매도호가수량2 | String | N |  |  |
| Body | `- - 632` | LP매수호가수량2 | String | N |  |  |
| Body | `- - 623` | LP매도호가수량3 | String | N |  |  |
| Body | `- - 633` | LP매수호가수량3 | String | N |  |  |
| Body | `- - 624` | LP매도호가수량4 | String | N |  |  |
| Body | `- - 634` | LP매수호가수량4 | String | N |  |  |
| Body | `- - 625` | LP매도호가수량5 | String | N |  |  |
| Body | `- - 635` | LP매수호가수량5 | String | N |  |  |
| Body | `- - 626` | LP매도호가수량6 | String | N |  |  |
| Body | `- - 636` | LP매수호가수량6 | String | N |  |  |
| Body | `- - 627` | LP매도호가수량7 | String | N |  |  |
| Body | `- - 637` | LP매수호가수량7 | String | N |  |  |
| Body | `- - 628` | LP매도호가수량8 | String | N |  |  |
| Body | `- - 638` | LP매수호가수량8 | String | N |  |  |
| Body | `- - 629` | LP매도호가수량9 | String | N |  |  |
| Body | `- - 639` | LP매수호가수량9 | String | N |  |  |
| Body | `- - 630` | LP매도호가수량10 | String | N |  |  |
| Body | `- - 640` | LP매수호가수량10 | String | N |  |  |
| Body | `- - 13` | 누적거래량 | String | N |  |  |
| Body | `- - 299` | 전일거래량대비예상체결율 | String | N |  |  |
| Body | `- - 215` | 장운영구분 | String | N |  |  |
| Body | `- - 216` | 투자자별ticker | String | N |  |  |
| Body | `- - 6044` | KRX 매도호가잔량1 | String | N |  |  |
| Body | `- - 6045` | KRX 매도호가잔량2 | String | N |  |  |
| Body | `- - 6046` | KRX 매도호가잔량3 | String | N |  |  |
| Body | `- - 6047` | KRX 매도호가잔량4 | String | N |  |  |
| Body | `- - 6048` | KRX 매도호가잔량5 | String | N |  |  |
| Body | `- - 6049` | KRX 매도호가잔량6 | String | N |  |  |
| Body | `- - 6050` | KRX 매도호가잔량7 | String | N |  |  |
| Body | `- - 6051` | KRX 매도호가잔량8 | String | N |  |  |
| Body | `- - 6052` | KRX 매도호가잔량9 | String | N |  |  |
| Body | `- - 6053` | KRX 매도호가잔량10 | String | N |  |  |
| Body | `- - 6054` | KRX 매수호가잔량1 | String | N |  |  |
| Body | `- - 6055` | KRX 매수호가잔량2 | String | N |  |  |
| Body | `- - 6056` | KRX 매수호가잔량3 | String | N |  |  |
| Body | `- - 6057` | KRX 매수호가잔량4 | String | N |  |  |
| Body | `- - 6058` | KRX 매수호가잔량5 | String | N |  |  |
| Body | `- - 6059` | KRX 매수호가잔량6 | String | N |  |  |
| Body | `- - 6060` | KRX 매수호가잔량7 | String | N |  |  |
| Body | `- - 6061` | KRX 매수호가잔량8 | String | N |  |  |
| Body | `- - 6062` | KRX 매수호가잔량9 | String | N |  |  |
| Body | `- - 6063` | KRX 매수호가잔량10 | String | N |  |  |
| Body | `- - 6064` | KRX 매도호가총잔량 | String | N |  |  |
| Body | `- - 6065` | KRX 매수호가총잔량 | String | N |  |  |
| Body | `- - 6066` | NXT 매도호가잔량1 | String | N |  |  |
| Body | `- - 6067` | NXT 매도호가잔량2 | String | N |  |  |
| Body | `- - 6068` | NXT 매도호가잔량3 | String | N |  |  |
| Body | `- - 6069` | NXT 매도호가잔량4 | String | N |  |  |
| Body | `- - 6070` | NXT 매도호가잔량5 | String | N |  |  |
| Body | `- - 6071` | NXT 매도호가잔량6 | String | N |  |  |
| Body | `- - 6072` | NXT 매도호가잔량7 | String | N |  |  |
| Body | `- - 6073` | NXT 매도호가잔량8 | String | N |  |  |
| Body | `- - 6074` | NXT 매도호가잔량9 | String | N |  |  |
| Body | `- - 6075` | NXT 매도호가잔량10 | String | N |  |  |
| Body | `- - 6076` | NXT 매수호가잔량1 | String | N |  |  |
| Body | `- - 6077` | NXT 매수호가잔량2 | String | N |  |  |
| Body | `- - 6078` | NXT 매수호가잔량3 | String | N |  |  |
| Body | `- - 6079` | NXT 매수호가잔량4 | String | N |  |  |
| Body | `- - 6080` | NXT 매수호가잔량5 | String | N |  |  |
| Body | `- - 6081` | NXT 매수호가잔량6 | String | N |  |  |
| Body | `- - 6082` | NXT 매수호가잔량7 | String | N |  |  |
| Body | `- - 6083` | NXT 매수호가잔량8 | String | N |  |  |
| Body | `- - 6084` | NXT 매수호가잔량9 | String | N |  |  |
| Body | `- - 6085` | NXT 매수호가잔량10 | String | N |  |  |
| Body | `- - 6086` | NXT 매도호가총잔량 | String | N |  |  |
| Body | `- - 6087` | NXT 매수호가총잔량 | String | N |  |  |
| Body | `- - 6100` | KRX 중간가 매도 총잔량 증감 | String | N |  |  |
| Body | `- - 6101` | KRX 중간가 매도 총잔량 | String | N |  |  |
| Body | `- - 6102` | KRX 중간가 | String | N |  |  |
| Body | `- - 6103` | KRX 중간가 매수 총잔량 | String | N |  |  |
| Body | `- - 6104` | KRX 중간가 매수 총잔량 증감 | String | N |  |  |
| Body | `- - 6105` | NXT중간가 매도 총잔량 증감 | String | N |  |  |
| Body | `- - 6106` | NXT중간가 매도 총잔량 | String | N |  |  |
| Body | `- - 6107` | NXT중간가 | String | N |  |  |
| Body | `- - 6108` | NXT중간가 매수 총잔량 | String | N |  |  |
| Body | `- - 6109` | NXT중간가 매수 총잔량 증감 | String | N |  |  |
| Body | `- - 6110` | KRX중간가대비 | String | N |  | 기준가대비 |
| Body | `- - 6111` | KRX중간가대비 기호 | String | N |  | 기준가대비 |
| Body | `- - 6112` | KRX중간가대비등락율 | String | N |  | 기준가대비 |
| Body | `- - 6113` | NXT중간가대비 | String | N |  | 기준가대비 |
| Body | `- - 6114` | NXT중간가대비 기호 | String | N |  | 기준가대비 |
| Body | `- - 6115` | NXT중간가대비등락율 | String | N |  | 기준가대비 |

---

### 주식시간외호가 (`0E`)

- **메뉴 위치**: 국내주식 > 실시간시세 > 주식시간외호가(0E)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 10 | REG : 등록 , REMOVE : 해지 |
| Body | `grp_no` | 그룹번호 | String | Y | 4 |  |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 등록(REG)시
0:기존유지안함 1:기존유지(Default)
 0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지
해지(REMOVE)시 값 불필요 |
| Body | `data` | 실시간 등록 리스트 | LIST |  |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N | 100 | 거래소별 종목코드, 업종코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 통신결과에대한 코드
(등록,해지요청시에만 값 전송 0:정상,1:오류 , 데이터 실시간 수신시 미전송) |
| Body | `return_msg` | 결과메시지 | String | N |  | 통신결과에대한메시지 |
| Body | `trnm` | 서비스명 | String | N |  | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |
| Body | `data` | 실시간 등록리스트 | LIST | N |  |  |
| Body | `- type` | 실시간항목 | String | N |  | TR 명(0A,0B....) |
| Body | `- name` | 실시간 항목명 | String | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N |  | 거래소별 종목코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `- values` | 실시간 값 리스트 | LIST | N |  |  |
| Body | `- - 21` | 호가시간 | String | N |  |  |
| Body | `- - 131` | 시간외매도호가총잔량 | String | N |  |  |
| Body | `- - 132` | 시간외매도호가총잔량직전대비 | String | N |  |  |
| Body | `- - 135` | 시간외매수호가총잔량 | String | N |  |  |
| Body | `- - 136` | 시간외매수호가총잔량직전대비 | String | N |  |  |

---

### 주식당일거래원 (`0F`)

- **메뉴 위치**: 국내주식 > 실시간시세 > 주식당일거래원(0F)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 10 | REG : 등록 , REMOVE : 해지 |
| Body | `grp_no` | 그룹번호 | String | Y | 4 |  |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 등록(REG)시
0:기존유지안함 1:기존유지(Default)
 0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지
해지(REMOVE)시 값 불필요 |
| Body | `data` | 실시간 등록 리스트 | LIST |  |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N | 100 | 거래소별 종목코드, 업종코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 통신결과에대한 코드
(등록,해지요청시에만 값 전송 0:정상,1:오류 , 데이터 실시간 수신시 미전송) |
| Body | `return_msg` | 결과메시지 | String | N |  | 통신결과에대한메시지 |
| Body | `trnm` | 서비스명 | String | N |  | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |
| Body | `data` | 실시간 등록리스트 | LIST | N |  |  |
| Body | `- type` | 실시간항목 | String | N |  | TR 명(0A,0B....) |
| Body | `- name` | 실시간 항목명 | String | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N |  | 종목코드 |
| Body | `- values` | 실시간 값 리스트 | LIST | N |  |  |
| Body | `- - 141` | 매도거래원1 | String | N |  |  |
| Body | `- - 161` | 매도거래원수량1 | String | N |  |  |
| Body | `- - 166` | 매도거래원별증감1 | String | N |  |  |
| Body | `- - 146` | 매도거래원코드1 | String | N |  |  |
| Body | `- - 271` | 매도거래원색깔1 | String | N |  |  |
| Body | `- - 151` | 매수거래원1 | String | N |  |  |
| Body | `- - 171` | 매수거래원수량1 | String | N |  |  |
| Body | `- - 176` | 매수거래원별증감1 | String | N |  |  |
| Body | `- - 156` | 매수거래원코드1 | String | N |  |  |
| Body | `- - 281` | 매수거래원색깔1 | String | N |  |  |
| Body | `- - 142` | 매도거래원2 | String | N |  |  |
| Body | `- - 162` | 매도거래원수량2 | String | N |  |  |
| Body | `- - 167` | 매도거래원별증감2 | String | N |  |  |
| Body | `- - 147` | 매도거래원코드2 | String | N |  |  |
| Body | `- - 272` | 매도거래원색깔2 | String | N |  |  |
| Body | `- - 152` | 매수거래원2 | String | N |  |  |
| Body | `- - 172` | 매수거래원수량2 | String | N |  |  |
| Body | `- - 177` | 매수거래원별증감2 | String | N |  |  |
| Body | `- - 157` | 매수거래원코드2 | String | N |  |  |
| Body | `- - 282` | 매수거래원색깔2 | String | N |  |  |
| Body | `- - 143` | 매도거래원3 | String | N |  |  |
| Body | `- - 163` | 매도거래원수량3 | String | N |  |  |
| Body | `- - 168` | 매도거래원별증감3 | String | N |  |  |
| Body | `- - 148` | 매도거래원코드3 | String | N |  |  |
| Body | `- - 273` | 매도거래원색깔3 | String | N |  |  |
| Body | `- - 153` | 매수거래원3 | String | N |  |  |
| Body | `- - 173` | 매수거래원수량3 | String | N |  |  |
| Body | `- - 178` | 매수거래원별증감3 | String | N |  |  |
| Body | `- - 158` | 매수거래원코드3 | String | N |  |  |
| Body | `- - 283` | 매수거래원색깔3 | String | N |  |  |
| Body | `- - 144` | 매도거래원4 | String | N |  |  |
| Body | `- - 164` | 매도거래원수량4 | String | N |  |  |
| Body | `- - 169` | 매도거래원별증감4 | String | N |  |  |
| Body | `- - 149` | 매도거래원코드4 | String | N |  |  |
| Body | `- - 274` | 매도거래원색깔4 | String | N |  |  |
| Body | `- - 154` | 매수거래원4 | String | N |  |  |
| Body | `- - 174` | 매수거래원수량4 | String | N |  |  |
| Body | `- - 179` | 매수거래원별증감4 | String | N |  |  |
| Body | `- - 159` | 매수거래원코드4 | String | N |  |  |
| Body | `- - 284` | 매수거래원색깔4 | String | N |  |  |
| Body | `- - 145` | 매도거래원5 | String | N |  |  |
| Body | `- - 165` | 매도거래원수량5 | String | N |  |  |
| Body | `- - 170` | 매도거래원별증감5 | String | N |  |  |
| Body | `- - 150` | 매도거래원코드5 | String | N |  |  |
| Body | `- - 275` | 매도거래원색깔5 | String | N |  |  |
| Body | `- - 155` | 매수거래원5 | String | N |  |  |
| Body | `- - 175` | 매수거래원수량5 | String | N |  |  |
| Body | `- - 180` | 매수거래원별증감5 | String | N |  |  |
| Body | `- - 160` | 매수거래원코드5 | String | N |  |  |
| Body | `- - 285` | 매수거래원색깔5 | String | N |  |  |
| Body | `- - 261` | 외국계매도추정합 | String | N |  |  |
| Body | `- - 262` | 외국계매도추정합변동 | String | N |  |  |
| Body | `- - 263` | 외국계매수추정합 | String | N |  |  |
| Body | `- - 264` | 외국계매수추정합변동 | String | N |  |  |
| Body | `- - 267` | 외국계순매수추정합 | String | N |  |  |
| Body | `- - 268` | 외국계순매수변동 | String | N |  |  |
| Body | `- - 337` | 거래소구분 | String | N |  |  |

---

### ETF NAV (`0G`)

- **메뉴 위치**: 국내주식 > 실시간시세 > ETF NAV(0G)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 10 | REG : 등록 , REMOVE : 해지 |
| Body | `grp_no` | 그룹번호 | String | Y | 4 |  |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 등록(REG)시
0:기존유지안함 1:기존유지(Default)
 0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지
해지(REMOVE)시 값 불필요 |
| Body | `data` | 실시간 등록 리스트 | LIST |  |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N | 100 | 거래소별 종목코드, 업종코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 통신결과에대한 코드
(등록,해지요청시에만 값 전송 0:정상,1:오류 , 데이터 실시간 수신시 미전송) |
| Body | `return_msg` | 결과메시지 | String | N |  | 통신결과에대한메시지 |
| Body | `trnm` | 서비스명 | String | N |  | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |
| Body | `data` | 실시간 등록리스트 | LIST | N |  |  |
| Body | `- type` | 실시간항목 | String | N |  | TR 명(0A,0B....) |
| Body | `- name` | 실시간 항목명 | String | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N |  | 종목코드 |
| Body | `- values` | 실시간 값 리스트 | LIST | N |  |  |
| Body | `- - 36` | NAV | String | N |  |  |
| Body | `- - 37` | NAV전일대비 | String | N |  |  |
| Body | `- - 38` | NAV등락율 | String | N |  |  |
| Body | `- - 39` | 추적오차율 | String | N |  |  |
| Body | `- - 20` | 체결시간 | String | N |  |  |
| Body | `- - 10` | 현재가 | String | N |  |  |
| Body | `- - 11` | 전일대비 | String | N |  |  |
| Body | `- - 12` | 등락율 | String | N |  |  |
| Body | `- - 13` | 누적거래량 | String | N |  |  |
| Body | `- - 25` | 전일대비기호 | String | N |  |  |
| Body | `- - 667` | ELW기어링비율 | String | N |  |  |
| Body | `- - 668` | ELW손익분기율 | String | N |  |  |
| Body | `- - 669` | ELW자본지지점 | String | N |  |  |
| Body | `- - 265` | NAV/지수괴리율 | String | N |  |  |
| Body | `- - 266` | NAV/ETF괴리율 | String | N |  |  |

---

### 주식예상체결 (`0H`)

- **메뉴 위치**: 국내주식 > 실시간시세 > 주식예상체결(0H)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 10 | REG : 등록 , REMOVE : 해지 |
| Body | `grp_no` | 그룹번호 | String | Y | 4 |  |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 등록(REG)시
0:기존유지안함 1:기존유지(Default)
 0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지
해지(REMOVE)시 값 불필요 |
| Body | `data` | 실시간 등록 리스트 | LIST |  |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N | 100 | 거래소별 종목코드, 업종코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 통신결과에대한 코드
(등록,해지요청시에만 값 전송 0:정상,1:오류 , 데이터 실시간 수신시 미전송) |
| Body | `return_msg` | 결과메시지 | String | N |  | 통신결과에대한메시지 |
| Body | `trnm` | 서비스명 | String | N |  | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |
| Body | `data` | 실시간 등록리스트 | LIST | N |  |  |
| Body | `- type` | 실시간항목 | String | N |  | TR 명(0A,0B....) |
| Body | `- name` | 실시간 항목명 | String | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N |  | 종목코드 |
| Body | `- values` | 실시간 값 리스트 | LIST | N |  |  |
| Body | `- - 20` | 체결시간 | String | N |  |  |
| Body | `- - 10` | 현재가 | String | N |  |  |
| Body | `- - 11` | 전일대비 | String | N |  |  |
| Body | `- - 12` | 등락율 | String | N |  |  |
| Body | `- - 15` | 거래량 | String | N |  | +는 매수체결, -는 매도체결 |
| Body | `- - 13` | 누적거래량 | String | N |  |  |
| Body | `- - 25` | 전일대비기호 | String | N |  |  |

---

### 국제금환산가격 (`0I`)

- **메뉴 위치**: 국내주식 > 실시간시세 > 국제금환산가격(0I)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 10 | REG : 등록 , REMOVE : 해지 |
| Body | `grp_no` | 그룹번호 | String | Y | 4 |  |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 등록(REG)시
0:기존유지안함 1:기존유지(Default)
 0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지
해지(REMOVE)시 값 불필요 |
| Body | `data` | 실시간 등록 리스트 | LIST | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N | 100 | MGD: 원/g, MGU: $/온스,소수점2자리 |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_msg` | 결과메시지 | String | N |  | 통신결과에대한메시지 |
| Body | `trnm` | 서비스명 | String | N |  | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |
| Body | `data` | 실시간 등록리스트 | LIST | N |  |  |
| Body | `- type` | 실시간항목 | String | N |  | TR 명(0B,0B....) |
| Body | `- name` | 실시간 항목명 | String | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N |  | 종목코드 |
| Body | `- values` | 실시간 값 리스트 | LIST | N |  |  |
| Body | `- - 10` | 현재가 | String | N |  |  |
| Body | `- - 25` | 전일대비기호 | String | N |  | 1:상한, 2:상승, 3:없음, 4:하한, 5:하락 |
| Body | `- - 11` | 전일대비 | String | N |  |  |
| Body | `- - 12` | 등락율 | String | N |  |  |

---

### 업종지수 (`0J`)

- **메뉴 위치**: 국내주식 > 실시간시세 > 업종지수(0J)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 10 | REG : 등록 , REMOVE : 해지 |
| Body | `grp_no` | 그룹번호 | String | Y | 4 |  |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 등록(REG)시
0:기존유지안함 1:기존유지(Default)
 0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지
해지(REMOVE)시 값 불필요 |
| Body | `data` | 실시간 등록 리스트 | LIST |  |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N | 100 | 거래소별 종목코드, 업종코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 통신결과에대한 코드
(등록,해지요청시에만 값 전송 0:정상,1:오류 , 데이터 실시간 수신시 미전송) |
| Body | `return_msg` | 결과메시지 | String | N |  | 통신결과에대한메시지 |
| Body | `trnm` | 서비스명 | String | N |  | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |
| Body | `data` | 실시간 등록리스트 | LIST | N |  |  |
| Body | `- type` | 실시간항목 | String | N |  | TR 명(0A,0B....) |
| Body | `- name` | 실시간 항목명 | String | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N |  | 종목코드 |
| Body | `- values` | 실시간 값 리스트 | LIST | N |  |  |
| Body | `- - 20` | 체결시간 | String | N |  |  |
| Body | `- - 10` | 현재가 | String | N |  |  |
| Body | `- - 11` | 전일대비 | String | N |  |  |
| Body | `- - 12` | 등락율 | String | N |  |  |
| Body | `- - 15` | 거래량 | String | N |  | +는 매수체결,-는 매도체결 |
| Body | `- - 13` | 누적거래량 | String | N |  |  |
| Body | `- - 14` | 누적거래대금 | String | N |  |  |
| Body | `- - 16` | 시가 | String | N |  |  |
| Body | `- - 17` | 고가 | String | N |  |  |
| Body | `- - 18` | 저가 | String | N |  |  |
| Body | `- - 25` | 전일대비기호 | String | N |  |  |
| Body | `- - 26` | 전일거래량대비 | String | N |  | 계약,주 |

---

### 업종등락 (`0U`)

- **메뉴 위치**: 국내주식 > 실시간시세 > 업종등락(0U)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 10 | REG : 등록 , REMOVE : 해지 |
| Body | `grp_no` | 그룹번호 | String | Y | 4 |  |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 등록(REG)시
0:기존유지안함 1:기존유지(Default)
 0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지
해지(REMOVE)시 값 불필요 |
| Body | `data` | 실시간 등록 리스트 | LIST |  |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N | 100 | 거래소별 종목코드, 업종코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 통신결과에대한 코드
(등록,해지요청시에만 값 전송 0:정상,1:오류 , 데이터 실시간 수신시 미전송) |
| Body | `return_msg` | 결과메시지 | String | N |  | 통신결과에대한메시지 |
| Body | `trnm` | 서비스명 | String | N |  | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |
| Body | `data` | 실시간 등록리스트 | LIST | N |  |  |
| Body | `- type` | 실시간항목 | String | N |  | TR 명(0A,0B....) |
| Body | `- name` | 실시간 항목명 | String | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N |  | 종목코드 |
| Body | `- values` | 실시간 값 리스트 | LIST | N |  |  |
| Body | `- - 20` | 체결시간 | String | N |  |  |
| Body | `- - 252` | 상승종목수 | String | N |  |  |
| Body | `- - 251` | 상한종목수 | String | N |  |  |
| Body | `- - 253` | 보합종목수 | String | N |  |  |
| Body | `- - 255` | 하락종목수 | String | N |  |  |
| Body | `- - 254` | 하한종목수 | String | N |  |  |
| Body | `- - 13` | 누적거래량 | String | N |  |  |
| Body | `- - 14` | 누적거래대금 | String | N |  |  |
| Body | `- - 10` | 현재가 | String | N |  |  |
| Body | `- - 11` | 전일대비 | String | N |  |  |
| Body | `- - 12` | 등락율 | String | N |  |  |
| Body | `- - 256` | 거래형성종목수 | String | N |  | 계약,주 |
| Body | `- - 257` | 거래형성비율 | String | N |  |  |
| Body | `- - 25` | 전일대비기호 | String | N |  |  |

---

### 주식종목정보 (`0g`)

- **메뉴 위치**: 국내주식 > 실시간시세 > 주식종목정보(0g)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 10 | REG : 등록 , REMOVE : 해지 |
| Body | `grp_no` | 그룹번호 | String | Y | 4 |  |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 등록(REG)시
0:기존유지안함 1:기존유지(Default)
 0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지
해지(REMOVE)시 값 불필요 |
| Body | `data` | 실시간 등록 리스트 | LIST |  |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N | 100 | 거래소별 종목코드, 업종코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 통신결과에대한 코드
(등록,해지요청시에만 값 전송 0:정상,1:오류 , 데이터 실시간 수신시 미전송) |
| Body | `return_msg` | 결과메시지 | String | N |  | 통신결과에대한메시지 |
| Body | `trnm` | 서비스명 | String | N |  | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |
| Body | `data` | 실시간 등록리스트 | LIST | N |  |  |
| Body | `- type` | 실시간항목 | String | N |  | TR 명(0A,0B....) |
| Body | `- name` | 실시간 항목명 | String | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N |  | 종목코드 |
| Body | `- values` | 실시간 값 리스트 | LIST | N |  |  |
| Body | `- - 297` | 임의연장 | String | N |  |  |
| Body | `- - 592` | 장전임의연장 | String | N |  |  |
| Body | `- - 593` | 장후임의연장 | String | N |  |  |
| Body | `- - 305` | 상한가 | String | N |  |  |
| Body | `- - 306` | 하한가 | String | N |  |  |
| Body | `- - 307` | 기준가 | String | N |  |  |
| Body | `- - 689` | 조기종료ELW발생 | String | N |  |  |
| Body | `- - 594` | 통화단위 | String | N |  |  |
| Body | `- - 382` | 증거금율표시 | String | N |  |  |
| Body | `- - 370` | 종목정보 | String | N |  |  |

---

### ELW 이론가 (`0m`)

- **메뉴 위치**: 국내주식 > 실시간시세 > ELW 이론가(0m)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 10 | REG : 등록 , REMOVE : 해지 |
| Body | `grp_no` | 그룹번호 | String | Y | 4 |  |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 등록(REG)시
0:기존유지안함 1:기존유지(Default)
 0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지
해지(REMOVE)시 값 불필요 |
| Body | `data` | 실시간 등록 리스트 | LIST |  |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N | 100 | 거래소별 종목코드, 업종코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 통신결과에대한 코드
(등록,해지요청시에만 값 전송 0:정상,1:오류 , 데이터 실시간 수신시 미전송) |
| Body | `return_msg` | 결과메시지 | String | N |  | 통신결과에대한메시지 |
| Body | `trnm` | 서비스명 | String | N |  | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |
| Body | `data` | 실시간 등록리스트 | LIST | N |  |  |
| Body | `- type` | 실시간항목 | String | N |  | TR 명(0A,0B....) |
| Body | `- name` | 실시간 항목명 | String | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N |  | 종목코드 |
| Body | `- values` | 실시간 값 리스트 | LIST | N |  |  |
| Body | `- - 20` | 체결시간 | String | N |  |  |
| Body | `- - 10` | 현재가 | String | N |  |  |
| Body | `- - 670` | ELW이론가 | String | N |  |  |
| Body | `- - 671` | ELW내재변동성 | String | N |  |  |
| Body | `- - 672` | ELW델타 | String | N |  |  |
| Body | `- - 673` | ELW감마 | String | N |  |  |
| Body | `- - 674` | ELW쎄타 | String | N |  |  |
| Body | `- - 675` | ELW베가 | String | N |  |  |
| Body | `- - 676` | ELW로 | String | N |  |  |
| Body | `- - 706` | LP호가내재변동성 | String | N |  |  |

---

### 장시작시간 (`0s`)

- **메뉴 위치**: 국내주식 > 실시간시세 > 장시작시간(0s)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 10 | REG : 등록 , REMOVE : 해지 |
| Body | `grp_no` | 그룹번호 | String | Y | 4 |  |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 등록(REG)시
0:기존유지안함 1:기존유지(Default)
 0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지
해지(REMOVE)시 값 불필요 |
| Body | `data` | 실시간 등록 리스트 | LIST |  |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N | 100 | 거래소별 종목코드, 업종코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 통신결과에대한 코드
(등록,해지요청시에만 값 전송 0:정상,1:오류 , 데이터 실시간 수신시 미전송) |
| Body | `return_msg` | 결과메시지 | String | N |  | 통신결과에대한메시지 |
| Body | `trnm` | 서비스명 | String | N |  | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |
| Body | `data` | 실시간 등록리스트 | LIST | N |  |  |
| Body | `- type` | 실시간항목 | String | N |  | TR 명(0A,0B....) |
| Body | `- name` | 실시간 항목명 | String | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N |  | 종목코드 |
| Body | `- values` | 실시간 값 리스트 | LIST | N |  |  |
| Body | `- - 215` | 장운영구분 | String | N |  | 0 : 장시작전 알림(8:40~),
3 : 장시작(09:00),
2 : 장마감 알림(15:20~),
4 : 장마감(15:30),
8 : 정규장마감(거래소 수신시 15:30 이후),
9 : 전체장마감(거래소 수신시 18:00 이후),
a : 시간외 종가매매 시작(15:40),
b : 시간외 종가매매 종료(16:00),
c : 시간외 단일가 시작(16:00),
d : 시간외 단일가 종료(18:00),
e : 선옵 장마감전 동시호가 종료,
f : 선물옵션 장운영시간 알림(조기개장 상품),
o : 선옵 장시작,
s : 선옵 장마감전 동시호가 시작,
P : NXT 프리마켓 시작 알림,
Q : NXT 프리마켓 종료 알림,
R : NXT 메인마켓 시작 알림,
S : NXT 메인마켓 종료 알림,
T : NXT 에프터마켓 단일가 시작 알림,
U : NXT 에프터마켓 시작 알림,
V : NXT 에프터마켓 종료 알림 |
| Body | `- - 20` | 체결시간 | String | N |  |  |
| Body | `- - 214` | 장시작예상잔여시간 | String | N |  |  |

---

### ELW 지표 (`0u`)

- **메뉴 위치**: 국내주식 > 실시간시세 > ELW 지표(0u)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 10 | REG : 등록 , REMOVE : 해지 |
| Body | `grp_no` | 그룹번호 | String | Y | 4 |  |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 등록(REG)시
0:기존유지안함 1:기존유지(Default)
 0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지
해지(REMOVE)시 값 불필요 |
| Body | `data` | 실시간 등록 리스트 | LIST |  |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N | 100 | 거래소별 종목코드, 업종코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 통신결과에대한 코드
(등록,해지요청시에만 값 전송 0:정상,1:오류 , 데이터 실시간 수신시 미전송) |
| Body | `return_msg` | 결과메시지 | String | N |  | 통신결과에대한메시지 |
| Body | `trnm` | 서비스명 | String | N |  | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |
| Body | `data` | 실시간 등록리스트 | LIST | N |  |  |
| Body | `- type` | 실시간항목 | String | N |  | TR 명(0A,0B....) |
| Body | `- name` | 실시간 항목명 | String | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N |  | 종목코드 |
| Body | `- values` | 실시간 값 리스트 | LIST | N |  |  |
| Body | `- - 20` | 체결시간 | String | N |  |  |
| Body | `- - 666` | ELW패리티 | String | N |  |  |
| Body | `- - 1211` | ELW프리미엄 | String | N |  |  |
| Body | `- - 667` | ELW기어링비율 | String | N |  |  |
| Body | `- - 668` | ELW손익분기율 | String | N |  |  |
| Body | `- - 669` | ELW자본지지점 | String | N |  |  |

---

### 종목프로그램매매 (`0w`)

- **메뉴 위치**: 국내주식 > 실시간시세 > 종목프로그램매매(0w)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 10 | REG : 등록 , REMOVE : 해지 |
| Body | `grp_no` | 그룹번호 | String | Y | 4 |  |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 등록(REG)시
0:기존유지안함 1:기존유지(Default)
 0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지
해지(REMOVE)시 값 불필요 |
| Body | `data` | 실시간 등록 리스트 | LIST |  |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N | 100 | 거래소별 종목코드, 업종코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 통신결과에대한 코드
(등록,해지요청시에만 값 전송 0:정상,1:오류 , 데이터 실시간 수신시 미전송) |
| Body | `return_msg` | 결과메시지 | String | N |  | 통신결과에대한메시지 |
| Body | `trnm` | 서비스명 | String | N |  | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |
| Body | `data` | 실시간 등록리스트 | LIST | N |  |  |
| Body | `- type` | 실시간항목 | String | N |  | TR 명(0A,0B....) |
| Body | `- name` | 실시간 항목명 | String | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N |  | 종목코드 |
| Body | `- values` | 실시간 값 리스트 | LIST | N |  |  |
| Body | `- - 20` | 체결시간 | String | N |  |  |
| Body | `- - 10` | 현재가 | String | N |  |  |
| Body | `- - 25` | 전일대비기호 | String | N |  |  |
| Body | `- - 11` | 전일대비 | String | N |  |  |
| Body | `- - 12` | 등락율 | String | N |  |  |
| Body | `- - 13` | 누적거래량 | String | N |  |  |
| Body | `- - 202` | 매도수량 | String | N |  |  |
| Body | `- - 204` | 매도금액 | String | N |  |  |
| Body | `- - 206` | 매수수량 | String | N |  |  |
| Body | `- - 208` | 매수금액 | String | N |  |  |
| Body | `- - 210` | 순매수수량 | String | N |  |  |
| Body | `- - 211` | 순매수수량증감 | String | N |  | 계약,주 |
| Body | `- - 212` | 순매수금액 | String | N |  |  |
| Body | `- - 213` | 순매수금액증감 | String | N |  |  |
| Body | `- - 214` | 장시작예상잔여시간 | String | N |  |  |
| Body | `- - 215` | 장운영구분 | String | N |  |  |
| Body | `- - 216` | 투자자별ticker | String | N |  |  |

---

### VI발동/해제 (`1h`)

- **메뉴 위치**: 국내주식 > 실시간시세 > VI발동/해제(1h)
- **Method**: `POST`
- **운영 도메인**: `wss://api.kiwoom.com:10000`
- **모의투자 도메인**: `wss://mockapi.kiwoom.com:10000(KRX만 지원가능)`
- **URL**: `/api/dostk/websocket`
- **Content-Type**: `application/json;charset=UTF-8`
- **Format**: `JSON`

#### Request

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `authorization` | 접근토큰 | String | Y | 1000 | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 
 예) Bearer Egicyx... |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `trnm` | 서비스명 | String | Y | 10 | REG : 등록 , REMOVE : 해지 |
| Body | `grp_no` | 그룹번호 | String | Y | 4 |  |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 등록(REG)시
0:기존유지안함 1:기존유지(Default)
 0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지
해지(REMOVE)시 값 불필요 |
| Body | `data` | 실시간 등록 리스트 | LIST |  |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N | 100 | 거래소별 종목코드, 업종코드
(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `- type` | 실시간 항목 | String | Y | 2 | TR 명(0A,0B....) |

#### Response

**Header**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Header | `api-id` | TR명 | String | Y | 10 |  |
| Header | `cont-yn` | 연속조회여부 | String | N | 1 | 다음 데이터가 있을시 Y값 전달 |
| Header | `next-key` | 연속조회키 | String | N | 50 | 다음 데이터가 있을시 다음 키값 전달 |

**Body**

| 구분 | Element | 한글명 | Type | Required | Length | Description |
|------|---------|--------|------|----------|--------|-------------|
| Body | `return_code` | 결과코드 | String | N |  | 통신결과에대한 코드
(등록,해지요청시에만 값 전송 0:정상,1:오류 , 데이터 실시간 수신시 미전송) |
| Body | `return_msg` | 결과메시지 | String | N |  | 통신결과에대한메시지 |
| Body | `trnm` | 서비스명 | String | N |  | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |
| Body | `data` | 실시간 등록리스트 | LIST | N |  |  |
| Body | `- type` | 실시간항목 | String | N |  | TR 명(0A,0B....) |
| Body | `- name` | 실시간 항목명 | String | N |  |  |
| Body | `- item` | 실시간 등록 요소 | String | N |  | 종목코드 |
| Body | `- values` | 실시간 값 리스트 | LIST | N |  |  |
| Body | `- - 9001` | 종목코드 | String | N |  |  |
| Body | `- - 302` | 종목명 | String | N |  |  |
| Body | `- - 13` | 누적거래량 | String | N |  |  |
| Body | `- - 14` | 누적거래대금 | String | N |  |  |
| Body | `- - 9068` | VI발동구분 | String | N |  |  |
| Body | `- - 9008` | KOSPI,KOSDAQ,전체구분 | String | N |  |  |
| Body | `- - 9075` | 장전구분 | String | N |  |  |
| Body | `- - 1221` | VI발동가격 | String | N |  |  |
| Body | `- - 1223` | 매매체결처리시각 | String | N |  |  |
| Body | `- - 1224` | VI해제시각 | String | N |  |  |
| Body | `- - 1225` | VI적용구분 | String | N |  | 정적/동적/동적+정적 |
| Body | `- - 1236` | 기준가격 정적 | String | N |  | 계약,주 |
| Body | `- - 1237` | 기준가격 동적 | String | N |  |  |
| Body | `- - 1238` | 괴리율 정적 | String | N |  |  |
| Body | `- - 1239` | 괴리율 동적 | String | N |  |  |
| Body | `- - 1489` | VI발동가 등락율 | String | N |  |  |
| Body | `- - 1490` | VI발동횟수 | String | N |  |  |
| Body | `- - 9069` | 발동방향구분 | String | N |  |  |
| Body | `- - 1279` | Extra Item | String | N |  |  |

---

## 오류코드

| No. | 오류코드 | 오류메시지 |
|-----|---------|-----------|
| 1 | `1501` | API ID가 Null이거나 값이 없습니다 |
| 2 | `1504` | 해당 URI에서는 지원하는 API ID가 아닙니다. API ID={?}, URI={?} |
| 3 | `1505` | 해당 API ID는 존재하지 않습니다. API ID={?} |
| 4 | `1511` | 필수 입력 값에 값이 존재하지 않습니다. 필수입력 파라미터={?} |
| 5 | `1512` | Http header에 값이 설정되지 않았거나 읽을 수 없습니다 |
| 6 | `1513` | Http Header에 authorization 필드가 설정되어 있어야 합니다 |
| 7 | `1514` | 입력으로 들어온 Http Header의 authorization 필드 형식이 맞지 않습니다 |
| 8 | `1515` | Http Header의 authorization 필드 내 Grant Type이 미리 정의된 형식이 아닙니다 |
| 9 | `1516` | Http Header의 authorization 필드 내 Token이 정의되어 있지 않습니다 |
| 10 | `1517` | 입력 값 형식이 올바르지 않습니다. 파라미터={?} 실패사유= {?} |
| 11 | `1687` | 재귀 호출이 발생하여 API 호출을 제한합니다, API ID={?} |
| 12 | `1700` | 허용된 요청 개수를 초과하였습니다. API ID={?} |
| 13 | `1901` | 시장 코드값이 존재하지 않습니다. 종목코드={?} |
| 14 | `1902` | 종목 정보가 없습니다. 입력한 종목코드 값을 확인바랍니다. 종목코드={?} |
| 15 | `1999` | 예기치 못한 에러가 발생했습니다. 실패사유={?} |
| 16 | `8001` | App Key와 Secret Key 검증에 실패했습니다 |
| 17 | `8002` | App Key와 Secret Key 검증에 실패했습니다. 실패사유={?} |
| 18 | `8003` | Access Token을 조회하는데 실패했습니다. 실패사유={?} |
| 19 | `8005` | Token이 유효하지 않습니다 |
| 20 | `8006` | Access Token을 생성하는데 실패했습니다. 실패사유={?} |
| 21 | `8009` | Access Token을 발급하는데 실패했습니다. 실패사유={?} |
| 22 | `8010` | Token을 발급받은 IP와 서비스를 요청한 IP가 동일하지 않습니다 |
| 23 | `8011` | Access Token을 발급하는데 실패했습니다. 입력값에 grant_type이 들어오지 않았습니다 |
| 24 | `8012` | Access Token을 발급하는데 실패했습니다. grant_type의 값이 맞지 않습니다 |
| 25 | `8015` | Access Token을 폐기하는데 실패했습니다. 실패사유={?} |
| 26 | `8016` | Access Token을 폐기하는데 실패했습니다. 입력값에 Token이 들어오지 않았습니다 |
| 27 | `8020` | 입력파라미터로 appkey 또는 secretkey가 들어오지 않았습니다. |
| 28 | `8030` | 투자구분(실전/모의)이 달라서 Appkey를 사용할수가 없습니다 |
| 29 | `8031` | 투자구분(실전/모의)이 달라서 Token를 사용할수가 없습니다 |
| 30 | `8040` | 단말기 인증에 실패했습니다 |
| 31 | `8050` | 지정단말기 인증에 실패했습니다 |
| 32 | `8103` | 토큰 인증 또는 단말기인증에 실패했습니다. 실패사유={?} |
