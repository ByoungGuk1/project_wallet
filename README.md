# 개인 자산 관리 서비스

개인 금융 관리를 위한 웹 애플리케이션입니다.  
사용자는 계좌를 등록하고, 수입/지출 내역을 기록하며, 월별 소비 흐름과 카테고리별 지출 통계를 확인할 수 있습니다.

## 프로젝트 개요

해당 프로젝트는 개인의 자산 흐름을 한눈에 관리하기 위한 금융 관리 서비스입니다.  
기존 가계부처럼 단순히 거래 내역만 기록하는 것이 아니라, 계좌별 잔액 관리, 수입/지출 분류, 월별 통계, 카테고리별 소비 분석 기능을 제공하는 것을 목표로 합니다.  
이 프로젝트는 React 기반 프론트엔드와 Python FastAPI 기반 백엔드로 구성됩니다.

## 주요 기능

### 계좌 관리

- 계좌 등록
- 계좌 목록 조회
- 계좌 정보 수정
- 계좌 삭제
- 계좌별 잔액 확인

### 거래 내역 관리

- 수입 내역 등록
- 지출 내역 등록
- 거래 내역 조회
- 거래 내역 수정
- 거래 내역 삭제
- 날짜별 거래 내역 필터링

### 카테고리 관리

- 수입/지출 카테고리 분류
- 카테고리별 거래 내역 조회
- 카테고리별 지출 합계 확인

### 통계 기능

- 월별 수입/지출 합계
- 월별 잔액 변화
- 카테고리별 지출 비율
- 최근 거래 내역 요약

## 기술 스택

### Frontend

| 구분        | 기술              |
| ----------- | ----------------- |
| Language    | JavaScript        |
| Framework   | React             |
| Routing     | React Router      |
| State       | React Hooks       |
| HTTP Client | Fetch API         |
| Styling     | styled-components |
| Chart       | Recharts          |

### Backend

| 구분        | 기술                 |
| ----------- | -------------------- |
| Language    | Python               |
| Framework   | FastAPI              |
| ORM         | SQLAlchemy           |
| Validation  | Pydantic             |
| Database    | MySQL                |
| Server      | Uvicorn              |
| API Docs    | FastAPI Swagger UI   |
| Environment | venv                 |
| Test Tool   | Swagger UI / Postman |

## 프로젝트 구조

### Frontend

```text
frontend/
├── public/
│   └── index.html
│
├── src/
│   ├── api/
│   │   ├── fetchClient.js
│   │   ├── accountApi.js
│   │   ├── transactionApi.js
│   │   ├── categoryApi.js
│   │   └── statisticsApi.js
│   │
│   ├── components/
│   │   ├── account/
│   │   ├── transaction/
│   │   ├── chart/
│   │   ├── common/
│   │   │   ├── button/
│   │   │   ├── input/
│   │   │   ├── Card.jsx
│   │   │   └── style.js
│   │   │
│   │   └── layout/
│   │       ├── MainLayout.jsx
│   │       ├── style.js
│   │       ├── header/
│   │       └── footer/
│   │
│   ├── hooks/
│   │   └── useInput.js
│   │
│   ├── pages/
│   │   ├── main/
│   │   ├── account/
│   │   ├── transaction/
│   │   ├── statistics/
│   │   └── notfound/
│   │
│   ├── routes/
│   │   └── AppRouter.js
│   │
│   ├── styles/
│   │   ├── common.js
│   │   ├── global.js
│   │   └── theme.js
│   │
│   ├── App.js
│   └── index.js
│
├── .env.example
├── package.json
└── package-lock.json
```

### Backend

