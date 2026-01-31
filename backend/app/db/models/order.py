import uuid, enum
from sqlalchemy import Column, Enum, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class OrderStatus(str, enum.Enum):
    CONFIRMED = "CONFIRMED"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"

class RentalOrder(Base):
    __tablename__ = "rental_orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quotation_id = Column(UUID(as_uuid=True), ForeignKey("quotations.id"))
    customer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    vendor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    status = Column(Enum(OrderStatus), default=OrderStatus.CONFIRMED)
