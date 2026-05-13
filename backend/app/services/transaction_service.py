from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.account import Account
from app.models.category import Category
from app.models.enums import TransactionType
from app.models.member import Member
from app.repositories import transaction_repository
from app.schemas.transaction_schema import TransactionCreate, TransactionUpdate


def get_transactions(db: Session, current_member: Member):
    return transaction_repository.find_all_by_member_id(db, current_member.id)


def get_transaction(db: Session, transaction_id: int, current_member: Member):
    transaction = transaction_repository.find_by_id_and_member_id(
        db,
        transaction_id,
        current_member.id,
    )
    if transaction is None:
        raise HTTPException(status_code=404, detail="거래 내역을 찾을 수 없습니다.")
    return transaction


def create_transaction(db: Session, data: TransactionCreate, current_member: Member):
    account = _get_account_by_member_id(db, data.account_id, current_member.id)
    _validate_category(
        db=db,
        category_id=data.category_id,
        member_id=current_member.id,
        transaction_type=data.transaction_type,
    )
    _apply_transaction_to_balance(
        account=account,
        transaction_type=data.transaction_type,
        amount=data.amount,
    )
    return transaction_repository.create(db, data)


def update_transaction(
    db: Session,
    transaction_id: int,
    data: TransactionUpdate,
    current_member: Member,
):
    transaction = get_transaction(db, transaction_id, current_member)
    account = transaction.account

    new_transaction_type = data.transaction_type or transaction.transaction_type
    new_amount = data.amount if data.amount is not None else transaction.amount

    new_category_id = (
        data.category_id
        if "category_id" in data.model_fields_set
        else transaction.category_id
    )
    _validate_category(
        db=db,
        category_id=new_category_id,
        member_id=current_member.id,
        transaction_type=new_transaction_type,
    )
    _rollback_transaction_from_balance(
        account=account,
        transaction_type=transaction.transaction_type,
        amount=transaction.amount,
    )
    _apply_transaction_to_balance(
        account=account,
        transaction_type=new_transaction_type,
        amount=new_amount,
    )

    return transaction_repository.update(db, transaction, data)


def delete_transaction(db: Session, transaction_id: int, current_member: Member):
    transaction = get_transaction(db, transaction_id, current_member)
    account = transaction.account
    _rollback_transaction_from_balance(
        account=account,
        transaction_type=transaction.transaction_type,
        amount=transaction.amount,
    )
    transaction_repository.delete(db, transaction)
    return {"message": "거래 내역이 삭제되었습니다."}


def _get_account_by_member_id(db: Session, account_id: int, member_id: int):
    account = (
        db.query(Account)
        .filter(Account.id == account_id)
        .filter(Account.member_id == member_id)
        .first()
    )
    if account is None:
        raise HTTPException(status_code=404, detail="계좌를 찾을 수 없습니다.")
    return account


def _validate_category(
    db: Session,
    category_id: int | None,
    member_id: int,
    transaction_type: TransactionType,
):
    if category_id is None:
        return

    category = (
        db.query(Category)
        .filter(Category.id == category_id)
        .filter(Category.member_id == member_id)
        .first()
    )

    if category is None:
        raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다.")

    if category.category_type.value != transaction_type.value:
        raise HTTPException(
            status_code=400,
            detail="거래 유형과 카테고리 유형이 일치하지 않습니다.",
        )


def _apply_transaction_to_balance(
    account: Account,
    transaction_type: TransactionType,
    amount: int,
):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="거래 금액은 0보다 커야 합니다.")

    if transaction_type == TransactionType.INCOME:
        account.balance += amount
    elif transaction_type == TransactionType.EXPENSE:
        account.balance -= amount
    else:
        raise HTTPException(status_code=400, detail="지원하지 않는 거래 유형입니다.")


def _rollback_transaction_from_balance(
    account: Account,
    transaction_type: TransactionType,
    amount: int,
):
    if transaction_type == TransactionType.INCOME:
        account.balance -= amount
    elif transaction_type == TransactionType.EXPENSE:
        account.balance += amount
    else:
        raise HTTPException(status_code=400, detail="지원하지 않는 거래 유형입니다.")
