from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth_dependency import get_current_member
from app.models.member import Member
from app.schemas.transaction_schema import (
    TransactionCreate,
    TransactionResponse,
    TransactionUpdate,
)
from app.services import transaction_service

router = APIRouter(prefix="/api/transactions", tags=["Transaction"])


@router.get("", response_model=list[TransactionResponse])
def get_transactions(
    db: Session = Depends(get_db),
    current_member: Member = Depends(get_current_member),
):
    return transaction_service.get_transactions(db, current_member)


@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_member: Member = Depends(get_current_member),
):
    return transaction_service.get_transaction(db, transaction_id, current_member)


@router.post("", response_model=TransactionResponse)
def create_transaction(
    data: TransactionCreate,
    db: Session = Depends(get_db),
    current_member: Member = Depends(get_current_member),
):
    return transaction_service.create_transaction(db, data, current_member)


@router.patch("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int,
    data: TransactionUpdate,
    db: Session = Depends(get_db),
    current_member: Member = Depends(get_current_member),
):
    return transaction_service.update_transaction(
        db,
        transaction_id,
        data,
        current_member,
    )


@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_member: Member = Depends(get_current_member),
):
    return transaction_service.delete_transaction(db, transaction_id, current_member)
