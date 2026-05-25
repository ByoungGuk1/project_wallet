# 인증 구현 정리

## 기준

이 문서는 `project_wallet` 백엔드의 인증 구현 상태를 정리합니다.

기존 `auth-plan.md`는 인증 기능을 설계하기 위한 초기 계획 문서였지만, 현재 백엔드에는 로컬 회원가입, 로그인, JWT Access Token, Redis 기반 Refresh Token, Refresh Token Rotation, 로그아웃, Access Token blacklist, 현재 로그인 사용자 기준 API 보호가 구현되어 있습니다.

따라서 이 문서는 “계획”이 아니라 “현재 인증 구현 요약 및 검증 기준”으로 관리합니다.

## 1. 인증 기능 목표

`project_wallet`은 개인 금융 관리 서비스이므로 사용자별 데이터 분리가 중요

인증 기능의 목표는 단순히 로그인 여부를 확인하는 것이 아니라

계좌, 카테고리, 거래, 통계 API가 현재 로그인 사용자 기준으로만 동작하도록 만드는 것

현재 인증 기능의 목표

- 로컬 회원가입을 통해 사용자를 등록
- 비밀번호는 평문으로 저장하지 않고 bcrypt 해시 값으로 저장
- 로그인 성공 시 JWT Access Token을 발급
- Refresh Token을 발급하고 Redis에 저장
- Refresh Token 기반 Access Token 재발급을 지원
- 재발급 시 Refresh Token Rotation을 적용
- 로그아웃 시 Redis에 저장된 Refresh Token을 삭제
- 로그아웃 시 Access Token을 Redis blacklist에 저장
- 로그아웃된 Access Token의 재사용을 차단
- 인증이 필요한 API는 현재 로그인 사용자 기준으로만 접근 가능하게 한다.
- 클라이언트가 `member_id`를 직접 넘겨 다른 사용자의 데이터에 접근하지 못하게 한다.

## 2. 인증 관련 기술 스택

| 구분             | 기술             |
| ---------------- | ---------------- |
| Framework        | FastAPI          |
| Auth             | JWT              |
| Password Hashing | bcrypt / passlib |
| Token Storage    | Redis            |
| Database         | MySQL            |
| ORM              | SQLAlchemy       |
| Validation       | Pydantic         |
| API Docs         | Swagger UI       |

## 3. 인증 기능 구현 상태

| 기능                     | 상태      | 설명                                                       |
| ------------------------ | --------- | ---------------------------------------------------------- |
| 로컬 회원가입            | 구현 완료 | `members`, `local_members`에 사용자 정보 저장              |
| 비밀번호 해싱            | 구현 완료 | bcrypt 기반 해시 저장                                      |
| 로컬 로그인              | 구현 완료 | 이메일, 비밀번호 기반 로그인                               |
| Access Token 발급        | 구현 완료 | JWT 기반 Access Token 발급                                 |
| Access Token type 검증   | 구현 완료 | payload의 `type=access` 확인                               |
| Refresh Token 발급       | 구현 완료 | `secrets.token_urlsafe(64)` 기반 랜덤 문자열 발급          |
| Refresh Token Redis 저장 | 구현 완료 | Redis에 member 기준 token 저장                             |
| Refresh Token Rotation   | 구현 완료 | 재발급 시 기존 Refresh Token 폐기 후 새 Refresh Token 발급 |
| Access Token 재발급      | 구현 완료 | Refresh Token 검증 후 새 Access Token 발급                 |
| 로그아웃                 | 구현 완료 | Refresh Token 삭제 및 Access Token blacklist 등록          |
| Access Token blacklist   | 구현 완료 | 로그아웃된 Access Token 재사용 차단                        |
| 현재 사용자 조회         | 구현 완료 | `/api/auth/me`                                             |
| 보호 API 인증 적용       | 구현 완료 | 계좌, 카테고리, 거래, 통계 API 보호                        |
| 에러 메시지 상수화       | 구현 완료 | `app/core/error_messages.py` 기준 관리                     |
| 응답 모델 정리           | 구현 완료 | 공통 `MessageResponse`, 통계 응답 모델 적용                |

## 4. 인증 API 목록

