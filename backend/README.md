# Backend

개인 자산 관리 서비스 `project_wallet`의 FastAPI 기반 백엔드 서버입니다.

백엔드는 회원 인증, 사용자별 계좌 관리, 카테고리 관리, 거래 내역 관리, 통계 조회 기능을 제공합니다.

현재 구현은 현재 로그인 사용자 기준 데이터 접근 제어, JWT 기반 인증, Redis 기반 Refresh Token 관리, 거래 내역과 계좌 잔액 정합성 유지를 중심으로 구성되어 있습니다.

---

## 기술 스택

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

## 주요 기능

### 인증

- 로컬 회원가입
- 로컬 로그인
- bcrypt 기반 비밀번호 해싱
- JWT Access Token 발급
- Access Token type 검증
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

- 수입/지출 거래 등록
- 거래 목록 조회
- 거래 상세 조회
- 거래 수정
- 거래 삭제
- 현재 로그인 사용자 계좌에 속한 거래만 접근 가능
- 거래 등록/수정/삭제 시 계좌 잔액 자동 반영
- 거래 유형과 카테고리 유형 일치 검증
- 거래 금액이 0 이하인 경우 예외 처리

### 통계

- 현재 로그인 사용자 기준 전체 계좌 잔액 합계
- 현재 로그인 사용자 기준 이번 달 수입 합계
- 현재 로그인 사용자 기준 이번 달 지출 합계
- 현재 로그인 사용자 기준 월별 수입/지출 통계
- 현재 로그인 사용자 기준 카테고리별 수입/지출 통계
- `type=INCOME`, `type=EXPENSE` 쿼리 파라미터 기반 카테고리 통계 필터링
- 통계 API 응답 모델 적용

---

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

---

## 인증 구조 요약

### Access Token

Access Token은 JWT로 발급합니다.

Payload에는 현재 사용자 식별과 토큰 타입 검증에 필요한 값을 포함합니다.

```text
sub: 회원 ID
email: 사용자 이메일
member_type: 회원 유형
type: access
exp: 만료 시간
```

인증이 필요한 API는 `Authorization` 헤더에 Access Token을 전달해야 합니다.

```http
Authorization: Bearer <access_token>
```

Access Token 검증 기준:

- JWT 서명 검증
- 만료 시간 검증
- `type=access` 확인
- Redis blacklist 등록 여부 확인
- `sub` 기준 회원 조회

### Refresh Token

Refresh Token은 JWT가 아니라 `secrets.token_urlsafe(64)`로 생성한 랜덤 문자열입니다.

Redis 저장 구조:

```text
refresh_token:{member_id} -> latest_refresh_token
refresh_token_value:{refresh_token} -> member_id
```

Refresh Token TTL:

```text
REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
```

### Refresh Token Rotation

`POST /api/auth/reissue` 호출 시 기존 Refresh Token을 그대로 재사용하지 않습니다.

처리 흐름:

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

### Logout + Access Token Blacklist

로그아웃 시 Refresh Token만 삭제하지 않고, Access Token도 Redis blacklist에 저장합니다.

처리 흐름:

```text
현재 사용자 확인
→ Redis refresh_token:{member_id} 삭제
→ Redis refresh_token_value:{refresh_token} 삭제
→ Access Token의 남은 만료 시간 계산
→ Redis blacklist:access_token:{access_token} 저장
```

Access Token blacklist 저장 구조:

```text
blacklist:access_token:{access_token} -> member_id
```

blacklist TTL은 Access Token의 남은 만료 시간으로 설정합니다.

---

## 프로젝트 구조

