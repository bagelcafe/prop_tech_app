# NL2SQL Agent 개발 계획서

> **대상 DB**: AWS Athena  
> **LLM**: OpenAI GPT-4o  
> **작성일**: 2026-05-22  
> **개발 기간**: 2026-05-26 ~ 2026-08-31 (총 14주)

---

## 개요

자연어(Natural Language)를 SQL 쿼리로 변환하는 NL2SQL 에이전트를 개발한다.
사용자는 AWS Athena 위에 저장된 데이터를 SQL 없이 한국어/영어 질의만으로 조회·분석할 수 있다.

---

## 개발 단계 요약

| # | 항목 | 기간 | 일정 | 산출물 |
|---|------|------|------|---------|
| 1 | NL2SQL 기술 Survey & 평가 설계 | 2주 | 05/26 ~ 06/08 | Survey 보고서, 평가 방법론 |
| 2 | 데이터 분석 및 Schema Intelligence 설계 | 2주 | 06/09 ~ 06/22 | 설계 문서, 시맨틱 레이어 명세 |
| 3 | NL2SQL 에이전트 코어 개발 | 3주 | 06/23 ~ 07/13 | MVP 에이전트 코드 |
| 4 | 평가 프레임워크 구축 및 성능 베이스라인 확보 | 2주 | 07/14 ~ 07/27 | 성능 지표 보고서, 벤치마크 데이터셋 |
| 5 | Edge 모델 교체 실험 및 Ablation Study | 3주 | 07/28 ~ 08/17 | 모델 비교 보고서, 비용-성능 분석 |
| 6 | 개발 검증 설계 및 지속 평가 체계 구축 | 2주 | 08/18 ~ 08/31 | 최종 보고서, 배포 패키지 |

---

## 1. NL2SQL 기술 Survey & 평가 설계

> **기간**: 2주 (2026-05-26 ~ 2026-06-08)

### 목표
- NL2SQL 분야의 최신 기술 동향 파악
- AWS Athena 연계에 적합한 접근법 선정

### 세부 작업

#### 1.1 벤치마크 & 데이터셋 조사
- [ ] Spider, BIRD, WikiSQL 벤치마크 현황 분석
- [ ] 한국어 NL2SQL 데이터셋 존재 여부 확인
- [ ] AWS Athena(Presto/Trino SQL 방언) 특성 정리

#### 1.2 기존 접근법 비교

| 방식 | 도구/모델 | 장점 | 단점 |
|------|-----------|------|------|
| Prompt Engineering | GPT-4o + Few-shot | 빠른 구현 | 복잡 쿼리 한계 |
| RAG 기반 Schema Retrieval | LlamaIndex + GPT-4o | 대규모 스키마 처리 | 검색 품질 의존 |
| Fine-tuned 모델 | SQLCoder-7B, NSQL | 낮은 비용 | 도메인 적응 필요 |
| Multi-agent (ReAct) | LangGraph + GPT-4o | 자기 수정 가능 | 복잡도 높음 |

#### 1.3 AWS Athena 특이사항 조사
- [ ] Athena SQL 방언(Presto/Trino) vs ANSI SQL 차이점 정리
- [ ] AWS Glue Data Catalog 스키마 추출 방법 조사
- [ ] Athena boto3 API 연동 방법 확인

#### 1.4 선택 기술 확정
- [ ] GPT-4o 기반 Prompt Engineering + RAG Schema Retrieval 조합 채택 여부 결정
- [ ] LangChain vs LlamaIndex vs 커스텀 구현 비교 결정

### 산출물
- `survey_report.md` : 기술 Survey 보고서
- `athena_sql_dialect.md` : Athena SQL 방언 정리 문서

---

## 2. 데이터 분석 및 Schema Intelligence 설계

> **기간**: 2주 (2026-06-09 ~ 2026-06-22)

### 목표
- 확장 가능하고 유지보수 가능한 NL2SQL 에이전트 아키텍처 설계
- AWS Athena 연동 구조 확정

### 세부 작업

#### 2.1 시스템 구성 설계

```
┌─────────────────────────────────────────────────────────┐
│                    NL2SQL Agent                         │
│                                                         │
│  [사용자 질의] ──► [질의 분석기] ──► [Schema Retriever] │
│                         │                   │           │
│                         ▼                   ▼           │
│                  [SQL Generator]   [Schema Store]       │
│                  (GPT-4o)         (Vector DB)           │
│                         │                               │
│                         ▼                               │
│                  [SQL Validator]                        │
│                         │                               │
│                         ▼                               │
│                  [Athena Executor]                      │
│                         │                               │
│                         ▼                               │
│                  [결과 포매터]                           │
└─────────────────────────────────────────────────────────┘
```