| Method | URL                 | 인증 필요 여부 | 설명                                                      |
| ------ | ------------------- | -------------- | --------------------------------------------------------- |
| POST   | `/api/auth/signup`  | 불필요         | 로컬 회원가입                                             |
| POST   | `/api/auth/login`   | 불필요         | 로컬 로그인 및 토큰 발급                                  |
| GET    | `/api/auth/me`      | 필요           | 현재 로그인 사용자 조회                                   |
| POST   | `/api/auth/reissue` | 불필요         | Refresh Token 기반 Access Token 재발급                    |
| POST   | `/api/auth/logout`  | 필요           | 로그아웃, Refresh Token 삭제, Access Token blacklist 등록 |

## 5. 인증 데이터 구조

### 5.1 `members`

`members`는 회원의 공통 정보를 저장한다.

주요 역할:

- 회원 ID
- 이메일
- 닉네임
- 회원 유형
- 로그인 유형
- 생성일
- 수정일

### 5.2 `local_members`

`local_members`는 로컬 로그인 회원의 인증 정보를 저장한다.

주요 역할:

- 회원 ID
- 비밀번호 해시

비밀번호는 평문으로 저장하지 않고 bcrypt 해시 값으로 저장한다.

### 5.3 `oauth_members`

`oauth_members`는 향후 OAuth 로그인 확장을 고려한 테이블이다.

현재 인증 구조는 로컬 로그인 중심으로 구현되어 있으며, OAuth 로그인은 향후 확장 계획으로 열어만 두었다.

## 6. 회원가입 흐름

```text
1. 클라이언트가 이메일, 비밀번호, 닉네임을 전송
2. 서버는 이메일 중복 여부를 확인
3. 비밀번호를 bcrypt로 해싱
4. members 테이블에 회원 공통 정보를 저장
5. local_members 테이블에 비밀번호 해시를 저장
6. 회원가입 완료 응답을 반환
```

### 처리 기준

- 비밀번호는 평문으로 저장하지 않는다.
- 이메일 중복 검사를 수행한다.
- 회원 공통 정보와 로컬 로그인 정보를 분리한다.
- 회원가입 성공 후 자동 로그인하지 않는다.
- 로그인은 `/api/auth/login`을 별도로 호출하는 구조로 둔다.

### 실패 조건

| 상황                              | 상태코드 | 메시지                                       |
| --------------------------------- | -------: | -------------------------------------------- |
| 이미 사용 중인 이메일             |      409 | 이미 사용 중인 이메일입니다.                 |
| 회원가입 처리 중 중복 데이터 발생 |      409 | 회원가입 처리 중 중복 데이터가 발생했습니다. |

## 7. 로그인 흐름

```text
1. 클라이언트가 이메일과 비밀번호를 전송
2. 서버는 이메일로 회원을 조회
3. 로컬 로그인 회원인지 확인
4. local_members에서 비밀번호 해시를 조회
5. 입력 비밀번호와 저장된 비밀번호 해시를 비교
6. 검증에 성공하면 JWT Access Token을 발급
7. Refresh Token을 생성
8. Refresh Token을 Redis에 저장
9. Access Token과 Refresh Token을 응답으로 반환
```

### 로그인 실패 조건

| 상황                          | 상태코드 | 메시지                                    |
| ----------------------------- | -------: | ----------------------------------------- |
| 이메일에 해당하는 회원이 없음 |      401 | 이메일 또는 비밀번호가 올바르지 않습니다. |
| 비밀번호가 일치하지 않음      |      401 | 이메일 또는 비밀번호가 올바르지 않습니다. |
| 로컬 로그인 회원 정보가 없음  |      401 | 이메일 또는 비밀번호가 올바르지 않습니다. |
| 로컬 로그인 회원이 아님       |      400 | 로컬 로그인 회원이 아닙니다.              |

계정 존재 여부 노출을 줄이기 위해 로그인 실패 시에는 이메일 존재 여부를 구분해서 알려주지 않는다.

## 8. Token 설계

## 8.1 Access Token

Access Token은 인증이 필요한 API 요청에서 현재 사용자를 식별하기 위해 사용한다.

역할:

- 현재 로그인 사용자 식별
- 인증이 필요한 API 접근 허용
- JWT payload에서 사용자 ID 추출
- 토큰 타입 검증
- 만료 시간 검증

Payload 예시:

```text
sub: 회원 ID
email: 사용자 이메일
member_type: 회원 유형
type: access
exp: 만료 시간
```

클라이언트 요청 예시:

```http
Authorization: Bearer <access_token>
```

### Access Token 처리 기준

