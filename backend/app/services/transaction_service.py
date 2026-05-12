from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.account import Account
from app.models.category import Category
from app.models.enums import TransactionType
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
    account = _get_account(db, data.account_id)
    _validate_category_owner(db, data.category_id, account.member_id)

    _apply_transaction_to_balance(
        account=account,
        transaction_type=data.transaction_type,
        amount=data.amount,
    )

    return transaction_repository.create(db, data)


def update_transaction(db: Session, transaction_id: int, data: TransactionUpdate):
    transaction = get_transaction(db, transaction_id)
    account = transaction.account

    _validate_category_owner(db, data.category_id, account.member_id)

    # 기존 거래 금액을 먼저 잔액에서 되돌림
    _rollback_transaction_from_balance(
        account=account,
        transaction_type=transaction.transaction_type,
        amount=transaction.amount,
    )

    # 수정 후 적용될 값 계산
    new_transaction_type = data.transaction_type or transaction.transaction_type
    new_amount = data.amount if data.amount is not None else transaction.amount

    # 새 거래 금액을 잔액에 다시 반영
    _apply_transaction_to_balance(
        account=account,
        transaction_type=new_transaction_type,
        amount=new_amount,
    )

    return transaction_repository.update(db, transaction, data)


def delete_transaction(db: Session, transaction_id: int):
    transaction = get_transaction(db, transaction_id)
    account = transaction.account

    _rollback_transaction_from_balance(
        account=account,
        transaction_type=transaction.transaction_type,
        amount=transaction.amount,
    )

    transaction_repository.delete(db, transaction)
    return {"message": "거래 내역이 삭제되었습니다."}


def _get_account(db: Session, account_id: int):
    account = db.query(Account).filter(Account.id == account_id).first()
    if account is None:
        raise HTTPException(status_code=404, detail="계좌를 찾을 수 없습니다.")
    return account


def _validate_category_owner(db: Session, category_id: int | None, member_id: int):
    if category_id is None:
        return

    category = db.query(Category).filter(Category.id == category_id).first()

    if category is None:
        raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다.")

    if category.member_id != member_id:
        raise HTTPException(
            status_code=400,
            detail="계좌 소유자와 카테고리 소유자가 일치하지 않습니다.",
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