```text
backend/
├── app/
│   ├── api/
│   │   ├── account_router.py
│   │   ├── auth_router.py
│   │   ├── category_router.py
│   │   ├── statistics_router.py
│   │   └── transaction_router.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── error_messages.py
│   │   ├── redis_client.py
│   │   └── security.py
│   │
│   ├── database/
│   │   ├── connection.py
│   │   └── session.py
│   │
│   ├── dependencies/
│   │   ├── __init__.py
│   │   └── auth_dependency.py
│   │
│   ├── models/
│   │   ├── account.py
│   │   ├── category.py
│   │   ├── content.py
│   │   ├── enums.py
│   │   ├── member.py
│   │   └── transaction.py
│   │
│   ├── repositories/
│   │   ├── account_repository.py
│   │   ├── category_repository.py
│   │   └── transaction_repository.py
│   │
│   ├── schemas/
│   │   ├── account_schema.py
│   │   ├── auth_schema.py
│   │   ├── category_schema.py
│   │   ├── common_schema.py
│   │   ├── statistics_schema.py
│   │   └── transaction_schema.py
│   │
│   ├── services/
│   │   ├── account_service.py
│   │   ├── auth_service.py
│   │   ├── category_service.py
│   │   ├── statistics_service.py
│   │   └── transaction_service.py
│   │
│   └── main.py
│
├── docs/
│   └── auth-plan.md
│
├── .env.example
├── requirements.txt
└── README.md
```

## 실행 방법

### 1. 가상환경 생성 및 활성화

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### 2. 패키지 설치

```bash
pip install -r requirements.txt
```

### 3. 환경변수 설정

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

### 4. MySQL 데이터베이스 생성

