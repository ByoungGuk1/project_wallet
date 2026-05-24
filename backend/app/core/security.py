import secrets
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_context.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
    payload = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )

    payload.update(
        {
            "exp": expire,
            "type": "access",
        }
    )

    return jwt.encode(
        payload,
        settings.secret_key,
        algorithm=settings.algorithm,
    )


def create_refresh_token() -> str:
    return secrets.token_urlsafe(64)


def get_access_token_ttl_seconds(token: str) -> int:
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

    expire_timestamp = payload.get("exp")
    if expire_timestamp is None:
        raise HTTPException(status_code=401, detail=error_messages.INVALID_TOKEN)

    expire_datetime = datetime.fromtimestamp(expire_timestamp, tz=timezone.utc)
    now = datetime.now(timezone.utc)

    ttl_seconds = int((expire_datetime - now).total_seconds())

    if ttl_seconds <= 0:
        raise HTTPException(status_code=401, detail=error_messages.EXPIRED_TOKEN)

    return ttl_seconds
