# 개인 자산 관리 서비스

개인 자산 흐름을 관리하기 위한 웹 애플리케이션입니다.

사용자는 계좌를 등록하고, 수입/지출 거래 내역을 기록하며, 계좌 잔액과 월별·카테고리별 통계를 확인할 수 있습니다.

## 프로젝트 개요

이 프로젝트는 단순 가계부 CRUD를 넘어서, 금융 서비스에서 중요한 **회원별 데이터 격리**, **거래 내역과 계좌 잔액의 정합성**, **JWT 기반 인증 흐름**을 직접 구현하는 것을 목표로 합니다.

현재 백엔드는 FastAPI 기반으로 회원가입, 로컬 로그인, JWT Access Token, Redis 기반 Refresh Token, 로그아웃, 토큰 재발급, 현재 로그인 사용자 기준 계좌·카테고리·거래·통계 API가 구현되어 있습니다.

프론트엔드는 React 기반으로 공통 레이아웃, 메인 페이지 섹션, 주요 페이지 라우팅, 통계 차트 화면의 기반이 구성되어 있습니다. 이후 백엔드 API와 단계적으로 연동할 예정입니다.

## 기술 스택

### Frontend

| 구분 | 기술 |
| --- | --- |
| Language | JavaScript |
| Framework | React 18 |
| Routing | React Router |
| Styling | styled-components |
| Chart | Recharts |
| Build Tool | Create React App |

### Backend

| 구분 | 기술 |
| --- | --- |
| Language | Python 3.12 |
| Framework | FastAPI |
| Server | Uvicorn |
| Database | MySQL |
| Database Access | SQLAlchemy ORM / Native SQL |
| Auth | JWT |
| Token Storage | Redis |
| Validation | Pydantic |
| Environment | python-dotenv |
| API Docs | Swagger UI |

## 주요 기능

### 인증

- 로컬 회원가입
- 로컬 로그인
- 비밀번호 bcrypt 해싱
- JWT Access Token 발급
- Access Token 기반 현재 로그인 사용자 조회
- Redis 기반 Refresh Token 저장
- Refresh Token 기반 Access Token 재발급
- 로그아웃 시 Redis Refresh Token 삭제
- Access Token payload type 검증
- 현재 로그인 사용자 기준 API 접근 제어

### 계좌 관리

- 계좌 등록
- 계좌 목록 조회
- 계좌 상세 조회
- 계좌 수정
- 계좌 삭제
- 계좌별 잔액 관리
- 현재 로그인 사용자 계좌만 조회 가능
- 계좌 생성 시 `member_id` 직접 입력 제거

### 카테고리 관리

- 수입/지출 카테고리 등록
- 카테고리 목록 조회
- 카테고리 상세 조회
- 카테고리 수정
- 카테고리 삭제
- 현재 로그인 사용자 카테고리만 조회 가능
- 카테고리 생성 시 `member_id` 직접 입력 제거

### 거래 내역 관리

- 수입 거래 등록
- 지출 거래 등록
- 거래 목록 조회
- 거래 상세 조회
- 거래 수정
- 거래 삭제
- 거래 생성/수정/삭제 시 계좌 잔액 자동 반영
- 현재 로그인 사용자의 계좌에 속한 거래만 접근 가능
- 거래 유형과 카테고리 유형 일치 검증

### 통계

- 현재 로그인 사용자 기준 전체 계좌 잔액 합계
- 현재 로그인 사용자 기준 이번 달 수입 합계
- 현재 로그인 사용자 기준 이번 달 지출 합계
- 현재 로그인 사용자 기준 월별 수입/지출 통계
- 현재 로그인 사용자 기준 카테고리별 수입/지출 통계
- 카테고리 통계 `type=INCOME`, `type=EXPENSE` 필터 지원

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

## 핵심 비즈니스 로직

### 인증 흐름

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
→ 새 Access Token 발급

