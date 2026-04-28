from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services import statistics_service

router = APIRouter(prefix="/api/statistics", tags=["Statistics"])


@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    return statistics_service.get_summary(db)


@router.get("/monthly")
def get_monthly_statistics(db: Session = Depends(get_db)):
    return statistics_service.get_monthly_statistics(db)


@router.get("/category")
def get_category_statistics(db: Session = Depends(get_db)):
    return statistics_service.get_category_statistics(db)
