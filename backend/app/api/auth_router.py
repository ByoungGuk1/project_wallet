from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.auth_schema import AuthMemberResponse, SignupRequest
from app.services import auth_service

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/signup", response_model=AuthMemberResponse)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    return auth_service.signup(db, data)
