import uuid, enum
from sqlalchemy import Column, Enum, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class InvoiceStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PARTIALLY_PAID = "PARTIALLY_PAID"
    PAID = "PAID"

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("rental_orders.id"))
    status = Column(Enum(InvoiceStatus))
    total_amount = Column(Float)
