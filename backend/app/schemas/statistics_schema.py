from pydantic import BaseModel

from app.models.enums import TransactionType


class SummaryResponse(BaseModel):
    total_balance: int
    monthly_income: int
    monthly_expense: int


class MonthlyStatisticsResponse(BaseModel):
    month: str
    income: int
    expense: int


class CategoryStatisticsResponse(BaseModel):
    category: str
    category_type: TransactionType
    amount: int
