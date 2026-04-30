from datetime import date

from pydantic import BaseModel

from app.models.enums import TransactionType


class TransactionBase(BaseModel):
    account_id: int
    category_id: int | None = None
    transaction_type: TransactionType
    amount: int
    transaction_date: date
    memo: str | None = None


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    category_id: int | None = None
    transaction_type: TransactionType | None = None
    amount: int | None = None
    transaction_date: date | None = None
    memo: str | None = None


class TransactionResponse(TransactionBase):
    id: int

    model_config = {"from_attributes": True}
