from pydantic import BaseModel


class AccountBase(BaseModel):
    account_name: str | None = None
    account_number: str
    bank_name: str
    balance: int = 0


class AccountCreate(AccountBase):
    member_id: int


class AccountUpdate(BaseModel):
    account_name: str | None = None
    account_number: str | None = None
    bank_name: str | None = None
    balance: int | None = None


class AccountResponse(AccountBase):
    id: int
    member_id: int

    model_config = {"from_attributes": True}
