from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth_dependency import get_current_member
from app.models.enums import TransactionType
from app.models.member import Member
from app.services import statistics_service

router = APIRouter(prefix="/api/statistics", tags=["Statistics"])


@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_member: Member = Depends(get_current_member),
):
    return statistics_service.get_summary(db, current_member)


@router.get("/monthly")
def get_monthly_statistics(
    db: Session = Depends(get_db),
    current_member: Member = Depends(get_current_member),
):
    return statistics_service.get_monthly_statistics(db, current_member)


@router.get("/category")
def get_category_statistics(
    transaction_type: TransactionType | None = Query(default=None, alias="type"),
    db: Session = Depends(get_db),
    current_member: Member = Depends(get_current_member),
):
    return statistics_service.get_category_statistics(
        db,
        current_member,
        transaction_type,
    )