로그아웃
→ 현재 사용자 확인
→ Redis Refresh Token 삭제
```

### 현재 로그인 사용자 기준 데이터 처리

계좌, 카테고리, 거래, 통계 API는 모두 JWT에서 추출한 현재 로그인 사용자 기준으로 동작합니다.

```text
Authorization: Bearer <access_token>
→ JWT 검증
→ current_member.id 추출
→ 해당 사용자 데이터만 조회/생성/수정/삭제
```

### 거래 등록 시 잔액 반영

| 거래 유형 | 처리 |
| --- | --- |
| `INCOME` | 계좌 잔액 증가 |
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

거래 삭제 시 기존 거래의 영향을 반대로 적용하여 계좌 잔액을 복구합니다.

```text
EXPENSE 삭제 → 잔액 증가
INCOME 삭제 → 잔액 감소
```

### 거래 유형과 카테고리 유형 검증

거래 등록·수정 시 거래 유형과 카테고리 유형이 일치하는지 검증합니다.

```text
INCOME 거래 → INCOME 카테고리만 사용 가능
EXPENSE 거래 → EXPENSE 카테고리만 사용 가능
```

잘못된 예:

```text
INCOME 거래 + EXPENSE 카테고리
EXPENSE 거래 + INCOME 카테고리
```

## 데이터 관계 요약

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

## 프론트엔드 구성

프론트엔드는 CRA 기반 React 프로젝트로 구성되어 있으며, React Router를 사용해 주요 페이지 라우팅을 분리했습니다.

현재는 백엔드 API 연동 전 단계로, 메인 페이지와 주요 페이지의 레이아웃 기반을 먼저 구성했습니다.

### 라우팅

| URL | 화면 | 현재 상태 |
| --- | --- | --- |
| `/` | 메인 페이지 | 구현 |
| `/my-wallet` | 개인 지갑 | placeholder 구성 |
| `/group-wallet` | 그룹 지갑 | placeholder 구성 |
| `/community` | 커뮤니티 | placeholder 구성 |
| `/statistics` | 통계 | 차트 기반 화면 구성 |
| `/events/:eventId` | 이벤트 상세 | NotFound 임시 연결 |
| `/notifications/:notificationId` | 공지 상세 | NotFound 임시 연결 |
| `/informations/:informationId` | 정보 상세 | NotFound 임시 연결 |
| `/faq` | 자주하는 질문 | NotFound 임시 연결 |
| `/support` | 이메일 상담 | NotFound 임시 연결 |
| `/ars` | ARS | NotFound 임시 연결 |
| `*` | 잘못된 경로 | NotFound 처리 |

### 메인 페이지 섹션

메인 페이지는 현재 정적 데이터 기반으로 화면 구조를 먼저 구성한 상태입니다.

- Advertisement
- Signin
- Report
- MainEvent
- SubEvent
- EtcEvent
- Notification
- Information
- Customer Service

### 통계 페이지

통계 페이지는 Recharts 기반 월별 수입·지출 라인 차트 컴포넌트를 포함합니다.

현재는 정적 샘플 데이터를 사용하며, 이후 백엔드의 `/api/statistics/monthly` API와 연동할 예정입니다.

## 프로젝트 구조

```text
project_wallet/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── account_router.py
│   │   │   ├── auth_router.py
│   │   │   ├── category_router.py
│   │   │   ├── statistics_router.py
│   │   │   └── transaction_router.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── redis_client.py
│   │   │   └── security.py
│   │   │
│   │   ├── database/
│   │   │   ├── connection.py
│   │   │   └── session.py
│   │   │
│   │   ├── dependencies/
│   │   │   ├── __init__.py
│   │   │   └── auth_dependency.py
│   │   │
│   │   ├── models/
│   │   │   ├── account.py
│   │   │   ├── category.py
│   │   │   ├── content.py
│   │   │   ├── enums.py
│   │   │   ├── member.py
│   │   │   └── transaction.py
│   │   │
│   │   ├── repositories/
│   │   │   ├── account_repository.py
│   │   │   ├── category_repository.py
│   │   │   └── transaction_repository.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── account_schema.py
│   │   │   ├── auth_schema.py
│   │   │   ├── category_schema.py
│   │   │   └── transaction_schema.py
│   │   │
│   │   ├── services/
│   │   │   ├── account_service.py
│   │   │   ├── auth_service.py
│   │   │   ├── category_service.py
│   │   │   ├── statistics_service.py
│   │   │   └── transaction_service.py
│   │   │
│   │   └── main.py
│   │
│   ├── .env.example
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│
├── .gitattributes
├── .gitignore
└── README.md
```

## API 목록

### Auth API

| Method | URL | 인증 | 설명 |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | 불필요 | 로컬 회원가입 |
| POST | `/api/auth/login` | 불필요 | 로컬 로그인 및 토큰 발급 |
| GET | `/api/auth/me` | 필요 | 현재 로그인 사용자 조회 |
| POST | `/api/auth/reissue` | 불필요 | Refresh Token 기반 Access Token 재발급 |
| POST | `/api/auth/logout` | 필요 | 로그아웃 및 Refresh Token 삭제 |

### Account API

| Method | URL | 인증 | 설명 |
| --- | --- | --- | --- |
| GET | `/api/accounts` | 필요 | 현재 사용자 계좌 목록 조회 |
| GET | `/api/accounts/{account_id}` | 필요 | 현재 사용자 계좌 상세 조회 |
| POST | `/api/accounts` | 필요 | 현재 사용자 계좌 등록 |
| PATCH | `/api/accounts/{account_id}` | 필요 | 현재 사용자 계좌 수정 |
| DELETE | `/api/accounts/{account_id}` | 필요 | 현재 사용자 계좌 삭제 |

### Category API

| Method | URL | 인증 | 설명 |
| --- | --- | --- | --- |
| GET | `/api/categories` | 필요 | 현재 사용자 카테고리 목록 조회 |
| GET | `/api/categories/{category_id}` | 필요 | 현재 사용자 카테고리 상세 조회 |
| POST | `/api/categories` | 필요 | 현재 사용자 카테고리 등록 |
| PATCH | `/api/categories/{category_id}` | 필요 | 현재 사용자 카테고리 수정 |
| DELETE | `/api/categories/{category_id}` | 필요 | 현재 사용자 카테고리 삭제 |

### Transaction API

| Method | URL | 인증 | 설명 |
| --- | --- | --- | --- |
| GET | `/api/transactions` | 필요 | 현재 사용자 거래 목록 조회 |
| GET | `/api/transactions/{transaction_id}` | 필요 | 현재 사용자 거래 상세 조회 |
| POST | `/api/transactions` | 필요 | 현재 사용자 거래 등록 |
| PATCH | `/api/transactions/{transaction_id}` | 필요 | 현재 사용자 거래 수정 |
| DELETE | `/api/transactions/{transaction_id}` | 필요 | 현재 사용자 거래 삭제 |

### Statistics API

| Method | URL | 인증 | 설명 |
| --- | --- | --- | --- |
| GET | `/api/statistics/summary` | 필요 | 현재 사용자 요약 통계 조회 |
| GET | `/api/statistics/monthly` | 필요 | 현재 사용자 월별 수입/지출 통계 조회 |
| GET | `/api/statistics/category` | 필요 | 현재 사용자 카테고리별 수입/지출 통계 조회 |
| GET | `/api/statistics/category?type=INCOME` | 필요 | 현재 사용자 수입 카테고리 통계 조회 |
| GET | `/api/statistics/category?type=EXPENSE` | 필요 | 현재 사용자 지출 카테고리 통계 조회 |

## 실행 방법

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

## 데이터베이스 확인 명령어

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
```

