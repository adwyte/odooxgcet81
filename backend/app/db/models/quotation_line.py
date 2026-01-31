import uuid
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
)
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class QuotationLine(Base):
    __tablename__ = "quotation_lines"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    quotation_id = Column(
        UUID(as_uuid=True),
        ForeignKey("quotations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    product_id = Column(
        UUID(as_uuid=True),
        ForeignKey("products.id"),
        nullable=False,
    )

    vendor_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    variant_id = Column(
        UUID(as_uuid=True),
        #ForeignKey("product_variants.id"),
        nullable=True,
    )

    rental_start = Column(DateTime, nullable=False)
    rental_end = Column(DateTime, nullable=False)

    quantity = Column(Integer, nullable=False, default=1)

    price_per_unit = Column(Numeric(10, 2), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)
