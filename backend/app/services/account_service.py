from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core import error_messages
from app.models.member import Member
from app.repositories import account_repository
from app.schemas.account_schema import AccountCreate, AccountUpdate


def get_accounts(db: Session, current_member: Member):
    return account_repository.find_all_by_member_id(db, current_member.id)


def get_account(db: Session, account_id: int, current_member: Member):
    account = account_repository.find_by_id_and_member_id(
        db,
        account_id,
        current_member.id,
    )

    if account is None:
        raise HTTPException(status_code=404, detail=error_messages.ACCOUNT_NOT_FOUND)

    return account


def create_account(db: Session, data: AccountCreate, current_member: Member):
    return account_repository.create(db, data, current_member.id)


def update_account(
    db: Session,
    account_id: int,
    data: AccountUpdate,
    current_member: Member,
):
    account = get_account(db, account_id, current_member)
    return account_repository.update(db, account, data)


def delete_account(db: Session, account_id: int, current_member: Member):
    account = get_account(db, account_id, current_member)
    account_repository.delete(db, account)

    return {"message": "계좌가 삭제되었습니다."}
