from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str
    type: str


class CategoryCreate(CategoryBase):
    model_config = {"from_attributes": True}


class CategoryUpdate(BaseModel):
    name: str | None = None
    type: str | None = None


class CategoryResponse(CategoryBase):
    id: int

    model_config = {"from_attributes": True}
