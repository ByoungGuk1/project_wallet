from sqlalchemy.orm import Session

from app.models.account import Account
from app.schemas.account_schema import AccountCreate, AccountUpdate


def find_all(db: Session):
    return db.query(Account).all()


def find_by_id(db: Session, account_id: int):
    return db.query(Account).filter(Account.id == account_id).first()


def create(db: Session, data: AccountCreate):
    account = Account(**data.model_dump())
    db.add(account)
    db.commit()
    db.refresh(account)
    return account


def update(db: Session, account: Account, data: AccountUpdate):
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(account, key, value)

    db.commit()
    db.refresh(account)
    return account


def delete(db: Session, account: Account):
    db.delete(account)
    db.commit()