## 현재 개발 상태

### 구현 완료

#### Backend

- FastAPI 백엔드 기본 구조
- MySQL 연결 설정
- SQLAlchemy 모델 정의
- 로컬 회원가입 API
- 로컬 로그인 API
- bcrypt 비밀번호 해싱
- JWT Access Token 발급 및 검증
- Redis Refresh Token 저장
- Access Token 재발급 API
- 로그아웃 API
- 현재 로그인 사용자 조회 API
- 계좌 CRUD API
- 카테고리 CRUD API
- 거래 CRUD API
- 현재 로그인 사용자 기준 계좌/카테고리/거래 접근 제어
- 거래 생성/수정/삭제 시 계좌 잔액 정합성 처리
- 거래 유형과 카테고리 유형 일치 검증
- 현재 로그인 사용자 기준 요약 통계 API
- 현재 로그인 사용자 기준 월별 수입/지출 통계 API
- 현재 로그인 사용자 기준 카테고리별 수입/지출 통계 API
- Swagger 기반 API 테스트

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

### 진행 예정

#### Backend

- OAuth 로그인 API
- Access Token blacklist 적용 여부 검토
- 콘텐츠 API 구현
- 광고 / 이벤트 / 공지사항 / 정보성 게시글 API 연동
- API 응답 스키마 정리
- 예외 응답 형식 표준화

#### Frontend

- 백엔드 API 연동
- 로그인/회원가입 화면 구현
- JWT 인증 흐름 연동
- 계좌 목록/등록/수정/삭제 화면 구현
- 카테고리 목록/등록/수정/삭제 화면 구현
- 거래 목록/등록/수정/삭제 화면 구현
- 통계 API 기반 차트 데이터 연동
- 상세 페이지 라우트 구현
- placeholder 데이터 제거

## 개발 방향

현재 프로젝트는 백엔드 DB 정합성과 API 안정성을 우선으로 개발하고 있습니다.

특히 거래 내역과 계좌 잔액이 어긋나지 않도록, 거래 생성·수정·삭제 시 잔액 변경 흐름을 백엔드에서 처리합니다.

인증 이후에는 사용자가 직접 `member_id`를 입력하지 않고, JWT에서 현재 로그인 사용자를 식별하여 계좌·카테고리·거래·통계 데이터를 사용자별로 분리합니다.

프론트엔드는 먼저 화면 구조와 라우팅을 구성한 뒤, 백엔드 API와 단계적으로 연결하는 방식으로 개발합니다.