- Access Token은 JWT로 발급
- payload의 `type`은 `access`로 저장
- 인증 의존성에서 `type=access`인지 검증
- 로그아웃된 Access Token은 Redis blacklist에서 확인
- Access Token은 만료 시간이 짧게 설정되는 것을 전제로 한다.

## 8.2 Refresh Token

Refresh Token은 Access Token이 만료되었을 때 새 Access Token을 발급받기 위해 사용한다.

현재 구현에서 Refresh Token은 JWT가 아닌, `secrets.token_urlsafe(64)`로 생성한 랜덤 문자열이다.

역할:

- Access Token 재발급
- 로그인 상태 유지
- Redis 기반 서버 측 토큰 관리
- 로그아웃 시 서버에서 삭제
- 재발급 시 Rotation 적용
- 탈취 또는 만료 시 서버에서 무효화 가능

### Redis 저장 방식

```text
refresh_token:{member_id} -> latest_refresh_token
refresh_token_value:{refresh_token} -> member_id
```

예시:

```text
refresh_token:3 -> abc.refresh.token.value
refresh_token_value:abc.refresh.token.value -> 3
```

### TTL

Refresh Token은 Redis TTL을 통해 만료 시간을 관리한다.

```text
TTL = REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
```

### Redis를 사용하는 이유

- Refresh Token을 서버에서 관리할 수 있다.
- 로그아웃 시 Refresh Token을 삭제할 수 있다.
- Refresh Token Rotation을 구현하기 쉽다.
- Redis TTL을 통해 만료 시간을 관리할 수 있다.
- DB에 비해 세션성 데이터를 관리하기 적합하다.

## 9. Access Token 재발급 흐름

현재 `/api/auth/reissue`는 Refresh Token Rotation을 적용

```text
1. 클라이언트가 Refresh Token을 서버로 전송
2. 서버는 Redis에서 refresh_token_value:{refresh_token} 키로 member_id를 조회
3. member_id가 없으면 유효하지 않은 Refresh Token으로 처리
4. Redis에서 refresh_token:{member_id}에 저장된 최신 Refresh Token을 조회
5. 요청 Refresh Token과 Redis에 저장된 최신 Refresh Token을 비교
6. 두 값이 다르면 유효하지 않은 Refresh Token으로 처리
7. DB에서 member_id에 해당하는 회원을 조회
8. 회원이 존재하면 새 Access Token을 발급
9. 새 Refresh Token을 생성
10. 기존 Refresh Token reverse key를 삭제
11. 새 Refresh Token을 Redis에 저장
12. 새 Access Token과 새 Refresh Token을 응답으로 반환
```

### 재발급 응답 예시

```json
{
  "access_token": "NEW_ACCESS_TOKEN",
  "refresh_token": "NEW_REFRESH_TOKEN",
  "token_type": "bearer"
}
```

### 재발급 실패 조건

| 상황                                    | 상태코드 | 메시지                             |
| --------------------------------------- | -------: | ---------------------------------- |
| Refresh Token이 Redis에 없음            |      401 | 유효하지 않은 Refresh Token입니다. |
| 요청 Refresh Token이 최신 저장값과 다름 |      401 | 유효하지 않은 Refresh Token입니다. |
| 사용자 정보가 DB에 존재하지 않음        |      401 | 회원을 찾을 수 없습니다.           |

### Rotation 적용 이유

Refresh Token을 계속 재사용하면 토큰이 탈취되었을 때 만료 전까지 반복 사용될 수 있다.

Rotation을 적용하면 재발급 시 기존 Refresh Token을 폐기하고 새 Refresh Token을 발급하므로, 이전 Refresh Token 재사용을 차단할 수 있다.

## 10. 로그아웃 흐름

현재 로그아웃은 Refresh Token 삭제와 Access Token blacklist 등록을 함께 수행한다.

```text
1. 클라이언트가 Access Token으로 로그아웃 요청을 보냄
2. 서버는 Access Token을 검증해 현재 사용자를 확인
3. Redis에서 refresh_token:{member_id}를 조회
4. 저장된 Refresh Token이 있으면 refresh_token_value:{refresh_token} 키를 삭제
5. refresh_token:{member_id} 키를 삭제
6. Access Token의 남은 만료 시간을 계산
7. Redis에 blacklist:access_token:{access_token} 키를 저장
8. 로그아웃 완료 응답을 반환
```

### Redis blacklist 저장 방식

```text
blacklist:access_token:{access_token} -> member_id
```

### blacklist TTL

Access Token blacklist의 TTL은 Access Token의 남은 만료 시간으로 설정한다.