#### 2.2 핵심 컴포넌트 정의

| 컴포넌트 | 역할 | 기술 |
|----------|------|------|
| Schema Extractor | Glue Catalog에서 테이블/컬럼 메타데이터 추출 | boto3 |
| Schema Store | 스키마 벡터 인덱싱 및 유사도 검색 | ChromaDB / FAISS |
| Query Analyzer | 질의 의도 분류 (SELECT/집계/조인 등) | GPT-4o |
| SQL Generator | 스키마 컨텍스트 + Few-shot으로 SQL 생성 | GPT-4o |
| SQL Validator | 구문 오류, 테이블명 오류 사전 검증 | sqlglot |
| Athena Executor | boto3로 Athena 쿼리 실행 및 결과 수집 | boto3 |
| Self-Corrector | 실행 오류 시 자동 수정 재시도 (ReAct) | LangChain/커스텀 |

#### 2.3 데이터 흐름 설계
- [ ] 스키마 갱신 주기 및 캐싱 전략 정의
- [ ] 대화 컨텍스트(멀티턴) 관리 방식 결정
- [ ] 오류 처리 및 폴백(fallback) 전략 정의

#### 2.4 API 인터페이스 설계
- [ ] FastAPI 기반 REST API 엔드포인트 설계
  - `POST /query` : 자연어 → SQL → 결과 반환
  - `GET /schema` : 현재 인식된 스키마 확인
  - `POST /feedback` : 쿼리 결과 피드백 수집
- [ ] 요청/응답 스키마(Pydantic) 정의

### 산출물
- `architecture.md` : 아키텍처 설계 문서
- `api_spec.md` : API 명세서
- `component_diagram.png` : 컴포넌트 다이어그램

---

## 3. NL2SQL 에이전트 코어 개발

> **기간**: 3주 (2026-06-23 ~ 2026-07-13)

### 목표
- 설계 기반 MVP(Minimum Viable Product) 구현
- AWS Athena 실 연동 확인

### 프로젝트 구조

```
nl2sql_agent/
├── main.py                  # FastAPI 앱 진입점
├── config.py                # 환경변수 설정 (AWS, OpenAI)
├── agent/
│   ├── __init__.py
│   ├── nl2sql_agent.py      # 메인 에이전트 오케스트레이터
│   ├── query_analyzer.py    # 질의 분석기
│   ├── sql_generator.py     # SQL 생성기 (GPT-4o)
│   ├── sql_validator.py     # SQL 검증기
│   └── self_corrector.py    # 자기 수정 루프
├── schema/
│   ├── __init__.py
│   ├── extractor.py         # Glue Catalog 스키마 추출
│   ├── store.py             # 벡터 스토어 (ChromaDB)
│   └── retriever.py         # 유사 스키마 검색
├── athena/
│   ├── __init__.py
│   ├── executor.py          # Athena 쿼리 실행
│   └── result_formatter.py  # 결과 포매팅
├── prompts/
│   ├── system_prompt.txt    # 시스템 프롬프트
│   ├── few_shot_examples.json  # Few-shot 예시
│   └── correction_prompt.txt   # 자기 수정 프롬프트
├── api/
│   ├── __init__.py
│   ├── routes.py            # API 라우터
│   └── schemas.py           # Pydantic 모델
├── tests/
│   ├── test_sql_generator.py
│   ├── test_athena_executor.py
│   └── test_api.py
├── requirements.txt
└── .env.example
```

### 세부 작업

#### 3.1 환경 설정 (Week 1 / 06-23 ~ 06-29)
- [ ] 프로젝트 폴더 구조 생성
- [ ] `requirements.txt` 작성
  - `openai`, `langchain`, `boto3`, `chromadb`, `sqlglot`, `fastapi`, `uvicorn`
- [ ] `.env.example` 작성 (AWS 자격증명, OpenAI API Key)
- [ ] AWS Athena 테스트 환경 구성 (테스트용 S3 버킷, Glue Database)

#### 3.2 Schema 추출 및 저장 (Week 1 / 06-23 ~ 06-29)
- [ ] `schema/extractor.py` : boto3로 Glue Catalog 메타데이터 추출
- [ ] `schema/store.py` : ChromaDB에 테이블/컬럼 임베딩 저장
- [ ] `schema/retriever.py` : 질의 관련 스키마 유사도 검색

