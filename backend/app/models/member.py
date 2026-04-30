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
from app.models.enums import MemberType, OAuthProvider, SigninType


class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    nickname = Column(String(255), nullable=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    member_type = Column(SAEnum(MemberType), nullable=False, default=MemberType.USER)
    signin_type = Column(SAEnum(SigninType), nullable=False, default=SigninType.LOCAL)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    local_member = relationship("LocalMember", back_populates="member", uselist=False)
    oauth_members = relationship("OAuthMember", back_populates="member")

    accounts = relationship("Account", back_populates="member")
    categories = relationship("Category", back_populates="member")
    posts = relationship("Post", back_populates="member")


class LocalMember(Base):
    __tablename__ = "local_members"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    member = relationship("Member", back_populates="local_member")


class OAuthMember(Base):
    __tablename__ = "oauth_members"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    provider = Column(SAEnum(OAuthProvider), nullable=False)
    provider_member_id = Column(String(255), nullable=False)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    member = relationship("Member", back_populates="oauth_members")

    __table_args__ = (
        UniqueConstraint(
            "provider", "provider_member_id", name="uq_oauth_provider_member"
        ),
    )
