from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.redis_client import redis_client
from app.core import error_messages
from app.database.session import get_db
from app.models.member import Member


bearer_scheme = HTTPBearer()


def get_current_member(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    token = credentials.credentials

    if redis_client.exists(f"blacklist:access_token:{token}"):
        raise HTTPException(status_code=401, detail=error_messages.LOGGED_OUT_TOKEN)

    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm],
        )
    except JWTError:
        raise HTTPException(status_code=401, detail=error_messages.INVALID_TOKEN)

    token_type = payload.get("type")
    if token_type != "access":
        raise HTTPException(status_code=401, detail=error_messages.INVALID_TOKEN)

    member_id = payload.get("sub")
    if member_id is None:
        raise HTTPException(status_code=401, detail=error_messages.INVALID_TOKEN)

    try:
        member_id = int(member_id)
    except (TypeError, ValueError):
        raise HTTPException(status_code=401, detail=error_messages.INVALID_TOKEN)

    member = db.query(Member).filter(Member.id == member_id).first()

    if member is None:
        raise HTTPException(status_code=401, detail=error_messages.MEMBER_NOT_FOUND)

    return member