#### 3.3 SQL 생성기 구현 (Week 2 / 06-30 ~ 07-06)
- [ ] `prompts/system_prompt.txt` : Athena SQL 방언 고려한 시스템 프롬프트 작성
- [ ] `prompts/few_shot_examples.json` : 도메인 특화 Few-shot 예시 10~20개 작성
- [ ] `agent/sql_generator.py` : GPT-4o API 호출 및 SQL 추출 구현
- [ ] `agent/query_analyzer.py` : 질의 분류 및 전처리 구현

#### 3.4 Athena 실행기 구현 (Week 2 / 06-30 ~ 07-06)
- [ ] `athena/executor.py` : boto3 Athena 쿼리 실행 (비동기 폴링 포함)
- [ ] `athena/result_formatter.py` : S3 결과 파일 파싱 및 포매팅
- [ ] 쿼리 타임아웃 및 비용 제한 안전장치 구현

#### 3.5 SQL 검증 및 자기 수정 (Week 3 / 07-07 ~ 07-13)
- [ ] `agent/sql_validator.py` : sqlglot 기반 구문 검증
- [ ] `agent/self_corrector.py` : 실행 오류 메시지 기반 자동 수정 (최대 3회)
- [ ] `agent/nl2sql_agent.py` : 전체 파이프라인 오케스트레이션

#### 3.6 FastAPI 서버 구현 (Week 3 / 07-07 ~ 07-13)
- [ ] `api/routes.py` : `/query`, `/schema`, `/feedback` 엔드포인트 구현
- [ ] `api/schemas.py` : 요청/응답 Pydantic 모델 정의
- [ ] `main.py` : FastAPI 앱 조립 및 실행

### 산출물
- MVP 에이전트 코드 (전체 디렉토리)
- 통합 테스트 결과 보고서

---

## 4. 평가 프레임워크 구축 및 성능 베이스라인 확보

> **기간**: 2주 (2026-07-14 ~ 2026-07-27)

### 목표
- SQL 생성 정확도(Execution Accuracy) 향상
- 응답 지연 시간 단축

### 측정 지표

| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| Execution Accuracy (EX) | ≥ 80% | 테스트셋 정답 SQL과 실행 결과 비교 |
| Valid SQL Rate | ≥ 95% | 구문 오류 없는 SQL 비율 |
| 평균 응답시간 | ≤ 5초 | Athena 실행 제외 에이전트 처리 시간 |
| 자기 수정 성공률 | ≥ 70% | 오류 발생 시 수정 성공 비율 |

### 세부 작업

#### 4.1 테스트셋 구축
- [ ] 도메인 특화 NL-SQL 쌍 50~100개 작성
- [ ] 난이도 분류: 단순 SELECT / 집계 / 조인 / 서브쿼리

#### 4.2 프롬프트 최적화
- [ ] Few-shot 예시 품질 개선 (Chain-of-Thought 적용)
- [ ] 스키마 컨텍스트 포함 방식 최적화 (토큰 절약)
- [ ] Athena 특화 지시사항 추가 (파티션 필터 강제 등)

#### 4.3 Schema Retrieval 개선
- [ ] 임베딩 모델 비교 (`text-embedding-3-small` vs `text-embedding-3-large`)
- [ ] 검색 Top-K 최적값 실험 (K=3, 5, 10)
- [ ] 테이블 관계(FK) 정보 추가 여부 실험

#### 4.4 캐싱 전략 적용
- [ ] 동일/유사 질의 SQL 캐싱 (Redis 또는 메모리 캐시)
- [ ] 스키마 임베딩 주기적 갱신 스케줄러 구현

### 산출물
- 성능 지표 보고서 (`performance_report.md`)
- 최적화된 프롬프트 및 설정값

---

## 5. Edge 모델 교체 실험 및 Ablation Study

> **기간**: 3주 (2026-07-28 ~ 2026-08-17)

### 목표
- GPT-4o 대신 경량 로컬 모델(Edge 환경)로 교체 가능한지 검증
- 인터넷 없는 환경 또는 비용 절감이 필요한 시나리오 대응

### 후보 모델

| 모델 | 파라미터 | 특징 |
|------|----------|------|
| SQLCoder-7B (Defog) | 7B | NL2SQL 특화 파인튜닝 |
| Qwen2.5-Coder-7B | 7B | 코드/SQL 생성 강점 |
| Llama-3.1-8B-Instruct | 8B | 범용 인스트럭션 모델 |
| GPT-4o-mini | - | OpenAI 경량 버전 (비용 절감) |

