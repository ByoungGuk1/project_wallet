# 개인 자산 관리 서비스

개인 자산 흐름을 관리하기 위한 웹 애플리케이션입니다.

사용자는 계좌를 등록하고, 수입/지출 거래 내역을 기록하며, 계좌 잔액과 월별·카테고리별 통계를 확인할 수 있습니다.

## 프로젝트 개요

이 프로젝트는 단순 가계부 CRUD를 넘어서, 금융 서비스에서 중요한 **거래 내역과 계좌 잔액의 정합성**을 직접 처리하는 것을 목표로 합니다.

현재 백엔드는 FastAPI 기반으로 DB 모델, 계좌·카테고리·거래 CRUD API, 거래 잔액 반영 로직, 통계 API가 구현되어 있습니다.

프론트엔드는 React 기반으로 공통 레이아웃, 메인 페이지 섹션, 주요 페이지 라우팅, 통계 차트 화면의 기반이 구성되어 있습니다. 이후 백엔드 API와 단계적으로 연동할 예정입니다.

## 기술 스택

### Frontend

| 구분       | 기술              |
| ---------- | ----------------- |
| Language   | JavaScript        |
| Framework  | React 18          |
| Routing    | React Router      |
| Styling    | styled-components |
| Chart      | Recharts          |
| Build Tool | Create React App  |

### Backend

| 구분            | 기술                        |
| --------------- | --------------------------- |
| Language        | Python 3.12                 |
| Framework       | FastAPI                     |
| Server          | Uvicorn                     |
| Database        | MySQL                       |
| Database Access | SQLAlchemy ORM / Native SQL |
| Validation      | Pydantic                    |
| Environment     | python-dotenv               |
| API Docs        | Swagger UI                  |

## 주요 기능

### 계좌 관리

- 계좌 등록
- 계좌 목록 조회
- 계좌 상세 조회
- 계좌 수정
- 계좌 삭제
- 계좌별 잔액 관리

### 카테고리 관리

- 수입/지출 카테고리 등록
- 카테고리 목록 조회
- 카테고리 상세 조회
- 카테고리 수정
- 카테고리 삭제

### 거래 내역 관리

- 수입 거래 등록
- 지출 거래 등록
- 거래 목록 조회
- 거래 상세 조회
- 거래 수정
- 거래 삭제
- 거래 생성/수정/삭제 시 계좌 잔액 자동 반영

### 통계

- 전체 계좌 잔액 합계
- 이번 달 수입 합계
- 이번 달 지출 합계
- 월별 수입/지출 통계
- 카테고리별 지출 통계

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

### 거래 등록 시 잔액 반영

| 거래 유형 | 처리           |
| --------- | -------------- |
| `INCOME`  | 계좌 잔액 증가 |
| `EXPENSE` | 계좌 잔액 감소 |

### 거래 수정 시 잔액 재계산

거래 수정 시에는 기존 거래를 먼저 잔액에서 되돌린 뒤, 수정된 거래 정보를 다시 반영합니다.

예시:

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

### 계좌와 카테고리 소유자 검증

거래 등록·수정 시 계좌 소유자와 카테고리 소유자가 일치하는지 검증합니다.

```text
계좌 member_id != 카테고리 member_id
→ 잘못된 거래로 판단
```

## 프론트엔드 구성

프론트엔드는 CRA 기반 React 프로젝트로 구성되어 있으며, React Router를 사용해 주요 페이지 라우팅을 분리했습니다.

현재는 백엔드 API 연동 전 단계로, 메인 페이지와 주요 페이지의 레이아웃 기반을 먼저 구성했습니다.

### 라우팅

