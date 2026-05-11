# Backend

개인 자산 관리 서비스의 FastAPI 기반 백엔드 서버입니다.

계좌, 거래 내역, 카테고리, 통계 API를 제공하며 MySQL 데이터베이스, SQLAlchemy ORM, Native SQL 기반 집계 쿼리를 사용합니다.

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Language | Python 3.12 |
| Framework | FastAPI |
| Server | Uvicorn |
| Database | MySQL |
| Database Access | SQLAlchemy ORM / Native SQL |
| Validation | Pydantic |
| Environment | python-dotenv |
| API Docs | Swagger UI |

## 주요 기능

### 계좌 관리

- 계좌 등록
- 계좌 목록 조회
- 계좌 상세 조회
- 계좌 수정
- 계좌 삭제

### 카테고리 관리

- 수입/지출 카테고리 등록
- 카테고리 목록 조회
- 카테고리 상세 조회
- 카테고리 수정
- 카테고리 삭제

### 거래 내역 관리

- 수입/지출 거래 등록
- 거래 목록 조회
- 거래 상세 조회
- 거래 수정
- 거래 삭제
- 거래 등록/수정/삭제 시 계좌 잔액 자동 반영

### 통계

- 전체 계좌 잔액 합계
- 이번 달 수입 합계
- 이번 달 지출 합계
- 월별 수입/지출 통계
- 카테고리별 지출 통계

## 프로젝트 구조

```text
backend/
├── app/
│   ├── api/
│   │   ├── account_router.py
│   │   ├── category_router.py
│   │   ├── statistics_router.py
│   │   └── transaction_router.py
│   │
│   ├── core/
│   │   └── config.py
│   │
│   ├── database/
│   │   ├── connection.py
│   │   └── session.py
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
│   │   ├── category_schema.py
│   │   └── transaction_schema.py
│   │
│   ├── services/
│   │   ├── account_service.py
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
1. 가상환경 생성 및 활성화

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```
2. 패키지 설치

```bash
pip install -r requirements.txt
```

3. 환경변수 설정 <br/>
`.env.example`을 참고하여 `.env` 파일을 생성합니다.

```env
DATABASE_URL=mysql+pymysql://root:1234@localhost:3306/wallet_db
SECRET_KEY=dev-local-secret-change-later
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

4. MySQL 데이터베이스 생성
```bash
mysql -uroot -p1234 -e "CREATE DATABASE IF NOT EXISTS wallet_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

5. 서버 실행
```bash
uvicorn app.main:app --reload
```
서버 실행 후 아래 주소에서 API 문서를 확인할 수 있습니다.
```
http://localhost:8000/docs
```

## API 목록

### Account API

| Method | URL | 설명 |
| --- | --- | --- |
| GET | `/api/accounts` | 계좌 목록 조회 |
| GET | `/api/accounts/{account_id}` | 계좌 상세 조회 |
| POST | `/api/accounts` | 계좌 등록 |
| PATCH | `/api/accounts/{account_id}` | 계좌 수정 |
| DELETE | `/api/accounts/{account_id}` | 계좌 삭제 |

### Category API

| Method | URL | 설명 |
| --- | --- | --- |
| GET | `/api/categories` | 카테고리 목록 조회 |
| GET | `/api/categories/{category_id}` | 카테고리 상세 조회 |
| POST | `/api/categories` | 카테고리 등록 |
| PATCH | `/api/categories/{category_id}` | 카테고리 수정 |
| DELETE | `/api/categories/{category_id}` | 카테고리 삭제 |

### Transaction API

| Method | URL | 설명 |
| --- | --- | --- |
| GET | `/api/transactions` | 거래 내역 목록 조회 |
| GET | `/api/transactions/{transaction_id}` | 거래 상세 조회 |
| POST | `/api/transactions` | 거래 등록 |
| PATCH | `/api/transactions/{transaction_id}` | 거래 수정 |
| DELETE | `/api/transactions/{transaction_id}` | 거래 삭제 |

### Statistics API

| Method | URL | 설명 |
| --- | --- | --- |
| GET | `/api/statistics/summary` | 전체 요약 통계 조회 |
| GET | `/api/statistics/monthly` | 월별 수입/지출 통계 조회 |
| GET | `/api/statistics/category` | 카테고리별 지출 통계 조회 |

## 데이터베이스 확인 명령어

### 테이블 목록 확인

```bash
mysql -uroot -p1234 -D wallet_db -e "SHOW TABLES;"
```

### 주요 데이터 확인

```bash
mysql -uroot -p1234 -D wallet_db -e "SELECT * FROM members;"
mysql -uroot -p1234 -D wallet_db -e "SELECT * FROM accounts;"
mysql -uroot -p1234 -D wallet_db -e "SELECT * FROM categories;"
mysql -uroot -p1234 -D wallet_db -e "SELECT * FROM transactions;"
```

## 현재 개발 상태

현재 구현 완료된 기능은 다음과 같습니다.

- 계좌 CRUD
- 카테고리 CRUD
- 거래 CRUD
- 거래 생성/수정/삭제 시 계좌 잔액 정합성 처리
- 요약 통계 API
- 월별 수입/지출 통계 API
- 카테고리별 지출 통계 API

추가 예정 기능은 다음과 같습니다.

- 회원가입 API
- 로그인 API
- JWT 인증
- 현재 로그인 사용자 기준 계좌/거래/카테고리 필터링
- 프론트엔드 API 연동