```bash
mysql -uroot -p1234 -e "CREATE DATABASE IF NOT EXISTS wallet_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 5. Redis 실행

```bash
docker start redis-dev
```

Redis 연결 확인:

```bash
docker exec -it redis-dev redis-cli
```

```redis
AUTH 1234
PING
```

정상 응답:

```text
PONG
```

### 6. 서버 실행

```bash
uvicorn app.main:app --reload
```

서버 실행 후 아래 주소에서 API 문서를 확인할 수 있습니다.

```text
http://localhost:8000/docs
```

## API 목록

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

계좌 생성 요청 예시:

```json
{
  "account_name": "생활비 계좌",
  "account_number": "1234567890",
  "bank_name": "국민은행",
  "balance": 100000
}
```

`member_id`는 요청 body에서 받지 않고 현재 로그인 사용자 ID로 저장합니다.

### Category API

| Method | URL                             | 인증 | 설명                           |
| ------ | ------------------------------- | ---- | ------------------------------ |
| GET    | `/api/categories`               | 필요 | 현재 사용자 카테고리 목록 조회 |
| GET    | `/api/categories/{category_id}` | 필요 | 현재 사용자 카테고리 상세 조회 |
| POST   | `/api/categories`               | 필요 | 현재 사용자 카테고리 등록      |
| PATCH  | `/api/categories/{category_id}` | 필요 | 현재 사용자 카테고리 수정      |
| DELETE | `/api/categories/{category_id}` | 필요 | 현재 사용자 카테고리 삭제      |

카테고리 생성 요청 예시:

```json
{
  "name": "식비",
  "category_type": "EXPENSE"
}
```

`member_id`는 요청 body에서 받지 않고 현재 로그인 사용자 ID로 저장합니다.

### Transaction API

| Method | URL                                  | 인증 | 설명                       |
| ------ | ------------------------------------ | ---- | -------------------------- |
| GET    | `/api/transactions`                  | 필요 | 현재 사용자 거래 목록 조회 |
| GET    | `/api/transactions/{transaction_id}` | 필요 | 현재 사용자 거래 상세 조회 |
| POST   | `/api/transactions`                  | 필요 | 현재 사용자 거래 등록      |
| PATCH  | `/api/transactions/{transaction_id}` | 필요 | 현재 사용자 거래 수정      |
| DELETE | `/api/transactions/{transaction_id}` | 필요 | 현재 사용자 거래 삭제      |

거래 생성 요청 예시:

```json
{
  "account_id": 1,
  "category_id": 1,
  "transaction_type": "EXPENSE",
  "amount": 12000,
  "transaction_date": "2026-05-13",
  "memo": "점심"
}
```

거래 생성 조건:

```text
account_id는 현재 로그인 사용자의 계좌여야 함
category_id가 있으면 현재 로그인 사용자의 카테고리여야 함
transaction_type과 category_type이 일치해야 함
amount는 0보다 커야 함
```

### Statistics API

| Method | URL                                     | 인증 | 설명                                       |
| ------ | --------------------------------------- | ---- | ------------------------------------------ |
| GET    | `/api/statistics/summary`               | 필요 | 현재 사용자 요약 통계 조회                 |
| GET    | `/api/statistics/monthly`               | 필요 | 현재 사용자 월별 수입/지출 통계 조회       |
| GET    | `/api/statistics/category`              | 필요 | 현재 사용자 카테고리별 수입/지출 통계 조회 |
| GET    | `/api/statistics/category?type=INCOME`  | 필요 | 현재 사용자 수입 카테고리 통계 조회        |
| GET    | `/api/statistics/category?type=EXPENSE` | 필요 | 현재 사용자 지출 카테고리 통계 조회        |

## 응답 모델

### 공통 메시지 응답

삭제 API와 로그아웃 API는 `MessageResponse`를 사용합니다.

```json
{
  "message": "처리 결과 메시지"
}
```

적용 대상:

- `POST /api/auth/logout`
- `DELETE /api/accounts/{account_id}`
- `DELETE /api/categories/{category_id}`
- `DELETE /api/transactions/{transaction_id}`

### 통계 응답

| API                            | Response Model                     |
| ------------------------------ | ---------------------------------- |
| `GET /api/statistics/summary`  | `SummaryResponse`                  |
| `GET /api/statistics/monthly`  | `list[MonthlyStatisticsResponse]`  |
| `GET /api/statistics/category` | `list[CategoryStatisticsResponse]` |

## 예외 처리 기준

현재 예외 응답은 FastAPI 기본 형식을 사용합니다.

```json
{
  "detail": "에러 메시지"
}
```

예외 메시지는 `app/core/error_messages.py`에서 상수로 관리합니다.

| 상황                             | 상태코드 | 메시지                                         |
| -------------------------------- | -------: | ---------------------------------------------- |
| 이메일 중복                      |      409 | 이미 사용 중인 이메일입니다.                   |
| 로그인 실패                      |      401 | 이메일 또는 비밀번호가 올바르지 않습니다.      |
| 로컬 로그인 회원 아님            |      400 | 로컬 로그인 회원이 아닙니다.                   |
| 유효하지 않은 Access Token       |      401 | 유효하지 않은 토큰입니다.                      |
| 만료된 Access Token              |      401 | 만료된 토큰입니다.                             |
| 로그아웃된 Access Token          |      401 | 로그아웃된 토큰입니다.                         |
| 유효하지 않은 Refresh Token      |      401 | 유효하지 않은 Refresh Token입니다.             |
| 계좌 없음                        |      404 | 계좌를 찾을 수 없습니다.                       |
| 카테고리 없음                    |      404 | 카테고리를 찾을 수 없습니다.                   |
| 거래 없음                        |      404 | 거래 내역을 찾을 수 없습니다.                  |
| 거래 유형과 카테고리 유형 불일치 |      400 | 거래 유형과 카테고리 유형이 일치하지 않습니다. |
| 거래 금액이 0 이하               |      400 | 거래 금액은 0보다 커야 합니다.                 |

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

## Redis 확인 명령어

Redis 접속:

```bash
docker exec -it redis-dev redis-cli
```

인증:

```redis
AUTH 1234
```

Refresh Token 확인:

```redis
KEYS refresh_token*
```

Access Token blacklist 확인:

```redis
KEYS blacklist:access_token*
```

TTL 확인:

```redis
TTL refresh_token:{member_id}
TTL blacklist:access_token:{access_token}
```

## 현재 개발 상태

### 구현 완료

- FastAPI 백엔드 기본 구조
- MySQL 연결 설정
- SQLAlchemy 모델 정의
- 로컬 회원가입 API
- 로컬 로그인 API
- bcrypt 비밀번호 해싱
- JWT Access Token 발급 및 검증
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
- 현재 로그인 사용자 기준 요약 통계 API
- 현재 로그인 사용자 기준 월별 수입/지출 통계 API
- 현재 로그인 사용자 기준 카테고리별 수입/지출 통계 API
- 공통 메시지 응답 모델 분리
- 통계 API 응답 모델 적용
- 예외 메시지 상수화
- Swagger 기반 API 테스트

### 진행 예정

- 자동 테스트 추가
- 프론트엔드 API 연동
- OAuth 로그인 API
- 콘텐츠 API 구현
- 광고 / 이벤트 / 공지사항 / 정보성 게시글 API 연동
- 외부 계좌 연동 또는 Mock Bank Provider 기반 동기화 구조 검토

---

## 관련 문서

- `backend/docs/auth-plan.md`: 인증 구현 및 검증 정리
