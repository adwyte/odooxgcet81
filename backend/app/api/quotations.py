from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.db.models.quotation import Quotation, QuotationStatus
from app.db.models.quotation_line import QuotationLine
from app.db.models.product import Product
from app.schemas.quotation import (
    AddToCartSchema,
    QuotationResponse,
)
from app.api.auth import get_current_user

router = APIRouter(prefix="/quotations", tags=["Quotations"])

@router.post("/current", response_model=QuotationResponse)
def get_or_create_cart(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    quotation = (
        db.query(Quotation)
        .filter(
            Quotation.customer_id == user.id,
            Quotation.status == QuotationStatus.DRAFT,
        )
        .first()
    )

    if not quotation:
        quotation = Quotation(customer_id=user.id)
        db.add(quotation)
        db.commit()
        db.refresh(quotation)

    lines = (
        db.query(QuotationLine)
        .filter(QuotationLine.quotation_id == quotation.id)
        .all()
    )

    total = sum(l.subtotal for l in lines)

    return {
        "id": quotation.id,
        "status": quotation.status.value,
        "lines": lines,
        "total": total,
    }

@router.post("/{quotation_id}/lines")
def add_to_cart(
    quotation_id,
    payload: AddToCartSchema,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    quotation = db.query(Quotation).filter_by(id=quotation_id).first()
    if not quotation or quotation.customer_id != user.id:
        raise HTTPException(status_code=404, detail="Cart not found")

    product = db.query(Product).filter_by(id=payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    price = 1000  # TEMP: replace with pricing logic
    subtotal = price * payload.quantity

    line = QuotationLine(
        quotation_id=quotation.id,
        product_id=product.id,
        vendor_id=product.vendor_id,
        variant_id=payload.variant_id,
        rental_start=payload.rental_start,
        rental_end=payload.rental_end,
        quantity=payload.quantity,
        price_per_unit=price,
        subtotal=subtotal,
    )

    db.add(line)
    db.commit()

    return {"success": True}

@router.delete("/lines/{line_id}")
def remove_line(
    line_id,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    line = db.query(QuotationLine).filter_by(id=line_id).first()
    if not line:
        raise HTTPException(status_code=404)

    db.delete(line)
    db.commit()
    return {"success": True}

