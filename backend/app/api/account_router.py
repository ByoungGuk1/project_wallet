from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.account_schema import AccountCreate, AccountResponse, AccountUpdate
from app.services import account_service

router = APIRouter(prefix="/api/accounts", tags=["Account"])


@router.get("", response_model=list[AccountResponse])
def get_accounts(db: Session = Depends(get_db)):
    return account_service.get_accounts(db)


@router.get("/{account_id}", response_model=AccountResponse)
def get_account(account_id: int, db: Session = Depends(get_db)):
    return account_service.get_account(db, account_id)


@router.post("", response_model=AccountResponse)
def create_account(data: AccountCreate, db: Session = Depends(get_db)):
    return account_service.create_account(db, data)


@router.patch("/{account_id}", response_model=AccountResponse)
def update_account(account_id: int, data: AccountUpdate, db: Session = Depends(get_db)):
    return account_service.update_account(db, account_id, data)


@router.delete("/{account_id}")
def delete_account(account_id: int, db: Session = Depends(get_db)):
    return account_service.delete_account(db, account_id)
