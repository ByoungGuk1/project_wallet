from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories import account_repository
from app.schemas.account_schema import AccountCreate, AccountUpdate


def get_accounts(db: Session):
    return account_repository.find_all(db)


def get_account(db: Session, account_id: int):
    account = account_repository.find_by_id(db, account_id)
    if account is None:
        raise HTTPException(status_code=404, detail="계좌를 찾을 수 없습니다.")
    return account


def create_account(db: Session, data: AccountCreate):
    return account_repository.create(db, data)


def update_account(db: Session, account_id: int, data: AccountUpdate):
    account = get_account(db, account_id)
    return account_repository.update(db, account, data)


def delete_account(db: Session, account_id: int):
    account = get_account(db, account_id)
    account_repository.delete(db, account)
    return {"message": "계좌가 삭제되었습니다."}
