from sqlalchemy import (
    Column,
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.session import Base
from app.models.enums import CategoryType


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    name = Column(String(50), nullable=False)
    category_type = Column(SAEnum(CategoryType), nullable=False)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    member = relationship("Member", back_populates="categories")
    transactions = relationship("Transaction", back_populates="category")

    __table_args__ = (
        UniqueConstraint(
            "member_id", "name", "category_type", name="uq_member_category"
        ),
    )