```text
TTL = Access Token exp - 현재 시각
```

이렇게 하면 Access Token이 원래 만료될 시점 이후에는 blacklist key도 자동으로 사라진다.

### 로그아웃 후 처리 기준

- Refresh Token은 Redis에서 삭제된다.
- 로그아웃된 Access Token은 Redis blacklist에 저장된다.
- 같은 Access Token으로 보호 API에 접근하면 401을 반환한다.
- Access Token이 원래 만료되면 blacklist key도 TTL에 의해 삭제된다.

## 11. 현재 로그인 사용자 조회

`GET /api/auth/me`는 Access Token을 기반으로 현재 로그인 사용자를 조회한다.

흐름:

```text
1. Authorization Header에서 Bearer Token을 추출
2. Redis blacklist에 등록된 Access Token인지 확인
3. JWT Access Token을 검증
4. payload의 type이 access인지 확인
5. payload에서 member_id를 추출
6. member_id를 정수로 변환
7. DB에서 회원 정보를 조회
8. 현재 로그인 사용자 정보를 반환
```

## 12. 인증 의존성

인증이 필요한 API에서는 `get_current_member` 인증 의존성을 사용한다.

역할:

- Authorization Header 확인
- Bearer Token 추출
- Access Token blacklist 확인
- JWT 검증
- Token type 확인
- member_id 추출
- DB에서 현재 사용자 조회
- 존재하지 않는 사용자면 예외 발생

사용 예시:

```python
current_member = Depends(get_current_member)
```

적용 대상:

- `/api/auth/me`
- `/api/auth/logout`
- 계좌 API
- 카테고리 API
- 거래 API
- 통계 API

## 13. 사용자별 데이터 접근 제어

`project_wallet`의 계좌, 카테고리, 거래, 통계 API는 현재 로그인 사용자 기준으로 동작한다.

## 13.1 계좌

계좌 API 처리 기준:

- 계좌 생성 시 `member_id`를 클라이언트가 직접 입력하지 않는다.
- 서버가 Access Token에서 추출한 현재 사용자 ID를 사용한다.
- 계좌 목록 조회 시 현재 사용자의 계좌만 조회
- 계좌 상세 조회, 수정, 삭제 시 현재 사용자의 계좌인지 확인

## 13.2 카테고리

카테고리 API 처리 기준:

- 카테고리 생성 시 `member_id`를 클라이언트가 직접 입력하지 않는다.
- 서버가 현재 로그인 사용자 ID를 기준으로 카테고리를 생성
- 카테고리 목록 조회 시 현재 사용자의 카테고리만 조회
- 카테고리 상세 조회, 수정, 삭제 시 현재 사용자의 카테고리인지 확인

## 13.3 거래

`transactions`에는 `member_id`를 직접 저장하지 않는다.

거래 소유자는 다음 관계로 확인

```text
transactions.account_id
→ accounts.id
→ accounts.member_id
```

거래 생성 시 확인할 것:

- `account_id`가 현재 로그인 사용자의 계좌인지 확인
- `category_id`가 현재 로그인 사용자의 카테고리인지 확인
- 거래 유형과 카테고리 유형이 일치하는지 확인
- 거래 생성, 수정, 삭제 시 계좌 잔액 정합성을 유지

## 13.4 통계

통계 API는 `transactions`와 `accounts`를 조인하여 현재 로그인 사용자 데이터만 집계한다.

```sql
SELECT ...
FROM transactions t
JOIN accounts a
ON t.account_id = a.id
WHERE a.member_id = :member_id;
```

## 14. 인증이 필요한 API

| 기능             | 인증 필요 여부 |
| ---------------- | -------------- |
| 회원가입         | 불필요         |
| 로그인           | 불필요         |
| 토큰 재발급      | 불필요         |
| 현재 사용자 조회 | 필요           |
| 로그아웃         | 필요           |
| 계좌 CRUD        | 필요           |
| 카테고리 CRUD    | 필요           |
| 거래 CRUD        | 필요           |
| 통계 조회        | 필요           |

## 15. 예외 처리 기준

현재 예외 응답은 FastAPI 기본 형식을 사용한다.

```json
{
  "detail": "에러 메시지"
}
```

에러 메시지는 `app/core/error_messages.py`에서 상수로 관리한다.

### 15.1 인증 관련 메시지

