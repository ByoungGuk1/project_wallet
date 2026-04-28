from decimal import Decimal

from pydantic import BaseModel


class SummaryResponse(BaseModel):
    total_balance: Decimal
    monthly_income: Decimal
    monthly_expense: Decimal


class MonthlyStatisticsResponse(BaseModel):
    month: str
    income: Decimal
    expense: Decimal


class CategoryStatisticsResponse(BaseModel):
    category_name: str
    total_amount: Decimal