```text
backend/
├── app/
│   ├── main.py
│   │
│   ├── api/
│   │   ├── auth_router.py    #추가예정
│   │   ├── user_router.py    #추가예정
│   │   ├── account_router.py
│   │   ├── transaction_router.py
│   │   ├── category_router.py
│   │   └── statistics_router.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── account.py
│   │   ├── transaction.py
│   │   └── category.py
│   │
│   ├── schemas/
│   │   ├── auth_schema.py    #추가예정
│   │   ├── user_schema.py    #추가예정
│   │   ├── account_schema.py
│   │   ├── transaction_schema.py
│   │   ├── category_schema.py
│   │   └── statistics_schema.py
│   │
│   ├── services/
│   │   ├── auth_service.py    #추가예정
│   │   ├── user_service.py    #추가예정
│   │   ├── account_service.py
│   │   ├── transaction_service.py
│   │   ├── category_service.py
│   │   └── statistics_service.py
│   │
│   ├── repositories/
│   │   ├── user_repository.py    #추가예정
│   │   ├── account_repository.py
│   │   ├── transaction_repository.py
│   │   └── category_repository.py
│   │
│   ├── database/
│   │   ├── connection.py
│   │   └── session.py
│   │
│   └── core/
│       ├── config.py
│       └── security.py    #추가예정
│
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

## ERD 설계

### 주요 테이블

USER

- id PK
- email
- password_hash
- name
- created_at
- updated_at

ACCOUNT

- id PK
- user_id FK
- account_name
- account_type
- balance
- created_at
- updated_at

CATEGORY

- id PK
- name
- type
- created_at
- updated_at

TRANSACTION

- id PK
- account_id FK
- category_id FK
- type
- amount
- memo
- transaction_date
- created_at
- updated_at

## API 설계

### Account API

| Method | URL                          | Description    |
| ------ | ---------------------------- | -------------- |
| GET    | `/api/accounts`              | 계좌 목록 조회 |
| GET    | `/api/accounts/{account_id}` | 계좌 상세 조회 |
| POST   | `/api/accounts`              | 계좌 등록      |
| PATCH  | `/api/accounts/{account_id}` | 계좌 수정      |
| DELETE | `/api/accounts/{account_id}` | 계좌 삭제      |

### Transaction API

| Method | URL                                  | Description    |
| ------ | ------------------------------------ | -------------- |
| GET    | `/api/transactions`                  | 거래 내역 조회 |
| GET    | `/api/transactions/{transaction_id}` | 거래 상세 조회 |
| POST   | `/api/transactions`                  | 거래 내역 등록 |
| PATCH  | `/api/transactions/{transaction_id}` | 거래 내역 수정 |
| DELETE | `/api/transactions/{transaction_id}` | 거래 내역 삭제 |

### Category API

| Method | URL                             | Description        |
| ------ | ------------------------------- | ------------------ |
| GET    | `/api/categories`               | 카테고리 목록 조회 |
| POST   | `/api/categories`               | 카테고리 등록      |
| PATCH  | `/api/categories/{category_id}` | 카테고리 수정      |
| DELETE | `/api/categories/{category_id}` | 카테고리 삭제      |

### Statistics API

| Method | URL                        | Description          |
| ------ | -------------------------- | -------------------- |
| GET    | `/api/statistics/monthly`  | 월별 수입/지출 통계  |
| GET    | `/api/statistics/category` | 카테고리별 지출 통계 |
| GET    | `/api/statistics/summary`  | 전체 요약 정보 조회  |

## 화면 구성

### 메인 화면

- 전체 잔액 표시
- 이번 달 수입/지출 요약
- 최근 거래 내역 표시
- 월별 소비 흐름 차트

### 계좌 화면

- 등록된 계좌 목록
- 계좌별 잔액
- 계좌 추가/수정/삭제

### 거래 내역 화면

- 수입/지출 내역 목록
- 날짜별 필터
- 카테고리별 필터
- 거래 내역 추가/수정/삭제

### 통계 화면

- 월별 수입/지출 그래프
- 카테고리별 지출 비율
- 가장 많이 사용한 카테고리
- 최근 소비 패턴 요약

## 프로젝트 목적

이 프로젝트의 목적은 단순한 CRUD 구현을 넘어서, 실제 서비스에서 자주 사용되는 데이터 관계 설계와 비즈니스 로직 처리를 학습하고 직접 활용 가능한 금융 관리 서비스를 구현하는 것입니다.  
특히 금융 관리 서비스 특성상 거래 내역과 계좌 잔액의 정합성이 중요하기 때문에, 백엔드에서 데이터 변경 흐름을 안정적으로 처리하는 것을 주요 목표로 합니다.  
또한 Python FastAPI를 사용하여 빠르게 API 서버를 구성하고, 자동 문서화와 데이터 검증 기능을 활용하는 것을 목표로 합니다.

## 실행 방법

### Backend 실행

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend 실행

본 프로젝트의 프론트엔드는 CRA(Create React App) 기반으로 구성합니다.

`.env.example`을 참고하여 `.env` 파일을 생성합니다.

```env
REACT_APP_API_BASE_URL=http://localhost:8000
```

```bash
cd frontend
npm install
npm start
```

### Swagger 접속

```text
http://localhost:8000/docs
```

### Database 설정

MySQL에서 사용할 데이터베이스를 생성합니다.

```sql
CREATE DATABASE wallet_db;
```

`.env.example` 파일을 참고하여 `.env` 파일을 생성하고 데이터베이스 연결 정보를 입력합니다.

```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/wallet_db
```

## Backend 주요 패키지

```txt
fastapi
uvicorn
sqlalchemy
pydantic
python-dotenv
pymysql
passlib[bcrypt]
python-jose[cryptography]
```
