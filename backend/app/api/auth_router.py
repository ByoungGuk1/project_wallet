from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth_dependency import get_current_member
from app.models.member import Member
from app.schemas.auth_schema import (
    AuthMemberResponse,
    LoginRequest,
    MessageResponse,
    ReissueRequest,
    SignupRequest,
    TokenResponse,
)
from app.services import auth_service


router = APIRouter(prefix="/api/auth", tags=["Auth"])
bearer_scheme = HTTPBearer()


@router.post("/signup", response_model=AuthMemberResponse)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    return auth_service.signup(db, data)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return auth_service.login(db, data)


@router.post("/reissue", response_model=TokenResponse)
def reissue(data: ReissueRequest, db: Session = Depends(get_db)):
    return auth_service.reissue_access_token(db, data)


@router.post("/logout", response_model=MessageResponse)
def logout(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    current_member: Member = Depends(get_current_member),
):
    return auth_service.logout(current_member.id, credentials.credentials)


@router.get("/me", response_model=AuthMemberResponse)
def get_me(current_member: Member = Depends(get_current_member)):
    return current_member
