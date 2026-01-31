from sqlalchemy import (
    Column,
    String,
    Boolean,
    Enum,
    DateTime,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum

from app.db.base import Base


class UserRole(enum.Enum):
    CUSTOMER = "CUSTOMER"
    VENDOR = "VENDOR"
    ADMIN = "ADMIN"


class User(Base):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)

    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)

    role = Column(Enum(UserRole), nullable=False)

    company_name = Column(String, nullable=True)
    business_category = Column(String, nullable=True)
    gstin = Column(String, nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