| URL                              | 화면          | 현재 상태           |
| -------------------------------- | ------------- | ------------------- |
| `/`                              | 메인 페이지   | 구현                |
| `/my-wallet`                     | 개인 지갑     | placeholder 구성    |
| `/group-wallet`                  | 그룹 지갑     | placeholder 구성    |
| `/community`                     | 커뮤니티      | placeholder 구성    |
| `/statistics`                    | 통계          | 차트 기반 화면 구성 |
| `/events/:eventId`               | 이벤트 상세   | NotFound 임시 연결  |
| `/notifications/:notificationId` | 공지 상세     | NotFound 임시 연결  |
| `/informations/:informationId`   | 정보 상세     | NotFound 임시 연결  |
| `/faq`                           | 자주하는 질문 | NotFound 임시 연결  |
| `/support`                       | 이메일 상담   | NotFound 임시 연결  |
| `/ars`                           | ARS           | NotFound 임시 연결  |
| `*`                              | 잘못된 경로   | NotFound 처리       |

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
│   │   │
│   │   ├── core/
│   │   │
│   │   ├── database/
│   │   │
│   │   ├── models/
│   │   │
│   │   ├── repositories/
│   │   │
│   │   ├── schemas/
│   │   │
│   │   ├── services/
│   │   │
│   │   └── main.py
│   │
│   ├── .env.example
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   └── images/
│   │   │
│   │   ├── components/
│   │   │   ├── chart/
│   │   │   │
│   │   │   ├── common/
│   │   │   │
│   │   │   └── layout/
│   │   │       ├── header/
│   │   │       └── footer/
│   │   │
│   │   ├── pages/
│   │   │   ├── main/
│   │   │   │   ├── advertisement/
│   │   │   │   ├── etcevent/
│   │   │   │   ├── information/
│   │   │   │   ├── mainevent/
│   │   │   │   ├── notification/
│   │   │   │   ├── report/
│   │   │   │   ├── signin/
│   │   │   │   └── subevent/
│   │   │   │
│   │   │   ├── mywallet/
│   │   │   │
│   │   │   ├── groupwallet/
│   │   │   │
│   │   │   ├── community/
│   │   │   │
│   │   │   ├── statistics/
│   │   │   │
│   │   │   └── notfound/
│   │   │
│   │   ├── routes/
│   │   │
│   │   ├── styles/
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── .gitattributes
├── .gitignore
└── README.md
```

## 데이터베이스 설계

### members

회원 기본 정보를 저장합니다.

| 컬럼        | 설명        |
| ----------- | ----------- |
| id          | 회원 ID     |
| nickname    | 닉네임      |
| email       | 이메일      |
| member_type | 회원 유형   |
| signin_type | 로그인 유형 |
| created_at  | 생성일      |
| updated_at  | 수정일      |

### local_members

로컬 로그인 회원의 비밀번호 해시 정보를 저장할 예정입니다.

| 컬럼          | 설명          |
| ------------- | ------------- |
| id            | 로컬 회원 ID  |
| member_id     | 회원 ID       |
| password_hash | 비밀번호 해시 |
| created_at    | 생성일        |
| updated_at    | 수정일        |

### oauth_members

OAuth 로그인 회원 정보를 저장할 예정입니다.

| 컬럼               | 설명           |
| ------------------ | -------------- |
| id                 | OAuth 회원 ID  |
| member_id          | 회원 ID        |
| provider           | OAuth 제공자   |
| provider_member_id | 제공자 회원 ID |
| created_at         | 생성일         |
| updated_at         | 수정일         |

### accounts

계좌 정보를 저장합니다.

| 컬럼           | 설명     |
| -------------- | -------- |
| id             | 계좌 ID  |
| member_id      | 회원 ID  |
| account_name   | 계좌명   |
| account_number | 계좌번호 |
| bank_name      | 은행명   |
| balance        | 잔액     |
| created_at     | 생성일   |
| updated_at     | 수정일   |

### categories

수입/지출 카테고리를 저장합니다.

| 컬럼          | 설명           |
| ------------- | -------------- |
| id            | 카테고리 ID    |
| member_id     | 회원 ID        |
| name          | 카테고리명     |
| category_type | 수입/지출 유형 |
| created_at    | 생성일         |
| updated_at    | 수정일         |

### transactions

거래 내역을 저장합니다.

| 컬럼             | 설명           |
| ---------------- | -------------- |
| id               | 거래 ID        |
| account_id       | 계좌 ID        |
| category_id      | 카테고리 ID    |
| transaction_type | 수입/지출 유형 |
| amount           | 거래 금액      |
| transaction_date | 거래일         |
| memo             | 메모           |
| created_at       | 생성일         |
| updated_at       | 수정일         |

### advertisements

메인 화면 광고 정보를 저장하기 위한 테이블입니다.

| 컬럼          | 설명       |
| ------------- | ---------- |
| id            | 광고 ID    |
| title         | 광고 제목  |
| image_url     | 이미지 URL |
| link_url      | 이동 URL   |
| started_at    | 시작일     |
| ended_at      | 종료일     |
| display_order | 노출 순서  |
| is_active     | 활성 여부  |
| created_at    | 생성일     |
| updated_at    | 수정일     |

### events

메인 화면 이벤트 정보를 저장하기 위한 테이블입니다.

| 컬럼          | 설명        |
| ------------- | ----------- |
| id            | 이벤트 ID   |
| title         | 이벤트 제목 |
| description   | 이벤트 설명 |
| image_url     | 이미지 URL  |
| event_type    | 이벤트 유형 |
| started_at    | 시작일      |
| ended_at      | 종료일      |
| display_order | 노출 순서   |
| is_active     | 활성 여부   |
| created_at    | 생성일      |
| updated_at    | 수정일      |

### posts

공지사항과 정보성 게시글을 저장하기 위한 테이블입니다.

| 컬럼          | 설명        |
| ------------- | ----------- |
| id            | 게시글 ID   |
| member_id     | 작성자 ID   |
| post_type     | 게시글 유형 |
| title         | 제목        |
| content       | 내용        |
| display_order | 노출 순서   |
| is_active     | 활성 여부   |
| created_at    | 생성일      |
| updated_at    | 수정일      |

## API 목록

### Account API

| Method | URL                          | 설명           |
| ------ | ---------------------------- | -------------- |
| GET    | `/api/accounts`              | 계좌 목록 조회 |
| GET    | `/api/accounts/{account_id}` | 계좌 상세 조회 |
| POST   | `/api/accounts`              | 계좌 등록      |
| PATCH  | `/api/accounts/{account_id}` | 계좌 수정      |
| DELETE | `/api/accounts/{account_id}` | 계좌 삭제      |

### Category API

| Method | URL                             | 설명               |
| ------ | ------------------------------- | ------------------ |
| GET    | `/api/categories`               | 카테고리 목록 조회 |
| GET    | `/api/categories/{category_id}` | 카테고리 상세 조회 |
| POST   | `/api/categories`               | 카테고리 등록      |
| PATCH  | `/api/categories/{category_id}` | 카테고리 수정      |
| DELETE | `/api/categories/{category_id}` | 카테고리 삭제      |

### Transaction API

| Method | URL                                  | 설명           |
| ------ | ------------------------------------ | -------------- |
| GET    | `/api/transactions`                  | 거래 목록 조회 |
| GET    | `/api/transactions/{transaction_id}` | 거래 상세 조회 |
| POST   | `/api/transactions`                  | 거래 등록      |
| PATCH  | `/api/transactions/{transaction_id}` | 거래 수정      |
| DELETE | `/api/transactions/{transaction_id}` | 거래 삭제      |

### Statistics API

| Method | URL                        | 설명                      |
| ------ | -------------------------- | ------------------------- |
| GET    | `/api/statistics/summary`  | 전체 요약 통계 조회       |
| GET    | `/api/statistics/monthly`  | 월별 수입/지출 통계 조회  |
| GET    | `/api/statistics/category` | 카테고리별 지출 통계 조회 |

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
```

