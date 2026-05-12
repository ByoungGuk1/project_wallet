from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.session import get_db
from app.models.member import Member

bearer_scheme = HTTPBearer()


def get_current_member(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm],
        )

        member_id = payload.get("sub")

        if member_id is None:
            raise HTTPException(status_code=401, detail="유효하지 않은 토큰입니다.")

    except JWTError:
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰입니다.")

    member = db.query(Member).filter(Member.id == int(member_id)).first()

    if member is None:
        raise HTTPException(status_code=401, detail="회원을 찾을 수 없습니다.")

    return member
