import uuid, enum
from sqlalchemy import Column, Enum, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class QuotationStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    SENT = "SENT"
    CONFIRMED = "CONFIRMED"

class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    status = Column(Enum(QuotationStatus), default=QuotationStatus.DRAFT)
    total_amount = Column(Float)
