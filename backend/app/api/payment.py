from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.api.auth import get_current_user
from app.db.models.user import User
from app.db.models.invoice import Invoice
from app.db.models.order import RentalOrder
from app.core.config import settings
import razorpay
from pydantic import BaseModel

router = APIRouter()

def get_razorpay_client():
    """Get Razorpay client with current credentials"""
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Razorpay credentials not configured"
        )
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class PaymentCreate(BaseModel):
    amount: int  # Amount in paise (e.g., 50000 for ₹500.00)
    currency: str = "INR"
    receipt: str

@router.post("/create-order")
async def create_razorpay_order(
    item: PaymentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        razorpay_client = get_razorpay_client()

        data = {
            "amount": item.amount,
            "currency": item.currency,
            "receipt": item.receipt,
            "notes": {
                "user_id": str(current_user.id),
                "email": current_user.email
            }
        }
        
        # Create Razorpay Order
        order = razorpay_client.order.create(data=data)
        
        return {
            "id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "receipt": order["receipt"]
        }
    except razorpay.errors.BadRequestError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid payment request: {str(e)}"
        )
    except razorpay.errors.ServerError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Razorpay server error. Please try again."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Payment Error: {str(e)}"
        )
