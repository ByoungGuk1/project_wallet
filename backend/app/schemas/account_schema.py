from decimal import Decimal

from pydantic import BaseModel


class AccountBase(BaseModel):
    account_name: str
    account_type: str
    balance: Decimal = Decimal("0")


class AccountCreate(AccountBase):
    user_id: int


class AccountUpdate(BaseModel):
    account_name: str | None = None
    account_type: str | None = None
    balance: Decimal | None = None


class AccountResponse(AccountBase):
    id: int
    user_id: int

    model_config = {"from_attributes": True}
