from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.redis_client import redis_client
from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)
from app.models.enums import MemberType, SigninType
from app.models.member import LocalMember, Member
from app.schemas.auth_schema import LoginRequest, ReissueRequest, SignupRequest


def signup(db: Session, data: SignupRequest):
    existing_member = (
        db.query(Member)
        .filter(Member.email == data.email)
        .first()
    )

    if existing_member is not None:
        raise HTTPException(status_code=409, detail="이미 사용 중인 이메일입니다.")

    try:
        member = Member(
            email=data.email,
            nickname=data.nickname,
            member_type=MemberType.USER,
            signin_type=SigninType.LOCAL,
        )

        db.add(member)
        db.flush()

        local_member = LocalMember(
            member_id=member.id,
            password_hash=hash_password(data.password),
        )

        db.add(local_member)

        db.commit()
        db.refresh(member)

        return member

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="회원가입 처리 중 중복 데이터가 발생했습니다.",
        )


def login(db: Session, data: LoginRequest):
    member = (
        db.query(Member)
        .filter(Member.email == data.email)
        .first()
    )

    if member is None:
        raise HTTPException(
            status_code=401,
            detail="이메일 또는 비밀번호가 올바르지 않습니다.",
        )

    if member.signin_type != SigninType.LOCAL:
        raise HTTPException(
            status_code=400,
            detail="로컬 로그인 회원이 아닙니다.",
        )

    local_member = (
        db.query(LocalMember)
        .filter(LocalMember.member_id == member.id)
        .first()
    )

    if local_member is None:
        raise HTTPException(
            status_code=401,
            detail="이메일 또는 비밀번호가 올바르지 않습니다.",
        )

    if not verify_password(data.password, local_member.password_hash):
        raise HTTPException(
            status_code=401,
            detail="이메일 또는 비밀번호가 올바르지 않습니다.",
        )

    access_token = _create_member_access_token(member)
    refresh_token = create_refresh_token()

    _save_refresh_token(member.id, refresh_token)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


def reissue_access_token(db: Session, data: ReissueRequest):
    member_id = redis_client.get(f"refresh_token_value:{data.refresh_token}")

    if member_id is None:
        raise HTTPException(status_code=401, detail="유효하지 않은 Refresh Token입니다.")

    stored_refresh_token = redis_client.get(f"refresh_token:{member_id}")

    if stored_refresh_token is None or stored_refresh_token != data.refresh_token:
        raise HTTPException(status_code=401, detail="유효하지 않은 Refresh Token입니다.")

    member = db.query(Member).filter(Member.id == int(member_id)).first()

    if member is None:
        raise HTTPException(status_code=401, detail="회원을 찾을 수 없습니다.")

    access_token = _create_member_access_token(member)

    return {
        "access_token": access_token,
        "refresh_token": data.refresh_token,
        "token_type": "bearer",
    }


def logout(member_id: int):
    member_key = f"refresh_token:{member_id}"
    refresh_token = redis_client.get(member_key)

    if refresh_token is not None:
        redis_client.delete(f"refresh_token_value:{refresh_token}")

    redis_client.delete(member_key)

    return {"message": "로그아웃되었습니다."}


def _get_refresh_token_ttl_seconds() -> int:
    return settings.refresh_token_expire_days * 24 * 60 * 60


def _create_member_access_token(member: Member) -> str:
    return create_access_token(
        {
            "sub": str(member.id),
            "email": member.email,
            "member_type": member.member_type.value,
        }
    )


def _save_refresh_token(member_id: int, refresh_token: str):
    ttl_seconds = _get_refresh_token_ttl_seconds()

    member_key = f"refresh_token:{member_id}"
    token_key = f"refresh_token_value:{refresh_token}"

    previous_refresh_token = redis_client.get(member_key)

    if previous_refresh_token is not None:
        redis_client.delete(f"refresh_token_value:{previous_refresh_token}")

    redis_client.setex(member_key, ttl_seconds, refresh_token)
    redis_client.setex(token_key, ttl_seconds, str(member_id))