| 상황                        | 상태코드 | 메시지                             |
| --------------------------- | -------: | ---------------------------------- |
| 유효하지 않은 Access Token  |      401 | 유효하지 않은 토큰입니다.          |
| 만료된 Access Token         |      401 | 만료된 토큰입니다.                 |
| 로그아웃된 Access Token     |      401 | 로그아웃된 토큰입니다.             |
| 유효하지 않은 Refresh Token |      401 | 유효하지 않은 Refresh Token입니다. |
| 회원 정보 없음              |      401 | 회원을 찾을 수 없습니다.           |

### 15.2 로그인 / 회원가입 관련 메시지

| 상황                              | 상태코드 | 메시지                                       |
| --------------------------------- | -------: | -------------------------------------------- |
| 이메일 중복                       |      409 | 이미 사용 중인 이메일입니다.                 |
| 회원가입 처리 중 중복 데이터 발생 |      409 | 회원가입 처리 중 중복 데이터가 발생했습니다. |
| 이메일 또는 비밀번호 불일치       |      401 | 이메일 또는 비밀번호가 올바르지 않습니다.    |
| 로컬 로그인 회원 아님             |      400 | 로컬 로그인 회원이 아닙니다.                 |

### 15.3 리소스 접근 관련 메시지

| 상황                             | 상태코드 | 메시지                                         |
| -------------------------------- | -------: | ---------------------------------------------- |
| 계좌 없음                        |      404 | 계좌를 찾을 수 없습니다.                       |
| 카테고리 없음                    |      404 | 카테고리를 찾을 수 없습니다.                   |
| 거래 없음                        |      404 | 거래 내역을 찾을 수 없습니다.                  |
| 거래 유형과 카테고리 유형 불일치 |      400 | 거래 유형과 카테고리 유형이 일치하지 않습니다. |
| 거래 금액이 0 이하               |      400 | 거래 금액은 0보다 커야 합니다.                 |
| 지원하지 않는 거래 유형          |      400 | 지원하지 않는 거래 유형입니다.                 |

## 16. 응답 모델 정리

공통 메시지 응답은 `common_schema.py`의 `MessageResponse`로 분리한다.

```python
class MessageResponse(BaseModel):
    message: str
```

적용 대상:

- `POST /api/auth/logout`
- `DELETE /api/accounts/{account_id}`
- `DELETE /api/categories/{category_id}`
- `DELETE /api/transactions/{transaction_id}`

통계 API는 별도 응답 모델을 사용한다.

| API                            | Response Model                     |
| ------------------------------ | ---------------------------------- |
| `GET /api/statistics/summary`  | `SummaryResponse`                  |
| `GET /api/statistics/monthly`  | `list[MonthlyStatisticsResponse]`  |
| `GET /api/statistics/category` | `list[CategoryStatisticsResponse]` |

## 17. Redis 확인 명령어

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

## 18. 테스트 시나리오

### 18.1 회원가입

- [ ] 정상 회원가입
- [ ] 중복 이메일 회원가입 실패
- [ ] 비밀번호 해시 저장 확인
- [ ] `members`, `local_members` 분리 저장 확인

### 18.2 로그인

- [ ] 정상 로그인
- [ ] 존재하지 않는 이메일 로그인 실패
- [ ] 잘못된 비밀번호 로그인 실패
- [ ] Access Token 발급 확인
- [ ] Refresh Token 발급 확인
- [ ] Refresh Token Redis 저장 확인

### 18.3 현재 사용자 조회

- [ ] Access Token으로 `/api/auth/me` 호출 성공
- [ ] Access Token 없이 호출 실패
- [ ] 잘못된 Access Token으로 호출 실패
- [ ] 로그아웃된 Access Token으로 호출 실패

### 18.4 토큰 재발급

- [ ] 정상 Refresh Token으로 Access Token 재발급
- [ ] 재발급 시 새 Refresh Token 반환
- [ ] 기존 Refresh Token 재사용 실패
- [ ] Redis에 최신 Refresh Token만 남는지 확인
- [ ] Redis에 없는 Refresh Token으로 재발급 실패

### 18.5 로그아웃

- [ ] 로그아웃 성공
- [ ] Redis Refresh Token 삭제 확인
- [ ] Redis Access Token blacklist 생성 확인
- [ ] 로그아웃 후 기존 Refresh Token 재사용 실패
- [ ] 로그아웃 후 기존 Access Token 재사용 실패
- [ ] blacklist TTL이 Access Token 남은 만료 시간 기준인지 확인

### 18.6 보호 API

