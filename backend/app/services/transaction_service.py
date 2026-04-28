from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories import transaction_repository
from app.schemas.transaction_schema import TransactionCreate, TransactionUpdate


def get_transactions(db: Session):
    return transaction_repository.find_all(db)


def get_transaction(db: Session, transaction_id: int):
    transaction = transaction_repository.find_by_id(db, transaction_id)
    if transaction is None:
        raise HTTPException(status_code=404, detail="거래 내역을 찾을 수 없습니다.")
    return transaction


def create_transaction(db: Session, data: TransactionCreate):
    return transaction_repository.create(db, data)


def update_transaction(db: Session, transaction_id: int, data: TransactionUpdate):
    transaction = get_transaction(db, transaction_id)
    return transaction_repository.update(db, transaction, data)


def delete_transaction(db: Session, transaction_id: int):
    transaction = get_transaction(db, transaction_id)
    transaction_repository.delete(db, transaction)
    return {"message": "거래 내역이 삭제되었습니다."}
