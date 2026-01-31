import enum
import uuid
from sqlalchemy import Column, Enum, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.base import Base


class QuotationStatus(enum.Enum):
    DRAFT = "DRAFT"
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"


class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    customer_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    status = Column(
        Enum(QuotationStatus),
        default=QuotationStatus.DRAFT,
        nullable=False,
    )

    created_at = Column(DateTime, server_default=func.now())
