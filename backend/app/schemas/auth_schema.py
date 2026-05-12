from pydantic import BaseModel, EmailStr

from app.models.enums import MemberType, SigninType


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    nickname: str | None = None


class AuthMemberResponse(BaseModel):
    id: int
    email: str
    nickname: str | None
    member_type: MemberType
    signin_type: SigninType

    model_config = {"from_attributes": True}
