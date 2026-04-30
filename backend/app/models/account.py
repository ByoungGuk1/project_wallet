from sqlalchemy import (
    BigInteger,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.session import Base


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    account_name = Column(String(255), nullable=True)
    account_number = Column(String(30), nullable=False)
    bank_name = Column(String(255), nullable=False)
    balance = Column(BigInteger, nullable=False, default=0)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    member = relationship("Member", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account")

    __table_args__ = (
        UniqueConstraint(
            "member_id", "account_number", name="uq_member_account_number"
        ),
    )
