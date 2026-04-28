from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.schemas.transaction_schema import TransactionCreate, TransactionUpdate


def find_all(db: Session):
    return db.query(Transaction).order_by(Transaction.transaction_date.desc()).all()


def find_by_id(db: Session, transaction_id: int):
    return db.query(Transaction).filter(Transaction.id == transaction_id).first()


def create(db: Session, data: TransactionCreate):
    transaction = Transaction(**data.model_dump())
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


def update(db: Session, transaction: Transaction, data: TransactionUpdate):
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(transaction, key, value)

    db.commit()
    db.refresh(transaction)
    return transaction


def delete(db: Session, transaction: Transaction):
    db.delete(transaction)
    db.commit()
