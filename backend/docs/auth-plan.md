# Auth Plan

## 목표

Project Wallet의 회원 인증 구조를 설계

## 구현 범위

- 회원가입
- 로그인
- JWT Access Token 발급
- Refresh Token 관리 방식 검토
- 인증이 필요한 API 보호

## 인증 흐름

1. 사용자가 이메일과 비밀번호로 로그인 요청
2. 서버에서 회원 정보 조회
3. 비밀번호 검증
4. Access Token 발급
5. Refresh Token 저장 방식 결정
6. 클라이언트는 Access Token을 Authorization 헤더에 포함해 요청

## 검토할 기술

- FastAPI Depends
- JWT
- SQLAlchemy
- Redis 또는 DB 기반 Refresh Token 저장

## 구현 순서

1. Member 모델 확인
2. 회원가입 API 구현
3. 로그인 API 구현
4. Access Token 발급
5. Refresh Token 저장 방식 결정
6. 인증 Depends 적용
7. 보호 API에 인증 적용

### 세부 작업

- 비밀번호 해싱 방식 확인
- JWT 발급 유틸 작성
- Access Token 만료 시간 설정
- Refresh Token 저장 위치 결정
  - DB 저장
  - Redis 저장
- 인증 실패 응답 형식 정리