- [ ] 로그인 사용자 기준 계좌 조회
- [ ] 다른 사용자의 계좌 접근 차단
- [ ] 로그인 사용자 기준 카테고리 조회
- [ ] 다른 사용자의 카테고리 접근 차단
- [ ] 로그인 사용자 기준 거래 조회
- [ ] 다른 사용자의 거래 접근 차단
- [ ] 통계 API가 현재 로그인 사용자 데이터만 집계하는지 확인

### 18.7 응답 모델

- [ ] 로그아웃 응답이 `MessageResponse` 형태인지 확인
- [ ] 계좌 삭제 응답이 `MessageResponse` 형태인지 확인
- [ ] 카테고리 삭제 응답이 `MessageResponse` 형태인지 확인
- [ ] 거래 삭제 응답이 `MessageResponse` 형태인지 확인
- [ ] 통계 API 응답 모델이 Swagger에 표시되는지 확인

## 19. 향후 개선 사항

### 19.1 OAuth 로그인

향후 OAuth 로그인 확장

대상 후보:

- Google
- Kakao
- Naver

확장 시 고려할 점:

- `members` 테이블과 `oauth_members` 테이블 관계
- provider
- provider_id
- 이메일 중복 처리

### 19.2 프론트엔드 연동

프론트엔드 연동 시 고려할 점:

- Access Token 저장 위치
- Refresh Token 저장 위치
- 로그인 상태 유지 방식
- 401 응답 발생 시 재발급 요청 처리
- Refresh Token Rotation 대응
- 로그아웃 시 클라이언트 토큰 삭제
- 인증이 필요한 라우트 보호

### 19.3 자동 테스트 추가

현재 인증 기능은 Swagger 기반 수동 검증 중심이다.

향후 다음 테스트를 자동화해야 한다.

- 회원가입 테스트
- 로그인 테스트
- 토큰 재발급 테스트
- 로그아웃 테스트
- Access Token blacklist 테스트
- Refresh Token Rotation 테스트
- 보호 API 접근 제어 테스트

### 19.4 API 응답 형식 통일

현재는 FastAPI 기본 응답 형식과 각 response model을 사용

향후 전체 API 응답을 다음과 같은 공통 envelope 구조로 통일할 수 있다.

```json
{
  "success": true,
  "message": "요청이 성공했습니다.",
  "data": {}
}
```

현재 단계에서는 FastAPI 기본 응답 형식을 유지

## 20. 구현 및 문서화 우선순위

현재 인증 구조는 기능 추가보다 안정화와 검증을 우선한다.

1. 회원가입 / 로그인 / 재발급 / 로그아웃 Swagger 재확인
2. Redis Refresh Token 저장 여부 확인
3. Redis Access Token blacklist 저장 여부 확인
4. 보호 API 접근 제어 재확인
5. 다른 사용자의 데이터 접근 차단 테스트
6. README와 `auth-plan.md`의 인증 설명 일치 여부 점검
7. 프론트엔드 연동 방식 결정
8. OAuth 로그인 확장 여부 결정

## 21. 요약정리

```text
FastAPI 기반 백엔드에서 로컬 회원가입과 로그인을 구현했고,
비밀번호는 bcrypt로 해싱해 저장

로그인 성공 시 JWT Access Token과 Refresh Token을 발급하며,
Refresh Token은 Redis에 저장해 서버 측에서 관리

Refresh Token은 랜덤 문자열로 생성했고,
Redis에는 member_id 기준 최신 Refresh Token과
Refresh Token 값 기준 member_id 역참조 키를 함께 저장

Access Token 재발급 시에는 Refresh Token Rotation을 적용해
기존 Refresh Token을 폐기하고 새 Refresh Token을 발급하도록 구성

로그아웃 시에는 Refresh Token을 삭제하고,
Access Token도 남은 만료 시간만큼 Redis blacklist에 저장해 로그아웃된 토큰의 재사용을 차단

인증이 필요한 계좌, 카테고리, 거래, 통계 API는
Access Token에서 추출한 현재 로그인 사용자 ID를 기준으로만 동작하도록 구성

거래 테이블에는 member_id를 직접 저장하지 않고,
transactions.account_id → accounts.member_id 관계를 통해
거래 소유자를 확인하도록 설계

인증과 리소스 접근 과정에서 사용되는 예외 메시지는
app/core/error_messages.py로 분리해 중복 문자열을 줄이고
관리 지점을 통일
```
