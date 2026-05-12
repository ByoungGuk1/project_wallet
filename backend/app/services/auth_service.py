from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.enums import MemberType, SigninType
from app.models.member import LocalMember, Member
from app.schemas.auth_schema import LoginRequest, SignupRequest


def signup(db: Session, data: SignupRequest):
    existing_member = (
        db.query(Member)
        .filter(Member.email == data.email)
        .first()
    )

    if existing_member is not None:
        raise HTTPException(status_code=409, detail="이미 사용 중인 이메일입니다.")

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

    try:
        db.commit()
        db.refresh(member)
        return member
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="회원가입 처리 중 중복 데이터가 발생했습니다.")

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

    access_token = create_access_token(
        {
            "sub": str(member.id),
            "email": member.email,
            "member_type": member.member_type.value,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
