from decimal import Decimal

from sqlalchemy.orm import Session


def get_summary(db: Session):
    return {
        "total_balance": Decimal("0"),
        "monthly_income": Decimal("0"),
        "monthly_expense": Decimal("0"),
    }


def get_monthly_statistics(db: Session):
    return []


def get_category_statistics(db: Session):
    return []
