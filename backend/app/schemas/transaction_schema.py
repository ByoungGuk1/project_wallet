from datetime import date
from decimal import Decimal

from pydantic import BaseModel


class TransactionBase(BaseModel):
    account_id: int
    category_id: int
    type: str
    amount: Decimal
    memo: str | None = None
    transaction_date: date


class TransactionCreate(TransactionBase):
    model_config = {"from_attributes": True}


class TransactionUpdate(BaseModel):
    category_id: int | None = None
    type: str | None = None
    amount: Decimal | None = None
    memo: str | None = None
    transaction_date: date | None = None


class TransactionResponse(TransactionBase):
    id: int

    model_config = {"from_attributes": True}
