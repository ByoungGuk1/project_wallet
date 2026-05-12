from pydantic import BaseModel

from app.models.enums import CategoryType


class CategoryBase(BaseModel):
    name: str
    category_type: CategoryType


class CategoryCreate(CategoryBase):
    member_id: int


class CategoryUpdate(BaseModel):
    name: str | None = None
    category_type: CategoryType | None = None


class CategoryResponse(CategoryBase):
    id: int
    member_id: int

    model_config = {"from_attributes": True}
