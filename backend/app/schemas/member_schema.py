from pydantic import BaseModel, EmailStr

from app.models.enums import MemberType, SigninType


class MemberCreate(BaseModel):
    email: EmailStr
    nickname: str | None = None
    password: str


class MemberResponse(BaseModel):
    id: int
    email: EmailStr
    nickname: str | None = None
    member_type: MemberType
    signin_type: SigninType

    model_config = {"from_attributes": True}
