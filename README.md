# Project Wallet

개인 자산 관리와 그룹 지갑 운영을 함께 고려한 자산 관리 웹 서비스입니다.

사용자는 계좌를 등록하고, 수입/지출 거래 내역을 관리하며, 월별·카테고리별 통계를 확인할 수 있습니다.  
현재 프로젝트는 백엔드 인증 구조, 사용자별 데이터 접근 제어, 거래 내역과 계좌 잔액 정합성 유지를 중심으로 구현되어 있으며,  
이후에는 Workspace 기반 SaaS 구조, 외부 계좌 동기화, AI 기반 소비 분석 및 카드 추천으로 확장할 계획입니다.

---

## 목차

1. [서비스 개요](#1-서비스-개요)
2. [현재 제공 기능](#2-현재-제공-기능)
3. [확장 예정 기능](#3-확장-예정-기능)
4. [사용자 흐름](#4-사용자-흐름)
5. [기술 스택](#5-기술-스택)
6. [핵심 구현 방식](#6-핵심-구현-방식)
7. [데이터 관계 요약](#7-데이터-관계-요약)
8. [향후 SaaS 확장 구조](#8-향후-saas-확장-구조)
9. [향후 외부 계좌 동기화 구조](#9-향후-외부-계좌-동기화-구조)
10. [향후 AI 기반 소비 분석 / 카드 추천](#10-향후-ai-기반-소비-분석--카드-추천)
11. [향후 구독 / PG 확장 방향](#11-향후-구독--pg-확장-방향)
12. [프로젝트 구조](#12-프로젝트-구조)
13. [API 목록](#13-api-목록)
14. [실행 방법](#14-실행-방법)
15. [데이터베이스 확인 명령어](#15-데이터베이스-확인-명령어)
16. [현재 개발 상태](#16-현재-개발-상태)
17. [진행 예정](#17-진행-예정)
18. [개발 로드맵](#18-개발-로드맵)
19. [관련 문서](#19-관련-문서)
20. [개발 방향](#20-개발-방향)

---

## 1. 서비스 개요

`Project Wallet`은 단순 가계부 CRUD를 넘어, 개인과 소규모 그룹이 자산 흐름을 관리할 수 있는 서비스로 확장하는 것을 목표로 합니다.

서비스 방향은 다음과 같습니다.

```text
개인 자산 관리
→ 그룹 지갑 / Workspace 기반 자산 관리
→ 외부 계좌 동기화
→ 소비 패턴 분석
→ 카드 추천 / 예산 관리 제안
→ 구독형 SaaS
```

---

## 2. 현재 제공 기능

### 인증

- 로컬 회원가입
- 로컬 로그인
- bcrypt 기반 비밀번호 해싱
- JWT Access Token 발급
- Access Token payload type 검증
- Access Token 기반 현재 로그인 사용자 조회
- Redis 기반 Refresh Token 저장
- Refresh Token 기반 Access Token 재발급
- Refresh Token Rotation 적용
- 토큰 재발급 시 기존 Refresh Token 폐기
- 로그아웃 시 Redis Refresh Token 삭제
- 로그아웃 시 Access Token blacklist 등록
- 로그아웃된 Access Token 재사용 차단
- 현재 로그인 사용자 기준 API 접근 제어
- 인증 예외 메시지 상수화

### 계좌 관리

- 계좌 등록
- 계좌 목록 조회
- 계좌 상세 조회
- 계좌 수정
- 계좌 삭제
- 계좌별 잔액 관리
- 현재 로그인 사용자 계좌만 접근 가능
- 계좌 생성 시 `member_id` 직접 입력 제거

### 카테고리 관리

- 수입/지출 카테고리 등록
- 카테고리 목록 조회
- 카테고리 상세 조회
- 카테고리 수정
- 카테고리 삭제
- 현재 로그인 사용자 카테고리만 접근 가능
- 카테고리 생성 시 `member_id` 직접 입력 제거

### 거래 내역 관리

- 수입 거래 등록
- 지출 거래 등록
- 거래 목록 조회
- 거래 상세 조회
- 거래 수정
- 거래 삭제
- 현재 로그인 사용자의 계좌에 속한 거래만 접근 가능
- 거래 생성/수정/삭제 시 계좌 잔액 자동 반영
- 거래 유형과 카테고리 유형 일치 검증
- 거래 금액이 0 이하인 경우 예외 처리

### 통계

- 현재 로그인 사용자 기준 전체 계좌 잔액 합계
- 현재 로그인 사용자 기준 이번 달 수입 합계
- 현재 로그인 사용자 기준 이번 달 지출 합계
- 현재 로그인 사용자 기준 월별 수입/지출 통계
- 현재 로그인 사용자 기준 카테고리별 수입/지출 통계
- 카테고리 통계 `type=INCOME`, `type=EXPENSE` 필터 지원
- 통계 API 응답 모델 적용

### 프론트엔드 화면

- 공통 Header / Footer 레이아웃
- 메인 페이지 섹션 구성
- 광고 영역
- 로그인 안내 영역
- 자산 리포트 영역
- 메인 이벤트 / 서브 이벤트 / 기타 이벤트 영역
- 공지사항 영역
- 고객센터 링크 영역
- 정보성 콘텐츠 영역
- 개인 지갑 / 그룹 지갑 / 커뮤니티 / 통계 페이지 라우팅 기반 구성
- 통계 페이지 월별 수입·지출 차트 기반 구성

---

## 3. 확장 예정 기능

현재 프로젝트는 개인 자산 관리 기능을 기반으로 SaaS형 서비스로 확장할 계획입니다.

### SaaS / Workspace

- Workspace 기반 개인/그룹 지갑 구조
- Workspace 멤버 관리
- Workspace 역할 기반 권한 관리
- 개인 지갑과 그룹 지갑을 같은 도메인 모델로 관리
- 향후 요금제별 기능 제한 적용

### 외부 계좌 동기화

- Mock Bank Provider 기반 계좌 연결 구조
- 외부 거래 ID 기준 중복 저장 방지
- 사용자가 편집한 메모/카테고리 보존
- 실제 마이데이터 / 오픈뱅킹 연동 가능성을 고려한 provider 구조 설계

### AI 소비 분석 / 카드 추천

- 월별 소비 리포트 생성
- 카테고리별 소비 패턴 분석
- 전월 대비 지출 증감률 계산
- 카드 혜택 기반 예상 절약액 계산
- LLM API 기반 자연어 리포트 생성
- 소비 패턴 기반 예산 관리 제안 / 과소비 경고

### 구독 / PG

- FREE / PRO / TEAM 요금제 구조
- 구독 상태에 따른 기능 제한
- 자동 계좌 동기화 / AI 리포트 / 그룹 지갑 기능 유료화 검토
- PG 결제 및 webhook 기반 결제 이벤트 처리

---

## 4. 사용자 흐름

### 4.1 현재 사용자 흐름

```text
회원가입
→ 로그인
→ Access Token / Refresh Token 발급
→ 계좌 등록
→ 카테고리 등록
→ 수입/지출 거래 등록
→ 계좌 잔액 자동 반영
→ 월별 / 카테고리별 통계 확인
→ 로그아웃
```

### 4.2 인증 흐름

```text
회원가입
→ 비밀번호 bcrypt 해싱
→ members / local_members 저장

로그인
→ 이메일 및 비밀번호 검증
→ JWT Access Token 발급
→ Refresh Token 생성
→ Redis 저장

토큰 재발급
→ Refresh Token 검증
→ Redis 저장값 비교
→ 기존 Refresh Token 폐기
→ 새 Access Token 발급
→ 새 Refresh Token 발급
→ Redis 저장

로그아웃
→ 현재 사용자 확인
→ Redis Refresh Token 삭제
→ Access Token 남은 만료 시간 계산
→ Redis blacklist 등록
```

### 4.3 거래 관리 흐름

```text
계좌 생성
→ 카테고리 생성
→ 거래 등록
→ 거래 유형 확인
→ 카테고리 유형 일치 여부 확인
→ 계좌 잔액 반영
→ 거래 목록 / 통계 조회
```

### 4.4 향후 Workspace 흐름

```text
회원가입
→ 기본 개인 Workspace 자동 생성
→ 개인 지갑 사용

그룹 지갑 생성
→ 멤버 추가
→ 역할 부여
→ 그룹 계좌 / 거래 / 통계 공유
```

### 4.5 향후 외부 계좌 동기화 흐름

```text
사용자가 계좌 연결
→ AccountConnection 저장
→ Mock Bank Provider 또는 실제 금융 API에서 거래 내역 조회
→ external_transaction_id 기준 중복 저장 방지
→ transactions에 신규 거래 저장
→ 계좌 잔액 갱신
→ 통계 자동 반영
```

### 4.6 향후 AI 추천 흐름

```text
거래 내역 집계
→ 카테고리별 소비 패턴 분석
→ 전월 대비 증감률 계산
→ 카드 혜택 / 예산 기준 추천 후보 계산
→ LLM API로 자연어 리포트 생성
→ 사용자에게 카드 추천 / 자산 관리 추천 제공
```

LLM은 직접 금융 판단을 하는 역할이 아닌, 백엔드가 계산한 근거 데이터를 사용자에게 이해하기 쉬운 문장으로 설명하는 역할로 사용할 계획입니다.

---

## 5. 기술 스택

### Backend

| 구분             | 기술                        |
| ---------------- | --------------------------- |
| Language         | Python 3.12                 |
| Framework        | FastAPI                     |
| Server           | Uvicorn                     |
| Database         | MySQL                       |
| Database Access  | SQLAlchemy ORM / Native SQL |
| Auth             | JWT                         |
| Token Storage    | Redis                       |
| Password Hashing | passlib / bcrypt            |
| Validation       | Pydantic                    |
| Environment      | python-dotenv               |
| API Docs         | Swagger UI                  |

### Frontend

| 구분       | 기술              |
| ---------- | ----------------- |
| Language   | JavaScript        |
| Framework  | React 18          |
| Routing    | React Router      |
| Styling    | styled-components |
| Chart      | Recharts          |
| Build Tool | Create React App  |

### 확장 검토

| 구분                  | 후보                                     |
| --------------------- | ---------------------------------------- |
| External Account Sync | Mock Bank Provider, 마이데이터, 오픈뱅킹 |
| AI Report             | LLM API                                  |
| Payment               | PG 결제 API                              |
| SaaS Billing          | Plan, Subscription, Payment, Webhook     |
| Test                  | pytest, httpx                            |

---

## 6. 핵심 구현 방식

## 6.1 Access Token

Access Token은 JWT로 발급합니다.

Payload 예시:

```text
sub: 회원 ID
email: 사용자 이메일
member_type: 회원 유형
type: access
exp: 만료 시간
```

인증이 필요한 요청은 다음 헤더를 사용합니다.

```http
Authorization: Bearer <access_token>
```

Access Token 검증 기준:

- JWT 서명 검증
- 만료 시간 검증
- `type=access` 확인
- Redis blacklist 등록 여부 확인
- `sub` 기준 현재 회원 조회

---

## 6.2 Refresh Token

Refresh Token은 JWT가 아니라 `secrets.token_urlsafe(64)`로 생성한 랜덤 문자열입니다.

Redis 저장 구조:

```text
refresh_token:{member_id} -> latest_refresh_token
refresh_token_value:{refresh_token} -> member_id
```

Refresh Token은 Redis TTL로 만료 시간을 관리합니다.

```text
TTL = REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
```

---

## 6.3 Refresh Token Rotation

`POST /api/auth/reissue` 호출 시 기존 Refresh Token을 그대로 재사용하지 않습니다.

```text
Refresh Token 수신
→ refresh_token_value:{refresh_token}으로 member_id 조회
→ refresh_token:{member_id}에 저장된 최신 Refresh Token과 비교
→ 기존 Refresh Token reverse key 삭제
→ 새 Access Token 발급
→ 새 Refresh Token 발급
→ 새 Refresh Token Redis 저장
→ 새 Access Token과 새 Refresh Token 반환
```

이 구조는 탈취된 이전 Refresh Token의 재사용을 차단하기 위한 방식입니다.

---

## 6.4 Access Token Blacklist

로그아웃 시 Access Token을 Redis blacklist에 저장합니다.

```text
blacklist:access_token:{access_token} -> member_id
```

blacklist TTL은 Access Token의 남은 만료 시간으로 설정합니다.

```text
TTL = Access Token exp - 현재 시각
```

따라서 Access Token이 원래 만료될 시점 이후에는 blacklist key도 자동으로 삭제됩니다.

---

## 6.5 현재 로그인 사용자 기준 데이터 처리

계좌, 카테고리, 거래, 통계 API는 모두 JWT에서 추출한 현재 로그인 사용자 기준으로 동작합니다.

```text
Authorization: Bearer <access_token>
→ JWT 검증
→ current_member.id 추출
→ 해당 사용자 데이터만 조회/생성/수정/삭제
```

사용자가 요청 body에 `member_id`를 직접 넣지 않습니다. 서버가 현재 로그인 사용자를 기준으로 데이터를 생성하고 조회합니다.

---

## 6.6 거래 소유자 확인

`transactions`에는 `member_id`를 직접 저장하지 않습니다.

거래 소유자는 다음 관계로 확인합니다.

```text
transactions.account_id
→ accounts.id
→ accounts.member_id
```

---

## 6.7 거래와 계좌 잔액 정합성

### 거래 등록 시 잔액 반영

| 거래 유형 | 처리           |
| --------- | -------------- |
| `INCOME`  | 계좌 잔액 증가 |
| `EXPENSE` | 계좌 잔액 감소 |

### 거래 수정 시 잔액 재계산

거래 수정 시에는 기존 거래를 먼저 잔액에서 되돌린 뒤, 수정된 거래 정보를 다시 반영합니다.

```text
초기 잔액: 100000
기존 거래: EXPENSE 12000
수정 거래: EXPENSE 20000

처리 흐름:
88000 + 12000 = 100000
100000 - 20000 = 80000
```

### 거래 삭제 시 잔액 복구

```text
EXPENSE 삭제 → 잔액 증가
INCOME 삭제 → 잔액 감소
```

### 거래 유형과 카테고리 유형 검증

```text
INCOME 거래 → INCOME 카테고리만 사용 가능
EXPENSE 거래 → EXPENSE 카테고리만 사용 가능
```

거래 금액이 0 이하인 경우에도 예외를 반환합니다.

---

## 7. 데이터 관계 요약

```text
members
├── local_members
├── oauth_members
├── accounts
│   └── transactions
└── categories
```

- `members`는 회원의 공통 정보를 저장합니다.
- `local_members`는 로컬 로그인 회원의 비밀번호 해시를 저장합니다.
- `oauth_members`는 OAuth 로그인 확장을 위한 소셜 계정 정보를 저장할 예정입니다.
- `accounts.member_id`로 계좌 소유자를 구분합니다.
- `categories.member_id`로 카테고리 소유자를 구분합니다.
- `transactions`에는 `member_id`를 직접 저장하지 않습니다.
- 거래 소유자는 `transactions.account_id → accounts.id → accounts.member_id` 관계로 확인합니다.
- 거래 생성 시 `account_id`와 `category_id`가 모두 현재 로그인 사용자 소유인지 검증합니다.
- 통계 API는 `transactions`와 `accounts`를 조인하여 현재 로그인 사용자 데이터만 집계합니다.

---

## 8. 향후 SaaS 확장 구조

현재는 `member_id` 기준 데이터 분리를 사용하지만, SaaS 구조로 확장할 경우 `workspace_id` 기반 데이터 분리로 확장할 계획입니다.

### Workspace 개념

```text
member
├── 개인 Workspace
├── 그룹 Workspace
└── 프리랜서 / 소규모 팀 Workspace
```

### 추가 예정 테이블

```text
workspaces
workspace_members
```

### Workspace Role

| Role   | 설명                                    |
| ------ | --------------------------------------- |
| OWNER  | Workspace 생성자, 삭제와 멤버 관리 가능 |
| ADMIN  | 계좌, 거래, 카테고리 관리 가능          |
| MEMBER | 거래 등록과 조회 가능                   |
| VIEWER | 조회만 가능                             |

### Workspace 기준 데이터 처리

```text
현재 로그인 사용자
→ workspace_members에서 소속 여부 확인
→ role 확인
→ workspace_id 기준 계좌/카테고리/거래/통계 조회
```

이 구조를 통해 개인 지갑과 그룹 지갑을 같은 도메인 모델 안에서 처리할 수 있습니다.

---

## 9. 향후 외부 계좌 동기화 구조

실제 마이데이터나 오픈뱅킹 API를 바로 붙이기 전에, 먼저 Mock Bank Provider 기반 동기화 구조를 구현할 계획입니다.

### 목표

```text
사용자가 최초 계좌 연결
→ 이후 거래 내역 자동 동기화
→ 사용자는 memo/category만 보정
→ 통계 자동 갱신
```

### 추가 예정 테이블

```text
account_connections
account_sync_logs
```

### transactions 확장 예정 필드

```text
transaction_source: MANUAL | BANK_SYNC
external_transaction_id
sync_source
original_memo
synced_at
```

### 동기화 정책

- `external_transaction_id` 기준 중복 저장 방지
- 외부 원본 거래와 사용자 편집 데이터를 분리
- 사용자가 수정하는 `memo`, `category_id`는 재동기화 시 덮어쓰지 않음
- 연동 거래의 금액, 날짜, 거래 유형은 원본 정합성을 위해 수정 제한
- 연동 계좌 잔액은 외부 API의 잔액을 기준으로 갱신

---

## 10. 향후 AI 기반 소비 분석 / 카드 추천

사용자 거래 내역을 기반으로 소비 패턴을 분석하고, 카드 추천 또는 자산 관리 추천 기능을 제공할 계획입니다.

### 핵심 원칙

LLM API는 추천 판단을 직접 수행하는 역할이 아니라, 백엔드가 계산한 분석 결과와 추천 근거를 사용자에게 이해하기 쉬운 자연어로 설명하는 역할로 사용합니다.

```text
거래 데이터
→ 백엔드 집계 / 분석
→ 추천 후보 계산
→ LLM 자연어 요약
→ 사용자 리포트 제공
```

### 소비 분석 예시

- 월별 수입/지출 추이
- 카테고리별 지출 비중
- 전월 대비 지출 증가율
- 고정비 추정
- 반복 지출 탐지
- 과소비 카테고리 탐지
- 저축 가능 금액 추정

### 카드 추천 예시

```text
카테고리별 소비 금액
+ 카드 혜택 조건
→ 예상 월 혜택 계산
→ 추천 점수 산출
→ LLM이 추천 사유 설명
```

### 추가 예정 테이블

```text
spending_reports
spending_report_items
recommendations
card_products
card_benefits
```

### 개인정보 처리 원칙

LLM API에는 원본 거래 내역 전체를 보내지 않습니다.

보내지 않을 정보:

- 계좌번호
- 이메일
- 실명
- 전화번호
- 주소
- 거래 메모 원문 전체
- 카드번호

전송 가능한 형태:

- 카테고리별 월 합계
- 전월 대비 증감률
- 상위 지출 카테고리
- 반복 지출 추정 결과
- 익명화된 요약 데이터

---

## 11. 향후 구독 / PG 확장 방향

PG 결제는 현재 우선순위가 낮지만, SaaS 기능이 구체화되면 확장할 수 있습니다.

### 요금제 예시

| 기능                |   FREE |        PRO |        TEAM |
| ------------------- | -----: | ---------: | ----------: |
| 수동 거래 입력      |   가능 |       가능 |        가능 |
| 기본 통계           |   가능 |       가능 |        가능 |
| 월간 AI 소비 리포트 | 월 1회 |     무제한 |      무제한 |
| 카드 추천           | 월 1회 |       가능 |        가능 |
| 자동 계좌 동기화    |   불가 |   계좌 3개 |   계좌 10개 |
| 그룹 지갑           |   불가 |        3개 |      무제한 |
| 멤버 초대           |   불가 | 그룹당 3명 | 그룹당 20명 |

### 추가 예정 테이블

```text
plans
subscriptions
payments
payment_events
```

### 결제 흐름

```text
사용자 요금제 선택
→ PG 결제 요청
→ 결제 성공 콜백 / webhook 수신
→ payment_events 저장
→ subscriptions 갱신
→ 유료 기능 활성화
```

---

## 12. 프로젝트 구조

```text
project_wallet/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── database/
│   │   ├── dependencies/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── docs/
│   │   └── auth-plan.md
│   │
│   ├── .env.example
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── routes/
│       ├── styles/
│       ├── App.js
│       └── index.js
│
├── .gitattributes
├── .gitignore
└── README.md
```

---

## 13. API 목록

### Auth API

| Method | URL                 | 인증   | 설명                                                      |
| ------ | ------------------- | ------ | --------------------------------------------------------- |
| POST   | `/api/auth/signup`  | 불필요 | 로컬 회원가입                                             |
| POST   | `/api/auth/login`   | 불필요 | 로컬 로그인 및 토큰 발급                                  |
| GET    | `/api/auth/me`      | 필요   | 현재 로그인 사용자 조회                                   |
| POST   | `/api/auth/reissue` | 불필요 | Refresh Token 기반 Access Token 재발급                    |
| POST   | `/api/auth/logout`  | 필요   | 로그아웃, Refresh Token 삭제, Access Token blacklist 등록 |

### Account API

| Method | URL                          | 인증 | 설명                       |
| ------ | ---------------------------- | ---- | -------------------------- |
| GET    | `/api/accounts`              | 필요 | 현재 사용자 계좌 목록 조회 |
| GET    | `/api/accounts/{account_id}` | 필요 | 현재 사용자 계좌 상세 조회 |
| POST   | `/api/accounts`              | 필요 | 현재 사용자 계좌 등록      |
| PATCH  | `/api/accounts/{account_id}` | 필요 | 현재 사용자 계좌 수정      |
| DELETE | `/api/accounts/{account_id}` | 필요 | 현재 사용자 계좌 삭제      |

### Category API

| Method | URL                             | 인증 | 설명                           |
| ------ | ------------------------------- | ---- | ------------------------------ |
| GET    | `/api/categories`               | 필요 | 현재 사용자 카테고리 목록 조회 |
| GET    | `/api/categories/{category_id}` | 필요 | 현재 사용자 카테고리 상세 조회 |
| POST   | `/api/categories`               | 필요 | 현재 사용자 카테고리 등록      |
| PATCH  | `/api/categories/{category_id}` | 필요 | 현재 사용자 카테고리 수정      |
| DELETE | `/api/categories/{category_id}` | 필요 | 현재 사용자 카테고리 삭제      |

### Transaction API

| Method | URL                                  | 인증 | 설명                       |
| ------ | ------------------------------------ | ---- | -------------------------- |
| GET    | `/api/transactions`                  | 필요 | 현재 사용자 거래 목록 조회 |
| GET    | `/api/transactions/{transaction_id}` | 필요 | 현재 사용자 거래 상세 조회 |
| POST   | `/api/transactions`                  | 필요 | 현재 사용자 거래 등록      |
| PATCH  | `/api/transactions/{transaction_id}` | 필요 | 현재 사용자 거래 수정      |
| DELETE | `/api/transactions/{transaction_id}` | 필요 | 현재 사용자 거래 삭제      |

### Statistics API

| Method | URL                                     | 인증 | 설명                                       |
| ------ | --------------------------------------- | ---- | ------------------------------------------ |
| GET    | `/api/statistics/summary`               | 필요 | 현재 사용자 요약 통계 조회                 |
| GET    | `/api/statistics/monthly`               | 필요 | 현재 사용자 월별 수입/지출 통계 조회       |
| GET    | `/api/statistics/category`              | 필요 | 현재 사용자 카테고리별 수입/지출 통계 조회 |
| GET    | `/api/statistics/category?type=INCOME`  | 필요 | 현재 사용자 수입 카테고리 통계 조회        |
| GET    | `/api/statistics/category?type=EXPENSE` | 필요 | 현재 사용자 지출 카테고리 통계 조회        |

---

## 14. 실행 방법

### Backend 실행

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

`.env.example`을 참고하여 `.env` 파일을 생성합니다.

```env
DATABASE_URL=mysql+pymysql://root:1234@localhost:3306/wallet_db
SECRET_KEY=dev-local-secret-change-later
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=14

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=1234
REDIS_DB=0
```

MySQL 데이터베이스를 생성합니다.

```bash
mysql -uroot -p1234 -e "CREATE DATABASE IF NOT EXISTS wallet_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

Redis 컨테이너를 실행합니다.

```bash
docker start redis-dev
```

백엔드 서버를 실행합니다.

```bash
uvicorn app.main:app --reload
```

Swagger UI는 아래 주소에서 확인할 수 있습니다.

```text
http://localhost:8000/docs
```

### Frontend 실행

```bash
cd frontend
npm install
npm start
```

프론트엔드 개발 서버는 기본적으로 아래 주소에서 실행됩니다.

```text
http://localhost:3000
```

---

## 15. 데이터베이스 확인 명령어

```bash
mysql -uroot -p1234 -D wallet_db -e "SHOW TABLES;"
mysql -uroot -p1234 -D wallet_db -e "SELECT * FROM members;"
mysql -uroot -p1234 -D wallet_db -e "SELECT * FROM local_members;"
mysql -uroot -p1234 -D wallet_db -e "SELECT * FROM accounts;"
mysql -uroot -p1234 -D wallet_db -e "SELECT * FROM categories;"
mysql -uroot -p1234 -D wallet_db -e "SELECT * FROM transactions;"
```

### 사용자별 거래 확인

```bash
mysql -uroot -p1234 -D wallet_db -e "
SELECT
    t.id,
    a.member_id,
    t.account_id,
    t.category_id,
    t.transaction_type,
    t.amount,
    t.memo
FROM transactions t
JOIN accounts a ON t.account_id = a.id
ORDER BY t.id;
"
```

### Redis 확인

```bash
docker exec -it redis-dev redis-cli
```

```redis
AUTH 1234
KEYS refresh_token*
KEYS blacklist:access_token*
```

---

## 16. 현재 개발 상태

### 구현 완료

#### Backend

- FastAPI 백엔드 기본 구조
- MySQL 연결 설정
- SQLAlchemy 모델 정의
- 로컬 회원가입 API
- 로컬 로그인 API
- bcrypt 비밀번호 해싱
- JWT Access Token 발급 및 검증
- Access Token type 검증
- Redis 기반 Refresh Token 저장
- Refresh Token 기반 Access Token 재발급 API
- Refresh Token Rotation 적용
- 토큰 재발급 시 기존 Refresh Token 폐기
- 로그아웃 API
- 로그아웃 시 Redis Refresh Token 삭제
- 로그아웃 시 Access Token blacklist 등록
- 로그아웃된 Access Token 재사용 차단
- 현재 로그인 사용자 조회 API
- 계좌 CRUD API
- 카테고리 CRUD API
- 거래 CRUD API
- 현재 로그인 사용자 기준 계좌/카테고리/거래 접근 제어
- 거래 생성/수정/삭제 시 계좌 잔액 정합성 처리
- 거래 유형과 카테고리 유형 일치 검증
- 거래 금액 0 이하 예외 처리
- 현재 로그인 사용자 기준 요약 통계 API
- 현재 로그인 사용자 기준 월별 수입/지출 통계 API
- 현재 로그인 사용자 기준 카테고리별 수입/지출 통계 API
- 공통 메시지 응답 모델 분리
- 통계 API 응답 모델 적용
- 예외 메시지 상수화
- Swagger 기반 주요 API 수동 검증

#### Frontend

- CRA 기반 React 프로젝트 구성
- React Router 기반 라우팅 구성
- 공통 MainLayout 구성
- Header / Footer 레이아웃 구성
- 메인 페이지 섹션 구성
- 광고 / 로그인 안내 / 리포트 / 이벤트 / 공지사항 / 정보 영역 구성
- 개인 지갑 / 그룹 지갑 / 커뮤니티 / 통계 페이지 라우팅 구성
- Recharts 기반 월별 통계 차트 컴포넌트 구성
- NotFound 페이지 구성

---

## 17. 진행 예정

### Backend

- 자동 테스트 추가
- Workspace 기반 개인/그룹 지갑 구조
- Workspace 권한 관리
- Mock Bank Provider 기반 계좌 동기화
- 거래 내역 기반 소비 패턴 분석
- 카드 추천 scoring
- LLM API 기반 추천 리포트 생성
- OAuth 로그인 API
- 콘텐츠 API 구현
- 광고 / 이벤트 / 공지사항 / 정보성 게시글 API 연동
- 구독 / PG 결제 연동 검토

### Frontend

- 백엔드 API 연동
- 로그인/회원가입 화면 구현
- JWT 인증 흐름 연동
- 계좌 목록/등록/수정/삭제 화면 구현
- 카테고리 목록/등록/수정/삭제 화면 구현
- 거래 목록/등록/수정/삭제 화면 구현
- 통계 API 기반 차트 데이터 연동
- Workspace 선택 UI
- AI 소비 리포트 화면
- 카드 추천 화면
- 상세 페이지 라우트 구현
- placeholder 데이터 제거

---

## 18. 개발 로드맵

| Phase | 작업                                                       |
| ----: | ---------------------------------------------------------- |
|     1 | Workspace 기반 SaaS 구조 설계                              |
|     2 | Workspace / WorkspaceMember 모델 추가                      |
|     3 | 기존 계좌·카테고리·거래·통계 API를 Workspace 기준으로 확장 |
|     4 | 그룹 지갑 API 추가                                         |
|     5 | Mock Bank Provider 기반 계좌 동기화 구조 구현              |
|     6 | AI 기반 소비 분석 / 카드 추천 기능 구현                    |
|     7 | 백엔드 자동 테스트 추가                                    |
|     8 | 프론트엔드 API 연동                                        |
|     9 | 구독 / PG 결제 확장                                        |

---

## 19. 관련 문서

- `backend/README.md`: 백엔드 실행 방법과 API 상세 정리
- `backend/docs/auth-plan.md`: 인증 구현 및 검증 정리

---

## 20. 개발 방향

현재 단계에서는 프론트엔드 API 연동보다 백엔드 도메인 구조 확장을 우선합니다.

Workspace, 외부 계좌 동기화, 소비 분석 API 구조를 먼저 정리한 뒤 프론트엔드와 단계적으로 연결할 계획입니다.

특히 거래 내역과 계좌 잔액이 어긋나지 않도록, 거래 생성·수정·삭제 시 잔액 변경 흐름을 백엔드에서 처리합니다.

인증 이후에는 사용자가 직접 `member_id`를 입력하지 않고, JWT에서 현재 로그인 사용자를 식별하여 계좌·카테고리·거래·통계 데이터를 사용자별로 분리합니다.

향후에는 Workspace 기반으로 개인 지갑과 그룹 지갑을 함께 지원하고, 외부 계좌 동기화와 AI 기반 소비 분석 기능을 추가해 개인 자산 관리 SaaS 형태로 확장할 계획입니다.
