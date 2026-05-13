from sqlalchemy.orm import Session

from app.models.account import Account
from app.schemas.account_schema import AccountCreate, AccountUpdate


def find_all_by_member_id(db: Session, member_id: int):
    return (
        db.query(Account)
        .filter(Account.member_id == member_id)
        .all()
    )


def find_by_id_and_member_id(db: Session, account_id: int, member_id: int):
    return (
        db.query(Account)
        .filter(Account.id == account_id)
        .filter(Account.member_id == member_id)
        .first()
    )


def create(db: Session, data: AccountCreate, member_id: int):
    account = Account(
        **data.model_dump(),
        member_id=member_id,
    )
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
