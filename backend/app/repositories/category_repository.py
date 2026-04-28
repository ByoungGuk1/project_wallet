from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category_schema import CategoryCreate, CategoryUpdate


def find_all(db: Session):
    return db.query(Category).all()


def find_by_id(db: Session, category_id: int):
    return db.query(Category).filter(Category.id == category_id).first()


def create(db: Session, data: CategoryCreate):
    category = Category(**data.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def update(db: Session, category: Category, data: CategoryUpdate):
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(category, key, value)

    db.commit()
    db.refresh(category)
    return category


def delete(db: Session, category: Category):
    db.delete(category)
    db.commit()
