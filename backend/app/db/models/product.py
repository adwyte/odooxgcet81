import uuid
from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    vendor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    name = Column(String, nullable=False)
    description = Column(String)
    is_rentable = Column(Boolean, default=True)
    quantity_on_hand = Column(Integer, default=0)
    cost_price = Column(Float)
    is_published = Column(Boolean, default=False)