MySQL 데이터베이스를 생성합니다.

```bash
mysql -uroot -p1234 -e "CREATE DATABASE IF NOT EXISTS wallet_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
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

### 구현 완료

#### Backend

- FastAPI 백엔드 기본 구조
- MySQL 연결 설정
- SQLAlchemy 모델 정의
- 계좌 CRUD API
- 카테고리 CRUD API
- 거래 CRUD API
- 거래 생성/수정/삭제 시 계좌 잔액 정합성 처리
- 요약 통계 API
- 월별 수입/지출 통계 API
- 카테고리별 지출 통계 API
- Swagger 기반 API 테스트
- 백엔드 README 정리

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

- 회원가입 API
- 로그인 API
- JWT 인증
- Redis 기반 Refresh Token 관리
- 로그아웃 및 토큰 재발급
- 현재 로그인 사용자 기준 데이터 필터링
- `member_id` 직접 입력 제거
- 콘텐츠 API 구현
- 광고 / 이벤트 / 공지사항 / 정보성 게시글 API 연동

#### Frontend

- 백엔드 API 연동
- 계좌 목록/등록/수정/삭제 화면 구현
- 카테고리 목록/등록/수정/삭제 화면 구현
- 거래 목록/등록/수정/삭제 화면 구현
- 통계 API 기반 차트 데이터 연동
- 로그인/회원가입 화면 구현
- JWT 인증 흐름 연동
- 상세 페이지 라우트 구현
- placeholder 데이터 제거

## 개발 방향

현재 프로젝트는 백엔드 DB 정합성과 API 안정성을 우선으로 개발하고 있습니다.

특히 거래 내역과 계좌 잔액이 어긋나지 않도록, 거래 생성·수정·삭제 시 잔액 변경 흐름을 백엔드에서 처리합니다.

프론트엔드는 먼저 화면 구조와 라우팅을 구성한 뒤, 백엔드 API와 단계적으로 연결하는 방식으로 개발합니다.

이후 인증 기능을 추가하여 사용자가 직접 `member_id`를 입력하지 않고, JWT에서 현재 로그인 사용자를 식별하는 구조로 개선할 예정입니다. Refresh Token은 Redis에 저장하는 방식으로 구현할 계획입니다.
