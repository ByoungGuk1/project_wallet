from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core import error_messages
from app.models.member import Member
from app.repositories import category_repository
from app.schemas.category_schema import CategoryCreate, CategoryUpdate


def get_categories(db: Session, current_member: Member):
    return category_repository.find_all_by_member_id(db, current_member.id)


def get_category(db: Session, category_id: int, current_member: Member):
    category = category_repository.find_by_id_and_member_id(
        db,
        category_id,
        current_member.id,
    )
    if category is None:
        raise HTTPException(status_code=404, detail=error_messages.CATEGORY_NOT_FOUND)
    return category


def create_category(db: Session, data: CategoryCreate, current_member: Member):
    return category_repository.create(db, data, current_member.id)


def update_category(
    db: Session,
    category_id: int,
    data: CategoryUpdate,
    current_member: Member,
):
    category = get_category(db, category_id, current_member)
    return category_repository.update(db, category, data)


def delete_category(db: Session, category_id: int, current_member: Member):
    category = get_category(db, category_id, current_member)
    category_repository.delete(db, category)
    return {"message": "카테고리가 삭제되었습니다."}
