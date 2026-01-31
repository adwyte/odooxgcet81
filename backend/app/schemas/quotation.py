from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


class AddToCartSchema(BaseModel):
    product_id: UUID
    variant_id: UUID | None = None
    rental_start: datetime
    rental_end: datetime
    quantity: int = 1


class QuotationLineResponse(BaseModel):
    id: UUID
    product_id: UUID
    rental_start: datetime
    rental_end: datetime
    quantity: int
    subtotal: float

    class Config:
        from_attributes = True


class QuotationResponse(BaseModel):
    id: UUID
    status: str
    lines: list[QuotationLineResponse]
    total: float
