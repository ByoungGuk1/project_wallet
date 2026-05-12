from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.enums import MemberType, SigninType
from app.models.member import LocalMember, Member
from app.schemas.auth_schema import SignupRequest


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
