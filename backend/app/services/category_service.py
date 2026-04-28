from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories import category_repository
from app.schemas.category_schema import CategoryCreate, CategoryUpdate


def get_categories(db: Session):
    return category_repository.find_all(db)


def get_category(db: Session, category_id: int):
    category = category_repository.find_by_id(db, category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다.")
    return category


def create_category(db: Session, data: CategoryCreate):
    return category_repository.create(db, data)


def update_category(db: Session, category_id: int, data: CategoryUpdate):
    category = get_category(db, category_id)
    return category_repository.update(db, category, data)


def delete_category(db: Session, category_id: int):
    category = get_category(db, category_id)
    category_repository.delete(db, category)
    return {"message": "카테고리가 삭제되었습니다."}