### 세부 작업

#### 5.1 모델 교체 인터페이스 설계
- [ ] `config.py`에 `LLM_PROVIDER` 설정 추가 (`openai` / `ollama` / `huggingface`)
- [ ] `agent/sql_generator.py`에 provider 추상화 레이어 추가
- [ ] Ollama 로컬 서버 연동 구현

#### 5.2 후보 모델 성능 비교
- [ ] 4.1에서 구축한 테스트셋으로 각 모델 EX 측정
- [ ] 응답시간 및 메모리 사용량 비교
- [ ] 한국어 질의 처리 품질 비교

#### 5.3 모델별 프롬프트 최적화
- [ ] GPT-4o 최적 프롬프트 vs 로컬 모델 프롬프트 차이 분석
- [ ] 로컬 모델 전용 프롬프트 템플릿 작성

### 산출물
- Edge 모델 검증 보고서 (`edge_model_report.md`)
- 모델 교체 설정 가이드

---

## 6. 개발 검증 설계 및 지속 평가 체계 구축

> **기간**: 2주 (2026-08-18 ~ 2026-08-31)

### 목표
- 전체 시스템 통합 테스트 및 안정성 검증
- 실 서비스 배포 준비

### 세부 작업

#### 6.1 통합 테스트
- [ ] End-to-End 시나리오 테스트 (자연어 입력 → Athena 결과 반환)
- [ ] 엣지 케이스 테스트
  - 스키마에 없는 테이블 질의
  - 모호한 자연어 질의
  - 매우 복잡한 다중 조인 질의
  - 한국어/영어 혼용 질의
- [ ] 부하 테스트 (동시 요청 10~50건)

#### 6.2 보안 검토
- [ ] SQL Injection 방어 검토 (LLM 생성 SQL의 위험성)
- [ ] AWS IAM 최소 권한 원칙 적용 확인
- [ ] API 인증(API Key / JWT) 구현 여부 결정
- [ ] 민감 데이터 컬럼 쿼리 차단 정책 구현

#### 6.3 운영 환경 구성
- [ ] Docker 컨테이너화 (`Dockerfile`, `docker-compose.yml`)
- [ ] AWS ECS 또는 EC2 배포 설정
- [ ] CloudWatch 로깅 및 알람 설정
- [ ] 환경변수 관리 (AWS Secrets Manager 연동)

#### 6.4 최종 성능 개선
- [ ] 6.1 테스트 결과 기반 약점 케이스 집중 개선
- [ ] 최종 성능 지표 측정 및 문서화

#### 6.5 사용자 가이드 작성
- [ ] API 사용 가이드 (`api_guide.md`)
- [ ] 스키마 등록/갱신 운영 가이드
- [ ] 트러블슈팅 가이드

### 산출물
- 최종 통합 테스트 보고서
- 배포 패키지 (Docker 이미지, 배포 스크립트)
- 운영 문서 일체

---

## 기술 스택 요약

| 영역 | 기술 |
|------|------|
| LLM | OpenAI GPT-4o |
| 에이전트 프레임워크 | 커스텀 (+ LangChain 선택적) |
| 데이터베이스 | AWS Athena (Presto/Trino SQL) |
| 스키마 메타데이터 | AWS Glue Data Catalog |
| 벡터 스토어 | ChromaDB |
| SQL 검증 | sqlglot |
| API 서버 | FastAPI + Uvicorn |
| AWS SDK | boto3 |
| 컨테이너 | Docker |
| 테스트 | pytest |

---

## 리스크 관리

| 리스크 | 가능성 | 영향도 | 대응방안 |
|--------|--------|--------|----------|
| Athena SQL 방언 불일치 | 높음 | 높음 | sqlglot Athena dialect 활용, 전용 Few-shot 강화 |
| GPT-4o 토큰 비용 초과 | 중간 | 중간 | 스키마 컨텍스트 압축, 캐싱 적용 |
| 복잡 쿼리 생성 실패 | 중간 | 높음 | 자기 수정 루프, 질의 분해 전략 |
| 한국어 질의 품질 저하 | 낮음 | 중간 | 한국어 Few-shot 예시 확충 |
| Athena 쿼리 비용 폭증 | 낮음 | 높음 | 쿼리 비용 사전 추정 경고, LIMIT 강제 삽입 |
