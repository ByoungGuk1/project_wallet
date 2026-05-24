from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth_dependency import get_current_member
from app.models.member import Member
from app.schemas.category_schema import CategoryCreate, CategoryResponse, CategoryUpdate
from app.schemas.common_schema import MessageResponse
from app.services import category_service

router = APIRouter(prefix="/api/categories", tags=["Category"])


@router.get("", response_model=list[CategoryResponse])
def get_categories(
    db: Session = Depends(get_db),
    current_member: Member = Depends(get_current_member),
):
    return category_service.get_categories(db, current_member)


@router.post("", response_model=CategoryResponse)
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    current_member: Member = Depends(get_current_member),
):
    return category_service.create_category(db, data, current_member)


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_member: Member = Depends(get_current_member),
):
    return category_service.get_category(db, category_id, current_member)


@router.patch("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    data: CategoryUpdate,
    db: Session = Depends(get_db),
    current_member: Member = Depends(get_current_member),
):
    return category_service.update_category(db, category_id, data, current_member)


@router.delete("/{category_id}", response_model=MessageResponse)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_member: Member = Depends(get_current_member),
):
    return category_service.delete_category(db, category_id, current_member)
