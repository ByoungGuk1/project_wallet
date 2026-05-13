# Backend

개인 자산 관리 서비스의 FastAPI 기반 백엔드 서버입니다.

회원가입, 로그인, JWT 인증, Redis 기반 Refresh Token 관리, 계좌·카테고리·거래·통계 API를 제공합니다.

계좌, 카테고리, 거래, 통계 데이터는 현재 로그인 사용자 기준으로 제한되며, 거래 등록·수정·삭제 시 계좌 잔액 정합성을 백엔드에서 처리합니다.

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Language | Python 3.12 |
| Framework | FastAPI |
| Server | Uvicorn |
| Database | MySQL |
| Database Access | SQLAlchemy ORM / Native SQL |
| Auth | JWT |
| Token Storage | Redis |
| Password Hashing | passlib / bcrypt |
| Validation | Pydantic |
| Environment | python-dotenv |
| API Docs | Swagger UI |

## 주요 기능

### 인증

- 로컬 회원가입
- 로컬 로그인
- bcrypt 기반 비밀번호 해싱
- JWT Access Token 발급
- Access Token 기반 현재 로그인 사용자 조회
- Redis 기반 Refresh Token 저장
- Refresh Token 기반 Access Token 재발급
- 로그아웃 시 Redis Refresh Token 삭제
- Access Token type 검증
- 현재 로그인 사용자 기준 API 접근 제어

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

### 통계

- 현재 로그인 사용자 기준 전체 계좌 잔액 합계
- 현재 로그인 사용자 기준 이번 달 수입 합계
- 현재 로그인 사용자 기준 이번 달 지출 합계
- 현재 로그인 사용자 기준 월별 수입/지출 통계
- 현재 로그인 사용자 기준 카테고리별 수입/지출 통계
- `type=INCOME`, `type=EXPENSE` 쿼리 파라미터 기반 카테고리 통계 필터링

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

## 인증 흐름

### 회원가입

```text
POST /api/auth/signup
```

요청 예시:

```json
{
  "email": "user@example.com",
  "password": "1234",
  "nickname": "테스트유저"
}
```

처리 흐름:

```text
이메일 중복 확인
→ 비밀번호 bcrypt 해싱
→ members 저장
→ local_members 저장
```

### 로그인

```text
POST /api/auth/login
```

요청 예시:

```json
{
  "email": "user@example.com",
  "password": "1234"
}
```

응답 예시:

```json
{
  "access_token": "JWT_ACCESS_TOKEN",
  "refresh_token": "REFRESH_TOKEN",
  "token_type": "bearer"
}
```

처리 흐름:

```text
이메일 조회
→ 로컬 회원 여부 확인
→ 비밀번호 검증
→ Access Token 발급
→ Refresh Token 생성
→ Redis 저장
```

### 현재 로그인 사용자 조회

```text
GET /api/auth/me
```

요청 헤더:

```http
Authorization: Bearer <access_token>
```

### 토큰 재발급

```text
POST /api/auth/reissue
```

요청 예시:

```json
{
  "refresh_token": "REFRESH_TOKEN"
}
```

처리 흐름:

```text
Refresh Token으로 Redis 조회
→ member_id 확인
→ 저장된 Refresh Token과 비교
→ 새 Access Token 발급
```

### 로그아웃

```text
POST /api/auth/logout
```

요청 헤더:

```http
Authorization: Bearer <access_token>
```

처리 흐름:

```text
현재 사용자 확인
→ Redis refresh_token:{member_id} 삭제
→ Redis refresh_token_value:{refresh_token} 삭제
```

## API 목록

### Auth API

| Method | URL | 인증 | 설명 |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | 불필요 | 로컬 회원가입 |
| POST | `/api/auth/login` | 불필요 | 로컬 로그인 및 토큰 발급 |
| GET | `/api/auth/me` | 필요 | 현재 로그인 사용자 조회 |
| POST | `/api/auth/reissue` | 불필요 | Access Token 재발급 |
| POST | `/api/auth/logout` | 필요 | 로그아웃 |

### Account API

| Method | URL | 인증 | 설명 |
| --- | --- | --- | --- |
| GET | `/api/accounts` | 필요 | 현재 사용자 계좌 목록 조회 |
| GET | `/api/accounts/{account_id}` | 필요 | 현재 사용자 계좌 상세 조회 |
| POST | `/api/accounts` | 필요 | 현재 사용자 계좌 등록 |
| PATCH | `/api/accounts/{account_id}` | 필요 | 현재 사용자 계좌 수정 |
| DELETE | `/api/accounts/{account_id}` | 필요 | 현재 사용자 계좌 삭제 |

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

| Method | URL | 인증 | 설명 |
| --- | --- | --- | --- |
| GET | `/api/categories` | 필요 | 현재 사용자 카테고리 목록 조회 |
| GET | `/api/categories/{category_id}` | 필요 | 현재 사용자 카테고리 상세 조회 |
| POST | `/api/categories` | 필요 | 현재 사용자 카테고리 등록 |
| PATCH | `/api/categories/{category_id}` | 필요 | 현재 사용자 카테고리 수정 |
| DELETE | `/api/categories/{category_id}` | 필요 | 현재 사용자 카테고리 삭제 |

카테고리 생성 요청 예시:

```json
{
  "name": "식비",
  "category_type": "EXPENSE"
}
```

`member_id`는 요청 body에서 받지 않고 현재 로그인 사용자 ID로 저장합니다.

### Transaction API

| Method | URL | 인증 | 설명 |
| --- | --- | --- | --- |
| GET | `/api/transactions` | 필요 | 현재 사용자 거래 목록 조회 |
| GET | `/api/transactions/{transaction_id}` | 필요 | 현재 사용자 거래 상세 조회 |
| POST | `/api/transactions` | 필요 | 현재 사용자 거래 등록 |
| PATCH | `/api/transactions/{transaction_id}` | 필요 | 현재 사용자 거래 수정 |
| DELETE | `/api/transactions/{transaction_id}` | 필요 | 현재 사용자 거래 삭제 |

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
```

### Statistics API

| Method | URL | 인증 | 설명 |
| --- | --- | --- | --- |
| GET | `/api/statistics/summary` | 필요 | 현재 사용자 요약 통계 조회 |
| GET | `/api/statistics/monthly` | 필요 | 현재 사용자 월별 수입/지출 통계 조회 |
| GET | `/api/statistics/category` | 필요 | 현재 사용자 카테고리별 수입/지출 통계 조회 |
| GET | `/api/statistics/category?type=INCOME` | 필요 | 현재 사용자 수입 카테고리 통계 조회 |
| GET | `/api/statistics/category?type=EXPENSE` | 필요 | 현재 사용자 지출 카테고리 통계 조회 |

## 데이터베이스 확인 명령어

### 테이블 목록 확인

```bash
mysql -uroot -p1234 -D wallet_db -e "SHOW TABLES;"
```

### 주요 데이터 확인

```bash
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

```bash
docker exec -it redis-dev redis-cli
```

```redis
AUTH 1234
KEYS refresh_token*
```

Refresh Token 저장 구조:

```text
refresh_token:{member_id} -> refresh_token
refresh_token_value:{refresh_token} -> member_id
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

### 진행 예정

- OAuth 로그인 API
- Access Token blacklist 적용 여부 검토
- 콘텐츠 API 구현
- 광고 / 이벤트 / 공지사항 / 정보성 게시글 API 연동
- 프론트엔드 API 연동
- API 응답 스키마 정리
- 예외 응답 형식 표준화
